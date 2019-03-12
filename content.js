console.log("milemoa content");
var saved_comments ={};
var is_first = 0;
function getPostID(){
	var pathname = window.location.pathname;
	var paths = pathname.split("/");
	var post_id = paths[3].toString();
	console.log("post_id:"+post_id);
	return post_id
}

function findComments(){
	var post_id = getPostID();
	var comments = jQuery("#comments > .lb-cm");
	console.log(comments);
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
function saveComments(){

}
function loadComments(){
	var post_id = getPostID();
	chrome.storage.local.get([post_id], function(result) {
    	console.log("load comments");
    	saved_comments = result[post_id];
    	if(saved_comments == undefined){
    		saved_comments = {};
    		is_first = 1;
    	}
    	//console.log(saved_comments);
    	findComments();
    });
}

loadComments()

