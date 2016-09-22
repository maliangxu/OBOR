/*  by lc--2015-3-12
	上传文件至服务器某个文件夹下
	说明:
	1、支持多文件上传
	2、支持一次性上传2G以内大小的文件 
	3、依赖于jquery

*/

//上传文件至服务器
gEcnu.Upload = gClass.extend({
	init:function (files,path){
		//this.requrl="http://"+gEcnu.config.webHostIP+":"+gEcnu.config.port+"/fileserver?req=putstream&path="+path;
		//this.requrl=gEcnu.config.geoserver+"fileserver?req=putstream&path="+path;
		this.requrl=gEcnu.config.geoserver+"fileserver?req=put&path="+path;
		this.uploadSizeByBlock=1000*1000*1; //分块上传时,每次上传的文件块的大小（2M）
		this.files=files;
		this.inum=0;
		this.itotal=0;
		this.uploaded=0; 
		this.abortFlag=false; //取消的标志
		this.totalFileSize=this._getFilesize();
	},
	processAscyn:function(succ,fail){  //可选参数
		this.fileCount=0;
		this.succCallback= arguments[0] ? arguments[0] : function (){ };
		this.failCallback= arguments[1] ? arguments[1] : function (){ };
		var files=this.files;
		if(!files.length) {
		        alert('请选择文件');
		        return false;
		}
        	this._uploadFile(); 
	},
	_uploadFile:function (){
		var files=this.files;
		var fileNum=files.length;
		if(this.fileCount > fileNum-1){ 
        	this.succCallback();
        	return;
        }
		var file=files[this.fileCount];
		var filelen=file.size;
		if(filelen>1024*1024*1024*2){
		  alert('文件太大');
		  return false;
		}
		// if(this.abortFlag){ alert('abort'); return ;}   //取消上传
		var blobsize=this.uploadSizeByBlock; //每次上传的文件块的大小（1M）,改小这个值可以精细显示上传进度，但会增加http请求数，降低上传效率。
		var blobnum=filelen/blobsize;  //需要分几块上传
		this.inum=0;
		this.itotal=blobnum;
	    this._uploadblob(file,0,blobsize-1);//从第一块开始上传，上传成功的事件里调用下一块文件上传。这样可以确保逐个块上传。
	},
	_uploadblob:function (file,start,end){
		var self=this;
        var reader= new FileReader();
        if(end>=file.size) { end=file.size-1; }
        if(start>end) return;
        var blobsize=end-start+1;
        var blob;
	  	if(file.webkitSlice){
	  	      blob = file.webkitSlice(start, end + 1);
	  	  } else if(file.mozSlice) {
	  	      blob = file.mozSlice(start, end + 1);
	  	  } else if(file.slice) {
	  	      blob = file.slice(start, end + 1);
	  	  }
	  	  if(this.abortFlag){  return ;}   //取消上传
	  	reader.onloadend = function () {
	  	var requrl=self.requrl+"&fn="+file.name;
		// var requrl="http://webgis.ecnu.edu.cn:85/fileserver?req=putstream&path=自定义的路径&fn="+file.name;
		$.ajax({
			async:true,// false 确保同步调用, 也可为true 
			url:requrl,
			type:'POST',
			contentType:'application/octet-stream', //（ 二进制流，不知道下载文件类型）文件扩展名为 .*
			processData:false,
			headers: {  //主要信息放在url上，次要参数放在这里，次要参数的值不能有中文,	若需要中文以后再说;后期将支持用户权限，需要再这里加入一个类似userkey:xxxxxxxx的内容
	    	        "filesize":file.size,
	    	        "start":start,
	    	        "blobsize":blobsize
        	        },
			data:this.result,
			success:function (){
					blob=null;
		        	this.result=null;//这两行避免浏览器内存泄漏
		    	    self.inum++;
		    	    self.uploaded=self.uploaded+blobsize;
		    	    self.onProgress(self.uploaded,self.totalFileSize);
				if(self.inum > self.itotal){
					self.fileCount++;
					self._uploadFile();

				}else {
					self._uploadblob(file,self.inum*blobsize,(self.inum+1)*blobsize-1); //	在这里调用可以确保逐个执行readAsArrayBuffer方法，若有更好的确保方法就取代这个方法。
				   } 
			},
			error:function (){
				self.failCallback();
			}
			});	
	  	};    
        reader.readAsArrayBuffer(blob); //此步是异步方式，应该逐个调用此方法，否则大型文件会导致浏览器崩溃
    },
    events:{
    	on:function (evtType,callback){
    		switch (evtType){
    			case "onProgress":
    			if(callback) {
    				gEcnu.Upload.prototype.onProgress = function (uploaded,totalsize) {
                  	  callback(uploaded,totalsize);
                  }
    			}
    			break;
    		}
    	}
    },
    _getFilesize:function (){
    	var files=this.files;
    	var size=0;
    	if(!files.length){ return 0;}
    	for(var i=0,len=files.length;i<len;i++){
    		size+=files[i].size;
    	}
    	return size;
    },
    //取消文件上传
    abort:function (){
    	this.abortFlag=true;
    },
	// showProgressBar:function (progressDiv){
	// 	this.progressBar=progressDiv;
	// 	progressDiv.style='width:100px;height:20px;border:1px solid #333';
	// },
	/**设置上传的参数
	* @param uploadSize 分块上传时一次上传的文件大小
	*/
	setParam:function (uploadSize){
		this.uploadSizeByBlock=sliceSize;
	}
});
gEcnu.Upload.prototype.onProgress=function (){

};

//上传文件（表格数据）至数据库 //文件名的唯一性，防止重名覆盖（待解决）
gEcnu.UploadCSVToDB=gClass.extend({
	init:function (file){
		this.file=file;
	},
	processAscyn:function (succ,fail){  //可选参数
		this.succCallback= succ;
		this.failCallback= fail;
		var file=this.file;
  		var filename=file.name.split(".")[0]; 
  		var self=this;
  		var reader = new FileReader(); 
  		reader.readAsText(file,'UTF-8'); 
  		reader.onload=function(){ 
  		    var bigdata=this.result;  
  		    self._read2DB(filename,bigdata);
  		}
	},
	_read2DB:function (tabname,data){
		var self=this;
  		var arr=data.split(/\r\n/);  
  		if(arr.length<1){ return;} 
  		var fields=arr[0];  //首行：字段信息
  		self._createDBTab(tabname,fields,function (){
  			//self._recordTab();  //追加至记录表
  		  	self._insert2DBTab(tabname,arr);
  		});
	},
	_createDBTab:function (tabname,fields,callback){
  		var websqlUrl=gEcnu.config.geoserver+"WebSQL";
  		var failCallback=this.failCallback;
  		var fldstr=fields;
  		var sql="create table if not exists "+tabname+" ("+fldstr+")";
  		var sqlexecParams={
  		  "mt":"SQLExec",
  		  "GeoDB":'publicdb',
  		  "SQL":sql
  		  }
  		var datastr = JSON.stringify(sqlexecParams);
  		var params = { req: datastr };
  		try{
  		  gEcnu.Util.ajax("POST", websqlUrl, params, true,function (msg){
  		    if(callback!=undefined){
  		      callback();
  		    }
  		  });
  		} catch(e){
  		  if(failCallback!=undefined){
  		    failCallback();
    		}
  		}
	},
	_insert2DBTab:function (tabname,data){
 		var websqlUrl=gEcnu.config.geoserver+"WebSQL";
 		var succCallback=this.succCallback;
 		var fail=this.failCallback;
 		if(data.length<=1){return;}  //data ["id,name","1,hello"]
 		var fileds=data[0].split(",");
 		var dataArr=[];
 		for(var i=1,len=data.length;i<len;i++){
 		  var str=data[i]; 
 		  if(str!=''){
 		    var arr=str.split(",");
 		    // for(var j=0,arrLen=arr.length;j<arrLen;j++){
 		    // 	arr[j]=escape(arr[j]);
 		    // }
 		    dataArr.push(arr);
 		  }
 		}
 		var addParams={
 		  "mt":"SQLInsert",
 		  "GeoDB":"publicdb",
 		  "tablename":tabname,
 		  "fldnames":fileds,
 		  "data":dataArr
 		  };
 		var datastr = JSON.stringify(addParams);
 		var params = { req: datastr};
 		try{
    		gEcnu.Util.ajax("POST", websqlUrl, params, true,function (msg){
    			console.log('写入到数据库中');
    			if(succCallback!=undefined){
    				succCallback();
    			}
    		});
  		} catch(e){
  			if(fail!=undefined){
  				fail();
  			}
  		}
	}

	});