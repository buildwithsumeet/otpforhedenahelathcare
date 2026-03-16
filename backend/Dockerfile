# Node image use
FROM node:20

# Working directory create
WORKDIR /app

# package.json copy
COPY package*.json ./

# dependencies install
RUN npm install

# project files copy
COPY . .

# backend port
EXPOSE 3000

# start command
CMD ["npm","start"]