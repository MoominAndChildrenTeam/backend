import codecs
from datetime import datetime
from bson.json_util import dumps
import fs as fs
from flask_mail import Mail, Message
import jwt
import random
from flask import Flask, render_template, request, jsonify, redirect, url_for
from pymongo import MongoClient
import hashlib

client = MongoClient('mongodb+srv://test:sparta@cluster0.sylvm.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.moomin

RANDOM_CHAR = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'
CHOISE_CHAR = ''

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'arrang20@gmail.com'
app.config['MAIL_PASSWORD'] = '####'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)
SECRET_KEY = 'fuckingFlask'

def send_mail(subject, sender, recipients, text_body):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    mail.send(msg)

def send_auth_email(email):
    try:
        global CHOISE_CHAR
        CHOISE_CHAR = "".join(random.sample(RANDOM_CHAR, 6))

        text = f'인증번호 : {CHOISE_CHAR}'
        send_mail('Moominstagram', sender='arrang20@gmail.com', recipients=[email], text_body=text)
        return True

    except:
        return False

def isLogin():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"email": payload['email']})
        return user_info
    except:
        return False

@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"email": payload['email']})
        return render_template('index1.html', nickname=user_info['nickname'], auth=user_info['auth'])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/register2')
def register2():
    return render_template('register2.html')



# api
@app.route('/api/register', methods=['POST'])
def api_register():
    email = request.form['email']
    nickname = request.form['nickname']
    pw = request.form['pw']

    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()

    if db.users.find_one({'email':email}):
        return jsonify({'result':'fail', 'msg': '가입된 이메일입니다.'})

    if db.users.find_one({'nickname':nickname}):
        return jsonify({'result':'fail', 'msg': '이미 존재하는 닉네임입니다.'})

    if send_auth_email(email) == False:
        return jsonify({'result': 'fail', 'msg': '올바른 이메일을 입력하세요'})

    doc = {
        'email': email,
        'nickname': nickname,
        'pw': pw_hash,
        'auth': False
    }

    db.users.insert_one(doc)

    # 로그인
    payload = {
        'email': email,
        # 'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=5000)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return jsonify({'result':'success', 'msg': '1차 회원가입 성공', 'token':token})


@app.route('/api/resend', methods=['POST'])
def api_resned():
    user_info = isLogin()
    if user_info:
        if send_auth_email(user_info['email']):
            return jsonify({'result': 'success', 'msg': '이메일 재전송'})
        else:
            return jsonify({'result': 'fail', 'msg': '이메일 재전송 실패 - 이메일 오류 '})
    else:
        return jsonify({'result': 'fail', 'msg': '로그인 first'})

@app.route('/api/register2', methods=['POST'])
def api_register2():
    user_checked = isLogin()
    if user_checked:
        EMAIL_AUTH_KEY = request.form['emailauth']
        if EMAIL_AUTH_KEY == CHOISE_CHAR:
            db.users.update_one(user_checked, {'$set': {'auth': True}})
            return jsonify({'result': 'success', 'msg': '이메일 인증 성공'})
        else:
            return jsonify({'result': 'fail', 'msg': '잘못된 인증번호 입니다.'})
    else:
        return jsonify({'result': 'fail', 'msg': '로그인 해주세요'})



@app.route('/api/login', methods=['POST'])
def api_login():
    email = request.form['id']
    pw = request.form['pw']

    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()

    doc = {
      'email': email,
      'pw': pw_hash
    }

    result = db.users.find_one(doc)

    print(result)

    if result is not None:
        payload = {
           'email': email,
           # 'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=5000)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})

    else:
       return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})




# main
@app.route('/main_page')
def mainpage():
    return render_template('main_page.html')


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
    img = db.img.find_one({'user':name_receive})
    like = False
    doc = {
        'date': date,
        'name': name_receive,
        'comment': comment_receive,
        'image': img['img'],
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
    like_user = db.all_feeds.find_one({'name'})
    db.all_feeds.update_one({'name': '한장원'}, {'$set': {'like': like_receive}})  ## name 을 게시글만든 user로 바꿔야함
    return jsonify({'msg': '좋아요'})




if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
