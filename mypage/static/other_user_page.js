$(document).ready(function () {
            get_other_user_page()
        });

function returnpage(){
                window.history.go(-1);
}
function  reload(){
    location.reload()
}
function movepage(){
    location.href='https://www.naver.com'
}
function get_other_user_page(){
             $.ajax({
                type: "GET",
                url: "/other_user_page",
                data: {},
                success: function (response) {
                        let name = ['name']
                        let feed_count = ['feed_count']
                        let follower_count = ['follower']
                        let following_count = ['following']
                        let new_profile_image = document.createElement('profile_img');
                        let new_footer_image = document.createElement('footer_img');
                        let follow_status = ['follow_status']

                        let new_follow_btn = document.createElement('follow_button');
                    if (follow_status == 0) {
                        new_follow_btn.attr("class", "btn btn-light");
                        new_follow_btn.attr("onclick", "post_follow()");
                        new_follow_btn.text("팔로잉");
                        }
                    else if (follow_status == 1) {
                    new_follow_btn.attr("class", "btn btn-primary");
                    new_follow_btn.attr("onclick", "post_follow()");
                    new_follow_btn.text("팔로우");
                    }

                        new_profile_image.setAttribute('class', my-page-img1)
                        new_profile_image.src = ['image']

                        new_footer_image.setAttribute('class',my-page-img)
                        new_footer_image.src = ['image']

                        let introduce = ['introduce']
                        let temp_introduce = `<p style="margin-top: 0">${introduce}</p>`
                        let temp_name = `<b>${name}</b>`
                        let temp_feed_count = `<b>${feed_count}</b>`
                        let temp_follower_count = `<b>${follower_count}</b>`
                        let temp_following_count = `<b>${following_count}</b>`

                        $('#introduce').append(temp_introduce)
                        $('#nickname').append(temp_name)
                        $('#feed').append(temp_feed_count)
                        $('#follower_count').append(temp_follower_count)
                        $('#following_count').append(temp_following_count)
                        $('#my_footer_img').append(new_footer_image)
                        $('#profile-image').append(new_profile_image)
                        $('#follow_btn').append(new_follow_btn)
                }
            });
}

function post_follow(){
    let follower_count = ['follower']
    let follow_status = ['follow_status']

    follower_count += 1
    let btn_status = document.getElementById("follow_btn")
    let kid_btn_status = btn_status.childNodes
    if (kid_btn_status.getElementById("1") == 'btn btn-light')
    {
        follow_status += 1
        follower_count += 1
    }
    else if (kid_btn_status.getElementById("1") == 'btn btn-primary')
    {
        follow_status -= 1
        follower_count -= 1
    }
             $.ajax({
                type: "POST",
                url: "/other_user_page",
                data: {'follower_count' : follower_count, 'follow_status' : follow_status},
                success: function (response) {
                    alert('팔로우 완료!')
                    window.location.reload()
                    }
             })
    }