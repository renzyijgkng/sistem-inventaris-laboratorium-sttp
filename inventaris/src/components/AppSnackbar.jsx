import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function AppSnackbar({ open, message, severity = 'info', onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: '10px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}