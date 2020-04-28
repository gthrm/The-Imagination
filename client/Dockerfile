FROM node:10.19.0
RUN yarn global add http-server
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
