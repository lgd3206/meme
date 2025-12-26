#!/usr/bin/env node

/**
 * 快速设置脚本
 * 帮助用户快速配置项目
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🎭 欢迎使用流行梗图解释器设置向导！\n');

  // 检查 .env.local 是否已存在
  const envPath = path.join(__dirname, '..', '.env.local');

  if (fs.existsSync(envPath)) {
    console.log('✅ 检测到 .env.local 文件已存在\n');
    const overwrite = await question('是否要重新配置 API Key? (y/n): ');

    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n✨ 设置已跳过！\n');
      rl.close();
      return;
    }
  }

  console.log('📝 请输入你的 Grok API Key');
  console.log('💡 提示：访问 https://console.x.ai 获取 API Key\n');

  const apiKey = await question('XAI_API_KEY: ');

  if (!apiKey || apiKey.trim() === '') {
    console.log('\n❌ API Key 不能为空！');
    rl.close();
    return;
  }

  // 写入 .env.local
  const envContent = `# Grok API Key (从 https://console.x.ai 获取)\nXAI_API_KEY=${apiKey.trim()}\n`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ 配置成功！\n');
    console.log('🚀 现在可以运行以下命令启动项目：');
    console.log('   npm run dev\n');
  } catch (error) {
    console.error('\n❌ 写入配置失败：', error.message);
  }

  rl.close();
}

setup();
