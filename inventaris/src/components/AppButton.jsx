import React from 'react';
import { Button } from '@mui/material';

export default function AppButton({ children, color = 'primary', sx, ...props }) {
  return (
    <Button
      variant="contained"
      color={color}
      fullWidth
      sx={{
        py: 1.3,
        fontWeight: 'bold',
        textTransform: 'none',
        fontSize: '1rem',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.6)',
          transform: 'translateY(-2px)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}