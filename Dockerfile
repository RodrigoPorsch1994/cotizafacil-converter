FROM node:20-slim

RUN apt-get update && apt-get install -y \
  libreoffice \
  fonts-dejavu \
  fonts-liberation \
  fontconfig \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
