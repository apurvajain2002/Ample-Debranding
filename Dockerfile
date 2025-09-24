FROM node:lts
LABEL authors="telwyn"
EXPOSE 3000


WORKDIR /evueme
COPY public /evueme/public
COPY src /evueme/src
COPY package.json /evueme
ADD  .env /evueme/.env
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "start"]
#evueme/ev-web:latest