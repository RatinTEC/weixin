function AI(msg){
	//这里要想小冰发送相应的信息
	//小冰的 contactcode
	var content	=	msg.Content;
	global.bot.sendText(global.usercode_username["649583950"],content);
}
exports.AI	=	AI;
