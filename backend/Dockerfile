FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# CMD ["sh","./wait-for-it.sh", "levelup-db:5432", "--","nodemon", "src/index.js"]
CMD ["bash","./wait-for-it.sh", "levelup-db:5432", "--","nodemon", "src/index.js"]
