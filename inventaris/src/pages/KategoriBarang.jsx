import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function KategoriBarang() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ nama: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = () => {
    api.get('/api/kategori').then((res) => setData(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ nama: '' });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({ nama: item.nama });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama) {
      toast.error('Nama kategori wajib diisi!');
      return;
    }
    try {
      if (isEdit) {
        await api.put(`/api/kategori/${currentId}`, form);
        toast.success('Kategori berhasil diubah!');
      } else {
        await api.post('/api/kategori', form);
        toast.success('Kategori berhasil ditambahkan!');
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
      await api.delete(`/api/kategori/${deleteId}`);
      fetchData();
      toast.success('Kategori berhasil dihapus!');
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
            Manajemen Kategori Barang
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Kelola kategori aset laboratorium komputer
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
            Tambah Kategori
          </Button>
        )}
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>No</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Nama Kategori</TableCell>
            {user?.role !== 'viewer' && <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Aksi</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                Belum ada data kategori
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Chip
                    label={row.nama}
                    sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }}
                  />
                </TableCell>
                {user?.role !== 'viewer' && (
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(row)}
                      sx={{ color: '#f59e0b', '&:hover': { backgroundColor: '#fef3c7' } }}
                    >
                      <EditIcon />
                    </IconButton>
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
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog Tambah/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 400 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
        </DialogTitle>
        <DialogContent sx={{ pt: '10px !important' }}>
          <AppTextField
            label="Nama Kategori"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Contoh: Komputer, Jaringan, dll"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <AppButton onClick={handleSave} sx={{ width: 'auto', px: 4 }}>Simpan</AppButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 400 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444', fontWeight: 'bold' }}>
          <WarningAmberIcon /> Konfirmasi Hapus
        </DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus kategori ini?</Typography>
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