$(document).ready(function () {
            listing();
        });


        function listing() {
            $.ajax({
                        type: 'GET',
                        url: '/users',
                        data: {},
                        success: function (response) {
                            let user = response['user']
                            let name = user

                            let header_name_temp = `<b>${name}</b>`
                            $('#nickname').append(header_name_temp)
                        }
                    }
            )

            $.ajax({
                        type: 'GET',
                        url: '/mypage',
                        data: {},
                        success: function (response) {
                            let feed_count = response['feed_count']

                            let feed_count_temp = `
                                    <p><b>게시물</b></p>
                                    <p class=countmargin id = feed><b>${feed_count}</b></p>
                        `
                            $('#feed_count').append(feed_count_temp)
                        }
                    }
            )


            $.ajax({
                type: 'GET',
                url: '/mypage',
                data: {},
                success: function (response) {
                    let rows = response['my_feeds']
                    for (let i = 0; i < Math.ceil(3 / (rows.length)); i++) {
                        let new_feed_line = document.createElement('feed_line');
                        new_feed_line.setAttribute('class', "feed")
                        $('#content').append(new_feed_line)
                        for (let a = 0; a < 3; a++) {
                            let new_feed_img = document.createElement('feed_img');
                            new_feed_img.setAttribute('class', "feed_image")
                            new_feed_img.src = ['image']
                            $('.feed').append(new_feed_line)
                        }
                    }
                }
            })
        }
        function movepage(page){
            location.href = 'upload_page'
        }