const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "info",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "MirryKal",
    description: "Stylish bot info with one random image",
    commandCategory: "system",
    cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
    const moment = require("moment-timezone");
    const time = process.uptime();
    const hours = Math.floor(time / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60);
    const currentTime = moment.tz("Asia/Kolkata").format("『D/MM/YYYY』 【HH:mm:ss】");

    const adminUIDs = global.config.ADMINBOT || [];
    let adminNames = [];

    for (const uid of adminUIDs) {
        try {
            const info = await api.getUserInfo(uid);
            const name = info[uid].name;
            adminNames.push(`👑 𝘽𝙊𝙏 𝙊𝙒𝙉𝙀𝙍: ${name}`);
        } catch (e) {
            adminNames.push(`👑 𝘽𝙊𝙏 𝙊𝙒𝙉𝙀𝙍 UID: ${uid}`);
        }
    }

    const botInfo = `
╭━━━━━━━━━━━━━━╮
   ✨ 𝙄𝙉𝙁𝙊 ✨
╰━━━━━━━━━━━━━━╯

📛 𝙉𝘼𝙈𝙀: ${global.config.BOTNAME}
🔰 𝙋𝙍𝙀𝙁𝙄𝙓: ${global.config.PREFIX}
⏱️ 𝙐𝙋𝙏𝙄𝙈𝙀: ${hours}h ${minutes}m ${seconds}s
📅 𝘿𝘼𝙏𝙀 & 𝙏𝙄𝙈𝙀: ${currentTime}

${adminNames.join("\n")}

📚 𝙇𝙀𝘼𝙍𝙉 𝘽𝙊𝙏 𝘾𝙍𝙀𝘼𝙏𝙄𝙊𝙉:
🔗 https://m.youtube.com/@Entertainment.story.
    `;

    // 🎯 Image map (filename -> URL)
    const imageList = {
        "py0hfk.jpg": "https://files.catbox.moe/py0hfk.jpg",
        "vsjokh.jpg": "https://files.catbox.moe/vsjokh.jpg",
        "49mlqw.jpg": "https://files.catbox.moe/49mlqw.jpg",
        "usz78q.jpg": "https://files.catbox.moe/usz78q.jpg"
    };

    // Random selection
    const entries = Object.entries(imageList);
    const [fileName, url] = entries[Math.floor(Math.random() * entries.length)];
    const filePath = path.join("cache", fileName);

    // Make sure cache folder exists
    if (!fs.existsSync("cache")) fs.mkdirSync("cache");

    // Download image if not exists
    if (!fs.existsSync(filePath)) {
        try {
            const res = await axios({
                url,
                method: "GET",
                responseType: "stream"
            });
            const writer = fs.createWriteStream(filePath);
            res.data.pipe(writer);
            await new Promise(resolve => writer.on("finish", resolve));
        } catch (err) {
            console.log(`❌ Failed to download ${fileName}`);
        }
    }

    return api.sendMessage({
        body: botInfo.trim(),
        attachment: fs.existsSync(filePath) ? fs.createReadStream(filePath) : null
    }, event.threadID, event.messageID);
};