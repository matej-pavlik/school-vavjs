import { Box, List, ListItem, ListItemButton, Sheet, Stack, Typography } from '@mui/joy';
import {
  NavLink as RouterNavLink,
  Outlet as RouterOutlet,
  useLoaderData,
  useLocation,
} from 'react-router-dom';

export default function UserLayout() {
  const user = useLoaderData();
  const { pathname } = useLocation();

  const items = [
    {
      label: 'Rides',
      to: '/user/rides',
    },
    {
      label: 'Ride types',
      to: '/user/ride-types',
    },
  ];

  return (
    <Stack direction="row" sx={{ height: '100%' }}>
      <Sheet component="aside" variant="outlined" sx={{ minWidth: 300 }}>
        <Typography
          component="h1"
          level="title-md"
          sx={{ pt: 1.5, pb: 1, px: 2, textAlign: 'center' }}
        >
          {user.email}
        </Typography>

        <List>
          {items.map(({ label, to }) => (
            <ListItem key={to}>
              <ListItemButton
                component={RouterNavLink}
                to={to}
                color="primary"
                selected={pathname === to}
              >
                {label}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Sheet>

      <Box component="main" sx={{ py: 1.25, px: 2 }}>
        <RouterOutlet />
      </Box>
    </Stack>
  );
}
