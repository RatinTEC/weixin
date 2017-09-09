function initinterval(contactlist){
        intervalmessage(contactlist);
        var ids         =       [];
        contactlist.map(function(item,index){
                ids.push(item.id);
        });
        //更新数据
        var whereStr    =       {_id:{$in:ids}};
        var updateStr   =       {$set:{"is_sent":true}};
        var MongoClient2 = require('mongodb').MongoClient;
        MongoClient2.connect(global.config.mongohost, function(err, db) {
                var collection = db.collection('intervalmessage');
                collection.update(whereStr,updateStr,{multi:true},function(err, result) {});
                db.close();
        });
}
exports.initinterval        		=       initinterval;

function usercode_username_handle(contactlist){
        contactlist.map(function(item,index){
                var string              =       item.HeadImgUrl;
                var result              =       /seq=(.+?)&/.exec(string);
                item.contactcode        =       result[1];
                global.usercode_username[item.contactcode]     =       item.UserName;
        });
}
exports.usercode_username_handle	=	usercode_username_handle;

function intervalmessage(messagelist){
	//console.log(messagelist);
	if(messagelist.length>0){
		messagelist.map(function(item,index){
			//item._id	就是从当中查询出来的contactcode
			var contactcodes	=	[];
			var reg			=	/\[(.+?)\]/;
			if(item._id.search(reg)>-1){
				//在这里运行代码
				contactcodes	=	JSON.parse(item._id);
				for(var i=0;i<contactcodes.length;i++){
					global.bot.sendText(global.usercode_username[contactcodes[i]],item.content);
				}
			}else{
				global.bot.sendText(global.usercode_username[item._id],item.content);
			}
		});
	}
}
exports.intervalmessage		=	intervalmessage;

function msg_handle(datalist,msg){
	if(datalist.length>0){
		datalist.map(function(item,index){
			//循环搜索
			/*
				如果存在相应的记录
					循环
						如果有记录的字符串为空或者如果字符串当中存在关键字 执行
			*/
			if(item.content==""){
				var javascriptstring		=		"require('./function/"+item.module+"')."+item['function']+"(msg)";
				//require("./function/"+item.module).AI(msg);
				//console.log(javascriptstring);
				eval(javascriptstring);
			}else if(msg.content.indexOf(item.content)>-1){
				eval("require('./function/"+item.module+"')."+item['function']+"("+msg+")");
			}else{
				
			}
		});
	}
}
exports.msg_handle		=	msg_handle;
