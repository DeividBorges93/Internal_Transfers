FROM node:16-alpine

WORKDIR /frontend

COPY package.json .

RUN npm install --silent

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
