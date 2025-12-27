import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import zh from '@/locales/zh.json';
import en from '@/locales/en.json';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';

export const runtime = 'nodejs';

const translations = { zh, en };

type SupportedLanguage = 'zh' | 'en';

function normalizeLanguage(value: unknown): SupportedLanguage {
  return value === 'en' ? 'en' : 'zh';
}

export async function POST(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';

  let language: SupportedLanguage = 'zh';

  try {
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: '请求格式错误' },
        { status: 400 }
      );
    }

    const imageData = (body as { imageData?: unknown }).imageData;
    language = normalizeLanguage((body as { language?: unknown }).language);

    const ip = getClientIp(request);
    const rateLimitResult = await checkRateLimit(ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            language === 'zh'
              ? `请求过于频繁，请稍后再试。剩余次数：${rateLimitResult.remaining}/${rateLimitResult.limit}`
              : `Too many requests. Please try again later. Remaining: ${rateLimitResult.remaining}/${rateLimitResult.limit}`,
          rateLimit: {
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset,
          },
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );
    }

    if (!process.env.XAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'API Key 未配置，请在环境变量中配置 XAI_API_KEY',
        },
        { status: 500 }
      );
    }

    if (typeof imageData !== 'string' || imageData.length === 0) {
      return NextResponse.json(
        { success: false, error: language === 'zh' ? '请上传图片' : 'Please upload an image.' },
        { status: 400 }
      );
    }

    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: language === 'zh' ? '图片格式不支持' : 'Unsupported image format.' },
        { status: 400 }
      );
    }

    const MAX_IMAGE_DATA_CHARS = 4_000_000;
    if (imageData.length > MAX_IMAGE_DATA_CHARS) {
      return NextResponse.json(
        {
          success: false,
          error: language === 'zh' ? '图片过大，请压缩后再试' : 'Image is too large. Please compress and try again.',
        },
        { status: 413 }
      );
    }

    const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
    const proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

    const client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: 'https://api.x.ai/v1',
      timeout: 60000,
      maxRetries: 2,
      httpAgent: proxyAgent,
    });

    const promptText = translations[language].apiPrompt.systemPrompt;

    const completion = await client.chat.completions.create({
      model: 'grok-2-vision-1212',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageData,
              },
            },
            {
              type: 'text',
              text: promptText,
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const explanation =
      completion.choices[0]?.message?.content ||
      (language === 'zh' ? '无法解析该图片' : 'Unable to analyze this image.');

    return NextResponse.json({
      success: true,
      explanation,
      model: 'grok-2-vision-1212',
    });
  } catch (error: unknown) {
    const errorMessageRaw = error instanceof Error ? error.message : '';
    const errorStack = error instanceof Error ? error.stack : undefined;

    let errorMessage = errorMessageRaw || (language === 'zh' ? '分析失败，请稍后重试' : 'Analysis failed. Please try again later.');

    if (errorMessageRaw.includes('API key')) {
      errorMessage = language === 'zh' ? 'API Key 无效，请检查配置' : 'Invalid API key. Please check your configuration.';
    } else if (errorMessageRaw.includes('quota')) {
      errorMessage = language === 'zh' ? 'API 额度不足，请充值' : 'API quota exceeded. Please top up.';
    } else if (errorMessageRaw.includes('network') || errorMessageRaw.includes('connect')) {
      errorMessage =
        language === 'zh'
          ? '网络连接失败，请检查网络或稍后重试'
          : 'Network connection failed. Please try again later.';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: isDev ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
