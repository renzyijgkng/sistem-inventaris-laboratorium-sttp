import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Chip, Button, Grid, Tabs, Tab, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function DetailAset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aset, setAset] = useState(null);
  const [spesifikasi, setSpesifikasi] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    api.get('/api/aset').then((res) => {
      const found = res.data.find((a) => String(a.id) === String(id));
      setAset(found);
    }).catch(() => {});

    api.get(`/api/spesifikasi-komputer/${id}`).then((res) => setSpesifikasi(res.data)).catch(() => {});
    api.get('/api/maintenance').then((res) => {
      const filtered = res.data.filter((m) => String(m.aset_id) === String(id));
      setMaintenance(filtered);
    }).catch(() => {});
  }, [id]);

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
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/inventaris')}
        sx={{ textTransform: 'none', mb: 2, color: '#2563eb' }}
      >
        Kembali
      </Button>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              Informasi Aset
            </Typography>
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>KONDISI</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={aset.kondisi?.nama_kondisi || '-'}
                    size="small"
                    sx={{ backgroundColor: kColor.bg, color: kColor.color, fontWeight: 'bold' }}
                  />
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
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
          Spesifikasi Komputer
        </Typography>
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
              {maintenance.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Belum ada riwayat maintenance
                </Typography>
              ) : (
                maintenance.map((m) => (
                  <Box key={m.id} sx={{ display: 'flex', gap: 2, mb: 1.5, pb: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', minWidth: 100 }}>{m.tanggal}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{m.jenis_maintenance}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>Teknisi: {m.teknisi}</Typography>
                    <Chip label={m.status} size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' }} />
                  </Box>
                ))
              )}
            </Box>
          )}
          {tab === 2 && <Typography variant="body2" sx={{ color: '#94a3b8' }}>Belum ada data mutasi</Typography>}
          {tab === 3 && <Typography variant="body2" sx={{ color: '#94a3b8' }}>Belum ada data pengaduan</Typography>}
        </Box>
      </Paper>
    </Box>
  );
}