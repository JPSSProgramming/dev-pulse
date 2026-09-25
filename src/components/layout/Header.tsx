import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useTranslation } from '../../i18n/I18nProvider';

interface HeaderProps {
  onMenuToggle: () => void;
  mode: PaletteMode;
  onToggleMode: () => void;
  drawerWidth: number;
}

export const Header = ({ onMenuToggle, mode, onToggleMode, drawerWidth }: HeaderProps) => {
  const { language, setLanguage, t } = useTranslation();
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

        <Chip label={t('header.status')} color="primary" variant="outlined" size="small" />

        <IconButton onClick={onToggleMode} color="primary" aria-label={t('header.toggleTheme')}>
          {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
        <Button size="small" onClick={() => setLanguage(language === 'uk' ? 'en' : 'uk')} aria-label={t('header.language')}>
          {language.toUpperCase()}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
