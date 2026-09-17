import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function DataBarang() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ kategori: '', nama: '', jumlah: '', satuan: '', spesifikasi: '' });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = () => {
    api.get('/api/barang').then((res) => setData(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ kategori: '', nama: '', jumlah: '', satuan: '', spesifikasi: '' });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm(item);
    setOpen(true);
  };

  const handleOpenDetail = (item) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleSave = async () => {
    if (!form.kategori || !form.nama || !form.jumlah || !form.satuan) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    const payload = { ...form, jumlah: Number(form.jumlah) };
    try {
      if (isEdit) {
        await api.put(`/api/barang/${currentId}`, payload);
        toast.success('Data barang berhasil diubah!');
      } else {
        await api.post('/api/barang', payload);
        toast.success('Data barang berhasil ditambahkan!');
      }
      fetchData();
      setOpen(false);
    } catch (err) {
      toast.error('Gagal menyimpan data!');
    }
  };

  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/barang/${deleteId}`);
      fetchData();
      toast.success('Data barang berhasil dihapus!');
      setConfirmOpen(false);
    } catch (err) {
      toast.error('Gagal menghapus data!');
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Data Barang Inventaris
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Kelola seluruh aset laboratorium komputer
          </Typography>
        </Box>
        {user?.role !== 'viewer' && (
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
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            Tambah Barang
          </Button>
        )}
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>No</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Kategori</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Nama Barang</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Jumlah</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Satuan</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Spesifikasi</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }} align="center">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                Belum ada data barang
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Chip label={row.kategori} size="small" sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.nama}</TableCell>
                <TableCell>
                  <Chip label={row.jumlah} size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' }} />
                </TableCell>
                <TableCell>{row.satuan}</TableCell>
                <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {row.spesifikasi || '-'}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDetail(row)}
                    sx={{ color: '#2563eb', '&:hover': { backgroundColor: '#dbeafe' } }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  {user?.role !== 'viewer' && (
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(row)}
                      sx={{ color: '#f59e0b', '&:hover': { backgroundColor: '#fef3c7' } }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}

                  {user?.role === 'admin' && (
                    <IconButton
                      size="small"
                      onClick={() => handleOpenConfirm(row.id)}
                      sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 450 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          {isEdit ? 'Edit Data Barang' : 'Tambah Data Barang'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: '10px !important' }}>
          <AppTextField label="Kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} placeholder="Contoh: Komputer" />
          <AppTextField label="Nama Barang" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Komputer Server" />
          <AppTextField label="Jumlah" type="number" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} placeholder="Contoh: 10" />
          <AppTextField label="Satuan" value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} placeholder="Contoh: unit, roll, pcs" />
          <AppTextField label="Spesifikasi" value={form.spesifikasi} onChange={(e) => setForm({ ...form, spesifikasi: e.target.value })} placeholder="Contoh: Intel Core i7, RAM 16GB" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <AppButton onClick={handleSave} sx={{ width: 'auto', px: 4 }}>Simpan</AppButton>
        </DialogActions>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 450 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b', borderBottom: '2px solid #e2e8f0' }}>
          📋 Detail Barang
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {detailItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>KATEGORI</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e40af' }}>{detailItem.kategori}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>NAMA BARANG</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>{detailItem.nama}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>JUMLAH</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#166534' }}>{detailItem.jumlah} {detailItem.satuan}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>SATUAN</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>{detailItem.satuan}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>SPESIFIKASI</Typography>
                <Typography variant="body1" sx={{ color: '#1e293b' }}>{detailItem.spesifikasi || '-'}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailOpen(false)} variant="contained" sx={{ textTransform: 'none', borderRadius: '10px', backgroundColor: '#2563eb' }}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 400 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444', fontWeight: 'bold' }}>
          <WarningAmberIcon /> Konfirmasi Hapus
        </DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus data barang ini?</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
            Tindakan ini tidak dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: '#ef4444',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#dc2626' },
            }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}