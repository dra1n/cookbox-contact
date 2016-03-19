const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const to = process.env.RECIPIENTS;
const bot = new TelegramBot(token);

module.exports = function(data) {
  const message = `Message from *${data.email}*: \n ${data.message}`;

  to.split(',').forEach((recipient) => {
    bot.sendMessage(to, message, { parse_mode: 'Markdown' });
  });
}
