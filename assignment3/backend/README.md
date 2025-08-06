# Development environment setup

1. Create an `.env` file according to `.env.example`. Fill in the empty and database values accordingly.

- As a part of this process, you will also need to create a PostgreSQL database.

2. Run `npm install`
3. Run `npm run dev` to start a backend development server

## Testing

- Run `npm run test` to run unit and integration tests (requires database setup)
- Run `npm run test:e2e` to run e2e tests (requires a fully running backend and frontend)
