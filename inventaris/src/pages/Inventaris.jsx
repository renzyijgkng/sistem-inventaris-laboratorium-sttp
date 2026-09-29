import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Button, IconButton, TextField, MenuItem, Select, FormControl, InputLabel,
  TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function Inventaris() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [labList, setLabList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [merkList, setMerkList] = useState([]);
  const [kondisiList, setKondisiList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [search, setSearch] = useState('');
  const [filterLab, setFilterLab] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterKondisi, setFilterKondisi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    kode_aset: '', nama_aset: '', kode_lab_id: '', kategori_id: '', merk_id: '',
    kondisi_id: '', status_id: '', nomor_seri: '', jumlah: 1, satuan: 'unit', keterangan: '',
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = () => {
    api.get('/api/aset').then((res) => setData(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchData();
    api.get('/api/laboratorium').then((res) => setLabList(res.data)).catch(() => {});
    api.get('/api/kategori-aset').then((res) => setKategoriList(res.data)).catch(() => {});
    api.get('/api/merk').then((res) => setMerkList(res.data)).catch(() => {});
    api.get('/api/kondisi-aset').then((res) => setKondisiList(res.data)).catch(() => {});
    api.get('/api/status-aset').then((res) => setStatusList(res.data)).catch(() => {});
  }, []);

  const filtered = data.filter((item) => {
    const matchSearch = !search || 
      item.nama_aset?.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_aset?.toLowerCase().includes(search.toLowerCase());
    const matchLab = !filterLab || String(item.kode_lab_id) === String(filterLab);
    const matchKategori = !filterKategori || String(item.kategori_id) === String(filterKategori);
    const matchKondisi = !filterKondisi || String(item.kondisi_id) === String(filterKondisi);
    const matchStatus = !filterStatus || String(item.status_id) === String(filterStatus);
    return matchSearch && matchLab && matchKategori && matchKondisi && matchStatus;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getKondisiColor = (nama) => {
    if (nama === 'Baik') return { bg: '#dcfce7', color: '#166534' };
    if (nama === 'Rusak Ringan') return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#fee2e2', color: '#991b1b' };
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({
      kode_aset: '', nama_aset: '', kode_lab_id: '', kategori_id: '', merk_id: '',
      kondisi_id: '', status_id: '', nomor_seri: '', jumlah: 1, satuan: 'unit', keterangan: '',
    });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({
      kode_aset: item.kode_aset || '',
      nama_aset: item.nama_aset || '',
      kode_lab_id: item.kode_lab_id || '',
      kategori_id: item.kategori_id || '',
      merk_id: item.merk_id || '',
      kondisi_id: item.kondisi_id || '',
      status_id: item.status_id || '',
      nomor_seri: item.nomor_seri || '',
      jumlah: item.jumlah || 1,
      satuan: item.satuan || 'unit',
      keterangan: item.keterangan || '',
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.kode_aset || !form.nama_aset) {
      toast.error('Kode Aset dan Nama Aset wajib diisi!');
      return;
    }
    try {
      if (isEdit) {
        await api.put(`/api/aset/${currentId}`, form);
        toast.success('Data aset berhasil diubah!');
      } else {
        await api.post('/api/aset', form);
        toast.success('Data aset berhasil ditambahkan!');
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
      await api.delete(`/api/aset/${deleteId}`);
      fetchData();
      toast.success('Data aset berhasil dihapus!');
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
            Inventaris
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Pengelolaan aset laboratorium komputer
          </Typography>
        </Box>
        {user?.role !== 'Dosen' && user?.role !== 'Pimpinan' && (
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
            Tambah Aset
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Cari aset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Lab</InputLabel>
            <Select value={filterLab} onChange={(e) => setFilterLab(e.target.value)} label="Lab">
              <MenuItem value="">Semua</MenuItem>
              {labList.map((l) => (
                <MenuItem key={l.id} value={l.id}>{l.nama_lab}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Kategori</InputLabel>
            <Select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} label="Kategori">
              <MenuItem value="">Semua</MenuItem>
              {kategoriList.map((k) => (
                <MenuItem key={k.id} value={k.id}>{k.nama_kategori}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Kondisi</InputLabel>
            <Select value={filterKondisi} onChange={(e) => setFilterKondisi(e.target.value)} label="Kondisi">
              <MenuItem value="">Semua</MenuItem>
              {kondisiList.map((k) => (
                <MenuItem key={k.id} value={k.id}>{k.nama_kondisi}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status">
              <MenuItem value="">Semua</MenuItem>
              {statusList.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.nama_status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Kode</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nama Aset</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Lab</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Kategori</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Kondisi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                  Belum ada data aset
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => {
                const kColor = getKondisiColor(item.kondisi?.nama_kondisi);
                return (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{item.kode_aset}</TableCell>
                    <TableCell>{item.nama_aset}</TableCell>
                    <TableCell>{item.laboratorium?.nama_lab || '-'}</TableCell>
                    <TableCell>{item.kategori?.nama_kategori || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.kondisi?.nama_kondisi || '-'}
                        size="small"
                        sx={{ backgroundColor: kColor.bg, color: kColor.color, fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/inventaris/${item.id}`)}
                        sx={{ color: '#2563eb' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      {user?.role !== 'Dosen' && user?.role !== 'Pimpinan' && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(item)}
                            sx={{ color: '#f59e0b' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {user?.role === 'Administrator' && (
                            <IconButton
                              size="small"
                              onClick={() => handleOpenConfirm(item.id)}
                              sx={{ color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* DIALOG TAMBAH/EDIT ASET */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          {isEdit ? 'Edit Data Aset' : 'Tambah Data Aset'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <AppTextField label="Kode Aset" value={form.kode_aset} onChange={(e) => setForm({ ...form, kode_aset: e.target.value })} placeholder="Contoh: PC-001" />
            <AppTextField label="Nama Aset" value={form.nama_aset} onChange={(e) => setForm({ ...form, nama_aset: e.target.value })} placeholder="Contoh: PC Lab 01" />
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Lab</InputLabel>
              <Select value={form.kode_lab_id} onChange={(e) => setForm({ ...form, kode_lab_id: e.target.value })} label="Lab">
                <MenuItem value="">-- Pilih Lab --</MenuItem>
                {labList.map((l) => (
                  <MenuItem key={l.id} value={l.id}>{l.nama_lab}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Kategori</InputLabel>
              <Select value={form.kategori_id} onChange={(e) => setForm({ ...form, kategori_id: e.target.value })} label="Kategori">
                <MenuItem value="">-- Pilih Kategori --</MenuItem>
                {kategoriList.map((k) => (
                  <MenuItem key={k.id} value={k.id}>{k.nama_kategori}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Merk</InputLabel>
              <Select value={form.merk_id} onChange={(e) => setForm({ ...form, merk_id: e.target.value })} label="Merk">
                <MenuItem value="">-- Pilih Merk --</MenuItem>
                {merkList.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.nama_merk}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Kondisi</InputLabel>
              <Select value={form.kondisi_id} onChange={(e) => setForm({ ...form, kondisi_id: e.target.value })} label="Kondisi">
                <MenuItem value="">-- Pilih Kondisi --</MenuItem>
                {kondisiList.map((k) => (
                  <MenuItem key={k.id} value={k.id}>{k.nama_kondisi}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select value={form.status_id} onChange={(e) => setForm({ ...form, status_id: e.target.value })} label="Status">
                <MenuItem value="">-- Pilih Status --</MenuItem>
                {statusList.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.nama_status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <AppTextField label="Nomor Seri" value={form.nomor_seri} onChange={(e) => setForm({ ...form, nomor_seri: e.target.value })} placeholder="Contoh: W6PFGF..." />
            <AppTextField label="Jumlah" type="number" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} />
            <AppTextField label="Satuan" value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} placeholder="unit / roll / meter" />
            <AppTextField label="Keterangan" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Opsional" />
          </Box>
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
          <Typography>Yakin ingin menghapus data aset ini?</Typography>
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