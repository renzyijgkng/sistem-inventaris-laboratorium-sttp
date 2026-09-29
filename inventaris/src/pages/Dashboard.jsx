import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, Chip } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import ComputerIcon from '@mui/icons-material/Computer';
import BusinessIcon from '@mui/icons-material/Business';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BuildIcon from '@mui/icons-material/Build';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalKomputer: 0,
    totalLab: 0,
    komputerRusak: 0,
    maintenance: 0,
  });
  const [komputerPerLab, setKomputerPerLab] = useState([]);
  const [kondisiKomputer, setKondisiKomputer] = useState([]);
  const [aktivitas, setAktivitas] = useState([]);
  const [inventarisTerbaru, setInventarisTerbaru] = useState([]);

  useEffect(() => {
    api.get('/api/dashboard-stats').then((res) => setStats(res.data)).catch(() => {});
    api.get('/api/dashboard/komputer-per-lab').then((res) => setKomputerPerLab(res.data)).catch(() => {});
    api.get('/api/dashboard/kondisi-komputer').then((res) => setKondisiKomputer(res.data)).catch(() => {});
    api.get('/api/dashboard/aktivitas-terbaru').then((res) => setAktivitas(res.data)).catch(() => {});
    api.get('/api/dashboard/inventaris-terbaru').then((res) => setInventarisTerbaru(res.data)).catch(() => {});
  }, []);

  const statCards = [
    { title: 'Total Komputer', value: stats.totalKomputer, subtitle: '↑ 5 bulan ini', icon: <ComputerIcon sx={{ fontSize: 40 }} />, color: '#2563eb' },
    { title: 'Total Lab', value: stats.totalLab, subtitle: 'Semua aktif', icon: <BusinessIcon sx={{ fontSize: 40 }} />, color: '#16a34a' },
    { title: 'Komputer Rusak', value: stats.komputerRusak, subtitle: 'Perlu tindakan', icon: <WarningAmberIcon sx={{ fontSize: 40 }} />, color: '#ef4444' },
    { title: 'Maintenance', value: stats.maintenance, subtitle: 'Ditangani', icon: <BuildIcon sx={{ fontSize: 40 }} />, color: '#eab308' },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#94a3b8'];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color, mt: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {card.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ color: card.color, opacity: 0.7 }}>{card.icon}</Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 350 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              Jumlah Komputer per Lab
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={komputerPerLab}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nama" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 350 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              Kondisi Komputer
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={kondisiKomputer}
                  dataKey="jumlah"
                  nameKey="nama"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label
                >
                  {kondisiKomputer.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: 280 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              Aktivitas Terbaru
            </Typography>
            {aktivitas.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Belum ada aktivitas
              </Typography>
            ) : (
              aktivitas.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563eb', mt: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                      {item.aktivitas}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {item.keterangan || '-'}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: 280 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              Inventaris Terbaru
            </Typography>
            {inventarisTerbaru.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Belum ada data inventaris
              </Typography>
            ) : (
              inventarisTerbaru.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, pb: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {item.kode_aset || '-'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {item.nama_aset}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      {item.laboratorium?.nama_lab || '-'}
                    </Typography>
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
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}