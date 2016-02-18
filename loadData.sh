#!/bin/bash
fileName="/media/sf_dockerRepos/webApp/mList"
postURL="http://192.168.56.85:8081"

while read line
do
mYear="$( cut -d '~' -f 1 <<< "$line" )"
mTitle="$( cut -d '~' -f 2 <<< "$line" )"
curl -X POST --data "mediaTitle=$mTitle" --data "mediaYear=$mYear"  "$postURL"
done < "$fileName"

##
# In case if you want to do random number of posting of the same URL
##

# display random number between 1 and 300.
# shuf -i 1-300-n 1
# echo $((RANDOM%300+1))
# for i in {1..10000}; do  shuf -i 1-300-n 1 > /dev/null; done

##
# Load testing with apache workbench
##


# Create a post data file with data in the below format
# <form_field1_name>=<form_field1_value>&<form_field2_name>=<form_field2_value>
# mediaTitle=titanic&mediaYear=1997
# ab -n 10000 -c 30 -p post_data -v 4 -T 'application/x-www-form-urlencoded' #postURL