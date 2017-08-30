// Require Nodejs v4+
require('reify');
require('async-to-gen/register');
// index.js
const Weixinbot = require('weixinbot');
const qrcode = require('qrcode-terminal');
const functionlib	=	require('./lib/function');
const config		=	require("./data/conf").config;
const CODES		=	require("./data/conf").CODES;	
const MongoDB           =       require("./lib/mongodb").MongoDB;
const MongoClient       =       new MongoDB(config.mongohost);
// will send qrcode to your email address
global.bot = new Weixinbot({receiver:'yingjiechen@live.cn'});
global.usercode_username           =       {};
function usercode_username_handle(contactlist){
        contactlist.map(function(item,index){
		var string              =       item.HeadImgUrl;
		var result              =       /seq=(.+?)&/.exec(string);
		item.contactcode        =       result[1];
                global.usercode_username[item.contactcode]     =       item.UserName;
        });
}
function initinterval(contactlist){
	functionlib.intervalmessage(contactlist);
	var ids		=	[];
	contactlist.map(function(item,index){
		ids.push(item.id);
	});
	//更新数据
	var whereStr	=	{_id:{$in:ids}};
	var updateStr 	=	{$set:{"is_sent":true}};
	var MongoClient2 = require('mongodb').MongoClient;
	MongoClient2.connect(config.mongohost, function(err, db) {
		var collection = db.collection('intervalmessage');
		collection.update(whereStr,updateStr,{multi:true},function(err, result) {});
		db.close();
	});
}
// will emit when bot fetch a new qrcodeUrl
bot.on('qrcode', (qrcodeUrl) => {
	qrcode.generate(qrcodeUrl.replace('/qrcode/', '/l/'), console.log);
})
//contactlist
bot.on('contactlist', (contactlist) => {
	//contactlist.MemberList
	contactlist.then(function(result){
		usercode_username_handle(result.data.MemberList);
		//MongoClient.insertMany("contactlist",result.data.MemberList);
		//MongoClient.find("contactlist",{},{usercode:1},usercode_username_handle);
		setInterval(function(){
			//相应的函数 functionlib.intervalmessage
			MongoClient.findandupdate_group("intervalmessage",[{$match:{is_sent:false}},{$group:{_id:"$contactcode",content:{$first:"$content"},id:{$first:"$_id"}}}],{},initinterval);
		},config.intervalformessage);
	});
})
bot.on('friend', (msg) => {
	switch(msg.MsgType){
		case CODES.MM_DATA_STATUSNOTIFY:
		break;
		default:
			MongoClient.insert("chattinghistory",msg);
		break;
	}
})
bot.on('group', (msg) => {
	msg.RecommendInfo		=	null;
	msg.Group.MemberList       	=       null;
	MongoClient.insert("chattinghistory",msg);
        //bot.sendText(msg.FromUserName, msg.Content);
})
bot.run();
