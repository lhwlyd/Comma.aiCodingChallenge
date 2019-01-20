from pymongo import MongoClient
# pprint library is used to make the output look more pretty
from pprint import pprint
# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://lhwlyd:LhwLyd12@ds151612.mlab.com:51612/commadb")
db=client.pythonmongolab
# Issue the serverStatus command and print the results
posts = db.posts
post = {'author':'royluo', 'text':'Hello world'}

id = posts.insert(post)

pprint(id)
client.close()
