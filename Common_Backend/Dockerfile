FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY Server.js ./
COPY src ./src
COPY scripts ./scripts
CMD ["npm", "start"]
