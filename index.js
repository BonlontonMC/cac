const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();
const port = 3000;

const usernames = [
  'KenjiVN',
  'NoobBui',
  'MrDat2009',
  'HuyGamerX',
  'DragonBoy99',
  'nghiemtuan123',
  'Anhhacker1',
  'Quang_TNT',
  'MinhHoangMC',
  'proplayervn',
];

let botName = usernames[Math.floor(Math.random() * usernames.length)];

function createBot() {
  const bot = mineflayer.createBot({
    host: 'BonvaBao123.aternos.me',
    port: 34742,
    username: botName,
    version: false,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log(`${bot.username} đã vào game.`);

    const regDelay = getRandomInt(5000, 7000);
    const loginDelay = regDelay + getRandomInt(1000, 2000);

    setTimeout(() => bot.chat('/reg concacduma concacduma'), regDelay);
    setTimeout(() => bot.chat('/login concacduma'), loginDelay);

    startRandomBehavior(bot);
    scheduleBotRestart();
  });

  bot.on('error', (err) => {
    console.error('Lỗi bot:', err.message);
    if (err.code === 'ECONNRESET') {
      console.log('→ Mất kết nối (ECONNRESET), sẽ khởi động lại bot sau 5s...');
      setTimeout(() => {
        process.exit(); // Render sẽ tự restart
      }, 5000);
    }
  });

  bot.on('end', () => {
    console.log(`${bot.username} đã rời khỏi server. Đang tạo lại bot...`);
    botName = usernames[Math.floor(Math.random() * usernames.length)];
    const respawnDelay = getRandomInt(5000, 7000);
    setTimeout(createBot, respawnDelay);
  });

  return bot;
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
  console.log(`Bot sẽ đổi tên và khởi động lại sau ${Math.floor(delay / 60000)} phút.`);
  setTimeout(() => process.exit(), delay); // Render sẽ tự restart bot
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Uptime server dùng được với UptimeRobot (chạy trên Render)
app.get('/', (req, res) => res.send('Bot online!'));
app.listen(port, '0.0.0.0', () => console.log(`Uptime server mở tại http://0.0.0.0:${port}`));

// Khởi tạo bot lần đầu
createBot();
