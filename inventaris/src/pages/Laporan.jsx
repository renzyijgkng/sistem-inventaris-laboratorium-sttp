import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Button, TextField, MenuItem, Select, FormControl, InputLabel, Grid,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Laporan() {
  const [jenis, setJenis] = useState('inventaris');
  const [labId, setLabId] = useState('');
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');

  const [labList, setLabList] = useState([]);
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/laboratorium').then((res) => setLabList(res.data)).catch(() => {});
  }, []);

  const handleTampilkan = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/aset';
      if (jenis === 'kondisi') endpoint = '/api/aset';
      else if (jenis === 'maintenance') endpoint = '/api/maintenance';
      else if (jenis === 'mutasi') endpoint = '/api/mutasi-aset';
      else if (jenis === 'pengaduan') endpoint = '/api/pengaduan';

      const res = await api.get(endpoint);
      let filtered = res.data;

      if (labId && (jenis === 'inventaris' || jenis === 'kondisi')) {
        filtered = filtered.filter((item) => String(item.kode_lab_id) === String(labId));
      }

      setHasil(filtered);
      toast.success(`Berhasil memuat ${filtered.length} data`);
    } catch (err) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJenis('inventaris');
    setLabId('');
    setPeriodeAwal('2026-01-01');
    setPeriodeAkhir('2026-12-31');
    setHasil([]);
  };

  const handleExportCSV = () => {
    if (hasil.length === 0) {
      toast.warning('Tidak ada data untuk diexport');
      return;
    }
    let csv = '';
    if (jenis === 'inventaris' || jenis === 'kondisi') {
      csv = 'Kode,Nama Aset,Lab,Kategori,Kondisi\n' +
        hasil.map((d) => `${d.kode_aset},${d.nama_aset},${d.laboratorium?.nama_lab || '-'},${d.kategori?.nama_kategori || '-'},${d.kondisi?.nama_kondisi || '-'}`).join('\n');
    } else if (jenis === 'maintenance') {
      csv = 'Tanggal,Jenis,Teknisi,Status\n' +
        hasil.map((d) => `${d.tanggal},${d.jenis_maintenance},${d.teknisi},${d.status}`).join('\n');
    } else if (jenis === 'mutasi') {
      csv = 'Tanggal,Dari Lab,Ke Lab,Keterangan\n' +
        hasil.map((d) => `${d.tanggal},${d.dari_lab},${d.ke_lab},${d.keterangan}`).join('\n');
    } else {
      csv = 'Tanggal,Judul,Deskripsi,Status\n' +
        hasil.map((d) => `${d.tanggal},${d.judul},${d.deskripsi},${d.status}`).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan_${jenis}.csv`;
    link.click();
    toast.success('File CSV berhasil diunduh!');
  };

  const handleExportPDF = () => {
    window.print();
    toast.info('Gunakan "Save as PDF" di dialog print.');
  };

  const getKondisiColor = (nama) => {
    if (nama === 'Baik') return { bg: '#dcfce7', color: '#166534' };
    if (nama === 'Rusak Ringan') return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#fee2e2', color: '#991b1b' };
  };

  const renderTable = () => {
    if (hasil.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
            Belum ada data. Klik "Tampilkan" untuk memuat laporan.
          </TableCell>
        </TableRow>
      );
    }

    if (jenis === 'inventaris' || jenis === 'kondisi') {
      return hasil.map((item) => {
        const kColor = getKondisiColor(item.kondisi?.nama_kondisi);
        return (
          <TableRow key={item.id} hover>
            <TableCell sx={{ fontWeight: 600 }}>{item.kode_aset}</TableCell>
            <TableCell>{item.nama_aset}</TableCell>
            <TableCell>{item.laboratorium?.nama_lab || '-'}</TableCell>
            <TableCell>{item.kategori?.nama_kategori || '-'}</TableCell>
            <TableCell>
              <Chip label={item.kondisi?.nama_kondisi || '-'} size="small" sx={{ backgroundColor: kColor.bg, color: kColor.color, fontWeight: 'bold' }} />
            </TableCell>
            <TableCell>{item.status?.nama_status || '-'}</TableCell>
          </TableRow>
        );
      });
    }

    if (jenis === 'maintenance') {
      return hasil.map((item) => (
        <TableRow key={item.id} hover>
          <TableCell>{item.tanggal}</TableCell>
          <TableCell>{item.jenis_maintenance}</TableCell>
          <TableCell>{item.teknisi}</TableCell>
          <TableCell>{item.keterangan || '-'}</TableCell>
          <TableCell>
            <Chip label={item.status} size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' }} />
          </TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ));
    }

    if (jenis === 'mutasi') {
      return hasil.map((item) => (
        <TableRow key={item.id} hover>
          <TableCell>{item.tanggal}</TableCell>
          <TableCell>Dari Lab ID: {item.dari_lab || '-'}</TableCell>
          <TableCell>Ke Lab ID: {item.ke_lab || '-'}</TableCell>
          <TableCell>{item.keterangan || '-'}</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ));
    }

    return hasil.map((item) => (
      <TableRow key={item.id} hover>
        <TableCell>{item.tanggal}</TableCell>
        <TableCell>{item.judul}</TableCell>
        <TableCell colSpan={2}>{item.deskripsi}</TableCell>
        <TableCell>
          <Chip label={item.status} size="small" sx={{ backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }} />
        </TableCell>
        <TableCell>-</TableCell>
      </TableRow>
    ));
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Laporan
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Laporan pengelolaan laboratorium komputer
        </Typography>
      </Box>

      {/* FILTER */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
          Filter Laporan
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Jenis Laporan</InputLabel>
              <Select value={jenis} onChange={(e) => setJenis(e.target.value)} label="Jenis Laporan">
                <MenuItem value="inventaris">Laporan Inventaris</MenuItem>
                <MenuItem value="kondisi">Laporan Kondisi Aset</MenuItem>
                <MenuItem value="maintenance">Laporan Maintenance</MenuItem>
                <MenuItem value="mutasi">Laporan Mutasi</MenuItem>
                <MenuItem value="pengaduan">Laporan Pengaduan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Laboratorium</InputLabel>
              <Select value={labId} onChange={(e) => setLabId(e.target.value)} label="Laboratorium">
                <MenuItem value="">Semua</MenuItem>
                {labList.map((l) => (
                  <MenuItem key={l.id} value={l.id}>{l.nama_lab}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                type="date"
                value={periodeAwal}
                onChange={(e) => setPeriodeAwal(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Typography variant="body2" sx={{ color: '#64748b' }}>-</Typography>
              <TextField
                size="small"
                type="date"
                value={periodeAkhir}
                onChange={(e) => setPeriodeAkhir(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleTampilkan}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '10px',
              px: 3,
            }}
          >
            {loading ? 'Memuat...' : 'Tampilkan'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            sx={{ textTransform: 'none', borderRadius: '10px', px: 3 }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {/* HASIL */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              Hasil Laporan
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {jenis === 'inventaris' && 'Laporan Inventaris Laboratorium Komputer'}
              {jenis === 'kondisi' && 'Laporan Kondisi Aset'}
              {jenis === 'maintenance' && 'Laporan Maintenance'}
              {jenis === 'mutasi' && 'Laporan Mutasi Aset'}
              {jenis === 'pengaduan' && 'Laporan Pengaduan'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPDF}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#ef4444', color: '#ef4444' }}
            >
              PDF
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<GridOnIcon />}
              onClick={handleExportCSV}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#22c55e', color: '#22c55e' }}
            >
              Excel
            </Button>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Kode / Tanggal</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nama / Jenis</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Lab / Teknisi</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Kategori / Ket</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Kondisi / Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTable()}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}