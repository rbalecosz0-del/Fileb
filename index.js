const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const TOKEN = "
13524293:3ElvmkM2sB4zKicjZscRiAifLPbACTiJk3W";

const API = `https://api.safew.bot/bot${13524293:3ElvmkM2sB4zKicjZscRiAifLPbACTiJk3W}`;

// Penyimpanan sementara
const database = {};

app.post("/", async (req, res) => {

    const update = req.body;

    if(update.message){

        const msg = update.message;
        const chat_id = msg.chat.id;

        // START
        if(msg.text && msg.text.startsWith("/start")){

            const param = msg.text.split(" ")[1];

            // Jika buka link file
            if(param && database[param]){

                const data = database[param];

                // VIDEO
                if(data.type === "video"){

                    await axios.post(`${API}/sendVideo`, {
                        chat_id,
                        video: data.file_id,
                        caption: "✅ Video berhasil dibuka"
                    });
                }

                // DOCUMENT
                if(data.type === "document"){

                    await axios.post(`${API}/sendDocument`, {
                        chat_id,
                        document: data.file_id,
                        caption: "✅ File berhasil dibuka"
                    });
                }

                // PHOTO
                if(data.type === "photo"){

                    await axios.post(`${API}/sendPhoto`, {
                        chat_id,
                        photo: data.file_id,
                        caption: "✅ Foto berhasil dibuka"
                    });
                }

            } else {

                await axios.post(`${API}/sendMessage`, {
                    chat_id,
                    text:
`👋 Selamat datang

📤 Kirim video/file/foto untuk membuat link.`
                });
            }
        }

        // VIDEO
        if(msg.video){

            const code = Math.random()
                .toString(36)
                .substring(2,8);

            database[code] = {
                type: "video",
                file_id: msg.video.file_id
            };

            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text:
`✅ Video berhasil disimpan

🔑 Kode:
${code}

🔗 Link:
}`
            });
        }https://t.me/SafeW_bot?start=${code

        // DOCUMENT
        if(msg.document){

            const code = Math.random()
                .toString(36)
                .substring(2,8);

            database[code] = {
                type: "document",
                file_id: msg.document.file_id
            };

            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text:
`✅ File berhasil disimpan

🔑 Kode:
${code}

🔗 Link:
https://t.me/SafeW_bot?start=${code}`
            });
        }

        // PHOTO
        if(msg.photo){

            const code = Math.random()
                .toString(36)
                .substring(2,8);

            const photo =
                msg.photo[msg.photo.length - 1];

            database[code] = {
                type: "photo",
                file_id: photo.file_id
            };

            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text:
`✅ Foto berhasil disimpan

🔑 Kode:
${code}

🔗 Link:
https://t.me/SafeW_bot?start=${code
            });
        }
    }

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Bot aktif");
});
