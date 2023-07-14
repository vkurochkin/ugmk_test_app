FROM node:18

# Creating app directory
WORKDIR /usr/src/app

# Installing app dependencies
COPY package*.json ./

# building code for production
RUN npm ci --omit=dev

# Bundling app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]