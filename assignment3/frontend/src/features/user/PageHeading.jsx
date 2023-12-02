import { Typography } from '@mui/joy';
import PropTypes from 'prop-types';

export default function Heading({ children }) {
  return (
    <Typography component="h1" level="h3" sx={{ mb: 1 }}>
      {children}
    </Typography>
  );
}

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};
