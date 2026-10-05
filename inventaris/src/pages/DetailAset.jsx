import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Chip, Button, Grid, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, FormControl, InputLabel, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function DetailAset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aset, setAset] = useState(null);
  const [spesifikasi, setSpesifikasi] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [mutasi, setMutasi] = useState([]);
  const [pengaduan, setPengaduan] = useState([]);
  const [tab, setTab] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [openMaint, setOpenMaint] = useState(false);
  const [openMutasi, setOpenMutasi] = useState(false);
  const [openPengaduan, setOpenPengaduan] = useState(false);

  const [formMaint, setFormMaint] = useState({ tanggal: '', jenis_maintenance: '', teknisi: '', keterangan: '', status: 'Selesai' });
  const [formMutasi, setFormMutasi] = useState({ tanggal: '', dari_lab: '', ke_lab: '', keterangan: '' });
  const [formPengaduan, setFormPengaduan] = useState({ tanggal: '', judul: '', deskripsi: '', status: 'Open' });

  const fetchAll = () => {
    api.get('/api/aset').then((res) => {
      const found = res.data.find((a) => String(a.id) === String(id));
      setAset(found);
    }).catch(() => {});

    api.get(`/api/spesifikasi-komputer/${id}`).then((res) => setSpesifikasi(res.data)).catch(() => {});
    api.get('/api/maintenance').then((res) => setMaintenance(res.data.filter((m) => String(m.aset_id) === String(id)))).catch(() => {});
    api.get('/api/mutasi-aset').then((res) => setMutasi(res.data.filter((m) => String(m.aset_id) === String(id)))).catch(() => {});
    api.get('/api/pengaduan').then((res) => setPengaduan(res.data.filter((p) => String(p.aset_id) === String(id)))).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleUploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('foto', file);
      const uploadRes = await api.post('/api/upload-foto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = uploadRes.data.url;
      await api.put(`/api/aset/${id}/foto`, { foto_uri: url });
      toast.success('Foto berhasil diupload!');
      fetchAll();
    } catch (err) {
      toast.error('Gagal upload foto!');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMaint = async () => {
    if (!formMaint.tanggal || !formMaint.jenis_maintenance) {
      toast.error('Tanggal & Jenis wajib diisi');
      return;
    }
    try {
      await api.post('/api/maintenance', { ...formMaint, aset_id: id });
      toast.success('Maintenance tersimpan!');
      setOpenMaint(false);
      setFormMaint({ tanggal: '', jenis_maintenance: '', teknisi: '', keterangan: '', status: 'Selesai' });
      fetchAll();
    } catch { toast.error('Gagal menyimpan'); }
  };

  const handleSaveMutasi = async () => {
    if (!formMutasi.tanggal || !formMutasi.ke_lab) {
      toast.error('Tanggal & Lab Tujuan wajib diisi');
      return;
    }
    try {
      await api.post('/api/mutasi-aset', { ...formMutasi, aset_id: id });
      toast.success('Mutasi tersimpan!');
      setOpenMutasi(false);
      setFormMutasi({ tanggal: '', dari_lab: '', ke_lab: '', keterangan: '' });
      fetchAll();
    } catch { toast.error('Gagal menyimpan'); }
  };

  const handleSavePengaduan = async () => {
    if (!formPengaduan.tanggal || !formPengaduan.judul) {
      toast.error('Tanggal & Judul wajib diisi');
      return;
    }
    try {
      await api.post('/api/pengaduan', { ...formPengaduan, aset_id: id });
      toast.success('Pengaduan tersimpan!');
      setOpenPengaduan(false);
      setFormPengaduan({ tanggal: '', judul: '', deskripsi: '', status: 'Open' });
      fetchAll();
    } catch { toast.error('Gagal menyimpan'); }
  };

  if (!aset) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="body1">Memuat data...</Typography>
      </Paper>
    );
  }

  const getKondisiColor = (nama) => {
    if (nama === 'Baik') return { bg: '#dcfce7', color: '#166534' };
    if (nama === 'Rusak Ringan') return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#fee2e2', color: '#991b1b' };
  };

  const kColor = getKondisiColor(aset.kondisi?.nama_kondisi);

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/inventaris')} sx={{ textTransform: 'none', mb: 2, color: '#2563eb' }}>
        Kembali
      </Button>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>Informasi Aset</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>KODE</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1e293b' }}>{aset.kode_aset}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>NAMA</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>{aset.nama_aset}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>KATEGORI</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>{aset.kategori?.nama_kategori || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>MERK</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>{aset.merk?.nama_merk || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>NOMOR SERI</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>{aset.nomor_seri || '-'}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>Status</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>KONDISI</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip label={aset.kondisi?.nama_kondisi || '-'} size="small" sx={{ backgroundColor: kColor.bg, color: kColor.color, fontWeight: 'bold' }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>STATUS</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>{aset.status?.nama_status || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>LAB</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>{aset.laboratorium?.nama_lab || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>RUANGAN</Typography>
                <Typography variant="body2" sx={{ color: '#1e293b' }}>{aset.ruangan?.nama_ruangan || '-'}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>Spesifikasi Komputer</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>PROCESSOR</Typography>
            <Typography variant="body2" sx={{ color: '#1e293b' }}>{spesifikasi?.processor || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>RAM</Typography>
            <Typography variant="body2" sx={{ color: '#1e293b' }}>{spesifikasi?.ram || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>STORAGE</Typography>
            <Typography variant="body2" sx={{ color: '#1e293b' }}>{spesifikasi?.storage || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>VGA</Typography>
            <Typography variant="body2" sx={{ color: '#1e293b' }}>{spesifikasi?.vga || '-'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>Foto Nomor Seri</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {aset.foto_uri ? (
            <img src={aset.foto_uri} alt="Foto Aset" style={{ width: 200, borderRadius: 8, border: '1px solid #cbd5e1' }} />
          ) : (
            <Box sx={{ width: 200, height: 150, backgroundColor: '#f1f5f9', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>BELUM ADA FOTO</Typography>
            </Box>
          )}
          <Button
            variant="outlined"
            component="label"
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
            disabled={uploading}
            sx={{ textTransform: 'none', borderRadius: '10px' }}
          >
            {uploading ? 'Mengunggah...' : 'Upload Foto'}
            <input type="file" accept="image/*" hidden onChange={handleUploadFoto} />
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: '1px solid #e2e8f0', px: 2 }}>
          <Tab label="Informasi" sx={{ textTransform: 'none' }} />
          <Tab label="Maintenance" sx={{ textTransform: 'none' }} />
          <Tab label="Mutasi" sx={{ textTransform: 'none' }} />
          <Tab label="Pengaduan" sx={{ textTransform: 'none' }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Informasi lengkap aset ditampilkan di atas.
            </Typography>
          )}

          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button startIcon={<AddIcon />} onClick={() => setOpenMaint(true)} variant="contained" sx={{ textTransform: 'none', borderRadius: '10px' }}>
                  Tambah Maintenance
                </Button>
              </Box>
              {maintenance.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Belum ada riwayat maintenance</Typography>
              ) : (
                maintenance.map((m) => (
                  <Box key={m.id} sx={{ display: 'flex', gap: 2, mb: 1.5, pb: 1.5, borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', minWidth: 100 }}>{m.tanggal}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{m.jenis_maintenance}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Teknisi: {m.teknisi}</Typography>
                    <Chip label={m.status} size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' }} />
                  </Box>
                ))
              )}
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button startIcon={<AddIcon />} onClick={() => setOpenMutasi(true)} variant="contained" sx={{ textTransform: 'none', borderRadius: '10px' }}>
                  Tambah Mutasi
                </Button>
              </Box>
              {mutasi.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Belum ada data mutasi</Typography>
              ) : (
                mutasi.map((m) => (
                  <Box key={m.id} sx={{ display: 'flex', gap: 2, mb: 1.5, pb: 1.5, borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', minWidth: 100 }}>{m.tanggal}</Typography>
                    <Typography variant="body2" sx={{ color: '#1e293b' }}>Dari Lab ID: {m.dari_lab} → Ke Lab ID: {m.ke_lab}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>{m.keterangan}</Typography>
                  </Box>
                ))
              )}
            </Box>
          )}

          {tab === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button startIcon={<AddIcon />} onClick={() => setOpenPengaduan(true)} variant="contained" sx={{ textTransform: 'none', borderRadius: '10px' }}>
                  Tambah Pengaduan
                </Button>
              </Box>
              {pengaduan.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Belum ada data pengaduan</Typography>
              ) : (
                pengaduan.map((p) => (
                  <Box key={p.id} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{p.judul}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{p.tanggal} • {p.deskripsi}</Typography>
                    <Chip label={p.status} size="small" sx={{ ml: 1, backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }} />
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog open={openMaint} onClose={() => setOpenMaint(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Tambah Maintenance</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField fullWidth type="date" label="Tanggal" value={formMaint.tanggal} onChange={(e) => setFormMaint({ ...formMaint, tanggal: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField fullWidth label="Jenis Maintenance" value={formMaint.jenis_maintenance} onChange={(e) => setFormMaint({ ...formMaint, jenis_maintenance: e.target.value })} placeholder="Contoh: Cleaning, Upgrade RAM" sx={{ mb: 2 }} />
          <TextField fullWidth label="Teknisi" value={formMaint.teknisi} onChange={(e) => setFormMaint({ ...formMaint, teknisi: e.target.value })} placeholder="Nama teknisi" sx={{ mb: 2 }} />
          <TextField fullWidth label="Keterangan" value={formMaint.keterangan} onChange={(e) => setFormMaint({ ...formMaint, keterangan: e.target.value })} multiline rows={2} sx={{ mb: 2 }} />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={formMaint.status} onChange={(e) => setFormMaint({ ...formMaint, status: e.target.value })} label="Status">
              <MenuItem value="Selesai">Selesai</MenuItem>
              <MenuItem value="Proses">Proses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenMaint(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSaveMaint} variant="contained" sx={{ textTransform: 'none', borderRadius: '10px' }}>Simpan</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openMutasi} onClose={() => setOpenMutasi(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Tambah Mutasi</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField fullWidth type="date" label="Tanggal" value={formMutasi.tanggal} onChange={(e) => setFormMutasi({ ...formMutasi, tanggal: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField fullWidth type="number" label="Dari Lab ID" value={formMutasi.dari_lab} onChange={(e) => setFormMutasi({ ...formMutasi, dari_lab: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth type="number" label="Ke Lab ID" value={formMutasi.ke_lab} onChange={(e) => setFormMutasi({ ...formMutasi, ke_lab: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Keterangan" value={formMutasi.keterangan} onChange={(e) => setFormMutasi({ ...formMutasi, keterangan: e.target.value })} multiline rows={2} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenMutasi(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSaveMutasi} variant="contained" sx={{ textTransform: 'none', borderRadius: '10px' }}>Simpan</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPengaduan} onClose={() => setOpenPengaduan(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Tambah Pengaduan</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField fullWidth type="date" label="Tanggal" value={formPengaduan.tanggal} onChange={(e) => setFormPengaduan({ ...formPengaduan, tanggal: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField fullWidth label="Judul" value={formPengaduan.judul} onChange={(e) => setFormPengaduan({ ...formPengaduan, judul: e.target.value })} placeholder="Contoh: PC tidak menyala" sx={{ mb: 2 }} />
          <TextField fullWidth label="Deskripsi" value={formPengaduan.deskripsi} onChange={(e) => setFormPengaduan({ ...formPengaduan, deskripsi: e.target.value })} multiline rows={3} sx={{ mb: 2 }} />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={formPengaduan.status} onChange={(e) => setFormPengaduan({ ...formPengaduan, status: e.target.value })} label="Status">
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Proses">Proses</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenPengaduan(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <Button onClick={handleSavePengaduan} variant="contained" sx={{ textTransform: 'none', borderRadius: '10px' }}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}