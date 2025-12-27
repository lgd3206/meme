'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function FaqSchema() {
  const { language } = useLanguage();

  const faqData = {
    en: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does this meme mean?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your meme to our AI-powered meme explainer tool, and you'll get instant detailed explanations about its origin, meaning, cultural context, and how it's typically used. Our tool uses Grok Vision AI to analyze any meme and provide comprehensive explanations."
          }
        },
        {
          "@type": "Question",
          "name": "How do I explain this meme to someone?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our free meme explainer tool powered by Grok Vision AI. Simply upload the meme image, and within seconds you'll receive a detailed explanation that you can share with others. The explanation includes the meme's origin, what it means, and examples of how it's used."
          }
        },
        {
          "@type": "Question",
          "name": "Can someone explain this meme I don't understand?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our AI meme explainer can help you understand any meme. Upload the meme image, and our advanced AI will analyze it and provide a clear explanation of its meaning, cultural references, and usage context. No more feeling left out when you see a confusing meme!"
          }
        },
        {
          "@type": "Question",
          "name": "What is a meme explanation tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A meme explanation tool uses artificial intelligence to analyze meme images and provide detailed explanations about their meaning, origin, and cultural context. Our tool uses Grok Vision AI to help you understand internet memes, jokes, and cultural references that might otherwise be confusing."
          }
        },
        {
          "@type": "Question",
          "name": "Why can't I understand this meme?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Memes often reference specific cultural moments, internet trends, or inside jokes that you might not be familiar with. They can also involve cross-cultural references, political satire, or generational humor. Our AI meme explainer helps bridge these knowledge gaps by providing comprehensive explanations of any meme you upload."
          }
        }
      ]
    },
    zh: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "这个梗图什么意思？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "上传梗图到我们的AI梗图解释器，您将立即获得关于梗图来源、含义、文化背景和使用场景的详细解释。我们的工具使用 Grok Vision AI 分析任何梗图并提供全面的解释。"
          }
        },
        {
          "@type": "Question",
          "name": "怎么解释这个梗给别人听？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "使用我们基于 Grok Vision AI 的免费梗图解释工具。只需上传梗图，几秒钟内您就能获得可以分享给他人的详细解释。解释内容包括梗的来源、含义以及使用示例。"
          }
        },
        {
          "@type": "Question",
          "name": "看不懂这个梗图怎么办？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "别担心！我们的AI梗图解释器可以帮您理解任何梗图。上传图片后，先进的AI将分析并提供清晰的解释，包括含义、文化引用和使用场景。再也不用担心看不懂网络梗图了！"
          }
        },
        {
          "@type": "Question",
          "name": "什么是梗图解释工具？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "梗图解释工具使用人工智能分析梗图并提供关于其含义、来源和文化背景的详细解释。我们的工具使用 Grok Vision AI 帮助您理解网络梗图、笑话和可能令人困惑的文化引用。"
          }
        },
        {
          "@type": "Question",
          "name": "为什么我看不懂这些梗图？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "梗图经常引用特定的文化时刻、网络趋势或内部笑话，您可能不熟悉这些背景。它们还可能涉及跨文化引用、政治讽刺或代际幽默。我们的AI梗图解释器通过提供全面的解释来帮助您理解任何上传的梗图。"
          }
        }
      ]
    }
  };

  const currentFaq = language === 'zh' ? faqData.zh : faqData.en;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(currentFaq) }}
    />
  );
}
