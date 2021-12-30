from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime
from pymongo import MongoClient



client = MongoClient('mongodb+srv://test:sparta@cluster0.sylvm.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.moomin

app = Flask(__name__)



#main
@app.route('/')
@app.route('/main_page')
def mainpage():
    return render_template('index.html')

@app.route("/mainpage", methods=["GET"])
def all_feed_get():
    all_feed_list = list(db.all_feeds.find({}, {'_id': False}))
    return jsonify({'all_feeds': all_feed_list})




#mypage
@app.route('/my_page')
def my_page():
    return render_template('mypage.html')


@app.route("/mypage", methods=["GET"])
def feed_get():
    feed_list = list(db.my_feeds.find({ }, {'_id': False}))
    return jsonify({'my_feeds': feed_list})

#upload
@app.route('/upload_page')
def upload_page():
    return render_template('upload.html')


@app.route('/upload', methods=["POST"])
def upload():
    date = datetime.today().strftime("%m{} %d{}")
    date = date.format('월', '일')
    image_receive = request.form['image_give']
    comment_receive = request.form['comment_give']
    like = False
    doc = {
        'date': date,
        'image': image_receive,
        'comment': comment_receive,
        'like': like
    }
    db.my_feeds.insert_one(doc)
    db.all_feeds.insert_one(doc)
    return jsonify({'msg': '저장 완료'})


# #users
# @app.route("/users", methods=['POST'])
# def create_user():
#     user = {
#         'name':request.form["name"],
#         'id':request.form["id"]
#     }
#     db.users.insert_one(user)

# like/unlike
@app.route('/mainpage', methods=["POST"])
def set_like():
    like_receive = request.form['like_give']
    db.all_feeds.update_one({'image': '한장원'}, {'$set': {'like': like_receive}})
    print(like_receive)
    return jsonify({'msg': '좋아요'})



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)