from flask import Flask, render_template, request, jsonify
import requests
from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.sylvm.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.moomin

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')



@app.route("/mypage", methods=["POST"])
def feed_post():
    image_receive = request.form['image_give']
    comment_receive = request.form['comment_give']
    doc = {
        'image': image_receive,
        'comment': comment_receive
    }
    db.feeds.insert_one(doc)

    return jsonify({'msg': '저장 완료'})

def feed_delete():
    db.feeds.deleteOne({})

@app.route("/mypage", methods=["GET"])
def feed_get():
    feed_list = list(db.feeds.find({}, {'_id': False}))
    return jsonify({'feeds': feed_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)