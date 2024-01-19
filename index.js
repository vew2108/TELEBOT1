const TOKEN = '6329965278:AAEHM8FWb9jNcQ1A70pa_JN-1Tz8Wp5eb7Y';
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_BOT_TOKEN' with the token you get from BotFather
// const TOKEN = 'YOUR_BOT_TOKEN';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! Send me a number to get part information and an image.');
});

bot.onText(/(\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const partNumber = match[1];

    try {
        const apiUrl = `https://vewtelebot.vercel.app/getpart/${partNumber}`;
        const response = await axios.get(apiUrl);

        if (response.data.success) {
            const partInfo = response.data.partInfo;

            // Check if the image link is provided
            if (partInfo.imageLink) {
                // Send the information along with the image link
                bot.sendMessage(chatId, `
Part Information:
SR Number: ${partInfo.srNumber}
Part Code: ${partInfo.partCode}
Name/Description: ${partInfo.nameDesc}
Sample: ${partInfo.sample}
Drawing: ${partInfo.drawing}
Stock: ${partInfo.stock}
Location: ${partInfo.location}
Remark: ${partInfo.remark}
Image Link: ${partInfo.imageLink}
                `);
            } else {
                bot.sendMessage(chatId, 'Image link not available.');
            }
        } else {
            bot.sendMessage(chatId, 'Failed to retrieve part information.');
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'An error occurred while processing your request.');
    }
});

// Handle other message types or commands as needed
// ...

// Start the bot
console.log('Bot is running...');
