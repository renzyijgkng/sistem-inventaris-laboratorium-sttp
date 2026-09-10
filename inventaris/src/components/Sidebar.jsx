import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Kategori Barang', icon: <CategoryIcon />, path: '/kategori' },
    { text: 'Data Barang', icon: <InventoryIcon />, path: '/barang' },
    { text: 'Barang Masuk', icon: <InputIcon />, path: '/barang-masuk' },
    { text: 'Barang Keluar', icon: <OutputIcon />, path: '/barang-keluar' },
    { text: 'Rekap Data', icon: <AssessmentIcon />, path: '/rekap' },
  ];

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', backgroundColor: '#2563eb', color: 'white' } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <img src="/labor.jpg" alt="Logo Lab" style={{ width: 45, height: 40, objectFit: 'cover', borderRadius: 4, backgroundColor: 'white' }} />
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1.1 }}>ASET</Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1.1 }}>LABORATORIUM</Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1.1 }}>KOMPUTER</Typography>
        </Box>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ marginTop: 'auto', p: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
          <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}