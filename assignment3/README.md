# Docker build setup

NOTE: For a local dev setup without Docker, look at the frontend and backend folders.

## Instructions

1. First, create an `.env` file according to `.env.example`. Fill in the empty values accordingly.

2. Run the following commands:

```
docker compose build
```

This build command may take a while when running for the first time. After it's done, run the following:

```
docker compose up
```

The application will then start at http://localhost:8080.
