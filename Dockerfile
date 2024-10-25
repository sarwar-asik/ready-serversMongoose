FROM node:20

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn

COPY . .

VOLUME [ "/logs" ]

EXPOSE 5000

CMD ["yarn","dev"]