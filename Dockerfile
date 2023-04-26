FROM node:18-alpine
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .
RUN npm install -g npm@9.6.4
RUN npm install --development
RUN npm run tsc
CMD [ "node", "dist/index.js" ]
