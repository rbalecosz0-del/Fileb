const express = require('express');
const axios = require('axios');
const app = express();

// 1. PENGOLAH DATA JSON (Wajib agar server Railway tidak hang/crash)
app.use(express.json());

// 2. KONFIGURASI BOT (Menggunakan Token Valid Anda)
const TOKEN = "13569302:3Esx8dVS3OXvFFqQM5XtaErTiHVOPiYl76J";
const API = `https://api.safew.bot/bot${TOKEN}`;

// Database lokal sementara untuk menyimpan file code
const database = {};

// 3. JALUR UTAMA WEBHOOK FOR RECEIVING MESSAGES
app.post(`/bot${TOKEN}`, async (req, res) => {
    try {
        const msg = req.body.message;
        
        // Beritahu SafeW secepatnya bahwa data sudah diterima agar koneksi tidak diputus
        res.sendStatus(200); 

        if (!msg) return;

        const chat_id = msg.chat.id;

        // --- LOGIKA UTAMA BOT ---

        // A. KETIK USER MENGIRIM /START
        if (msg.text === '/start') {
            await axios.post(`${API}/sendMessage`, {
                chat_id: chat_id,
                text: "😉 Selamat datang di MEVISS FILE CODE SYSTEM.\n\nKirimkan file (Video, Foto, Dokumen) untuk mendapatkan KODE, atau kirimkan KODE yang valid untuk mengambil file Anda kembali."
            });
            return;
        }

        // B. KETIK USER MENGIRIM KODE MANUAl UNTUK MENGAMBIL FILE
        if (msg.text && database[msg.text]) {
            const data = database[msg.text];
            if (data.type === 'video') {
                await axios.post(`${API}/sendVideo`, { chat_id: chat_id, video: data.file_id, caption: "Ini video Anda!" });
            } else if (data.type === 'document') {
                await axios.post(`${API}/sendDocument`, { chat_id: chat_id, document: data.file_id, caption: "Ini dokumen Anda!" });
            } else if (data.type === 'photo') {
                await axios.post(`${API}/sendPhoto`, { chat_id: chat_id, photo: data.file_id, caption: "Ini foto Anda!" });
            }
            return;
        }

        // C. PROSES KETIKA USER UPLOAD VIDEO
        if (msg.video) {
            const code = "Meviss_" + Math.random().toString(36).substring(2, 8);
            database[code] = { type: "video", file_id: msg.video.file_id };
            const sizeMB = (msg.video.file_size / (1024 * 1024)).toFixed(2);

            await axios.post(`${API}/sendMessage`, {
                chat_id: chat_id,
                text: `💾 UPLOAD COMPLETE\n\n🔑 CODE: \`${code}\`\n📦 Total File: 1\n📊 Size: ${sizeMB} MB`
            });
            return;
        }

        // D. PROSES KETIKA USER UPLOAD DOKUMEN / FILE
        if (msg.document) {
            const code = "Meviss_" + Math.random().toString(36).substring(2, 8);
            database[code] = { type: "document", file_id: msg.document.file_id };
            const sizeMB = (msg.document.file_size / (1024 * 1024)).toFixed(2);

            await axios.post(`${API}/sendMessage`, {
                chat_id: chat_id,
                text: `💾 UPLOAD COMPLETE\n\n🔑 CODE: \`${code}\`\n📦 Total File: 1\n📊 Size: ${sizeMB} MB`
            });
            return;
        }

        // E. PROSES KETIKA USER UPLOAD FOTO
        if (msg.photo) {
            const code = "Meviss_" + Math.random().toString(36).substring(2, 8);
            const photo_file_id = msg.photo[msg.photo.length - 1].file_id; // Ambil resolusi tertinggi
            database[code] = { type: "photo", file_id: photo_file_id };

            await axios.post(`${API}/sendMessage`, {
                chat_id: chat_id,
                text: `💾 UPLOAD COMPLETE\n\n🔑 CODE: \`${code}\`\n📦 Total File: 1\n📊 Size: Photo`
            });
            return;
        }

    } catch (error) {
        console.error("Terjadi error pada proses webhook:", error.message);
    }
});

// 4. KONFIGURASI PORT DINAMIS RAILWAY (Wajib menggunakan process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot aktif di port ${PORT}`);
});
