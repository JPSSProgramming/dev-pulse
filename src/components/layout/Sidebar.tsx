import type { ReactElement } from 'react';
import { Link } from '@tanstack/react-router';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useTranslation } from '../../i18n/I18nProvider';

type RoutePath = '/' | '/daily-goals' | '/focus-pulse' | '/snippets-vault';

interface SidebarItem {
  key: string;
  path: RoutePath;
  label: string;
  icon: ReactElement;
}

interface SidebarProps {
  drawerWidth: number;
  items: readonly SidebarItem[];
  activePath: string;
  mobileOpen: boolean;
  onClose: () => void;
}

const SidebarContent = ({ items, activePath, onClose }: Pick<SidebarProps, 'items' | 'activePath' | 'onClose'>) => (
  <Box sx={{ overflow: 'auto' }}>
    <Toolbar />
    <Divider />
    <List sx={{ p: 1.5 }}>
      {items.map((item) => (
        <ListItemButton
          key={item.key}
          component={Link}
          to={item.path}
          selected={activePath === item.path}
          onClick={onClose}
          sx={{ mb: 0.5, borderRadius: 1.5, py: 1.1 }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

export const Sidebar = ({ drawerWidth, items, activePath, mobileOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label={t('navigation.label')}>
      <Drawer variant="temporary" open={mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
        <SidebarContent items={items} activePath={activePath} onClose={onClose} />
      </Drawer>
      <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
        <SidebarContent items={items} activePath={activePath} onClose={onClose} />
      </Drawer>
    </Box>
  );
};
