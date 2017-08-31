// Require Nodejs v4+
require('reify');
require('async-to-gen/register');
// index.js
const Weixinbot = require('weixinbot');
const qrcode = require('qrcode-terminal');
const functionlib	=	require('./lib/function');
global.config		=	require("./data/conf").config;
const CODES		=	require("./data/conf").CODES;	
const MongoDB           =       require("./lib/mongodb").MongoDB;
const MongoClient       =       new MongoDB(config.mongohost);
// will send qrcode to your email address
global.bot = new Weixinbot({receiver:'yingjiechen@live.cn'});
global.usercode_username           =       {};
// will emit when bot fetch a new qrcodeUrl
bot.on('qrcode', (qrcodeUrl) => {
	qrcode.generate(qrcodeUrl.replace('/qrcode/', '/l/'), console.log);
});
//contactlist
bot.on('contactlist', (contactlist) => {
	//contactlist.MemberList
	contactlist.then(function(result){
		functionlib.usercode_username_handle(result.data.MemberList);
		//MongoClient.insertMany("contactlist",result.data.MemberList);
		//MongoClient.find("contactlist",{},{usercode:1},usercode_username_handle);
		setInterval(function(){
			//相应的函数 functionlib.intervalmessage
			MongoClient.findandupdate_group("intervalmessage",[{$match:{is_sent:false}},{$group:{_id:"$contactcode",content:{$first:"$content"},id:{$first:"$_id"}}}],{},functionlib.initinterval);
		},config.intervalformessage);
	});
});
bot.on('friend', (msg) => {
	var string              =       msg.Member.HeadImgUrl;
        var result              =       /seq=(.+?)&/.exec(string);
        var contactcode         =       result[1];
        MongoClient.find("msg_handle",{contactcode:contactcode,$or:[{content:""},{content:msg.content}]},{},functionlib.msg_handle,msg);
	switch(msg.MsgType){
		case CODES.MM_DATA_STATUSNOTIFY:
		break;
		default:
			MongoClient.insert("chattinghistory",msg);
		break;
	}
});
bot.on('group', (msg) => {
	msg.RecommendInfo		=	null;
	msg.Group.MemberList       	=       null;
	MongoClient.insert("chattinghistory",msg);
        //bot.sendText(msg.FromUserName, msg.Content);
	//这里增加相应的代码取得相应的 contactcode 之后,从数据库当中读取相应的记录
	//循环搜索
	/*
		如果存在相应的记录
			循环
				如果有记录的字符串为空或者如果字符串当中存在关键字 执行
	*/
	var string              =       msg.Group.HeadImgUrl;
	var result              =       /seq=(.+?)&/.exec(string);
	var contactcode        	=       result[1];
	MongoClient.find("msg_handle",{contactcode:contactcode,$or:[{content:""},{content:msg.content}]},{},functionlib.msg_handle,msg);
});
bot.run();
