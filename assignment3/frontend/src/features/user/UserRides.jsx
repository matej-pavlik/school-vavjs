import { Button, Table } from '@mui/joy';
import { format } from 'date-fns';
import { pipe, replace, toLower, toUpper } from 'ramda';
import { Link as RouterLink, useLoaderData, useSubmit } from 'react-router-dom';
import PageHeading from './PageHeading';

const capitalize = pipe(toLower, replace(/^./, toUpper));

export default function UserRides() {
  const rides = useLoaderData();
  const submit = useSubmit();

  function deleteRide(id) {
    return submit({ id }, { method: 'delete' });
  }

  return (
    <>
      <PageHeading>List of rides</PageHeading>

      <Table variant="outlined">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id}>
              <td>{format(new Date(ride.date), 'dd.MM.yyyy')}</td>
              <td>{capitalize(ride.type)}</td>
              <td>{ride.value}</td>
              <td>
                <Button
                  size="sm"
                  color="danger"
                  variant="outlined"
                  onClick={() => deleteRide(ride.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button component={RouterLink} to="/user/rides/create" variant="solid" sx={{ mt: 2 }}>
        Add new ride
      </Button>
    </>
  );
}
