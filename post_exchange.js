let base_url = `http://146.185.154.90:8000/blog/`
let first_email = `sheersound90@gmail.com`

async function makeRequest(url, method = 'GET') {
    let response = await fetch(url, {method});

    if (response.ok) {
        return await response.json();
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function onError(error) {
    console.log(error);
}

async function onClick(event) {
    let url = `${base_url}${first_email}/profile`

    try {
        let {firstName, lastName} = await makeRequest(url);
        $('.profile').append(
            `${firstName} ${lastName}`
        );
        let get_first_name = document.getElementById('firstName');
        let get_last_name = document.getElementById('lastName');
        get_first_name.value = `${firstName}`;
        get_last_name.value = `${lastName}`;
        getPosts();
    } catch (error) {
        onError(error);
    }
}


function getPosts() {
    function updatedPosts() {
        $.ajax({
            url: `${base_url}${first_email}/posts`,
            method: 'GET',
            success: function (data) {
                posts = '';
                data.sort(function (a, b) {
                    let dateA = new Date(a.datetime), dateB = new Date(b.datetime)
                    return dateB - dateA
                });
                data.forEach(function (message, num) {
                    if (num < 20) {
                        let create_div = document.createElement('div')
                        create_div.classList.add('card')
                        create_div.classList.add('messages')
                        posts += `<div class="card-body col mt-3" style="border: 2px solid #c74661;">
                                        <h5 class="card-title">${message.user.firstName} ${message.user.lastName} said:</h5>
                                        <p class="message">${message.message}</p>
                                       </div>`
                    }
                });
                $('#person_post').html(posts);
            }
        })
    }

    setTimeout(updatedPosts, 0);
    setInterval(updatedPosts, 2000);
}


async function onclickEdit(event) {
    event.stopPropagation();
    event.preventDefault();
    let url = `${base_url}${first_email}/profile`

    try {
        let get_first_name = document.getElementById('firstName');
        let get_last_name = document.getElementById('lastName');
        let body = {
            firstName: get_first_name.value,
            lastName: get_last_name.value
        };
        let form = document.getElementById('form_user');
        let data = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(body),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        form.submit();
    } catch (error) {
        onError(error);
    }
}

async function onclickAddPost(event) {
    event.stopPropagation();
    event.preventDefault();
    let url = `${base_url}${first_email}/posts`

    try {
        let get_message = document.getElementById('get_message');
        let form = document.getElementById('message');
        let message = {
            message: get_message.value
        };
        let data = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(message),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        form.submit();
    } catch (error) {
        onError(error);
    }
}

async function onclickFollowUser(event) {
    event.stopPropagation();
    event.preventDefault();
    let url = `${base_url}${first_email}/subscribe`
    try {
        let get_follow = document.getElementById('email');
        let form = document.getElementById('sub_f');
        let follow = {
            email: get_follow.value
        };
        let data = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(follow),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        form.submit();
    } catch (error) {
        onError(error);
    }
}


window.addEventListener("load", function () {
    onClick()
    let user_form = document.getElementById('form_user');
    user_form.onsubmit = onclickEdit;
    let form_message = document.getElementById('message');
    form_message.onsubmit = onclickAddPost;
    let subscribe = document.getElementById('sub_f');
    subscribe.onsubmit = onclickFollowUser;
})