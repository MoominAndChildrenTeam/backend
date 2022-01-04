window.onload = function () {
    /*댓글 입력 창 보이기, 숨기기*/
    let cmt = document.querySelector('.comment-btn');
    let cmt_container = document.querySelector('.comment-container')
    cmt.addEventListener('click', function () {
        cmt_container.classList.toggle('active');
    })

    /*좋아요 버튼 이미지 변경 일부 구현*/
    let likeBtn = document.querySelector('.like-btn');
    let like_cnt = 0;
    let liked_user_name = document.querySelector('.my-page-img-btn').getAttribute('alt')
    likeBtn.addEventListener('click', function () {
        /*
        likeBtn.src = '../../src/static/images/heart.png'
        like_cnt = 'True'
         */
        if (like_cnt === 0) {
            likeBtn.src = 'https://t1.daumcdn.net/cfile/blog/99A4FE405B9D71A414';
            like_cnt = 1;

            $.ajax({
                type: 'POST',
                url: '/main_page4',
                data: {liked_user_name_give: liked_user_name, like_cnt_give: like_cnt},
                success: function (response) {
                    alert(response['result'])
                }
            })
        } else if (like_cnt === 1) {
            likeBtn.src = '../static/images/like@3x.png';
            like_cnt = 0;

            $.ajax({
                type: 'POST',
                url: '/main_page4',
                data: {liked_user_name_give: liked_user_name, like_cnt_give: like_cnt},
                success: function (response) {
                    alert(response['result'])
                }
            })
        }
    })

    /*댓글 게시 버튼*/
    let cmt_register = document.querySelector('.comment-register');
    cmt_register.addEventListener('click', function () {
        /*    let comment_user_name = $('.my-page-img-btn').getAttribute('alt')*/
        let comment_user_name = $('.feed-user-name').innerText;
        let comment = $('.comment-content').val()

        $.ajax({
            type: "POST",
            url: "/main_page1",
            data: {name: comment_user_name, comment_give: comment},
            success: function (response) {
                alert(response["result"])
            }
        })
    })
}

/*
function comment_btn(){
    // let cmt = document.querySelector('.comment-btn');
    let cmt_container = document.querySelector('.comment-container');
    cmt_container.classList.toggle('active');
    console.log('success')
}
*/

function to_main() {
    location.href = "main_page"
}

function to_search() {
    location.href = 'search'
}

function to_upload() {
    location.href = 'write'
}

function to_favorite() {
    location.href = "../../favorite_page/templates/favorite_page.html"
}

function to_my_pg() {
    location.href = "my_page"
}

function to_user_pg() {
    location.href = 'other_user_page'
}

/*스토리 부분 스트롤 관련 참고 코드
const scroll = (direction) => {
    const instaStory = document.querySelector('.users-stories');
    let scrollAmount = 0;
    const slide = setInterval((e) => {
        if (direction === 'left') {
            instaStory.scrollLeft -= 15;
        } else {
            instaStory.scrollLeft += 15;
        }
        scrollAmount += 5;
        if (scrollAmount >= 100) {
            window.clearInterval(slide);
        }
    }, 20);
}
 */


/* 댓글 게시 버튼 클릭
let cmt_register = document.querySelector('.comment-register');
cmt_register.addEventListener('click', function () {
    /*
    const cmt_wrap = document.createElement('div.user-comment-wrapper')
    const cmt_user = document.createElement('p.comment-user-name')
    const cmt = document.createElement('p.comment')
    cmt_wrap.classList.add('cmt_wrap')
    cmt_user.classList.add('cmt_user')
    cmt.classList.add('cmt')
    cmt_wrap.appendChild(cmt_user)
    cmt_wrap.appendChild(cmt)
    cmt.textContent = $('.comment-content').val()
    let cmt_wrap = document.querySelector('.user-comment-wrapper')
    let cmt = $('.comment-content').val()
    let cmt_user = 'nickname'
    cmt_wrap.remove()
    document.createElement('div.user-comment-wrapper')
    $('.user-comment-wrapper').append(`<p class="comment-user-name">${cmt_user}</p>
                                       <p class="comment">${cmt}</p>`)
    $('.user-comment-box').append(`<div class="user-comment-wrapper"></div>`)
})
*/

function show_like() {
    $.ajax({
        type: 'GET',
        url: '/main_page3',
        data: {},
        success: function (response) {
            let like_feeds = response['like_feeds']
            for (let i = 0; i < like_feeds.length; i++) {
                let like_cnt = like_feeds[i]['like_cnt']
                if (like_cnt === 0) {
                    $('.like-btn').src = 'https://t1.daumcdn.net/cfile/blog/99A4FE405B9D71A414';
                } else if (like_cnt === 1) {
                    $('.like-btn').src = '../static/images/like@3x.png';
                }
            }
        }
    })
}

/*
if (like_cnt === 'False') {
    likeBtn.addEventListener('click', function () {
        like_cnt = 'True';
        likeBtn.src = '../../src/static/images/heart.png';
        return like_cnt;
    })
}
if (like_cnt === 'True') {
    likeBtn.addEventListener('click', function () {
        like_cnt = 'False';
        likeBtn.src = '../../src/static/images/like@3x.png';
        return like_cnt;
    })
}
 */
/*
likeBtn.addEventListener('click', function() {
    /*   const likedBtn = document.querySelector('.liked-btn');*/
/*
    if (likeBtn.style.display === 'none') {
        likeBtn.style.display = 'inline-block';
        likedBtn.style.display = 'none';
    } else {
        likeBtn.style.display = 'none';
        likedBtn.style.display = 'inline-block';
    }
    like_cnt = 'True';
    likeBtn.src = '../../src/static/images/heart.png';
    return like_cnt
})
likeBtn.addEventListener('click', function () {
    like_cnt = 'False';
    likeBtn.src = '../../src/static/images/like@3x.png'
    return like_cnt
})
*/

$(document).ready(function () {
    listing()
    /*show_feed()*/
    show_my_profile_btn()
    show_comment()
    show_like()
});

// function show_feed() {
//     $.ajax({
//         type: 'GET',
//         url: '/main_page',
//         data: {},
//         success: function (response) {
//             let feeds = response['feeds']
//             for (let i = 0; i < feeds.length; i++) {
//                 let feed_user_img = feeds[i]['feed_user_img']
//                 let feed_user_name = feeds[i]['feed_user_name']
//                 let user_uploaded_picture = feeds[i]['user_uploaded_picture']
//                 let feed_content = feeds[i]['feed_content']
//                 let comment_user_name = feeds[i]['comment_user_name']
//                 let comment = feeds[i]['comment']
//
//                 let temp_html = `<div class="user-name-and-img">
//                                     <div class="feed-user-img">
//                                         <img onclick="to_user_pg()" class="user-page-img-btn" src="${feed_user_img}"/>
//                                     </div>
//                                     <p class="feed-user-name">${feed_user_name}</p>
//                                  </div>
//                                  <img src="${user_uploaded_picture}">
//                                  <div class="active-btns-wrapper">
//                                      <img class="comment-btn" src="../images/comment@3x.png"/>
//                                      <img class="favorite-btn" src="../images/like@3x.png"/>
//                                  </div>
//                                  <div class="feed-content-box">
//                                      <p class="feed-user-name-of-content">${feed_user_name}</p>
//                                      <p class="feed-content">${feed_content}</p>
//                                  </div>
//                                  <div class="user-comment-wrapper">
//                                      <p class="comment-user-name">${comment_user_name}</p>
//                                      <p class="comment">${comment}</p>
//                                  </div>
//                                  <div class="feed-time-wrapper">
//                                     <p class="feed-time">6 hours age</p>
//                                 </div>`
//                 $('.feed').append(temp_html)
//             }
//         }
//     })
// }

function show_my_profile_btn() {
    $.ajax({
        type: 'GET',
        url: '/main_page',
        data: {},
        success: function (response) {
            let user_profile_name = response['nickname']
            let user_profile_imgs = response['user_profile_imgs']
            for (let i = 0; i < user_profile_imgs.length; i++) {
                let my_profile_img = user_profile_imgs[i]['my_profile_img']
                let temp_html = `<img class="my-page-img-btn" src="${my_profile_img}" alt="${user_profile_name}" onclick="to_my_pg()">`
                $('.mobile-footer').append(temp_html)
            }
        }
    })
}

function show_comment() {
    $.ajax({
        type: 'GET',
        url: '/main_page2',
        data: {},
        success: function (response) {
            let comments = response['comments']
            for (let i = 0; i < comments.length; i++) {
                let comment_user_name = comments[i]['nickname']
                let cmt = comments[i]['comment']

                let temp_html = `<div class="user-comment-wrapper">
                                    <p class="comment-user-name">${comment_user_name}</p>
                                    <p class="comment">${cmt}</p>
                                 </div>`
                $('.user-comment-box').append(temp_html)
            }
        }
    })
}

function listing() {
    $.ajax({
        type: 'GET',
        url: '/mainpage',
        data: {},
        success: function (response) {
            let rows = response['all_feeds']
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let date = rows[i]['date']
                let img = rows[i]['img']


                let temp_html = `<div class="user-name-and-img">
                                         <div class="feed-user-img">
                                             <button onclick="move_mypage()" class="user-page-img-btn"></button>
                                         </div>
                                         <p class="feed-user-name">${name}</p>
                                     </div>
                                     <img src="static/${img}">
                                     <div class="active-btns-wrapper">
                                         <img class="comment-btn" src="../static/images/comment@3x.png"/>
                                         <img class="like-btn" src="../static/images/like@3x.png"/>
                                     </div>
                                     <div class="feed-content-box">
                                         <p class="feed-user-name-of-content">${name}</p>
                                         <p class="feed-content">${comment}</p>
                                     </div>
                                     <div class="user-comment-box"></div>
                                     <div class="feed-time-wrapper">
                                         <time datetime="2021-12-30T01:26:43.000Z" class="feed-time">${date}</time>
                                     </div>
                                     <div class="comment-container">
                                         <input class="comment-content" placeholder="댓글 입력"/>
                                         <button class="comment-register">게시</button>
                                     </div>`
                $('#feed-box').append(temp_html)
            }
        }
    })
}