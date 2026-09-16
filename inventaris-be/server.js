require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Supabase (pakai Service Role Key untuk akses full dari backend)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ==================== LOGIN ====================
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email ? req.body.email.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false, message: 'Email atau Password Salah!' });
    }

    res.status(200).json({
      success: true,
      message: 'Login Berhasil!',
      user: { email: data.email, role: data.role, name: data.name },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== KATEGORI ====================
app.get('/api/kategori', async (req, res) => {
  const { data, error } = await supabase.from('kategori').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/kategori', async (req, res) => {
  const { data, error } = await supabase.from('kategori').insert([{ nama: req.body.nama }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.put('/api/kategori/:id', async (req, res) => {
  const { error } = await supabase.from('kategori').update({ nama: req.body.nama }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.delete('/api/kategori/:id', async (req, res) => {
  const { error } = await supabase.from('kategori').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ==================== BARANG ====================
app.get('/api/barang', async (req, res) => {
  const { data, error } = await supabase.from('barang').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/barang', async (req, res) => {
  const { data, error } = await supabase.from('barang').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.put('/api/barang/:id', async (req, res) => {
  const { error } = await supabase.from('barang').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.delete('/api/barang/:id', async (req, res) => {
  const { error } = await supabase.from('barang').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ==================== BARANG MASUK ====================
app.get('/api/barang-masuk', async (req, res) => {
  const { data, error } = await supabase.from('barang_masuk').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/barang-masuk', async (req, res) => {
  const { data, error } = await supabase.from('barang_masuk').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ==================== BARANG KELUAR ====================
app.get('/api/barang-keluar', async (req, res) => {
  const { data, error } = await supabase.from('barang_keluar').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/barang-keluar', async (req, res) => {
  const { data, error } = await supabase.from('barang_keluar').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ==================== RUN SERVER ====================
app.listen(5000, () => console.log('Backend Supabase jalan di http://localhost:5000'));