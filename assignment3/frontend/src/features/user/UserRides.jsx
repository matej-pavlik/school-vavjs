import { Button, Table } from '@mui/joy';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';

export default function UserRides() {
  const rides = useLoaderData();

  return (
    <div>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id}>
              <td>{ride.id}</td>
              <td>{ride.date}</td>
              <td>{ride.type}</td>
              <td>{ride.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button component={RouterLink} to="/user/rides/create" variant="solid">
        Create ride
      </Button>
    </div>
  );
}
