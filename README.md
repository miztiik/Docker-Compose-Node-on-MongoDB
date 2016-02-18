# How to use Docker Compose to run complex multi container apps - Node on MongoDB

This docker files shows how to build your own base image for various cloudera components running on Centos6.6
This is a simple setup with 3 Nodes and one MongoDB as backend run along with Weave for service discovery. Later will show you how to use [Apache Bench](http://httpd.apache.org/docs/2.2/programs/ab.html) to test the nodes and the fault tolerance of failing one _NODE_ intentionally

### We'll be using the following tools, technologies, and services in this post:
* Docker
* Docker Compose
* NodeJS
* MongoDB from [Mongo Labs](https://mongolab.com/)
* Weave
* Docker Hub
* Git
* OMDB API

## Composing our Services
We will be setting up three `webNode[1-3]` Nodes running `node.js` configured to run `express`. They will be frontended withe `HA Proxy` to load balance the queries. For the database, Initially design was to have mongo DB running locally as docker container, but then found that i could use [Mongo Labs](https://mongolab.com/) as that would reduce load on my machine and follows a more 'DBaaS' Model.

I usually run [Weave](http://www.weave.works/install-weave-net/) before other nodes are started as that allows you to have name resolution working among my docker nodes without too much networking configuration. [Scope](http://www.weave.works/install-weave-scope/) allows you monitor the nodes in _near_ real time and connect to them from the gui to do some quick fixes or validations. 

`cAdivsor` is another monitoring tool from google gives you detailed statistics about your containers, but Scope's ability to connect to the containers and visually appealing gui for each container more appealing.

The node servers are configured to run on port `8081`, The HA Proxy comes with an admin console running on port `70`. Feel free to change them to different ports, It will have to be done in these files : `Dockerfile`, `haproxy.cfg`, `docker-compose.yml`


## How to run
From your docker terminal, jump to the directory where you have the copied all the files from this repo and run,

`docker-compose up -d`

### How does it all look at the end?
```
                       |WebNode1|
User <--> HAProxy <--> |WebNode2| <--> MongoDB-Node1
                       |WebNode3|
```

### Performance testing using Apache Benchmark
If you are using linux (CentOS or Fedora or RHEL) you can install it by running

`yum -y install httpd-tools`

Create a post data file with data in the below format

`<form_field1_name>=<form_field1_value>&<form_field2_name>=<form_field2_value>`

`mediaTitle=titanic&mediaYear=1997`

Basically what we are doing here, The number`-n` of queries is being set `10000`. The concurrency `-c` is being set to `30`. The rest of the flags are mandatory if you are using `ab` to post data to the url and can be safely ignored if you are not using. Finally provide the url to which you are posting. If you want to know more, Apache Benchmark has very good documentation [here](https://httpd.apache.org/docs/2.2/programs/ab.html).

`ab -n 10000 -c 30 -p post_data_filepath -v 4 -T 'application/x-www-form-urlencoded' <NODE.JS_POST_URL>`

#### Performance testing using cURL
Incase installing another tool like `ab` is too much work, you can do something like this, (_Dont forget to fill in the fields <..>_)
```
for i in {1..10000}
do
curl -X POST --data "mediaTitle=<movie_title_of_choice>" --data "mediaYear=<Year_of_release_of_movie>"  <NODE.JS_POST_URL> > /dev/null;
done
```

##### To Do
- [x] Setup [Apache Bench](http://httpd.apache.org/docs/2.2/programs/ab.html) along with Docker Compose
