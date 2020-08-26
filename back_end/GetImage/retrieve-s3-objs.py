#author:			Thanh Phu Lai 
#Modified by:	Kate(Quyen) Vu Thi Tu
#id:  		   	
#tute:    		2.30-4.30pm Tuesday

from json import JSONEncoder
import json
import urllib.parse
import boto3

# init S3 client
s3 = boto3.client('s3')

#entry point of an AWS Lambda function
def lambda_handler(event, context):
    #'even' holds the payload sent from clients, we'll be getting a bucket name here, which was sent from clients.
    bucket_name = event['bucket_name']
    
    #get all objects in that bucket
    all_cards = get_all_cards(bucket_name)
    
    #convert that into JSON
    response = { 
        "allCards" : [obj.__dict__ for obj in all_cards]
    }
    #send back to client
    return response

#get all objects in S3 bucket
def get_all_cards(bucket_name):
    # list of Cat objects (defined below)
    all_cards = []

    # [ACTION REQUIRED] you need to get all objects in the bucket, meanwhile construct a Cat object for each image and add to the all_cats list
    for bucket_object in s3.list_objects(Bucket=bucket_name)['Contents']:
        key = bucket_object['Key']
        response = s3.get_object_tagging (Bucket=bucket_name, Key=key)
        url = "https://%s.s3.amazonaws.com/%s" % (bucket_name, key)
        card = Card(key, url)
        all_cards.append(card)
    return all_cards

class Card:
    def __init__(self, id, image_url):
        self.id = id
        self.imageUrl = image_url
