FROM node:16-alpine AS internaltransfersfrontend
WORKDIR /internal_transfers/frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]