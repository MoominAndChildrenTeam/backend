from pymongo import MongoClient
import certifi

client = MongoClient('mongodb+srv://jcode:1234@cluster0.z0xvg.mongodb.net/Cluster0?retryWrites=true&w=majority',tlsCAFile=certifi.where())
db = client.dbsparta

doc = {
    'email':'asd@gmail.com',
    'nickname':'david',
    'pw':00000
}

db.users.insert_one(doc)