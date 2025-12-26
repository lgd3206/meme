import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化 Grok API 客户端（使用 OpenAI SDK，兼容 Grok API）
const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: '请上传图片' },
        { status: 400 }
      );
    }

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

    const explanation = completion.choices[0]?.message?.content || '无法解析该图片';

    return NextResponse.json({
      success: true,
      explanation,
      model: 'grok-2-vision-1212',
    });
  } catch (error: any) {
    console.error('Grok API 错误:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || '分析失败，请稍后重试',
        details: error.error?.message || '',
      },
      { status: 500 }
    );
  }
}
