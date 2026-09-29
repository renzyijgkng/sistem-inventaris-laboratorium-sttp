import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function DetailLab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [aset, setAset] = useState([]);

  useEffect(() => {
    api.get('/api/laboratorium').then((res) => {
      const found = res.data.find((l) => String(l.id) === String(id));
      setLab(found);
    }).catch(() => {});

    api.get('/api/aset').then((res) => {
      const filtered = res.data.filter((a) => String(a.kode_lab_id) === String(id));
      setAset(filtered);
    }).catch(() => {});
  }, [id]);

  if (!lab) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="body1">Memuat data...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/lab')}
        sx={{ textTransform: 'none', mb: 2, color: '#2563eb' }}
      >
        Kembali
      </Button>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <BusinessIcon sx={{ fontSize: 40, color: '#2563eb' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              {lab.nama_lab}
            </Typography>
            <Chip
              label={lab.status || 'Aktif'}
              size="small"
              sx={{
                backgroundColor: lab.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                color: lab.status === 'Aktif' ? '#166534' : '#991b1b',
                fontWeight: 'bold',
                mt: 0.5,
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>KODE</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1e293b' }}>{lab.kode_lab}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>LOKASI</Typography>
            <Typography variant="body2" sx={{ color: '#1e293b' }}>{lab.lokasi || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>KAPASITAS</Typography>
            <Typography variant="body2" sx={{ color: '#1e293b' }}>{lab.kapasitas || 0} komputer</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>PENANGGUNG JAWAB</Typography>
            <Typography variant="body2" sx={{ color: '#1e293b' }}>{lab.penanggung_jawab || '-'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
          Daftar Komputer di {lab.nama_lab}
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Kode</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nama</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Kategori</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Kondisi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aset.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                  Belum ada data komputer di lab ini
                </TableCell>
              </TableRow>
            ) : (
              aset.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.kode_aset}</TableCell>
                  <TableCell>{item.nama_aset}</TableCell>
                  <TableCell>{item.kategori?.nama_kategori || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.kondisi?.nama_kondisi || '-'}
                      size="small"
                      sx={{
                        backgroundColor:
                          item.kondisi?.nama_kondisi === 'Baik' ? '#dcfce7'
                            : item.kondisi?.nama_kondisi === 'Rusak Ringan' ? '#fef3c7'
                              : '#fee2e2',
                        color:
                          item.kondisi?.nama_kondisi === 'Baik' ? '#166534'
                            : item.kondisi?.nama_kondisi === 'Rusak Ringan' ? '#92400e'
                              : '#991b1b',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => navigate(`/inventaris/${item.id}`)}
                      sx={{ textTransform: 'none', color: '#2563eb' }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}