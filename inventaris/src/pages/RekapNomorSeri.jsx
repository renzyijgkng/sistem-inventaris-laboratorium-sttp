import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function RekapNomorSeri() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ nama_barang: '', nomor_seri: '', foto_url: '', keterangan: '' });
  const [uploading, setUploading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = () => {
    api.get('/api/rekap-nomor-seri').then((res) => setData(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ nama_barang: '', nomor_seri: '', foto_url: '', keterangan: '' });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm(item);
    setOpen(true);
  };

  // Upload foto ke backend -> Supabase Storage
  const handleUploadFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('foto', file);
      const res = await api.post('/api/upload-foto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, foto_url: res.data.url });
      toast.success('Foto berhasil diupload!');
    } catch (err) {
      toast.error('Gagal upload foto!');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.nama_barang || !form.nomor_seri) {
      toast.error('Nama barang dan nomor seri wajib diisi!');
      return;
    }
    try {
      if (isEdit) {
        await api.put(`/api/rekap-nomor-seri/${currentId}`, form);
        toast.success('Data berhasil diubah!');
      } else {
        await api.post('/api/rekap-nomor-seri', form);
        toast.success('Data berhasil ditambahkan!');
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
      await api.delete(`/api/rekap-nomor-seri/${deleteId}`);
      fetchData();
      toast.success('Data berhasil dihapus!');
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
            Rekap Nomor Seri Peralatan
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Daftar nomor seri PC Laboratorium Komputer STTP
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
            Tambah Nomor Seri
          </Button>
        )}
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>No</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Nama Barang</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Nomor Seri</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Foto Nomor Seri</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Keterangan</TableCell>
            {user?.role !== 'viewer' && (
              <TableCell sx={{ fontWeight: 'bold', color: '#334155' }} align="center">Aksi</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                Belum ada data nomor seri
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.nama_barang}</TableCell>
                <TableCell>
                  <Chip
                    label={row.nomor_seri}
                    size="small"
                    sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  {row.foto_url ? (
                    <Avatar
                      src={row.foto_url}
                      variant="rounded"
                      sx={{ width: 80, height: 50, cursor: 'pointer' }}
                      onClick={() => window.open(row.foto_url, '_blank')}
                    />
                  ) : (
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>-</Typography>
                  )}
                </TableCell>
                <TableCell>{row.keterangan || '-'}</TableCell>
                {user?.role !== 'viewer' && (
                  <TableCell align="center">
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
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 480 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          {isEdit ? 'Edit Nomor Seri' : 'Tambah Nomor Seri'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: '10px !important' }}>
          <AppTextField
            label="Nama Barang"
            value={form.nama_barang}
            onChange={(e) => setForm({ ...form, nama_barang: e.target.value })}
            placeholder="Contoh: PC 1"
          />
          <AppTextField
            label="Nomor Seri"
            value={form.nomor_seri}
            onChange={(e) => setForm({ ...form, nomor_seri: e.target.value })}
            placeholder="Contoh: W6PFFGF00188427F"
          />
          <AppTextField
            label="Keterangan"
            value={form.keterangan}
            onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
            placeholder="Opsional"
          />

          {/* Upload Foto */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
              Foto Nomor Seri
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadFoto}
              disabled={uploading}
              style={{ display: 'block', marginTop: 8 }}
            />
            {uploading && (
              <Typography variant="caption" sx={{ color: '#2563eb', display: 'block', mt: 1 }}>
                Mengupload...
              </Typography>
            )}
            {form.foto_url && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={form.foto_url}
                  alt="Preview"
                  style={{ width: 150, borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </Box>
            )}
          </Box>
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
          <Typography>Yakin ingin menghapus data nomor seri ini?</Typography>
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