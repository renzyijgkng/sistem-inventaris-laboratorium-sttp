import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Chip, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/lab': 'Lab',
  '/inventaris': 'Inventaris',
  '/laporan': 'Laporan',
  '/pengguna': 'Pengguna',
  '/pengaturan': 'Pengaturan',
};

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* TOPBAR */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'white',
            color: '#1e293b',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              {currentTitle}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton size="small" sx={{ color: '#64748b' }}>
                <SearchIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748b' }}>
                <NotificationsIcon />
              </IconButton>

              <Chip
                avatar={<Avatar sx={{ bgcolor: '#1e40af' }}>{user?.name?.charAt(0) || 'A'}</Avatar>}
                label={`${user?.name || 'Admin'} (${user?.role || 'Admin'})`}
                sx={{
                  backgroundColor: '#eff6ff',
                  color: '#1e40af',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* CONTENT */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}