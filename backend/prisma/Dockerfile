FROM node:16-alpine AS internaltransfersprisma
WORKDIR /prisma
COPY ./ ./
RUN npm install prisma@4.6.1
CMD [ "npx", "prisma", "migrate", "dev" ]
