from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.sylvm.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.moomin

users = [
    {"id": "", "name": "James"},
    {"id": "", "name": "Alice"},
    {"id": "", "name": "Andrew"},
    {"id": "", "name": "Paul"},
    {"id": "", "name": "Sophia"},
    {"id": "", "name": "Rebecca"},
    {"id": "", "name": "Arnold"},
]
db.users.insert_many(users)

