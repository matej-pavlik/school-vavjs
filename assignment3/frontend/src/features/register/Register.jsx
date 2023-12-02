import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Stack,
  Typography,
} from '@mui/joy';
import Card from '@mui/joy/Card';
import { Form as RouterForm, Link as RouterLink } from 'react-router-dom';
import { useActionErrors } from '../common/hooks';

export default function Register() {
  const errors = useActionErrors({ parsed: true });

  return (
    <Stack direction="row" sx={{ p: 1, height: '100%' }}>
      <Card
        component={RouterForm}
        method="post"
        sx={{ maxWidth: 400, flex: 1, minWidth: 0, m: 'auto' }}
      >
        <Typography component="h1" level="h3" sx={{ textAlign: 'center', mb: 1 }}>
          Register
        </Typography>

        <FormControl error={Boolean(errors?.email?.errors)}>
          <FormLabel>Email</FormLabel>
          <Input name="email" type="email" required />
          <FormHelperText>{errors?.email?.errors?.[0].message}</FormHelperText>
        </FormControl>
        <FormControl error={Boolean(errors?.username?.errors)}>
          <FormLabel>Username</FormLabel>
          <Input name="username" required />
          <FormHelperText>{errors?.username?.errors?.[0].message}</FormHelperText>
        </FormControl>
        <FormControl error={Boolean(errors?.password?.errors)}>
          <FormLabel>Password</FormLabel>
          <Input name="password" type="password" required />
          <FormHelperText>{errors?.password?.errors?.[0].message}</FormHelperText>
        </FormControl>
        <FormControl error={Boolean(errors?.age?.errors)}>
          <FormLabel>Age</FormLabel>
          <Input name="age" type="number" required />
          <FormHelperText>{errors?.age?.errors?.[0].message}</FormHelperText>
        </FormControl>

        <Button type="submit" variant="solid" sx={{ mt: 2 }}>
          Register
        </Button>

        <Typography level="body-sm" sx={{ textAlign: 'center' }}>
          Already a member?
          <Link component={RouterLink} to="/login" sx={{ ml: 0.5 }}>
            Log in
          </Link>
        </Typography>
      </Card>
    </Stack>
  );
}
