# FROM node:16-alpine AS internaltransfersbackend
# WORKDIR /internal_transfers/backend
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npx prisma generate --schema ./prisma/schema.prisma
# EXPOSE 3001
# CMD [ "npm", "start" ]

FROM node:16-alpine

WORKDIR /backend

COPY package.json .

RUN npm install --silent

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
