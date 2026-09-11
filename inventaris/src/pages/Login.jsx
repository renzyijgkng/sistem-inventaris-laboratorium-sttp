import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import api from '../services/api';
import kampusImg from '../assets/kampus.jpg';

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
        backgroundImage: `url(${kampusImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          zIndex: 1,
        },
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: 400,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          borderRadius: 3,
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
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
             Laboratorium Komputer STTP
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <AppTextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
          />
          <AppTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
          />
          <Box sx={{ mt: 3 }}>
            <AppButton type="submit">Enter
            </AppButton>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}