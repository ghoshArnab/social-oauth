var oauthurl = 'https://accounts.google.com/o/oauth2/auth?';
var validurl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var params = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
var clientId = '603701886524-ji5vqm31363ocjkea93atj5inms18vb6.apps.googleusercontent.com';
var redirectURL = 'https://github.com/ghoshArnab'
var LOGOUT = 'http://accounts.google.com/Logout';
var token = 'token';
var _url = oauthurl + 'scope=' + params + '&client_id=' + clientId + '&redirect_uri=' + redirectURL + '&response_type=' + token;
var acToken;
var tokenType;
var expiresIn;
var user;
var loggedIn = false;

$('#google-login-button').on('click', function(event) {
    event.preventDefault();
    var win = window.open(_url, "windowname", 'width=800, height=600');

    
            if (win.document.URL.indexOf(redirectURL) != -1) {
                var url = win.document.URL;
                acToken = gup(url, 'access_token');
                tokenType = gup(url, 'token_type');
                expiresIn = gup(url, 'expires_in');
                win.close();

                validateToken(acToken);
            }
       
});

function validateToken(token) {
    $.ajax({
        url: validurl + token,
        data: null,
        success: function(responseText) {
            getUserInfo();
            loggedIn = true;
            $('#google-login-button').hide();
            $('#google-logout-button').show();
        },
        dataType: "jsonp"
    });
}

function getUserInfo() {
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
        data: null,
        success: function(resp) {
            user = resp;
            $('#username').text('Welcome ' + user.name);
            $('#imgHolder').attr('src', user.picture);
        },
        dataType: "jsonp"
    });
}

//credits: http://www.netlobo.com/url_query_string_javascript.html
function gup(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\#&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results == null)
        return "";
    else
        return results[1];
}

function startLogoutPolling() {
    $('#google-login-button').show();
    $('#google-logout-button').hide();
    loggedIn = false;
    $('#username').text('Welcome ');
    $('#imgHolder').attr('src', '');
}
