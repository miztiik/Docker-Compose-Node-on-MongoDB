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
FROM alpine
MAINTAINER mystique

# Add the tar file of the web site 
RUN apk update && apk add nodejs && rm -rf /var/cache/apk/* && mkdir /data

WORKDIR /data

EXPOSE 80

ENTRYPOINT [ "sh" ]
CMD [""]