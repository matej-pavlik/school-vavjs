import { Alert, Button, FormControl, FormLabel, Input, Link, Stack, Typography } from '@mui/joy';
import Card from '@mui/joy/Card';
import { Form as RouterForm, Link as RouterLink } from 'react-router-dom';
import { useActionErrors } from '@/features/common/hooks';

export default function Login() {
  const errors = useActionErrors();

  return (
    <Stack direction="row" sx={{ p: 1, height: '100%' }}>
      <Card
        component={RouterForm}
        method="post"
        sx={{ maxWidth: 400, flex: 1, minWidth: 0, m: 'auto' }}
      >
        <Typography component="h1" level="h3" sx={{ textAlign: 'center', mb: 1 }}>
          Log in
        </Typography>

        {errors && (
          <Alert color="danger" variant="soft">
            {errors[0].message}
          </Alert>
        )}

        <FormControl>
          <FormLabel>Login</FormLabel>
          <Input name="login" required />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input name="password" type="password" required />
        </FormControl>

        <Button type="submit" variant="solid" sx={{ mt: 2 }}>
          Log in
        </Button>

        <Typography level="body-sm" sx={{ textAlign: 'center' }}>
          Not a member?
          <Link component={RouterLink} to="/register" sx={{ ml: 0.5 }}>
            Register
          </Link>
        </Typography>
      </Card>
    </Stack>
  );
}
