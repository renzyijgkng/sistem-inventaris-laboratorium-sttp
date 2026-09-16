const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const users = [
  { email: 'admin@sttp.ac.id', pass: '123', role: 'admin', name: 'Admin Lab' },
  { email: 'operator@sttp.ac.id', pass: '123', role: 'operator', name: 'Operator Lab' },
  { email: 'viewer@sttp.ac.id', pass: '123', role: 'viewer', name: 'Viewer Lab' }
];

let kategoriData = [
  { id: 1, nama: 'Komputer' },
  { id: 2, nama: 'Kabel Jaringan' },
  { id: 3, nama: 'Pendingin Ruangan' },
  { id: 4, nama: 'Hardware' }
];

let barangData = [
  { id: 1, kategori: 'Komputer', nama: 'Komputer Server', jumlah: 2, satuan: 'unit' },
  { id: 2, kategori: 'Komputer', nama: 'Komputer Dekstop', jumlah: 10, satuan: 'unit' },
  { id: 3, kategori: 'Kabel Jaringan', nama: 'Kabel LAN', jumlah: 2, satuan: 'roll' },
  { id: 4, kategori: 'Pendingin Ruangan', nama: 'AC', jumlah: 3, satuan: 'unit' }
];

let barangMasukData = [
  { id: 1, tanggal: '2024-03-22', nama: 'Komputer Server', jumlah: 1, keterangan: 'Kondisi Barang Bagus' },
  { id: 2, tanggal: '2024-07-08', nama: 'Komputer Dekstop', jumlah: 5, keterangan: 'Kondisi Barang Bagus' }
];

let barangKeluarData = [
  { id: 1, tanggal: '2024-01-05', nama: 'Komputer Dekstop', jumlah: 3, keterangan: 'Barang dipinjam' },
  { id: 2, tanggal: '2024-01-05', nama: 'Keyboard + Mouse', jumlah: 5, keterangan: 'Barang dipinjam' }
];

app.post('/login', (req, res) => {
  const email = req.body.email ? req.body.email.trim() : '';
  const password = req.body.password ? req.body.password.trim() : '';
  const user = users.find(u => u.email === email && u.pass === password);

  if (user) {
    return res.status(200).json({ success: true, message: 'Login Berhasil!', user: { email: user.email, role: user.role, name: user.name } });
  }
  return res.status(401).json({ success: false, message: 'Email atau Password Salah!' });
});

app.get('/api/kategori', (req, res) => res.json(kategoriData));
app.get('/api/barang', (req, res) => res.json(barangData));
app.get('/api/barang-masuk', (req, res) => res.json(barangMasukData));
app.get('/api/barang-keluar', (req, res) => res.json(barangKeluarData));

app.post('/api/kategori', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  kategoriData.push(newItem);
  res.json(newItem);
});

app.put('/api/kategori/:id', (req, res) => {
  const id = parseInt(req.params.id);
  kategoriData = kategoriData.map(item => item.id === id ? { ...item, ...req.body } : item);
  res.json({ success: true });
});

app.delete('/api/kategori/:id', (req, res) => {
  const id = parseInt(req.params.id);
  kategoriData = kategoriData.filter(item => item.id !== id);
  res.json({ success: true });
});

app.post('/api/barang', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  barangData.push(newItem);
  res.json(newItem);
});

app.put('/api/barang/:id', (req, res) => {
  const id = parseInt(req.params.id);
  barangData = barangData.map(item => item.id === id ? { ...item, ...req.body } : item);
  res.json({ success: true });
});

app.delete('/api/barang/:id', (req, res) => {
  const id = parseInt(req.params.id);
  barangData = barangData.filter(item => item.id !== id);
  res.json({ success: true });
});

app.post('/api/barang-masuk', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  barangMasukData.push(newItem);
  res.json(newItem);
});

app.post('/api/barang-keluar', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  barangKeluarData.push(newItem);
  res.json(newItem);
});

app.listen(5000, () => console.log('Backend jalan di http://localhost:5000'));