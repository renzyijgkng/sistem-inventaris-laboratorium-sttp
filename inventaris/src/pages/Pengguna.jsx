import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Button, IconButton, TextField, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { toast } from 'react-toastify';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function Pengguna() {
  const [data, setData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    nama: '', email: '', password: '', role_id: '', status: 'Aktif',
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = () => {
    api.get('/api/users').then((res) => setData(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchData();
    api.get('/api/roles').then((res) => setRoleList(res.data)).catch(() => {});
  }, []);

  const filtered = data.filter((item) => {
    const matchSearch = !search ||
      item.nama?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || String(item.role_id) === String(filterRole);
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ nama: '', email: '', password: '', role_id: '', status: 'Aktif' });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({
      nama: item.nama || '',
      email: item.email || '',
      password: item.password || '',
      role_id: item.role_id || '',
      status: item.status || 'Aktif',
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama || !form.email || !form.password || !form.role_id) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    try {
      if (isEdit) {
        await api.put(`/api/users/${currentId}`, form);
        toast.success('Data pengguna berhasil diubah!');
      } else {
        await api.post('/api/users', form);
        toast.success('Data pengguna berhasil ditambahkan!');
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
      await api.delete(`/api/users/${deleteId}`);
      fetchData();
      toast.success('Data pengguna berhasil dihapus!');
      setConfirmOpen(false);
    } catch (err) {
      toast.error('Gagal menghapus data!');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Pengguna
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Pengelolaan pengguna dan hak akses sistem
          </Typography>
        </Box>
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
          }}
        >
          Tambah Pengguna
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} label="Role">
              <MenuItem value="">Semua</MenuItem>
              {roleList.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.nama_role}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status">
              <MenuItem value="">Semua</MenuItem>
              <MenuItem value="Aktif">Aktif</MenuItem>
              <MenuItem value="Nonaktif">Nonaktif</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Nama</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                  Belum ada data pengguna
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.nama}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.roles?.nama_role || '-'}
                      size="small"
                      sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status || 'Aktif'}
                      size="small"
                      sx={{
                        backgroundColor: item.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'Aktif' ? '#166534' : '#991b1b',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(item)}
                      sx={{ color: '#f59e0b' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenConfirm(item.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* DIALOG TAMBAH/EDIT */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <AppTextField label="Nama Lengkap" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Budi Santoso" />
          <AppTextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Contoh: budi@sttp.ac.id" />
          <AppTextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" />
          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })} label="Role">
              <MenuItem value="">-- Pilih Role --</MenuItem>
              {roleList.map((r) => (
                <MenuItem key={r.id} value={r.id}>{r.nama_role}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} label="Status">
              <MenuItem value="Aktif">Aktif</MenuItem>
              <MenuItem value="Nonaktif">Nonaktif</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <AppButton onClick={handleSave} sx={{ width: 'auto', px: 4 }}>Simpan</AppButton>
        </DialogActions>
      </Dialog>

      {/* DIALOG KONFIRMASI HAPUS */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: 3, width: 400 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444', fontWeight: 'bold' }}>
          <WarningAmberIcon /> Konfirmasi Hapus
        </DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus pengguna ini?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none' }}>Batal</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ backgroundColor: '#ef4444', textTransform: 'none', fontWeight: 'bold', borderRadius: '10px' }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}