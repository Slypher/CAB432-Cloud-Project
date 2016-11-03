$( document ).ready(sendPoll());
$( document ).ready(populateQueryBox());

function sendPoll(){
    console.log('Sent poll');
    $.ajax({
        url: '/',
        data: { 'queries': getParameter('queries') },
        contentType: 'application/json',
        error: function (data) {
            console.log('--- ERROR ---');
            console.log(data);
            setTimeout(sendPoll, 5000);
        },
        success: function (data) {
            console.log('Received ' + data.tweets.length + ' tweets');
            setTimeout(sendPoll, 5000);
            $(document).ready(function() {
                for (var i = 0; i < data.tweets.length; i++) {
                    var $last_tweet = $('#tweet_container').children().last();
                    var $new_tweet = $last_tweet.clone();
                    $new_tweet.find('#tweet_text').html(data.tweets[i].text);
                    $('#tweet_container').append($new_tweet);
                }
            });
        }
    });
}

function getParameter(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function populateQueryBox() {
    var queries = getParameter('queries');
    if (queries !== '') $( document ).ready(function() { document.getElementsByName('queries')[0].value = queries; });
}