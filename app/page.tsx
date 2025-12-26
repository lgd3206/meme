'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: selectedImage }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.explanation);
      } else {
        setError(data.error || '分析失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 头部 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎭 流行梗图解释器
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            看不懂网上的梗图？让 AI 帮你秒懂梗文化！
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Powered by Grok Vision AI
          </p>
        </header>

        {/* 主内容区 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8">
          {/* 上传区域 */}
          {!selectedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-4 border-dashed rounded-2xl p-16 text-center transition-all ${
                isDragging
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
              }`}
            >
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                选择梗图
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                或拖拽图片到这里
              </p>
              <p className="mt-2 text-xs text-gray-400">
                支持 JPG、PNG、GIF、WebP 等格式
              </p>
            </div>
          ) : (
            <div>
              {/* 预览图片 */}
              <div className="relative mb-6">
                <Image
                  src={selectedImage}
                  alt="预览"
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-96 object-contain rounded-xl"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* 分析按钮 */}
              {!result && (
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      AI 正在分析中...
                    </span>
                  ) : (
                    '🔍 开始解读梗图'
                  )}
                </button>
              )}

              {/* 错误提示 */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
                  ❌ {error}
                </div>
              )}

              {/* 分析结果 */}
              {result && (
                <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-2">🤖</span>
                    <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300">
                      AI 解读结果
                    </h3>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {result}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                    }}
                    className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    🔄 分析下一张
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">📸</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
              上传梗图
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              上传你看不懂的网络梗图或表情包
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
              AI 分析
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Grok AI 快速识别并解读梗的含义
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
              秒懂梗文化
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              获取详细的来源、含义和使用场景
            </p>
          </div>
        </div>

        {/* 页脚 */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Made with ❤️ using Grok Vision AI</p>
          <p className="mt-2">
            项目开源 •{' '}
            <a
              href="https://github.com"
              className="text-purple-600 hover:underline"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
