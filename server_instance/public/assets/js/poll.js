$( document ).ready(sendPoll());

function sendPoll(){
    $.ajax({
        url: '/',
        dataType: 'json',
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