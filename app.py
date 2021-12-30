from datetime import datetime

import gridfs
import io
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask import send_file
from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.sylvm.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.moomin

app = Flask(__name__)

# main
@app.route('/')
@app.route('/main_page')
def mainpage():
    return render_template('index.html')


## 모든 피드를 불러옴
@app.route("/mainpage", methods=["GET"])
def all_feed_get():
    all_feed_list = list(db.all_feeds.find({}, {'_id': False}))
    return jsonify({'all_feeds': all_feed_list})


# mypage
@app.route('/my_page')
def my_page():
    return render_template('mypage.html')


## 내가 쓴 글만 불러옴
@app.route("/mypage", methods=["GET"])
def feed_get():
    feed_list = list(db.my_feeds.find({}, {'_id': False}))
    return jsonify({'my_feeds': feed_list})


# upload
@app.route('/upload_page')
def upload_page():
    return render_template("upload_file.html")


# 게시물 업로드(날짜, 이름, 코멘트, 좋아요)
@app.route('/upload', methods=["POST"])
def upload():
    date = datetime.today().strftime("%m{} %d{}")
    date = date.format('월', '일')
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    like = False
    doc = {
        'date': date,
        'name': name_receive,
        'comment': comment_receive,
        'like': like
    }
    db.my_feeds.insert_one(doc)
    db.all_feeds.insert_one(doc)
    return jsonify({'msg': '저장 완료'})


# 이미지파일 업로드
@app.route('/upload_done', methods=["POST"])
def upload_done():
    file_user_receive = request.form['file_user']
    uploaded_files = request.files["file"]
    extension = uploaded_files.filename.split('.')[-1]
    mytime = datetime.today().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'{file_user_receive} - {mytime}'
    save_to = f'static/{filename}.{extension}'
    uploaded_files.save(save_to)


    doc = {'user': file_user_receive, 'img': f'{filename}.{extension}'}
    db.img.insert_one(doc)
    return render_template('upload.html')


# like/unlike
@app.route('/mainpage', methods=["POST"])
def set_like():
    like_receive = request.form['like_give']
    db.all_feeds.update_one({'name': '한장원'}, {'$set': {'like': like_receive}})  ## name 을 게시글만든 user로 바꿔야함
    print(like_receive)
    return jsonify({'msg': '좋아요'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
