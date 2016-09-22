


  //加载子模块：加载相应文件夹下的同名html、css
  //传入override//callback
  function loadModules(eleId,moduleName,override,callback){
  	var htmlPath='modules/'+moduleName+"/"+moduleName+".html";
  	var cssPath='modules/'+moduleName+"/"+moduleName+".css";
  	//var jsPath='modules/'+moduleName+"/"+moduleName+".js";
  	var bCover=arguments.length>2 ? arguments[2] :true;  //默认覆盖html
  	// var callOrBool=arguments.length>2 ? arguments[2];
  	loadFile(htmlPath,function (data){
  		if(bCover){
  			$("#"+eleId).html(data);  //覆盖
  		}else{
  			$("#"+eleId).append(data);  //追加
  		}
  		if(callback){
  			callback();
  		}
  		
  	});
  	if(!isExisted('css',cssPath)){
  		var link=document.createElement('link');
  		link.rel='stylesheet';
  		link.href=cssPath;
  		document.getElementsByTagName('head')[0].appendChild(link);
  	}  	
  }
  //请求相应的文件
  function loadFile(requrl,callback){
  	var succ=arguments.length>1 ? arguments[1] :function (){};
  	$.ajax({
  		type:'POST',
  		url:requrl,
  		async:true,   //同步加载
  		success:function (data){
  			succ(data);
  		}
  	});
  }
  //判断是否加载过js、css文件
  function isExisted(type,src){
  	var flag;
  	switch(type){
  		case "js":
  		flag=isExistScript(src); 
  		break;
  		case "css":
  		flag=isExistCss(src); 
  		break;
  	}
  	return flag;
  }
  function isExistScript(src){ 
  	var scripts=document.getElementsByTagName('script');
  	if(scripts==undefined){ return false;}
    for(var j=0,len=scripts.length;j<len;j++){ //注：返回的src含有域名  绝对路径
    	var tmpSrc=node.hasAttribute ? // non-IE6/7
      		node.src :node.getAttribute("src", 4); // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx        
    	var flag=matchStr(src,tmpSrc); 
    	if(flag){
    		return true;
    	}
    }
    return false;
  }
  function isExistCss(url){
  	var links=document.getElementsByTagName('link');
  	for(var i=0,len=links.length;i<len;i++){
  		var source=links[i].href;
  		var flag=matchStr(url,source);
  		if(flag){
  			return true;
  		}
  	}
  	return false;
  }
  //字符串匹配：targetStr待匹配字符串   
  function matchStr(targetStr,totalStr){
  	var reg=new RegExp(targetStr,'gi');
    if(reg.test(totalStr)){
      return true;
    }else{
    	return false;
    }
  }

  var util = {

    /*功能:1)去除字符串前后所有空格
    2)去除字符串中所有空格(包括中间空格,需要设置第2个参数为:g)*/
    Trim:function(str,is_global){
      var result; 
      result = str.replace(/(^\s+)|(\s+$)/g,""); 
      if(is_global){
        if(is_global.toLowerCase()=="g") 
        result = result.replace(/\s/g,""); 
      }
      return result; 
    },
    ifctrl:function(e){ //函数:判断键盘Ctrl按键
      var nav4 = window.Event ? true : false; //初始化变量
      if(nav4) { //对于Netscape浏览器
        //判断是否按下Ctrl按键
        if((typeof e.ctrlKey != 'undefined') ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK > 0) { 
          return true;
        } else {
          return false;
        }
      } else {
        //对于IE浏览器，判断是否按下Ctrl按键
        if(window.event.ctrlKey) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    ifshift:function(e){ //函数:判断键盘Shift按键
      var nav4 = window.Event ? true : false; //初始化变量
      if(nav4) { //对于Netscape浏览器
        //判断是否按下Ctrl按键
        if((typeof e.shiftKey != 'undefined') ? e.shiftKey : e.modifiers & Event.SHIFT_MASK > 0) { 
          return true;
        } else {
          return false;
        }
      } else {
        //对于IE浏览器，判断是否按下Ctrl按键
        if(window.event.shiftKey) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    stopDefaultAction:function(e){ //阻止默认行为
      if(e && e.preventDefault){
        e.preventDefault();
      }else{
        window.event.returnValue = false;
      }
    },
    /**
    * 拖动元素
    * @param  {[type]} divId      要拖动的元素的id
    * @param  {[type]} dragzoneId 拖动区域的id
    */
    dragDiv:function(divId,dragzoneId){
      var odiv=document.getElementById(divId);
      if(!odiv){ return;}
      var dragZone=document.getElementById(dragzoneId);
      dragZone.style.cursor='move';
      var odivWid_Px=odiv.currentStyle ? odiv.currentStyle['width'] : document.defaultView.getComputedStyle(odiv, null)['width'];
      var odivheignt_Px=odiv.currentStyle ? odiv.currentStyle['height'] : document.defaultView.getComputedStyle(odiv, null)['height'];
      var odivWid=odivWid_Px.substring(0,odivWid_Px.length-2);
      var odivh=odivheignt_Px.substring(0,odivheignt_Px.length-2);
      dragZone.onmousedown=function (e){  
        var dltx=e.clientX-odiv.offsetLeft;
        var dlty=e.clientY-odiv.offsetTop;
        document.onmousemove=function (e){  //绑定到document上
          var left=e.clientX-dltx;
          var top=e.clientY-dlty;
          /*if(left<0){
           left=0;
          }else if(left>document.body.clientWidth-odivWid){  
            left=document.body.clientWidth-odivWid;
           }
          if(top<0){
            top=0;
          }else if(top>document.body.clientHeight-odivh){
            top=document.body.clientHeight-odivh;
          }*/
          odiv.style.left=left+'px';
          odiv.style.top=top+'px';
        };
        document.onmouseup=function (e){
          document.onmousemove=null;
          document.onmouseup=null;
        };
      };
    },
    /**
    * 获取按键的值
    */
    getKeyCode:function(evt){
      var keyCode = evt.keyCode ? evt.keyCode 
      : evt.which ? evt.which : evt.charCode;
      return keyCode;
    },
    /**
    * 显示“加载中”的动画效果
    * @return {[type]} [description]
    */
    showLoading:function(){
      var loadingDiv = document.getElementById('_loadingDiv');
      if(loadingDiv){
        loadingDiv.style.display= 'block';
        //document.body.removeChild(loadingDiv);
        return;
      }
      var odiv = document.createElement('div');
      /*var img = new Image();
      img.src = gEcnu.config.imgPath+'wait.gif';
      odiv.id = '_loadingDiv';
      odiv.style.position = 'absolute';
      odiv.style.top = '50%';
      odiv.style.left = '45%';
      odiv.style.width = '100px';
      odiv.style.height = '100px';
      odiv.style.zIndex = '99999';
      odiv.appendChild(img);*/
  
      odiv.id = '_loadingDiv';
      odiv.style.position = 'absolute';
      odiv.style.top = '50%';
      odiv.style.left = '45%';
      odiv.style.width = '200px';
      odiv.style.height = '40px';
      odiv.style.zIndex = '99999';
      odiv.style.lineHeight = '40px';
      odiv.style.backgroundColor = '#757575';
      odiv.style.borderRadius = '20px';
   
      odiv.style.color = '#fff';
      odiv.style.textAlign = 'center';
      odiv.style.fontFamily = 'Microsoft YaHei';
      odiv.style.fontSize = '15px';
      odiv.style.letterSpacing = '1px';
      odiv.innerHTML = '数据加载中...';
      document.body.appendChild(odiv);
    },
    /**
    * 隐藏“加载中”的动画效果
    * @return {[type]} [description]
    */
    hideLoading:function(){
      var odiv = document.getElementById('_loadingDiv');
      if(odiv){
        odiv.style.display= 'none';
        //document.body.removeChild(odiv);
      }
    },
    mouseoverList:function(maxHgt,container){
      var maxBoxHgt = maxHgt;
      var list = container.find("ul");
      var height = list.height();       
      var multiplier = height / maxBoxHgt;
      var origHeight = 38;
      if (multiplier > 1) {
        container.css({height: maxBoxHgt,overflow: "hidden"}).on('mousemove',function(e){
          var offset = container.offset();
          var relativeY = ((e.pageY - offset.top) * multiplier) - (origHeight * multiplier);
          if (relativeY > origHeight) {
            list.css("top", -relativeY + origHeight);
          };
        });
      }else{
          container.css('height',list.height() + 4);
          container.off('mousemove');
      }
    },
    bindContext:function(context,fun,params){
      var len = arguments.length;
      var callArgs = [];
      if(len>2){
        for(var i=2;i<len;i++){
          callArgs.push(arguments[i]);
        }
      }     
      if(typeof fun=='function'){
        fun.apply(context,callArgs);
      }
    },
    mixin:function(dests,src,methods){
      if(!dests instanceof Array) dests = [dests];
      for (var i = 0; i < dests.length; i++) {
        var dest = dests[i];
        if(methods){
          if (typeof (methods) === 'string') methods = [methods];
          for (var j = 0; j < methods.length; j++) {
            var method = methods[j];
            if(method && !dest[method]){
              dest[method] = src[method];
            }
          };
          continue;
        }
        for (var prop in src) {
          if (!dest[prop]) {
              dest[prop] = src[prop];
          }
        }
      };
    },
    fldsArrTostring:function(arr){
      var fields='';
      for (var i = 0; i<arr.length; i++) {  
          if(i==0){
            fields+='['+arr[i]+']';
          }else{
            fields+=","+'['+arr[i]+']';
        }
      };
      return fields;
    },
    getCurrentStyle:function(){
      var style = null;     
      if(window.getComputedStyle) {
          style = window.getComputedStyle(node, null);
      }else{
          style = node.currentStyle;
      }     
      return style; 
    },
    minval:function(arr){
      if(arr.length==0) return 0;
      var min = arr[0];
      for (var i = 0; i < arr.length-1; i++) {
        var minval = Math.min(arr[i],arr[i+1]);
        if(minval<min)min = minval;   
      };
      return min;
    },
    maxval:function(arr){
      if(arr.length==0) return 0;
      var max = arr[0];
      for (var i = 0; i < arr.length-1; i++) {
        var maxval = Math.max(arr[i],arr[i+1]);
        if(maxval>max)max = maxval;   
      };
      return max;
    },
    showTipWin:function(tipmsg){
      var tipId = this._getTipWinId();
      $('#'+tipId).html(tipmsg);
      $('#'+tipId).fadeIn(0);
      $('#'+tipId).fadeOut(2000);
      $('#'+tipId).fadeTo(1000,0.9);
    },
    _getTipWinId:function(){
      return 'infoTipWin';
    },
    nameMap:{
      'Afghanistan':'阿富汗',
      'Angola':'安哥拉',
      'Albania':'阿尔巴尼亚',
      'United Arab Emirates':'阿联酋',
      'Argentina':'阿根廷',
      'Armenia':'亚美尼亚',
      'French Southern and Antarctic Lands':'法属南半球和南极领地',
      'Australia':'澳大利亚',
      'Austria':'奥地利',
      'Azerbaijan':'阿塞拜疆',
      'Burundi':'布隆迪',
      'Belgium':'比利时',
      'Benin':'贝宁',
      'Burkina Faso':'布基纳法索',
      'Bangladesh':'孟加拉国',
      'Bulgaria':'保加利亚',
      'The Bahamas':'巴哈马',
      'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那',
      'Belarus':'白俄罗斯',
      'Belize':'伯利兹',
      'Bermuda':'百慕大',
      'Bolivia':'玻利维亚',
      'Brazil':'巴西',
      'Brunei':'文莱',
      'Bhutan':'不丹',
      'Botswana':'博茨瓦纳',
      'Central African Republic':'中非共和国',
      'Canada':'加拿大',
      'Switzerland':'瑞士',
      'Chile':'智利',
      'China':'中国',
      'Ivory Coast':'象牙海岸',
      'Cameroon':'喀麦隆',
      'Democratic Republic of the Congo':'刚果民主共和国',
      'Republic of the Congo':'刚果共和国',
      'Colombia':'哥伦比亚',
      'Costa Rica':'哥斯达黎加',
      'Cuba':'古巴',
      'Northern Cyprus':'北塞浦路斯',
      'Cyprus':'塞浦路斯',
      'Czech Republic':'捷克共和国',
      'Germany':'德国',
      'Djibouti':'吉布提',
      'Denmark':'丹麦',
      'Dominican Republic':'多明尼加共和国',
      'Algeria':'阿尔及利亚',
      'Ecuador':'厄瓜多尔',
      'Egypt':'埃及',
      'Eritrea':'厄立特里亚',
      'Spain':'西班牙',
      'Estonia':'爱沙尼亚',
      'Ethiopia':'埃塞俄比亚',
      'Finland':'芬兰',
      'Fiji':'斐',
      'Falkland Islands':'福克兰群岛',
      'France':'法国',
      'Gabon':'加蓬',
      'United Kingdom':'英国',
      'Georgia':'格鲁吉亚',
      'Ghana':'加纳',
      'Guinea':'几内亚',
      'Gambia':'冈比亚',
      'Guinea Bissau':'几内亚比绍',
      'Equatorial Guinea':'赤道几内亚',
      'Greece':'希腊',
      'Greenland':'格陵兰',
      'Guatemala':'危地马拉',
      'French Guiana':'法属圭亚那',
      'Guyana':'圭亚那',
      'Honduras':'洪都拉斯',
      'Croatia':'克罗地亚',
      'Haiti':'海地',
      'Hungary':'匈牙利',
      'Indonesia':'印度尼西亚',
      'India':'印度',
      'Ireland':'爱尔兰',
      'Iran':'伊朗',
      'Iraq':'伊拉克',
      'Iceland':'冰岛',
      'Israel':'以色列',
      'Italy':'意大利',
      'Jamaica':'牙买加',
      'Jordan':'约旦',
      'Japan':'日本',
      'Kazakhstan':'哈萨克斯坦',
      'Kenya':'肯尼亚',
      'Kyrgyzstan':'吉尔吉斯斯坦',
      'Cambodia':'柬埔寨',
      'South Korea':'韩国',
      'Kosovo':'科索沃',
      'Kuwait':'科威特',
      'Laos':'老挝',
      'Lebanon':'黎巴嫩',
      'Liberia':'利比里亚',
      'Libya':'利比亚',
      'Sri Lanka':'斯里兰卡',
      'Lesotho':'莱索托',
      'Lithuania':'立陶宛',
      'Luxembourg':'卢森堡',
      'Latvia':'拉脱维亚',
      'Morocco':'摩洛哥',
      'Moldova':'摩尔多瓦',
      'Madagascar':'马达加斯加',
      'Mexico':'墨西哥',
      'Macedonia':'马其顿',
      'Mali':'马里',
      'Myanmar':'缅甸',
      'Montenegro':'黑山',
      'Mongolia':'蒙古',
      'Mozambique':'莫桑比克',
      'Mauritania':'毛里塔尼亚',
      'Malawi':'马拉维',
      'Malaysia':'马来西亚',
      'Namibia':'纳米比亚',
      'New Caledonia':'新喀里多尼亚',
      'Niger':'尼日尔',
      'Nigeria':'尼日利亚',
      'Nicaragua':'尼加拉瓜',
      'Netherlands':'荷兰',
      'Norway':'挪威',
      'Nepal':'尼泊尔',
      'New Zealand':'新西兰',
      'Oman':'阿曼',
      'Pakistan':'巴基斯坦',
      'Panama':'巴拿马',
      'Peru':'秘鲁',
      'Philippines':'菲律宾',
      'Papua New Guinea':'巴布亚新几内亚',
      'Poland':'波兰',
      'Puerto Rico':'波多黎各',
      'North Korea':'北朝鲜',
      'Portugal':'葡萄牙',
      'Paraguay':'巴拉圭',
      'Qatar':'卡塔尔',
      'Romania':'罗马尼亚',
      'Russia':'俄罗斯',
      'Rwanda':'卢旺达',
      'Western Sahara':'西撒哈拉',
      'Saudi Arabia':'沙特阿拉伯',
      'Sudan':'苏丹',
      'South Sudan':'南苏丹',
      'Senegal':'塞内加尔',
      'Solomon Islands':'所罗门群岛',
      'Sierra Leone':'塞拉利昂',
      'El Salvador':'萨尔瓦多',
      'Somaliland':'索马里兰',
      'Somalia':'索马里',
      'Republic of Serbia':'塞尔维亚共和国',
      'Suriname':'苏里南',
      'Slovakia':'斯洛伐克',
      'Slovenia':'斯洛文尼亚',
      'Sweden':'瑞典',
      'Swaziland':'斯威士兰',
      'Syria':'叙利亚',
      'Chad':'乍得',
      'Togo':'多哥',
      'Thailand':'泰国',
      'Tajikistan':'塔吉克斯坦',
      'Turkmenistan':'土库曼斯坦',
      'East Timor':'东帝汶',
      'Trinidad and Tobago':'特里尼达和多巴哥',
      'Tunisia':'突尼斯',
      'Turkey':'土耳其',
      'United Republic of Tanzania':'坦桑尼亚联合共和国',
      'Uganda':'乌干达',
      'Ukraine':'乌克兰',
      'Uruguay':'乌拉圭',
      'United States of America':'美国',
      'Uzbekistan':'乌兹别克斯坦',
      'Venezuela':'委内瑞拉',
      'Vietnam':'越南',
      'Vanuatu':'瓦努阿图',
      'West Bank':'西岸',
      'Yemen':'也门',
      'South Africa':'南非',
      'Zambia':'赞比亚',
      'Zimbabwe':'津巴布韦'
    }
  }
