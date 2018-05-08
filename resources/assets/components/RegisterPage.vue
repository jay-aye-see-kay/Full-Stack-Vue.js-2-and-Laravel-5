<template>

<div id="register" class="register-container">
    <form role="form" action="/register" method="post">
        <input type="hidden" name="_token" :value="csrf_token">
        <div class="form-control">
            <input type="text" name="name" id="name" placeholder="Name" required autofocus>
        </div>
        <div class="form-control">
            <input type="text" name="email" id="email" placeholder="Email Address" required>
        </div>
        <div class="form-control">
            <input type="password" name="password" id="password" placeholder="Password" required>
        </div>
        <div class="form-control">
            <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Confirm Password" required>
        </div>
        <div class="form-control">
            <button type="submit">Register</button>
        </div>
    </form>
</div>
</template>

<script>
export default {
    data() {
        return {
            csrf_token: window.csrf_token,
        }
    }
}
</script>

<style>
#register form {
    padding-top: 40px;
}
@media (min-width: 744px) {
    #register form {
        padding-top: 80px;
    }
}
#register .form-control {
    margin-bottom: 1em;
}
#register input[type=text],
#register input[type=email],
#register input[type=password],
#register button,
#register label {
    width: 100%;
    font-size: 19px !important;
    line-height: 24px;
    color: #484848;
    font-weight: 300;
}
#register input {
    background-color: transparent;
    padding: 11px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    box-sizing:border-box
}
#register button {
    background-color: #4fc08d;
    color: #ffffff;
    cursor: pointer;
    border: #4fc08d;
    border-radius: 4px;
    padding-top: 12px;
    padding-bottom: 12px;
}
</style>
