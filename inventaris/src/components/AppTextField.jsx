import React from 'react';
import { TextField } from '@mui/material';

export default function AppTextField({ sx, ...props }) {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          '& fieldset': { borderColor: '#cbd5e1' },
          '&:hover fieldset': { borderColor: '#2563eb' },
          '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 2 },
        },
        '& .MuiInputLabel-root': {
          color: '#475569',
          fontWeight: 500,
          '& .MuiInputLabel-asterisk': { display: 'none' },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#2563eb',
        },
        ...sx,
      }}
      {...props}
    />
  );
}