##################################################################################
## 
## VERSION      :   0.0.2
## DATE         :   15Feb2016
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
ADD appSrc/ /usr/src/app
WORKDIR /usr/src/app

# install the dependencies from the package.json file
RUN npm install express \
    npm install body-parser \
    npm install request \
    npm install mongodb
	
# make port 8081 available outside of the image
EXPOSE 8081

CMD [ "node", "/usr/src/app/server.js"]