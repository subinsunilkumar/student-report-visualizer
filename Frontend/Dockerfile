FROM node:16.15.1-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4200 49157
CMD npm run start