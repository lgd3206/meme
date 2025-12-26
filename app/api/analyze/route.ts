import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';
import zh from '@/locales/zh.json';
import en from '@/locales/en.json';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';

const translations = { zh, en };

// 配置代理
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;

console.log('🌐 代理配置:', proxyUrl || '未配置');

// 创建代理 Agent（兼容 http 和 https）
let httpAgent: http.Agent | undefined;
let httpsAgent: https.Agent | undefined;

if (proxyUrl) {
  console.log('✅ 启用代理:', proxyUrl);
  const agent = new HttpsProxyAgent(proxyUrl);
  httpAgent = agent as any;
  httpsAgent = agent as any;
}

// 初始化 Grok API 客户端
const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
  timeout: 60000,
  maxRetries: 2,
  httpAgent: httpsAgent,
} as any);

export async function POST(request: NextRequest) {
  try {
    const { imageData, language = 'zh' } = await request.json();

    // 速率限制检查
    const ip = getClientIp(request);
    console.log('🌐 请求 IP:', ip);

    const rateLimitResult = await checkRateLimit(ip);

    if (!rateLimitResult.success) {
      console.warn('⚠️ 速率限制触发:', ip);
      return NextResponse.json(
        {
          success: false,
          error: language === 'zh'
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

    console.log('✅ 速率限制检查通过，剩余次数:', rateLimitResult.remaining);

    // 检查 API Key
    if (!process.env.XAI_API_KEY) {
      console.error('❌ XAI_API_KEY 未配置');
      return NextResponse.json(
        {
          success: false,
          error: 'API Key 未配置，请在 .env.local 中配置 XAI_API_KEY'
        },
        { status: 500 }
      );
    }

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: '请上传图片' },
        { status: 400 }
      );
    }

    console.log('📤 开始调用 Grok API...');
    console.log('🌐 语言:', language);
    console.log('🔑 API Key 前缀:', process.env.XAI_API_KEY?.substring(0, 10) + '...');

    // 根据语言选择提示词
    const lang: 'zh' | 'en' = (language === 'zh' || language === 'en') ? language : 'zh';
    const promptText = translations[lang].apiPrompt.systemPrompt;

    // 调用 Grok Vision API 分析梗图
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

    console.log('✅ Grok API 调用成功');

    const explanation = completion.choices[0]?.message?.content || '无法解析该图片';

    return NextResponse.json({
      success: true,
      explanation,
      model: 'grok-2-vision-1212',
    });
  } catch (error: any) {
    console.error('❌ Grok API 错误详情:');
    console.error('错误类型:', error.constructor.name);
    console.error('错误消息:', error.message);
    console.error('错误对象:', JSON.stringify(error, null, 2));

    // 提取更详细的错误信息
    let errorMessage = error.message || '分析失败，请稍后重试';
    let errorDetails = '';

    if (error.error) {
      errorDetails = error.error.message || JSON.stringify(error.error);
    }

    // 特殊错误处理
    if (error.message?.includes('API key')) {
      errorMessage = 'API Key 无效，请检查配置';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API 额度不足，请充值';
    } else if (error.message?.includes('network') || error.message?.includes('connect')) {
      errorMessage = '网络连接失败，请检查网络或稍后重试';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        debugInfo: process.env.NODE_ENV === 'development' ? {
          type: error.constructor.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 3),
        } : undefined,
      },
      { status: 500 }
    );
  }
}
