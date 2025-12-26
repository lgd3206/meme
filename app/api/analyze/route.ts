import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';

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

    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: '请上传图片' },
        { status: 400 }
      );
    }

    console.log('📤 开始调用 Grok API...');
    console.log('🔑 API Key 前缀:', process.env.XAI_API_KEY?.substring(0, 10) + '...');

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
              text: `请详细分析这张梗图（meme）：

1. **图片内容描述**：这张图片里有什么？
2. **梗的来源**：这个梗来自哪里？什么时候开始流行的？
3. **梗的含义**：这个梗想表达什么意思？通常在什么场景下使用？
4. **文化背景**：有什么相关的文化背景或事件吗？
5. **使用示例**：人们通常在什么情况下会用这个梗？

请用轻松有趣的语气解释，让不了解网络文化的人也能听懂。如果图片不是梗图，请说明这只是一张普通图片。`,
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
