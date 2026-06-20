import { History, ScanBarcode, Search, User } from 'lucide-react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

interface BottomNavProps {
  value: number;
  onChange: (value: number) => void;
}

export function BottomNav({ value, onChange }: BottomNavProps) {
  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        zIndex: 1000,
        height: '72px',
        paddingBottom: '8px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        '& .MuiBottomNavigationAction-root': {
          minWidth: 'auto',
          padding: '8px 12px',
          color: '#9e9e9e',
          '&.Mui-selected': {
            color: '#2e7d32',
          }
        }
      }}
    >
      <BottomNavigationAction
        label="Verlauf"
        icon={<History size={24} />}
      />
      <BottomNavigationAction
        label="Scannen"
        icon={
          <div className="bg-green-600 rounded-full p-3 -mt-4 shadow-lg">
            <ScanBarcode size={28} color="white" />
          </div>
        }
        sx={{
          '& .MuiBottomNavigationAction-label': {
            marginTop: '8px !important'
          }
        }}
      />
      <BottomNavigationAction
        label="Entdecken"
        icon={<Search size={24} />}
      />
      <BottomNavigationAction
        label="Profil"
        icon={<User size={24} />}
      />
    </BottomNavigation>
  );
}
