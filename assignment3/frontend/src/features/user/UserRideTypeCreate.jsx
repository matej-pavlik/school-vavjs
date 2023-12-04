import { Button, FormControl, FormHelperText, FormLabel, Input, Stack, Textarea } from '@mui/joy';
import { Form as RouteForm, Link as RouterLink } from 'react-router-dom';
import { useActionErrors } from '../common/hooks';
import PageHeading from './PageHeading';

export default function UserRideTypeCreate() {
  const errors = useActionErrors({ parsed: true });

  return (
    <Stack direction="column" method="post" component={RouteForm}>
      <PageHeading>Add new ride type</PageHeading>

      <Stack spacing={1} sx={{ mt: 1 }}>
        <FormControl error={Boolean(errors?.name?.errors)}>
          <FormLabel>Name</FormLabel>
          <Input name="name" required />
          <FormHelperText>{errors?.name?.errors?.[0].message}</FormHelperText>
        </FormControl>
        <FormControl error={Boolean(errors?.description?.errors)}>
          <FormLabel>Description</FormLabel>
          <Textarea name="description" minRows={2} required />
          <FormHelperText>{errors?.description?.errors?.[0].message}</FormHelperText>
        </FormControl>
      </Stack>

      <Button type="submit" variant="solid" sx={{ mt: 2 }}>
        Add new ride type
      </Button>
      <Button component={RouterLink} to="/user/ride-types" sx={{ mt: 2 }} variant="outlined">
        Back to ride types
      </Button>
    </Stack>
  );
}
