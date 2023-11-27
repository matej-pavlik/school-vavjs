import { Button, FormControl, FormLabel, Input, Option, Select, Stack, Typography } from '@mui/joy';
import { Form as RouteForm, Link as RouterLink } from 'react-router-dom';

export default function UserRideCreate() {
  return (
    <Stack method="post" component={RouteForm} sx={{ p: 1, height: '100%' }}>
      <Typography component="h1" level="h3" sx={{ mb: 1 }}>
        Create a new ride
      </Typography>

      <Stack spacing={1}>
        <FormControl>
          <FormLabel>Login</FormLabel>
          <Select name="type" defaultValue="ROUTE" required>
            <Option value="ROUTE">Route</Option>
            <Option value="DURATION">Duration</Option>
            <Option value="CONSUMPTION">Consumption</Option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input name="date" type="date" required />
        </FormControl>
        <FormControl>
          <FormLabel>Value</FormLabel>
          <Input name="value" type="number" required />
        </FormControl>
      </Stack>

      <Button type="submit" variant="solid" sx={{ mt: 2 }}>
        Create new ride
      </Button>

      <Button component={RouterLink} to="/user/rides" sx={{ mt: 2 }} variant="outlined">
        Back
      </Button>
    </Stack>
  );
}
