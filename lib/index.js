var MongoDB	=	require("./mongodb").MongoDB;
var MongoClient	=	new MongoDB("mongodb://127.0.0.1:27017/weixin");
function usercode_username_handle(result){
	console.log(result);
}
MongoClient.findandupdate_group("intervalmessage",[{$match:{is_sent:false}},{$group:{_id:"contactcode",content:{$first:"$content"},id:{$first:"$_id"}}}],{},usercode_username_handle);
