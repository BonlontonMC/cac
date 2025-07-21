const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();
const port = 3000;

let usernames = [
  'KenjiVN', 'NoobBui', 'MrDat2009', 'HuyGamerX',
  'DragonBoy99', 'nghiemtuan123', 'Anhhacker1',
  'Quang_TNT', 'MinhHoangMC', 'proplayervn',
];

let usedNames = new Set(); // Tránh trùng bot khi restart

function pickBotName() {
  const available = usernames.filter(name => !usedNames.has(name));
  if (available.length === 0) {
    usedNames.clear(); // Reset nếu hết tên
    return pickBotName();
  }
  const name = available[Math.floor(Math.random() * available.length)];
  usedNames.add(name);
  return name;
}

function createBot() {
  const botName = pickBotName();

  const bot = mineflayer.createBot({
    host: 'BonvaBao123.aternos.me',
    port: 34742,
    username: botName,
    version: false,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
  console.log(`✅ ${bot.username} đã vào game.`);

  const loginDelay = getRandomInt(8000, 10000);
  setTimeout(() => {
    console.log(`🔐 ${bot.username} đang gửi lệnh /reg và /login`);
    bot.chat('/register concacduma concacduma');
    setTimeout(() => bot.chat('/login concacduma'), 1000); // Đợi 1s sau khi /register
  }, loginDelay);

  startRandomBehavior(bot);
  scheduleBotRestart();
});

  bot.on('kicked', (reason) => {
    console.log(`❌ Bot ${bot.username} bị kick: ${reason}`);
  });

  bot.on('error', (err) => {
    console.error(`⚠️ Lỗi bot ${bot.username}:`, err.message);
    if (err.code === 'ECONNRESET') {
      console.log(`→ Sẽ thử kết nối lại sau 5s...`);
      setTimeout(() => createBot(), 5000);
    }
  });

  bot.on('end', () => {
    console.log(`🔁 ${bot.username} đã rời server. Restart bot...`);
    setTimeout(createBot, getRandomInt(5000, 7000));
  });
}

function startRandomBehavior(bot) {
  const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak', 'rotate', 'clickLeft', 'clickRight'];

  setInterval(() => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const duration = Math.floor(Math.random() * 2000) + 500;

    switch (action) {
      case 'forward':
      case 'back':
      case 'left':
      case 'right':
      case 'jump':
      case 'sneak':
        bot.setControlState(action, true);
        setTimeout(() => bot.setControlState(action, false), duration);
        break;
      case 'rotate':
        bot.look(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, true);
        break;
      case 'clickLeft':
        bot.swingArm('right');
        break;
      case 'clickRight':
        bot.activateItem();
        break;
    }
  }, 3000);
}

function scheduleBotRestart() {
  const min = 60 * 60 * 1000;        // 1 giờ
  const max = 3 * 60 * 60 * 1000;    // 3 giờ
  const delay = getRandomInt(min, max);
  console.log(`⏰ Bot sẽ đổi tên và restart sau ${Math.floor(delay / 60000)} phút.`);
  setTimeout(() => process.exit(), delay);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// UptimeRobot ping
app.get('/', (req, res) => res.send('Bot online!'));
app.listen(port, '0.0.0.0', () => console.log(`🌐 Uptime server chạy tại http://0.0.0.0:${port}`));

// Start
createBot();
