import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Chip,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';

interface HeaderProps {
  onMenuToggle: () => void;
  mode: PaletteMode;
  onToggleMode: () => void;
  drawerWidth: number;
}

export const Header = ({ onMenuToggle, mode, onToggleMode, drawerWidth }: HeaderProps) => {

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton edge="start" onClick={onMenuToggle} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
          DevPulse
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Chip label="Developer: Building" color="primary" variant="outlined" size="small" />

        <IconButton onClick={onToggleMode} color="primary" aria-label="toggle theme">
          {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
