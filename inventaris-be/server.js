require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const upload = multer({ storage: multer.memoryStorage() });

// ==================== HELPER: AUTO-LOG ====================
async function logActivity(aktivitas, keterangan) {
  try {
    await supabase.from('activity_logs').insert([{
      aktivitas,
      keterangan,
      created_at: new Date().toISOString(),
    }]);
  } catch (err) {
    console.error('Gagal log activity:', err.message);
  }
}

// ==================== LOGIN ====================
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email ? req.body.email.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';

    const { data, error } = await supabase
      .from('users')
      .select('*, roles(nama_role)')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false, message: 'Email atau Password Salah!' });
    }

    await logActivity(`Login: ${data.nama}`, `Role: ${data.roles?.nama_role || '-'}`);

    res.status(200).json({
      success: true,
      message: 'Login Berhasil!',
      user: {
        id: data.id,
        email: data.email,
        name: data.nama,
        role: data.roles?.nama_role || 'Unknown',
        status: data.status,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== ROLES ====================
app.get('/api/roles', async (req, res) => {
  const { data, error } = await supabase.from('roles').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ==================== USERS ====================
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*, roles(nama_role)').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah User: ${req.body.nama}`, `Email: ${req.body.email}`);
  res.json(data[0]);
});

app.put('/api/users/:id', async (req, res) => {
  const { error } = await supabase.from('users').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Edit User ID: ${req.params.id}`, `Nama: ${req.body.nama || '-'}`);
  res.json({ success: true });
});

app.delete('/api/users/:id', async (req, res) => {
  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Hapus User ID: ${req.params.id}`, 'User dihapus');
  res.json({ success: true });
});

// ==================== LABORATORIUM ====================
app.get('/api/laboratorium', async (req, res) => {
  const { data, error } = await supabase.from('laboratorium').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/laboratorium', async (req, res) => {
  const { data, error } = await supabase.from('laboratorium').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah Lab: ${req.body.nama_lab}`, `Kode: ${req.body.kode_lab}`);
  res.json(data[0]);
});

app.put('/api/laboratorium/:id', async (req, res) => {
  const { error } = await supabase.from('laboratorium').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Edit Lab ID: ${req.params.id}`, `Nama: ${req.body.nama_lab || '-'}`);
  res.json({ success: true });
});

app.delete('/api/laboratorium/:id', async (req, res) => {
  const { error } = await supabase.from('laboratorium').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Hapus Lab ID: ${req.params.id}`, 'Lab dihapus');
  res.json({ success: true });
});

// ==================== RUANGAN ====================
app.get('/api/ruangan', async (req, res) => {
  const { data, error } = await supabase.from('ruangan').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ==================== KATEGORI ASET ====================
app.get('/api/kategori-aset', async (req, res) => {
  const { data, error } = await supabase.from('kategori_aset').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/kategori-aset', async (req, res) => {
  const { data, error } = await supabase.from('kategori_aset').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah Kategori: ${req.body.nama_kategori}`, '-');
  res.json(data[0]);
});

app.put('/api/kategori-aset/:id', async (req, res) => {
  const { error } = await supabase.from('kategori_aset').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Edit Kategori ID: ${req.params.id}`, `Nama: ${req.body.nama_kategori || '-'}`);
  res.json({ success: true });
});

app.delete('/api/kategori-aset/:id', async (req, res) => {
  const { error } = await supabase.from('kategori_aset').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Hapus Kategori ID: ${req.params.id}`, '-');
  res.json({ success: true });
});

// ==================== MERK ====================
app.get('/api/merk', async (req, res) => {
  const { data, error } = await supabase.from('merk').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/merk', async (req, res) => {
  const { data, error } = await supabase.from('merk').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah Merk: ${req.body.nama_merk}`, '-');
  res.json(data[0]);
});

app.put('/api/merk/:id', async (req, res) => {
  const { error } = await supabase.from('merk').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Edit Merk ID: ${req.params.id}`, `Nama: ${req.body.nama_merk || '-'}`);
  res.json({ success: true });
});

app.delete('/api/merk/:id', async (req, res) => {
  const { error } = await supabase.from('merk').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Hapus Merk ID: ${req.params.id}`, '-');
  res.json({ success: true });
});

// ==================== KONDISI ASET ====================
app.get('/api/kondisi-aset', async (req, res) => {
  const { data, error } = await supabase.from('kondisi_aset').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ==================== STATUS ASET ====================
app.get('/api/status-aset', async (req, res) => {
  const { data, error } = await supabase.from('status_aset').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ==================== ASET ====================
app.get('/api/aset', async (req, res) => {
  const { laboratorium_id, kategori_id, kondisi_id, status_id } = req.query;

  let query = supabase
    .from('aset')
    .select(`
      *,
      laboratorium:laboratorium_id(nama_lab, kode_lab),
      kategori:kategori_id(nama_kategori),
      merk:merk_id(nama_merk),
      kondisi:kondisi_id(nama_kondisi),
      status:status_id(nama_status)
    `)
    .order('id');

  if (laboratorium_id) query = query.eq('laboratorium_id', laboratorium_id);
  if (kategori_id) query = query.eq('kategori_id', kategori_id);
  if (kondisi_id) query = query.eq('kondisi_id', kondisi_id);
  if (status_id) query = query.eq('status_id', status_id);

  const { data, error } = await query;
  if (error) {
    const { data: fallback, error: err2 } = await supabase.from('aset').select('*').order('id');
    if (err2) return res.status(500).json({ error: err2.message });
    return res.json(fallback);
  }
  res.json(data);
});

app.post('/api/aset', async (req, res) => {
  const { data, error } = await supabase.from('aset').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah Aset: ${req.body.nama_aset}`, `Kode: ${req.body.kode_aset}`);
  res.json(data[0]);
});

app.put('/api/aset/:id', async (req, res) => {
  const { error } = await supabase.from('aset').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Edit Aset ID: ${req.params.id}`, `Nama: ${req.body.nama_aset || '-'}`);
  res.json({ success: true });
});

app.put('/api/aset/:id/foto', async (req, res) => {
  const { foto_uri } = req.body;
  const { error } = await supabase.from('aset').update({ foto_uri }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Update Foto Aset ID: ${req.params.id}`, `Foto: ${foto_uri}`);
  res.json({ success: true });
});

app.delete('/api/aset/:id', async (req, res) => {
  const { error } = await supabase.from('aset').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Hapus Aset ID: ${req.params.id}`, 'Aset dihapus');
  res.json({ success: true });
});

// ==================== SPESIFIKASI KOMPUTER ====================
app.get('/api/spesifikasi-komputer/:aset_id', async (req, res) => {
  const { data, error } = await supabase
    .from('spesifikasi_komputer')
    .select('*')
    .eq('aset_id', req.params.aset_id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || {});
});

app.post('/api/spesifikasi-komputer', async (req, res) => {
  const { data, error } = await supabase.from('spesifikasi_komputer').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.put('/api/spesifikasi-komputer/:id', async (req, res) => {
  const { error } = await supabase.from('spesifikasi_komputer').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ==================== MAINTENANCE ====================
app.get('/api/maintenance', async (req, res) => {
  const { data, error } = await supabase.from('maintenance').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/maintenance', async (req, res) => {
  const { data, error } = await supabase.from('maintenance').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah Maintenance`, `Aset ID: ${req.body.aset_id}, Jenis: ${req.body.jenis_maintenance}`);
  res.json(data[0]);
});

// ==================== MUTASI ASET ====================
app.get('/api/mutasi-aset', async (req, res) => {
  const { data, error } = await supabase.from('mutasi_aset').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/mutasi-aset', async (req, res) => {
  const { data, error } = await supabase.from('mutasi_aset').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah Mutasi`, `Aset ID: ${req.body.aset_id}, Ke Lab: ${req.body.ke_lab}`);
  res.json(data[0]);
});

// ==================== PENGADUAN ====================
app.get('/api/pengaduan', async (req, res) => {
  const { data, error } = await supabase.from('pengaduan').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/pengaduan', async (req, res) => {
  const { data, error } = await supabase.from('pengaduan').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(`Tambah Pengaduan: ${req.body.judul}`, `Aset ID: ${req.body.aset_id}`);
  res.json(data[0]);
});

// ==================== SETTINGS ====================
app.get('/api/settings', async (req, res) => {
  const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || {});
});

app.put('/api/settings/:id', async (req, res) => {
  const { error } = await supabase.from('settings').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity('Update Pengaturan', `Oleh: Admin`);
  res.json({ success: true });
});

// ==================== ACTIVITY LOGS ====================
app.get('/api/activity-logs', async (req, res) => {
  const { data, error } = await supabase.from('activity_logs').select('*').order('id', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/activity-logs', async (req, res) => {
  const { data, error } = await supabase.from('activity_logs').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// ==================== UPLOAD FOTO ====================
app.post('/api/upload-foto', upload.single('foto'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'File tidak ditemukan' });

    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from('foto-nomor-seri')
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) return res.status(500).json({ error: error.message });

    const { data: urlData } = supabase.storage
      .from('foto-nomor-seri')
      .getPublicUrl(fileName);

    res.json({ url: urlData.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD STATS (HANYA PC) ====================
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const { count: totalKomputer } = await supabase
      .from('aset')
      .select('*', { count: 'exact', head: true })
      .like('kode_aset', 'KOM-%');

    const { count: totalLab } = await supabase
      .from('laboratorium')
      .select('*', { count: 'exact', head: true });

    const { count: komputerRusak } = await supabase
      .from('aset')
      .select('*', { count: 'exact', head: true })
      .like('kode_aset', 'KOM-%')
      .in('kondisi_id', [2, 3]);

    const { count: maintenanceCount } = await supabase
      .from('maintenance')
      .select('*', { count: 'exact', head: true });

    res.json({
      totalKomputer: totalKomputer || 0,
      totalLab: totalLab || 0,
      komputerRusak: komputerRusak || 0,
      maintenance: maintenanceCount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD: KOMPUTER PER LAB ====================
app.get('/api/dashboard/komputer-per-lab', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('aset')
      .select('laboratorium_id, laboratorium:laboratorium_id(nama_lab), kategori_id, kode_aset')
      .like('kode_aset', 'KOM-%');
    if (error) return res.status(500).json({ error: error.message });

    const grouped = {};
    (data || []).forEach((item) => {
      const namaLab = item.laboratorium?.nama_lab || 'Tanpa Lab';
      grouped[namaLab] = (grouped[namaLab] || 0) + 1;
    });

    const result = Object.keys(grouped).map((nama) => ({ nama, jumlah: grouped[nama] }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD: KONDISI KOMPUTER ====================
app.get('/api/dashboard/kondisi-komputer', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('aset')
      .select('kondisi:kondisi_id(nama_kondisi), kode_aset')
      .like('kode_aset', 'KOM-%');
    if (error) return res.status(500).json({ error: error.message });

    const grouped = {};
    (data || []).forEach((item) => {
      const namaKondisi = item.kondisi?.nama_kondisi || 'Tidak Diketahui';
      grouped[namaKondisi] = (grouped[namaKondisi] || 0) + 1;
    });

    const result = Object.keys(grouped).map((nama) => ({ nama, jumlah: grouped[nama] }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD: AKTIVITAS TERBARU ====================
app.get('/api/dashboard/aktivitas-terbaru', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('id', { ascending: false })
      .limit(5);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD: INVENTARIS TERBARU ====================
app.get('/api/dashboard/inventaris-terbaru', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('aset')
      .select(`
        id, kode_aset, nama_aset,
        laboratorium:laboratorium_id(nama_lab),
        kondisi:kondisi_id(nama_kondisi)
      `)
      .order('id', { ascending: false })
      .limit(4);
    if (error) {
      const { data: fallback, error: err2 } = await supabase
        .from('aset')
        .select('*')
        .order('id', { ascending: false })
        .limit(4);
      if (err2) return res.status(500).json({ error: err2.message });
      return res.json(fallback || []);
    }
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== LAPORAN ====================
app.get('/api/laporan', async (req, res) => {
  const { jenis, laboratorium_id, tanggal_awal, tanggal_akhir } = req.query;

  try {
    let data = [];

    if (jenis === 'inventaris' || jenis === 'kondisi' || !jenis) {
      let query = supabase
        .from('aset')
        .select(`
          *,
          laboratorium:laboratorium_id(nama_lab, kode_lab),
          kategori:kategori_id(nama_kategori),
          merk:merk_id(nama_merk),
          kondisi:kondisi_id(nama_kondisi),
          status:status_id(nama_status)
        `)
        .order('id');

      if (laboratorium_id) query = query.eq('laboratorium_id', laboratorium_id);
      const result = await query;
      if (result.error) return res.status(500).json({ error: result.error.message });
      data = result.data;
    } else if (jenis === 'maintenance') {
      const result = await supabase.from('maintenance').select('*').order('id');
      if (result.error) return res.status(500).json({ error: result.error.message });
      data = result.data;
    } else if (jenis === 'mutasi') {
      const result = await supabase.from('mutasi_aset').select('*').order('id');
      if (result.error) return res.status(500).json({ error: result.error.message });
      data = result.data;
    } else if (jenis === 'pengaduan') {
      const result = await supabase.from('pengaduan').select('*').order('id');
      if (result.error) return res.status(500).json({ error: result.error.message });
      data = result.data;
    }

    if (tanggal_awal && tanggal_akhir && data.length > 0) {
      const start = new Date(tanggal_awal);
      const end = new Date(tanggal_akhir);
      data = data.filter((item) => {
        const tgl = item.created_at || item.tanggal;
        if (!tgl) return true;
        const d = new Date(tgl);
        return d >= start && d <= end;
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== RUN SERVER ====================
app.listen(5000, () => console.log('Backend Sistem Inventaris Lab jalan di http://localhost:5000'));