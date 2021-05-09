FROM node:10-alpine

RUN mkdir /app
WORKDIR /app

COPY ./package*.json .
RUN npm install

COPY src .
COPY public .

RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]
