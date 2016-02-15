##################################################################################
## 
## VERSION      :   0.0.1
## DATE         :   12Feb2016
##
## DESCRIPTION  :   "How to use Docker Compose to run complex multi container apps - Node on MongoDB"
##
## Ref [1]      :   http://mherman.org/blog/2015/03/06/node-with-docker-continuous-integration-and-delivery/
## Ref [2]      :   http://blog.hypriot.com/post/docker-compose-nodejs-haproxy/
##
##################################################################################
FROM node
MAINTAINER mystique

# Create app directory
RUN mkdir -p /usr/src/app
ADD appSrc /usr/src/app
WORKDIR /usr/src/app

# install the dependencies from the package.json file
RUN npm install

# make port 8089 available outside of the image
EXPOSE 8089

CMD [ "node", "/usr/src/app/server.js"]