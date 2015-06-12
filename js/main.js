var tags = new Stamplay.Cobject('post').Collection;
var user = new Stamplay.User().Model;


$(document).ready(function () {

  $('#login').on('click', function (e) {
    e.preventDefault();
    user.login('facebook').then(function () {
      return user.currentUser()
    }).then(function () {
      window.location.href = '/';
    });
  });

  $('#logout').on('click', function (e) {
    e.preventDefault();
    user.logout();
  })

  /* Checking if the user is logged */
  user.currentUser()
    .then(function () {
      var userId = user.get('_id');
      if (userId) {

        if (window.location.href.indexOf("contact") > -1) {
          $('#email').val(user.get('email'));
          $('#email').attr('disabled', 'disabled')
        }

        $('#login-btn').hide();
        /* Show submit button*/
        $('#submit-button').show();
        /* Show logout button*/
        $('#logout-btn').show();
        /* Retrieving the user's points */
        $.ajax({
          method: 'GET',
          url: '/api/gm/v0/challenges/hnkarma/userchallenges/' + userId,
          params: {
            select: 'points'
          },
          success: function (response) {
            $('#user-info').html(user.get('displayName') + '  ' + response.points + ' | ');
          }
        });

      } else {
        /* User is not logged*/
      }
    }).catch(function (err) {
      console.log('err during user fetch ', err);
    });

  /* Retrieving posts */
  var queryParam = {
    sort: '-actions.votes.total'
  };

  if (window.location.href.indexOf("item") > -1) {
    getPostDetail();
  } else if (window.location.href.indexOf("newest") > -1) {
    queryParam.sort = '-dt_create';
  } else if (window.location.href.indexOf("search") > -1) {
    var title = Utils.getParameterByName("title");
    queryParam.title = title;
  }
  getSortedPostList(tags, queryParam);
  $('#newest').css('font-weight', 'none');

});


function getPostDetail() {
  var postId = Utils.getParameterByName("id");
  var post = new Stamplay.Cobject('post').Model;
  post.fetch(postId).then(function () {
    var id = post.get('_id');
    var url = post.get('url');
    var title = post.get('title');
    var dt_create = post.get('dt_create');
    var commentLength = post.get('actions').comments.length;
    var votesLength = post.get('actions').votes.users_upvote.length;


    var tElem = '<tr><td><center><a href="#" class="voteelem" data-postid="' + id + '">';
    tElem += '<div class="votearrow" title="upvote"></div></a><span>';
    tElem += '</span></center></td><td class="title"><a href="' + url + '" target="_blank">';
    tElem += title + '</a><span class="comhead"> (' + Utils.getHostname(url) + ')';
    tElem += '</span></td></tr><tr><td colspan="1"></td><td class="subtext buffer-inserted">';
    tElem += '<span>' + votesLength + ' points</span> ' + Utils.formatDate(dt_create);
    tElem += ' </td></tr><tr style="height:10px"></tr><tr><td></td><td>';
    tElem += '<form id="submitcomment" data-postid="' + id + '" method="post" action="comment">';
    tElem += '<textarea name="text" rows="6" cols="60"></textarea><br><br>';
    tElem += '<input type="submit" value="add comment"></form></td></tr>';

    $('#postcontent').append(tElem);

    post.get('actions').comments.forEach(function (comment) {
      var comment = '<tr><td><table border="0"><tbody><tr><td></td><td valign="top"><center><a href="#"><div class="" title="upvote"></div></a><span id="down_7904745"></span></center></td><td class="default"><div style="margin-top:2px; margin-bottom:-10px; "><span class="comhead"><a href="#">' + comment.displayName + '</a> ' + Utils.formatDate(comment.dt_create) + '</span>    </div><br><span class="comment"><font color="#000000">' + comment.text + '</font></span></td></tr></tbody></table></td></tr>'
      $('#postcomments').append(comment)
    })

  }).catch(function (err) {
    console.log('errr', err);
  })
}

function getSortedPostList(tags, sort) {
  tags.instance = [];
  return tags.fetch(sort).then(function () {
    $('#newstable').html('');
    tags.instance.forEach(function (tag, count) {
      var id = tag.get('_id');
      var url = tag.get('url');
      var title = tag.get('title');
      var dt_create = tag.get('dt_create');
      var commentLength = tag.get('actions').comments.length;
      var votesLength = tag.get('actions').votes.users_upvote.length;

      var tElem = '<tr><td align="right" valign="top" class="title">' + count;
      tElem += '.</td><td><center><a href="#" class="voteelem" data-postid="' + id;
      tElem += '"><div class="votearrow" title="upvote"></div></a><span id="down_' + id;
      tElem += '"></span></center></td><td class="title"> <a href="' + url + '">';
      tElem += title + '</a><span class="comhead"> (' + Utils.getHostname(url) + ')';
      tElem += '</span></td></tr><tr><td colspan="2"></td><td class="subtext buffer-inserted"><span id="score_';
      tElem += id + '" data-score="' + votesLength + '">';
      tElem += votesLength + ' points</span> ' + Utils.formatDate(dt_create);
      tElem += '|<a href="item.html?id=' + id + '">' + commentLength;
      tElem += ' comments</a>|</td></tr><tr style="height:5px"></tr>';
      $('#newstable').append(tElem);
    });
  })
}

$("#sendnews").submit(function (event) {
  event.preventDefault();

  var title = $("input[name='title']").val();
  var url = $("input[name='url']").val();
  var description = $("#description").val();

  var newPost = new Stamplay.Cobject('post').Model;
  newPost.set('title', title);
  newPost.set('url', url);
  newPost.set('description', description);

  newPost.save().then(function () {
    window.location.href = "/index.html";
  });
});


$("#contactform").submit(function (event) {
  event.preventDefault();
  var email = $("#contactform input[name='email']").val();
  var message = $("#contactform textarea[name='message']").val();

  var newContactMessage = new Stamplay.Cobject('contact').Model;
  newContactMessage.set('email', email);
  newContactMessage.set('message', message);
  newContactMessage.save().then(function () {
    window.location.href = "/index.html";
  });

});


$('body').on('click', 'a.voteelem', function (e) {
  e.preventDefault();
  var postid = $(this).data('postid');

  var post = new Stamplay.Cobject('post').Model;
  post.set('_id', postid);
  post.upVote().then(function () {
    var score = $("#score_" + postid).data('score');
    score++;
    $("#score_" + postid).html(score + ' points');
  });
});

$('body').on('submit', '#submitcomment', function (e) {
  e.preventDefault();
  var postid = $(this).data('postid');
  var post = new Stamplay.Cobject('post').Model;
  post.set('_id', postid);
  var comment = $("textarea[name='text']").val();
  post.comment(comment).then(function () {
    document.location.reload(true);
  });


});