# How to use Docker Compose to run complex multi container apps - Node on MongoDB

This docker files shows how to build your own base image for various cloudera components running on Centos6.6
This is a simple setup with 3 Nodes and one MongoDB as backend run along with Weave for service discovery. Later will show you how to use [Apache Bench][http://httpd.apache.org/docs/2.2/programs/ab.html] to test the nodes and the fault tolerance of failing one _NODE_ intentionally

### We'll be using the following tools, technologies, and services in this post:
* Docker
* Docker Compose
* NodeJS
* MongoDB
* Weave
* Docker Hub
* Git
* OMDB API

## Composing our Services
To get our five container configuration set up we first need to create a _docker-compose.yml_ file. We will need three containers webNode1, webNode2 and webNode3
based on our web application image and one haproxy container.



### Sample Code
```
su - hdfs
hadoop jar /usr/lib/hadoop-0.20-mapreduce/hadoop-examples.jar randomwriter out
```


##### To Do
- [x] Setup [Apache Bench][http://httpd.apache.org/docs/2.2/programs/ab.html] along with Docker Compose
- [ ] Find a way to add vm.swapiness during build, probably echo it into the file?
