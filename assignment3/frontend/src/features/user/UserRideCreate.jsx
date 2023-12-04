import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
} from '@mui/joy';
import { Form as RouteForm, Link as RouterLink } from 'react-router-dom';
import { useActionErrors } from '../common/hooks';
import PageHeading from './PageHeading';

export default function UserRideCreate() {
  const errors = useActionErrors({ parsed: true });

  return (
    <Stack direction="column" method="post" component={RouteForm}>
      <PageHeading>Add new ride</PageHeading>

      <Stack spacing={1} sx={{ mt: 1 }}>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select name="type" defaultValue="ROUTE" required>
            <Option value="ROUTE">Route</Option>
            <Option value="DURATION">Duration</Option>
            <Option value="CONSUMPTION">Consumption</Option>
          </Select>
          <FormHelperText />
        </FormControl>
        <FormControl error={Boolean(errors?.date?.errors)}>
          <FormLabel>Date</FormLabel>
          <Input name="date" type="date" required />
          <FormHelperText>{errors?.date?.errors?.[0].message}</FormHelperText>
        </FormControl>
        <FormControl error={Boolean(errors?.value?.errors)}>
          <FormLabel>Value</FormLabel>
          <Input name="value" type="number" required />
          <FormHelperText>{errors?.value?.errors?.[0].message}</FormHelperText>
        </FormControl>
      </Stack>

      <Button type="submit" variant="solid" sx={{ mt: 2 }}>
        Add new ride
      </Button>
      <Button component={RouterLink} to="/user/rides" sx={{ mt: 2 }} variant="outlined">
        Back to rides
      </Button>
    </Stack>
  );
}
