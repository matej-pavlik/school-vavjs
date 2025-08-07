FROM node:20.9.0
WORKDIR /fe
COPY frontend/package-lock.json frontend/package.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM node:20.9.0
WORKDIR /home/node/app
COPY backend/package-lock.json backend/package.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci
COPY backend ./
COPY --from=0 /fe/dist ./public
CMD ["node", "src/main.js"]