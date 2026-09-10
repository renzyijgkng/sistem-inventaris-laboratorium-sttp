import React from 'react';
import { Typography, Paper, Box, Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import InventoryIcon from '@mui/icons-material/Inventory';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const cards = [
    { title: 'DATA BARANG', color: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', path: '/barang', icon: <InventoryIcon sx={{ fontSize: 40 }} /> },
    { title: 'BARANG MASUK', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', path: '/barang-masuk', icon: <InputIcon sx={{ fontSize: 40 }} /> },
    { title: 'BARANG KELUAR', color: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', path: '/barang-keluar', icon: <OutputIcon sx={{ fontSize: 40 }} /> },
    { title: 'REKAP DATA', color: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', path: '/rekap', icon: <AssessmentIcon sx={{ fontSize: 40 }} /> },
  ];

  const roleColor = {
    admin: { bg: '#dbeafe', color: '#1e40af' },
    operator: { bg: '#fef3c7', color: '#92400e' },
    viewer: { bg: '#dcfce7', color: '#166534' },
  };

  const currentRole = roleColor[user?.role] || roleColor.viewer;

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          color: 'white',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Dashboard 📊
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.95 }}>
          Selamat datang di Sistem Informasi Aset Laboratorium Komputer STTP
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Anda Login Sebagai: ${user?.role?.toUpperCase()}`}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              px: 2,
              py: 2.5,
            }}
          />
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
        Menu Cepat
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              onClick={() => navigate(card.path)}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: card.color,
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                height: 160,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                },
              }}
            >
              <Box sx={{ mb: 1 }}>{card.icon}</Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 }}>
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}