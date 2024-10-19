FROM node:18-buster as builder
# make the directory where the project files will be stored
RUN mkdir -p /usr/src/
# set it as the working directory so that we don't need to keep referencing it
WORKDIR /usr/src/
# Copy the package.json file
COPY . .
# install project dependencies
RUN npm install
# make sure to set up .dockerignore to copy only necessary files
# run the build command which will build and export html files
RUN npm run build
CMD ["npm", "run", "start"]