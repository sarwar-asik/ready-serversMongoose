FROM node:20  
#  

WORKDIR /app
COPY package.json yarn.lock ./

RUN npm install

COPY . .

# VOLUME [ "/logs" ]

EXPOSE 5000

CMD ["npm","run","dev"]