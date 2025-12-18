const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// File JSON untuk menyimpan data
const DATA_FILE = 'data-alamat.json';

// Inisialisasi file JSON jika belum ada
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Endpoint untuk menyimpan alamat
app.post('/api/simpan-alamat', (req, res) => {
    try {
        const dataBaru = {
            id: Date.now(), // ID unik berdasarkan timestamp
            timestamp: new Date().toISOString(),
            ...req.body
        };

        // Baca data yang ada
        const dataLama = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        // Tambahkan data baru
        dataLama.push(dataBaru);
        
        // Simpan ke file
        fs.writeFileSync(DATA_FILE, JSON.stringify(dataLama, null, 2));
        
        res.json({
            success: true,
            message: 'Alamat berhasil disimpan!',
            data: dataBaru
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menyimpan alamat: ' + error.message
        });
    }
});

// Endpoint untuk mengambil semua data alamat
app.get('/api/alamat', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal membaca data: ' + error.message
        });
    }
});

// Endpoint untuk mengambil data berdasarkan ID
app.get('/api/alamat/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const alamat = data.find(item => item.id == req.params.id);
        
        if (alamat) {
            res.json({
                success: true,
                data: alamat
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal membaca data: ' + error.message
        });
    }
});

// Endpoint untuk menghapus data
app.delete('/api/alamat/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const dataBaru = data.filter(item => item.id != req.params.id);
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(dataBaru, null, 2));
        
        res.json({
            success: true,
            message: 'Data berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data: ' + error.message
        });
    }
});

// Endpoint utama - serve file HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`- Form alamat: http://localhost:${port}/`);
    console.log(`- Endpoint API: http://localhost:${port}/api/simpan-alamat`);
});
