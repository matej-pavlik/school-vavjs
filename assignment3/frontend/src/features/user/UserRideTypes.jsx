import { Box, Button, Table } from '@mui/joy';
import { Link as RouterLink, useLoaderData, useSubmit } from 'react-router-dom';
import PageHeading from './PageHeading';

const ellipsis = { overflow: 'hidden', textOverflow: 'ellipsis' };

export default function UserRideTypes() {
  const rideTypes = useLoaderData();
  const submit = useSubmit();

  function deleteRideType(id) {
    return submit({ id }, { method: 'delete' });
  }

  return (
    <>
      <PageHeading>List of ride types</PageHeading>

      <Table variant="outlined">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rideTypes.map((rideType) => (
            <tr key={rideType.id}>
              <Box component="td" sx={{ ...ellipsis }}>
                {rideType.name}
              </Box>
              <Box component="td" sx={{ ...ellipsis }}>
                {rideType.description}
              </Box>
              <td>
                <Button
                  size="sm"
                  color="danger"
                  variant="outlined"
                  onClick={() => deleteRideType(rideType.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button component={RouterLink} to="/user/ride-types/create" variant="solid" sx={{ mt: 2 }}>
        Add new ride type
      </Button>
    </>
  );
}
