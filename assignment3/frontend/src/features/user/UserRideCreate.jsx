import { Box, Button, FormControl, FormLabel, Input, Option, Select, Stack } from '@mui/joy';
import { Form as RouteForm, Link as RouterLink } from 'react-router-dom';
import PageHeading from './PageHeading';

export default function UserRideCreate() {
  return (
    <Box method="post" component={RouteForm}>
      <PageHeading>Add new ride</PageHeading>

      <Stack spacing={1}>
        <FormControl>
          <FormLabel>Type</FormLabel>
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
        Add new ride
      </Button>

      <Button component={RouterLink} to="/user/rides" sx={{ mt: 2 }} variant="outlined">
        Back to rides
      </Button>
    </Box>
  );
}
