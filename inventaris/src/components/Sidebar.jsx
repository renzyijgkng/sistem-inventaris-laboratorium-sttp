import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
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
    { text: 'Lab', icon: <BusinessIcon />, path: '/lab' },
    { text: 'Inventaris', icon: <Inventory2Icon />, path: '/inventaris' },
    { text: 'Laporan', icon: <AssessmentIcon />, path: '/laporan' },
    { text: 'Pengguna', icon: <PeopleIcon />, path: '/pengguna' },
    { text: 'Pengaturan', icon: <SettingsIcon />, path: '/pengaturan' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1e40af',
          color: 'white',
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          minHeight: 80,
        }}
      >
        <img
          src="/labor.jpg"
          alt="Logo Lab"
          style={{
            width: 45,
            height: 45,
            objectFit: 'cover',
            borderRadius: 6,
            backgroundColor: 'white',
          }}
        />
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1.2 }}>
            SISTEM
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1.2 }}>
            INVENTARIS
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1.2 }}>
            LABORATORIUM
          </Typography>
        </Box>
      </Box>

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                borderLeft: location.pathname === item.path ? '4px solid #fbbf24' : '4px solid transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ marginTop: 'auto', p: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Keluar" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}