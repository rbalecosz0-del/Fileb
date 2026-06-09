const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// GANTI DENGAN TOKEN ASLI DARI BOTFATHER ANDA
const TOKEN = "13524293:3ElvmkM2sB4zKicjZscRiAifLPbACTiJk3W";
const API = `https://api.safew.bot/bot${TOKEN}`;

// Penyimpanan database sementara di memori
const database = {};

// Template Keyboard Menu Utama di bagian bawah
const mainMenuKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "📥 Up File" }, { text: "📤 Get File" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

app.post("/", async (req, res) => {
    try {
        const update = req.body;

        if (!update.message) {
            return res.sendStatus(200);
        }

        const msg = update.message;
        const chat_id = msg.chat.id;

        // 1. RESPONS UTAMA (/start atau ketik menu biasa)
        if (msg.text && (msg.text.startsWith("/start") || msg.text === "Kembali")) {
            const param = msg.text.split(" ")[1];

            // JIKA USER MEMBUKA LINK otomatis (contoh: /start xyz)
            if (param && database[param]) {
                const data = database[param];
                if (data.type === "video") {
                    await axios.post(`${API}/sendVideo`, { chat_id, video: data.file_id, caption: "✅ Video berhasil dibuka" });
                } else if (data.type === "document") {
                    await axios.post(`${API}/sendDocument`, { chat_id, document: data.file_id, caption: "✅ File berhasil dibuka" });
                } else if (data.type === "photo") {
                    await axios.post(`${API}/sendPhoto`, { chat_id, photo: data.file_id, caption: "✅ Foto berhasil dibuka" });
                }
                return res.sendStatus(200);
            }

            // TAMPILAN MENU UTAMA
            const pesanMenu = 
`😉 Selamat datang di FILE CODE SYSTEM.
━━━━━━━━━━━━━━━━━━━━
📌 MENU
━━━━━━━━━━━━━━━━━━━━
📥 Up File → upload file
📤 Get File → ambil file pakai CODE
━━━━━━━━━━━━━━━━━━━━
💀 NOTE
━━━━━━━━━━━━━━━━━━━━
• CODE hilang = tanggung jawab user
• Jangan spam 😉`;

            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text: pesanMenu,
                ...mainMenuKeyboard
            });
        }

        // 2. KETIKA USER KLIK TOMBOL "📥 Up File"
        else if (msg.text === "📥 Up File") {
            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text: "Upload atau silakan kirim file/video/foto Anda ke sini..."
            });
        }

        // 3. KETIKA USER KLIK TOMBOL "📤 Get File"
        else if (msg.text === "📤 Get File") {
            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text: "Silakan kirimkan KODE file untuk mengambil file Anda."
            });
        }

        // 4. KETIKA USER MENGIRIM KODE MANUAL
        else if (msg.text && database[msg.text]) {
            const data = database[msg.text];
            if (data.type === "video") {
                await axios.post(`${API}/sendVideo`, { chat_id, video: data.file_id, caption: "✅ Video berhasil dibuka" });
            } else if (data.type === "document") {
                await axios.post(`${API}/sendDocument`, { chat_id, document: data.file_id, caption: "✅ File berhasil dibuka" });
            } else if (data.type === "photo") {
                await axios.post(`${API}/sendPhoto`, { chat_id, photo: data.file_id, caption: "✅ Foto berhasil dibuka" });
            }
        }

        // 5. PROSES UPLOAD VIDEO
        else if (msg.video) {
            const code = "Meviss_" + Math.random().toString(36).substring(2, 8) + "_0v_1p_0d_" + Math.random().toString(36).substring(2, 10);
            database[code] = { type: "video", file_id: msg.video.file_id };
            const sizeMB = (msg.video.file_size / (1024 * 1024)).toFixed(2);

            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text: `💀 UPLOAD COMPLETE\n\n😉 CODE:\n${code}\n\n📦 Total File : 1\n💾 Size      : ${sizeMB} MB\n\n📦 File berhasil disimpan 😉\n🤖 Bot: Mevissbot`
            });
        }

        // 6. PROSES UPLOAD DOCUMENT (FILE)
        else if (msg.document) {
            const code = "Meviss_" + Math.random().toString(36).substring(2, 8) + "_0v_1p_0d_" + Math.random().toString(36).substring(2, 10);
            database[code] = { type: "document", file_id: msg.document.file_id };
            const sizeMB = (msg.document.file_size / (1024 * 1024)).toFixed(2);

            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text: `💀 UPLOAD COMPLETE\n\n😉 CODE:\n${code}\n\n📦 Total File : 1\n💾 Size      : ${sizeMB} MB\n\n📦 File berhasil disimpan 😉\n🤖 Bot: Mevissbot`
            });
        }

        // 7. PROSES UPLOAD PHOTO
        else if (msg.photo) {
            const code = "Meviss_" + Math.random().toString(36).substring(2, 8) + "_0v_1p_0d_" + Math.random().toString(36).substring(2, 10);
            const photo = msg.photo[msg.photo.length - 1];
            database[code] = { type: "photo", file_id: photo.file_id };
            const sizeMB = photo.file_size ? (photo.file_size / (1024 * 1024)).toFixed(2) : "0.03";

            await axios.post(`${API}/sendMessage`, {
                chat_id,
                text: `💀 UPLOAD COMPLETE\n\n😉 CODE:\n${code}\n\n📦 Total File : 1\n💾 Size      : ${sizeMB} MB\n\n📦 File berhasil disimpan 😉\n🤖 Bot: Mevissbot`
            });
        }
    } catch (error) {
        console.error("Terjadi error pada proses webhook:", error.message);
    }

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Bot aktif");
});
