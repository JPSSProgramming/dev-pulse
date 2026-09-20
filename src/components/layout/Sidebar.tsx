import type { ReactElement } from 'react';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

import type { NavSection } from '../../types/navigation';

interface SidebarItem {
  key: NavSection;
  label: string;
  icon: ReactElement;
}

interface SidebarProps {
  drawerWidth: number;
  items: SidebarItem[];
  activeSection: NavSection;
  onSelect: (section: NavSection) => void;
  mobileOpen: boolean;
  onClose: () => void;
}

const SidebarContent = ({ items, activeSection, onSelect }: Pick<SidebarProps, 'items' | 'activeSection' | 'onSelect'>) => (
  <Box sx={{ overflow: 'auto' }}>
    <Toolbar />
    <Divider />
    <List sx={{ p: 1.5 }}>
      {items.map((item) => (
        <ListItemButton
          key={item.key}
          selected={activeSection === item.key}
          onClick={() => onSelect(item.key)}
          sx={{
            mb: 0.5,
            borderRadius: 1.5,
            py: 1.1,
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

export const Sidebar = ({
  drawerWidth,
  items,
  activeSection,
  onSelect,
  mobileOpen,
  onClose,
}: SidebarProps) => {
  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="navigation">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <SidebarContent items={items} activeSection={activeSection} onSelect={onSelect} />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <SidebarContent items={items} activeSection={activeSection} onSelect={onSelect} />
      </Drawer>
    </Box>
  );
};
