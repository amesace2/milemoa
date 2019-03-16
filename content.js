console.log("milemoa content");
var saved_comments ={};

var is_first = 0;

function getPostID(url){
	var post_id = null;

  if(url == null){
    url = window.location.href;
  }
  url = new URL(url);
  //console.log("url:",url)
  var pathname = url.pathname;
  var urlParams = new URLSearchParams(url.search);
  var document_srl = urlParams.get('document_srl');
  if(document_srl != null){
    post_id = document_srl.toString();
  }else{
    var paths = pathname.split("/");
    if(paths[2] == "board" && paths[3] != null){
  	  post_id = paths[3].toString();
    }else{
      if(Number.isInteger(parseInt(paths[2]))){
        post_id = paths[2].toString();
      }
    }
  }
  //console.log("post_id:"+post_id);
	return post_id
}

function findComments(){
	var post_id = getPostID();
	var post = {};
  var comments = jQuery("#comments > .lb-cm");
	//console.log(comments);
	for(var i=0;i<comments.length;i++){
		var comment = comments[i];
		console.log("comment_id:"+comment.id);
		comment_id = comment.id.replace('comment_','');;
		if(saved_comments[comment_id] == null){
			console.log("unsaved");
			if(is_first == 0){
				jQuery("#"+comment.id +" > .lb-cm-body").css("border","#ffbf00 1px solid");
			}
			saved_comments[comment_id] = 1;
		}
	}
	save_data = {};
	save_data[post_id] = saved_comments;
	chrome.storage.local.set(save_data,function() {
          console.log('saved');
        });
	chrome.storage.local.get([post_id], function(result) {
          console.log('loaded');
        });


}

function findCommentDetail(){
    var post_id = getPostID();
    var save_data ={}
    comment_count = jQuery("#comments").children(".lb-bar").children("h2.lb-bar-h2").children(".lb-comments").children("span.lb-i-hack")[0].innerText;
    console.log("comment_count",comment_count);
    subdata = {};
    subdata["comment_count"] = parseInt(comment_count);
    save_data["post_"+post_id] = subdata;

    chrome.storage.local.set(save_data,function() {
        console.log('saved');
    });
}

function viewCommentCount(list,post_hash){
  console.log("viewCommentCount");
  for(var i=0;i<list.length;i++){
    post_list = list[i];
    var post_id = getPostID(post_list.href);
    post = post_hash["post_"+post_id];
    if(post != null){
      console.log("saved comment",post_id);
      saved_comment_count = post["comment_count"];
      //console.log(post_list);
      list_dom = jQuery(post_list).parent().parent().children("span.lb-in-count").children("a")[0];
      if(list_dom != null){
        list_comment_count = parseInt(list_dom.innerText);
        //console.log(saved_comment_count,list_comment_count);
        
        if(saved_comment_count != list_comment_count){
          jQuery(post_list).parent().parent().children("span.lb-in-count").children("a").css("background-color","#da6969");
        }else{
          jQuery(post_list).parent().parent().children("span.lb-in-count").children("a").css("background-color","#bdb252");
        }
      }
    }
  }
}

function updateList(){
  var list = jQuery("a.lb-in-title");
  var post_list = [];
  var post_result = {};
  
  if(list != null){
    for(var i = 0;i<list.length;i++){
      post = list[i];
      //console.log(post);
      url = post.href;
      //console.log("post url:",url);
      var post_id = getPostID(url);
      post_list.push("post_"+post_id);
    }
    //console.log(post_list);
    chrome.storage.local.get(post_list, function(result) {
      viewCommentCount(list,result)
    });
  }
}

function loadComments(){
	var post_id = getPostID();
  if(post_id != null){
  	chrome.storage.local.get([post_id], function(result) {
      	console.log("load comments");
      	saved_comments = result[post_id];
      	if(saved_comments == undefined){
      		saved_comments = {};
      		is_first = 1;
      	}
      	//console.log(saved_comments);
      	is_first = 0;
        findComments();
        findCommentDetail();
        updateList();
      });
    
  }else{
    updateList();
  }
}

loadComments();

