import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function BarangKeluar() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ tanggal: '', nama: '', jumlah: '', keterangan: '' });

  const fetchData = () => {
    api.get('/api/barang-keluar').then((res) => setData(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.tanggal || !form.nama || !form.jumlah || !form.keterangan) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    await api.post('/api/barang-keluar', { ...form, jumlah: Number(form.jumlah) });
    fetchData();
    toast.success('Barang keluar berhasil dicatat!');
    setOpen(false);
    setForm({ tanggal: '', nama: '', jumlah: '', keterangan: '' });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Pencatatan Barang Keluar
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Riwayat barang yang keluar atau dipinjam
          </Typography>
        </Box>
        {user?.role !== 'viewer' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '10px',
              px: 3,
              boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            Tambah Barang Keluar
          </Button>
        )}
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>No</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Tanggal</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Nama Barang</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Jumlah</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Keterangan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                Belum ada data barang keluar
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.tanggal}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.nama}</TableCell>
                <TableCell>
                  <Chip label={row.jumlah} size="small" sx={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold' }} />
                </TableCell>
                <TableCell>{row.keterangan}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 450 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>Tambah Barang Keluar</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: '10px !important' }}>
          <AppTextField label="Tanggal" type="date" InputLabelProps={{ shrink: true }} value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
          <AppTextField label="Nama Barang" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Komputer Dekstop" />
          <AppTextField label="Jumlah" type="number" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} placeholder="Contoh: 3" />
          <AppTextField label="Keterangan" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Contoh: Barang dipinjam" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <AppButton onClick={handleSave} sx={{ width: 'auto', px: 4 }}>Simpan</AppButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}