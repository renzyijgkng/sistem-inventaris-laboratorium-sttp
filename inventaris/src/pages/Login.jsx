import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan Password wajib diisi!');
      return;
    }

    try {
      const res = await api.post('/login', { email, password });
      login(res.data.user);
      toast.success(`Berhasil login sebagai ${res.data.user.role.toUpperCase()}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal! Periksa email/password.');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: 400,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#2563eb', letterSpacing: 1 }}
          >
            INVENTARIS
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#666', mt: 0.5, fontStyle: 'italic' }}
          >
            Aset Laboratorium Komputer STTP
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <AppTextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sttp.ac.id"
            required
          />
          <AppTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />
          <Box sx={{ mt: 3 }}>
            <AppButton type="submit">MASUK</AppButton>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}