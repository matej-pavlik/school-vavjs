# Source: https://github.com/puppeteer/puppeteer/blob/puppeteer-v20.9.0/docker/Dockerfile
FROM ghcr.io/puppeteer/puppeteer:20.9.0

# The puppeteer Docker source above uses a different version of Node.js (v18), therefore a new build stage is introduced to avoid bugs.
FROM node:20.9.0
WORKDIR /home/node/e2e

# Installs system dependencies for Puppeteer
# https://pptr.dev/troubleshooting#running-puppeteer-in-docker
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser
COPY backend/package-lock.json backend/package.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci
COPY backend ./
USER pptruser
COPY --from=0 /home/pptruser /home/pptruser/
CMD ["npm", "run", "test:e2e"]
