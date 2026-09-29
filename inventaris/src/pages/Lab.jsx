import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import ComputerIcon from '@mui/icons-material/Computer';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function Lab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    kode_lab: '', nama_lab: '', lokasi: '', kapasitas: '', penanggung_jawab: '', status: 'Aktif',
  });

  const fetchData = () => {
    api.get('/api/laboratorium').then((res) => setData(res.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ kode_lab: '', nama_lab: '', lokasi: '', kapasitas: '', penanggung_jawab: '', status: 'Aktif' });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm(item);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.kode_lab || !form.nama_lab) {
      toast.error('Kode dan Nama Lab wajib diisi!');
      return;
    }
    const payload = { ...form, kapasitas: Number(form.kapasitas) || 0 };
    try {
      if (isEdit) {
        await api.put(`/api/laboratorium/${currentId}`, payload);
        toast.success('Data lab berhasil diubah!');
      } else {
        await api.post('/api/laboratorium', payload);
        toast.success('Data lab berhasil ditambahkan!');
      }
      fetchData();
      setOpen(false);
    } catch (err) {
      toast.error('Gagal menyimpan data!');
    }
  };

  const totalKomputer = data.reduce((sum, item) => sum + (item.kapasitas || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Daftar Laboratorium Komputer
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Pengelolaan laboratorium komputer STTP
          </Typography>
        </Box>
        {user?.role === 'Administrator' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '10px',
              px: 3,
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            Tambah Laboratorium
          </Button>
        )}
      </Box>

      {/* GRID 3 KARTU HORIZONTAL */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {data.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Belum ada data laboratorium
              </Typography>
            </Paper>
          </Grid>
        ) : (
          data.map((lab) => (
            <Grid item xs={12} sm={6} md={4} key={lab.id}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  borderTop: '4px solid #2563eb',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* HEADER: KODE + NAMA */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BusinessIcon sx={{ color: '#2563eb', fontSize: 28 }} />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', fontWeight: 600, display: 'block', lineHeight: 1 }}
                    >
                      {lab.kode_lab}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        lineHeight: 1.2,
                        fontSize: '0.95rem',
                      }}
                    >
                      {lab.nama_lab}
                    </Typography>
                  </Box>
                </Box>

                {/* INFO: LOKASI */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                  <Typography variant="caption" sx={{ color: '#475569' }}>
                    {lab.lokasi || '-'}
                  </Typography>
                </Box>

                {/* INFO: KAPASITAS */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <PeopleIcon sx={{ fontSize: 16, color: '#eab308' }} />
                  <Typography variant="caption" sx={{ color: '#475569' }}>
                    Kapasitas: {lab.kapasitas || 0}
                  </Typography>
                </Box>

                {/* INFO: KOMPUTER */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <ComputerIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                  <Typography variant="caption" sx={{ color: '#475569' }}>
                    Komputer: {lab.kapasitas || 0}
                  </Typography>
                </Box>

                {/* STATUS */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={lab.status || 'Aktif'}
                    size="small"
                    sx={{
                      backgroundColor: lab.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                      color: lab.status === 'Aktif' ? '#166534' : '#991b1b',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      height: 22,
                    }}
                  />
                </Box>

                {/* AKSI */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/lab/${lab.id}`)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#2563eb',
                      fontSize: '0.75rem',
                      py: 0.5,
                    }}
                  >
                    Detail
                  </Button>
                  {user?.role === 'Administrator' && (
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(lab)}
                      sx={{ color: '#f59e0b', '&:hover': { backgroundColor: '#fef3c7' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* RINGKASAN */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
          Ringkasan
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>Total Lab</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2563eb' }}>{data.length}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>Total Komputer</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#16a34a' }}>{totalKomputer}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>Kapasitas</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#eab308' }}>{totalKomputer}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* DIALOG TAMBAH/EDIT */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          {isEdit ? 'Edit Laboratorium' : 'Tambah Laboratorium'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <AppTextField label="Kode Lab" value={form.kode_lab} onChange={(e) => setForm({ ...form, kode_lab: e.target.value })} placeholder="Contoh: LAB-01" />
          <AppTextField label="Nama Lab" value={form.nama_lab} onChange={(e) => setForm({ ...form, nama_lab: e.target.value })} placeholder="Contoh: Lab Komputer 1" />
          <AppTextField label="Lokasi" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} placeholder="Contoh: Gedung A Lantai 1" />
          <AppTextField label="Kapasitas" type="number" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} placeholder="Contoh: 14" />
          <AppTextField label="Penanggung Jawab" value={form.penanggung_jawab} onChange={(e) => setForm({ ...form, penanggung_jawab: e.target.value })} placeholder="Contoh: Budi Santoso" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <AppButton onClick={handleSave} sx={{ width: 'auto', px: 4 }}>Simpan</AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}