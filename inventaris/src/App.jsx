import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KategoriBarang from './pages/KategoriBarang';
import DataBarang from './pages/DataBarang';
import BarangMasuk from './pages/BarangMasuk';
import BarangKeluar from './pages/BarangKeluar';
import RekapData from './pages/RekapData';
import Sidebar from './components/Sidebar';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      {!user ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/kategori" element={<KategoriBarang />} />
              <Route path="/barang" element={<DataBarang />} />
              <Route path="/barang-masuk" element={<BarangMasuk />} />
              <Route path="/barang-keluar" element={<BarangKeluar />} />
              <Route path="/rekap" element={<RekapData />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Box>
        </Box>
      )}
    </BrowserRouter>
  );
}