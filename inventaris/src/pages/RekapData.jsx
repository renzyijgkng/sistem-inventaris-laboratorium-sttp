import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Chip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TableViewIcon from '@mui/icons-material/TableView';
import GridOnIcon from '@mui/icons-material/GridOn';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function RekapData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/api/barang').then((res) => setData(res.data));
  }, []);

  const handleCopy = () => {
    const text = data.map((d, i) => `${i + 1}. ${d.nama} - ${d.jumlah} ${d.satuan}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Data berhasil disalin ke clipboard!');
  };

  const handleCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,No,Kategori,Nama Barang,Jumlah,Satuan\n' +
      data.map((d, i) => `${i + 1},${d.kategori},${d.nama},${d.jumlah},${d.satuan}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'rekap_inventaris.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('File CSV berhasil diunduh!');
  };

  const handleExcel = () => {
    let html = '<table><tr><th>No</th><th>Kategori</th><th>Nama Barang</th><th>Jumlah</th><th>Satuan</th></tr>' +
      data.map((d, i) => `<tr><td>${i + 1}</td><td>${d.kategori}</td><td>${d.nama}</td><td>${d.jumlah}</td><td>${d.satuan}</td></tr>`).join('') +
      '</table>';
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rekap_inventaris.xls';
    link.click();
    toast.success('File Excel berhasil diunduh!');
  };

  const handlePDF = () => {
    window.print();
    toast.info('Gunakan "Save as PDF" di dialog print untuk menyimpan sebagai PDF.');
  };

  return (
    <Box id="rekap-container">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #rekap-area, #rekap-area * {
              visibility: visible;
            }
            #rekap-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box id="rekap-area">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              Rekap Data Barang Inventaris
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Ekspor laporan inventaris dalam berbagai format
            </Typography>
          </Box>

          <Box className="no-print" sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Button variant="outlined" size="small" startIcon={<ContentCopyIcon />} onClick={handleCopy}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#94a3b8', color: '#475569' }}>
              COPY
            </Button>
            <Button variant="outlined" size="small" startIcon={<TableViewIcon />} onClick={handleCSV}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#10b981', color: '#10b981' }}>
              CSV
            </Button>
            <Button variant="outlined" size="small" startIcon={<GridOnIcon />} onClick={handleExcel}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#22c55e', color: '#22c55e' }}>
              EXCEL
            </Button>
            <Button variant="outlined" size="small" startIcon={<PictureAsPdfIcon />} onClick={handlePDF}
              sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#ef4444', color: '#ef4444' }}>
              PDF
            </Button>
            <Button variant="contained" size="small" startIcon={<PrintIcon />} onClick={handlePDF}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}>
              PRINT
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Nama Barang</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Jumlah</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#334155' }}>Satuan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    Belum ada data untuk direkap
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}