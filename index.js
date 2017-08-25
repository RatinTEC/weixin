// Require Nodejs v4+
require('reify');
require('async-to-gen/register');
// index.js
const Weixinbot = require('weixinbot');
const qrcode = require('qrcode-terminal');

const config		=	require("./data/conf").config;
const CODES		=	require("./data/conf").CODES;	
const MongoDB           =       require("./lib/mongodb").MongoDB;
const MongoClient       =       new MongoDB(config.mongohost);
// will send qrcode to your email address
const bot = new Weixinbot({receiver:'yingjiechen@live.cn'});
// will emit when bot fetch a new qrcodeUrl
bot.on('qrcode', (qrcodeUrl) => {
	qrcode.generate(qrcodeUrl.replace('/qrcode/', '/l/'), console.log);
})
//contactlist
bot.on('contactlist', (contactlist) => {
	//contactlist.MemberList
	MongoClient.remove("contactlist",{});
	contactlist.then(function(result){
		MongoClient.insertMany("contactlist",result.data.MemberList);
	});
})
bot.on('friend', (msg) => {
	console.log(msg);
	switch(msg.MsgType){
		case CODES.MM_DATA_STATUSNOTIFY:
		break;
		default:
			MongoClient.insert("chattinghistory",msg);
		break;
	}
})

bot.on('group', (msg) => {
	console.log(msg);
	msg.RecommendInfo		=	null;
	msg.Group.MemberList       	=       null;
	MongoClient.insert("chattinghistory",msg);
        //bot.sendText(msg.FromUserName, msg.Content);
})
bot.run();
