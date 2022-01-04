// 이미지 업로드스크립트
function DropFile(dropAreaId, fileListId) {
  let dropArea = document.getElementById(dropAreaId);
  let fileList = document.getElementById(fileListId);

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight(e) {
    preventDefaults(e);
    dropArea.classList.add("highlight");
  }

  function unhighlight(e) {
    preventDefaults(e);
    dropArea.classList.remove("highlight");
  }

  function handleDrop(e) {
    unhighlight(e);
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);

    const fileList = document.getElementById(fileListId);
    if (fileList) {
      fileList.scrollTo({ top: fileList.scrollHeight });
    }
  }

  function handleFiles(files) {
    files = [...files];
    files.forEach(previewFile);
  }

  function previewFile(file) {
    console.log(file);
    renderFile(file);
  }

  function renderFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      let img = dropArea.getElementsByClassName("preview")[0];
      img.src = reader.result;
      img.style.display = "block";
    };
  }

  dropArea.addEventListener("dragenter", highlight, false);
  dropArea.addEventListener("dragover", highlight, false);
  dropArea.addEventListener("dragleave", unhighlight, false);
  dropArea.addEventListener("drop", handleDrop, false);

  return {
    handleFiles
  };
}

const dropFile = new DropFile("drop-file", "files");

//비밀번호 확인 스크립트
function check_pw() {
  var p1 = document.getElementById('password1').value;
  var p2 = document.getElementById('password2').value;
  if(p1 != p2) {
    document.getElementById('check').innerHTML = 'X'
    document.getElementById('check').style.color = 'red'
    document.getElementById('check').style.fontSize = "10vw"
  }
  else {
    document.getElementById('check').innerHTML = 'O'
    document.getElementById('check').style.color = 'green'
    document.getElementById('check').style.fontSize = "10vw"
  }
}

function register() {
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {
            email: $('#userid').val(),
            pw: $('#password2').val(),
            nickname: $('#usernick').val(),
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token']);
                alert('작성하신 이메일로 인증번호 발송하였습니다. 이메일 인증을 완료해주세요')
                window.location.href = '/register2'
            } else {
                alert(response['msg'])
            }
        }
    })
}

function confirmEmail() {
        $.ajax({
            type: "POST",
            url: "/api/checkemail",
            data: {
                email: $('#userid').val(),
            },
        success: function (response) {
            if (response['result'] == 'success') {
                alert('이메일 확인')
            } else {
                alert(response['msg'])
            }
        }
    })
}

function confirmNickname() {
        $.ajax({
            type: "POST",
            url: "/api/checknick",
            data: {
                nickname: $('#usernick').val(),
            },
        success: function (response) {
            if (response['result'] == 'success') {
                alert('닉네임 확인')
            } else {
                alert(response['msg'])
            }
        }
    })
}