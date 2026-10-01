import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, TextField, List, ListItem,
  ListItemText, Badge, Menu, MenuItem, Divider, Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
  const navigate = useNavigate();
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  // ==== SEARCH ====
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // ==== NOTIFIKASI (LONCENG) ====
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [notifikasi, setNotifikasi] = useState([]);

  useEffect(() => {
    // Ambil aktivitas terbaru untuk notifikasi
    api.get('/api/dashboard/aktivitas-terbaru')
      .then((res) => setNotifikasi(res.data || []))
      .catch(() => setNotifikasi([]));
  }, [location.pathname]); // Refresh notif setiap pindah halaman

  // Search aset ketika user mengetik
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    api.get('/api/aset')
      .then((res) => {
        const q = searchQuery.toLowerCase();
        const filtered = (res.data || []).filter(
          (a) =>
            a.nama_aset?.toLowerCase().includes(q) ||
            a.kode_aset?.toLowerCase().includes(q)
        ).slice(0, 10);
        setSearchResults(filtered);
      })
      .catch(() => setSearchResults([]));
  }, [searchQuery]);

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleOpenNotif = (e) => setAnchorNotif(e.currentTarget);
  const handleCloseNotif = () => setAnchorNotif(null);

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
              {/* TOMBOL SEARCH */}
              <IconButton
                size="small"
                sx={{ color: '#64748b' }}
                onClick={() => setOpenSearch(true)}
              >
                <SearchIcon />
              </IconButton>

              {/* TOMBOL LONCENG */}
              <IconButton
                size="small"
                sx={{ color: '#64748b' }}
                onClick={handleOpenNotif}
              >
                <Badge
                  badgeContent={notifikasi.length}
                  color="error"
                  invisible={notifikasi.length === 0}
                >
                  <NotificationsIcon />
                </Badge>
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

      {/* DIALOG SEARCH */}
      <Dialog
        open={openSearch}
        onClose={handleCloseSearch}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Cari Aset
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Ketik nama atau kode aset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mt: 1 }}
          />
          {searchQuery && (
            <List sx={{ mt: 2 }}>
              {searchResults.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8', py: 2, textAlign: 'center' }}>
                  Tidak ada aset yang cocok
                </Typography>
              ) : (
                searchResults.map((item) => (
                  <ListItem
                    key={item.id}
                    button
                    onClick={() => {
                      handleCloseSearch();
                      navigate(`/inventaris/${item.id}`);
                    }}
                    sx={{ borderRadius: 2, '&:hover': { backgroundColor: '#f1f5f9' } }}
                  >
                    <ListItemText
                      primary={`${item.kode_aset} — ${item.nama_aset}`}
                      secondary={
                        <>
                          {item.laboratorium?.nama_lab || '-'} •{' '}
                          {item.kategori?.nama_kategori || '-'} •{' '}
                          {item.kondisi?.nama_kondisi || '-'}
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* DROPDOWN NOTIFIKASI */}
      <Menu
        anchorEl={anchorNotif}
        open={Boolean(anchorNotif)}
        onClose={handleCloseNotif}
        PaperProps={{ sx: { borderRadius: 3, width: 360, maxHeight: 400 } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Notifikasi
          </Typography>
        </Box>
        <Divider />
        {notifikasi.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Belum ada notifikasi
            </Typography>
          </Box>
        ) : (
          notifikasi.map((item) => (
            <MenuItem
              key={item.id}
              onClick={handleCloseNotif}
              sx={{ display: 'block', py: 1.5, borderBottom: '1px solid #f1f5f9' }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {item.aktivitas}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {item.keterangan || '-'}
              </Typography>
            </MenuItem>
          ))
        )}
        <Divider />
        <Box sx={{ p: 1.5, textAlign: 'center' }}>
          <Button
            size="small"
            onClick={() => {
              handleCloseNotif();
              navigate('/pengaturan');
            }}
            sx={{ textTransform: 'none', color: '#2563eb' }}
          >
            Lihat Semua
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}