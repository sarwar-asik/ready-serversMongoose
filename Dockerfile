FROM node:22  AS builder
# RUN apk add --no-cache python3 make g++ 
WORKDIR /app

COPY package.json  ./

# RUN yarn cache clean
RUN npm cache clean --force

# RUN yarn install --frozen-lockfile
# RUN npm install --production
RUN npm install

COPY . .

# RUN yarn build
RUN npm run build

FROM node:22 

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY . /app

EXPOSE 5002

CMD ["npm", "start"]