var getmessage		=	function(msg){
	var content	=	msg.Content;
	global.bot.sendText(global.usercode_username["667494611"],content);
}
exports.getmessage	=	getmessage;
