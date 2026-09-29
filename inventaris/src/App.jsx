import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Lab from './pages/Lab';
import DetailLab from './pages/DetailLab';
import Inventaris from './pages/Inventaris';
import DetailAset from './pages/DetailAset';
import Laporan from './pages/Laporan';
import Pengguna from './pages/Pengguna';
import Pengaturan from './pages/Pengaturan';
import Layout from './components/Layout';
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
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/lab/:id" element={<DetailLab />} />
            <Route path="/inventaris" element={<Inventaris />} />
            <Route path="/inventaris/:id" element={<DetailAset />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/pengguna" element={<Pengguna />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}