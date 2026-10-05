import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Tabs, Tab, Button, Grid, Switch, FormControlLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import { toast } from 'react-toastify';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function Pengaturan() {
  const [tab, setTab] = useState(0);
  const [settings, setSettings] = useState({
    id: null,
    nama_kampus: '',
    alamat: '',
    email: '',
    logo_url: '',
    nama_sistem: 'Sistem Inventaris Laboratorium',
    versi: '1.0.0',
    mode_maintenance: false,
    developer: 'Fiqria Rangga',
  });
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    api.get('/api/settings').then((res) => {
      if (res.data && res.data.id) setSettings((prev) => ({ ...prev, ...res.data }));
    }).catch(() => {});

    api.get('/api/activity-logs').then((res) => setActivityLogs(res.data)).catch(() => {});
  }, []);

  const handleSaveSettings = async () => {
    if (!settings.nama_kampus) {
      toast.error('Nama kampus wajib diisi!');
      return;
    }
    try {
      if (settings.id) {
        await api.put(`/api/settings/${settings.id}`, settings);
      } else {
        await api.post('/api/settings', settings);
      }
      toast.success('Pengaturan berhasil disimpan!');
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan!');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Pengaturan
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Pengaturan sistem dan identitas kampus
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid #e2e8f0', px: 2, minHeight: 44 }}
        >
          <Tab label="Identitas" sx={{ textTransform: 'none', fontSize: '0.85rem', minWidth: 90, minHeight: 44 }} />
          <Tab label="Sistem" sx={{ textTransform: 'none', fontSize: '0.85rem', minWidth: 90, minHeight: 44 }} />
          <Tab label="Activity Log" sx={{ textTransform: 'none', fontSize: '0.85rem', minWidth: 110, minHeight: 44 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
                Informasi Kampus
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Logo Kampus
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  {settings.logo_url ? (
                    <img
                      src={settings.logo_url}
                      alt="Logo Kampus"
                      style={{ width: 120, borderRadius: 8, border: '1px solid #cbd5e1' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 120, height: 120, backgroundColor: '#f1f5f9',
                        borderRadius: 2, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', border: '1px dashed #cbd5e1',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        LOGO KAMPUS
                      </Typography>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{ textTransform: 'none', borderRadius: '10px' }}
                  >
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          const formData = new FormData();
                          formData.append('foto', file);
                          const res = await api.post('/api/upload-foto', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                          });
                          setSettings({ ...settings, logo_url: res.data.url });
                          toast.success('Logo berhasil diupload!');
                        } catch (err) {
                          toast.error('Gagal upload logo!');
                        }
                      }}
                    />
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <AppTextField
                    label="Nama Kampus"
                    value={settings.nama_kampus}
                    onChange={(e) => setSettings({ ...settings, nama_kampus: e.target.value })}
                    placeholder="Contoh: Sekolah Tinggi Teknologi Payakumbuh"
                  />
                </Grid>
                <Grid item xs={12}>
                  <AppTextField
                    label="Alamat"
                    value={settings.alamat}
                    onChange={(e) => setSettings({ ...settings, alamat: e.target.value })}
                    placeholder="Contoh: Kota Payakumbuh, Sumatera Barat"
                  />
                </Grid>
                <Grid item xs={12}>
                  <AppTextField
                    label="Email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="Contoh: admin@sttp.ac.id"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <AppButton
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  sx={{ width: 'auto', px: 4 }}
                >
                  Simpan Perubahan
                </AppButton>
              </Box>
            </Box>
          )}

          {tab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
                Pengaturan Sistem
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <AppTextField
                    label="Nama Sistem"
                    value={settings.nama_sistem || ''}
                    onChange={(e) => setSettings({ ...settings, nama_sistem: e.target.value })}
                    placeholder="Contoh: Sistem Inventaris Laboratorium"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppTextField
                    label="Versi Aplikasi"
                    value={settings.versi || ''}
                    onChange={(e) => setSettings({ ...settings, versi: e.target.value })}
                    placeholder="Contoh: 1.0.0"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AppTextField
                    label="Developer"
                    value={settings.developer || ''}
                    onChange={(e) => setSettings({ ...settings, developer: e.target.value })}
                    placeholder="Nama developer"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.mode_maintenance || false}
                          onChange={(e) => setSettings({ ...settings, mode_maintenance: e.target.checked })}
                          color="warning"
                        />
                      }
                      label="Mode Maintenance"
                    />
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', ml: 5 }}>
                      Jika aktif, sistem dalam perbaikan.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <AppButton
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  sx={{ width: 'auto', px: 4 }}
                >
                  Simpan Pengaturan Sistem
                </AppButton>
              </Box>
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
                Activity Log
              </Typography>
              {activityLogs.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Belum ada aktivitas
                </Typography>
              ) : (
                activityLogs.map((log) => (
                  <Box key={log.id} sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {log.aktivitas}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {log.keterangan || '-'} • {log.created_at || ''}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}