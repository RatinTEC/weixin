class MongoDB{
	constructor(connectionstring){
		this.MongoClient 	= 	require('mongodb').MongoClient;
		this.DB_CONN_STR 	= 	connectionstring;
	}
	insert(tablename,data){
		this.data               =       data;
		this.MongoClient.connect(this.DB_CONN_STR, function(err, db) {
			var collection = db.collection(tablename);
			//插入数据
			collection.insert(this.data, function(err, result){});
			db.close();
		}.bind(this));
	}
	insertMany(tablename,datas){
                this.MongoClient.connect(this.DB_CONN_STR, function(err, db) {
                        var collection = db.collection(tablename);
                        //插入数据
			datas.map(function(item,index){
				var string              =       item.HeadImgUrl;
				var result              =       /seq=(.+?)&/.exec(string);
				item.contactcode        =       result[1];
				collection.insert(item, function(err, result){});
			});
                        db.close();
                }.bind(this));
        }
	update(tablename,wherestr,newdata,options={multi:true,upsert:false}){
                this.MongoClient.connect(this.DB_CONN_STR, function(err, db) {
                        var collection = db.collection(tablename);
                        //插入数据
                        collection.update(wherestr,newdata,options,function(err, result){});
			db.close();
                }.bind(this));
	}
	remove(tablename,wherestr,options={justOne:false,}){
		this.MongoClient.connect(this.DB_CONN_STR, function(err, db) {
                        var collection = db.collection(tablename);
                        //插入数据
                        collection.remove(wherestr,options,function(err, result){});
                        db.close();
                }.bind(this));
	}
	find(tablename,wherestr){
		this.MongoClient.connect(this.DB_CONN_STR, function(err, db) {
                        var collection = db.collection(tablename);
                        //插入数据
			collection.find(wherestr).toArray(function(err, result) {
				console.log(result)
			});
                        db.close();
                }.bind(this));
	}
}

exports.MongoDB         =       MongoDB;
