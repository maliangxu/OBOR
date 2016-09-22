//themeMap 专题图
var ThemeMap = {};
(function (){ 
	ThemeMap.addMap=_extendMapData; //扩展地图数据
	ThemeMap.Theme=Theme;     //专题图
	ThemeMap.setReqURL=_setRequrl; //设置请求专题图的url
	ThemeMap.setMapBgcolor=_setMapBgcolor;
	ThemeMap.getMapBgcolor=_getMapBg;
	ThemeMap.bgColor='#ccc';
	ThemeMap.requrl='ccgis.cn'; //
	ThemeMap.port='81';
	ThemeMap.ajaxType='GeoJson';  //GeoJson(编码的数据，需要解码后传给回调函数)、SQLDATA（sql查询）
	ThemeMap.name2GeoField={name:'name',geoField:'name',nameMapping:{}}; //name与指定字段（实际地名）的对应关系
	ThemeMap.GeoField2name={geoField:'name',name:'name',geoMapping:{}};  //实际地名与name的对应关系
	ThemeMap.map_geoNames=[];//默认的地图上各区域的地名（可能是真是地名 也能是代表的id）
	//ThemeMap.name2center={};  //{'闵行区':[121.36,31.26],....}
    ThemeMap.themeSucceed=null; // 专题图生成成功的回调
    ThemeMap._instance=null;  //地图上各区域
    configureEhart();  //配置文件

/**扩展地图数据 {geoDB:,ftSet:,sql:[optional],mapGeoField: name,mapname:[optional]}
*@param geoDB 数据库名
*@param ftSet 要素集名
*@param mapGeoField 指定的字段是地图上各区域的地名字段
*@param mapname:扩展的地图名 可选参数，默认是要素名（用户自定义，请求地图时用该名称，）
*@param sql：可选参数 默认是获取指定的ftSet中的所有要素
*/
function _extendMapData(paramObj){ 
		var db=paramObj.geoDB;
    	var ftset=paramObj.ftSet;
    	var sql=paramObj.sql || '';
    	var zip=paramObj.zip || false;  
    	var geofield=paramObj.mapGeoField ? paramObj.mapGeoField.split(',')[0] : '';
    	var mapname=paramObj.mapname || ftset;
    	// ThemeMap.name2GeoField.nameMapping=ThemeMap.GeoField2name.geoMapping={};
    	ThemeMap.name2GeoField.geoField=ThemeMap.GeoField2name.geoField=geofield!='' ? geofield: 'name';
   		
   		require('echarts/util/mapData/params').params[mapname] = {
   		//gl_mapParams[mapname] = {
    	getGeoJson: function (callback) { 
    		ThemeMap.ajaxType='GeoJson' ; 
    		var data={
    			"mt":"SQLQuery",
				"format":"geojson",
				"zip":'true',
				"geoDB":db,
				"ftSet":ftset,
				"sql":sql,
				"return":{"shape":1,"fields":geofield}
				};  
			var params={
    			req:JSON.stringify(data)
    		};        
    		//var url="https://"+ThemeMap.requrl+":"+ThemeMap.port+"/WebFeature";
    		var url="https://ccgis.cn/mapb/WebFeature";
    		_ajax('POST', url, params, true, callback);
    	}
 	 };   
}
//设置请求的url、port
function _setRequrl(url,port){
	ThemeMap.requrl=url;
	ThemeMap.port=port;
}
function _setMapBgcolor(color){
	ThemeMap.bgColor=color || '#ccc';
}
function _getMapBg(){
	return ThemeMap.bgColor;
}
//配置文件 引入依赖模块()
function configureEhart(callback){  
/*	require.config({
        paths: {  //配置路径
        echarts: '/mapb/common/js/lib'
         }
       });
    require([  //引入依赖模块
        'echarts',
        'echarts/chart/map',
        'echarts/chart/bar',
        'echarts/chart/pie'
         ],
        function (ec) { 
        	ThemeMap.echarts=ec;  
            if(callback!=undefined){
			 	callback(ec);
			}
           }
       );*/
	ThemeMap.echarts=echarts;
	if(callback!=undefined) callback(ec);  		 	
}
//专题图
function Theme(dom,option,callback){
	var self=this;
	var _callback;
	this._mapOption=option;
	this.bindOption={};  //绑定数据后的参数配置
	this.pieScript=false;  //是否引入pie脚本
	this.funnelScript=false;  //是否引入funnel脚本
	ThemeMap._instance=this;
	this.legend={pie:[],funnel:[]};
	// this.pieLgend=[];  
	// this.funnelLgend=[];

	if(arguments.length>2){
		_callback=callback;
		ThemeMap.themeSucceed=callback;
	}
		ThemeMap.map_geoNames=[];
		this.eChart =ThemeMap.echarts.init(dom);  
    	this.eChart.setOption(option);
    	this.eChart._hasPie=false;
    	this.eChart._hasFunnel=false;
		this.eChart.pieData=[];
		this.eChart.funnelData=[];
    	this.eChart.on('mapRoam',_mapRoam);  
    	//this.eChart.on('mapSelected',_mapSelected); 
}
//地图漫游
function _mapRoam(){   //console.log(this);   //this指向ECharts
	var theme=ThemeMap._instance; 
	var isHasPie=theme.eChart._hasPie;
	var isHasFunnel= theme.eChart._hasFunnel;
	var delSeries=[];
	var _option=this.getOption();
	var allSeries=_option.series;
	var funnelSeries=[]; 
	var pieSeries=[];
	for(var ss=0;ss<allSeries.length;ss++){    //获取专题图上的饼图、漏斗图
		var seriesFlag=allSeries[ss].seriesType;
		if(seriesFlag=='pie_series' || seriesFlag=='funnel_series'){
			delSeries.push(allSeries[ss]);  
		}
	}  
		//  先删除已有的饼图、漏斗图
	for(var i=0;i<delSeries.length;i++){
		var obj=delSeries[i];
		var index=_indexOfInArray(obj,allSeries); 
		if(index>=0){ 
			allSeries.splice(index,1);
		}
	}  
	_option.series=allSeries;
	if(isHasPie){
		_option=theme._getPieOption(_option);
	}
	if(isHasFunnel){
		_option= theme._getFunnelOption(_option);
	}
	theme.setOption(_option,true);  
}
Theme.prototype={
	/**绑定数据: 将指定的某些字段值绑定到地图上  作为专题图数据
	*@param {data:[] ,bindFields:[],keyField:'' ,geoField:[]}
	*@param bindFields是要绑定的字段[pop,gdp,..]
	*@param keyField为地域名字段，
	*@param geoField要绑定的区域['上海'，'北京'。。] 
	*@param //seriesOption用于设置新绑定数据的series中的其他参数，{roam:true}如是否允许漫游roam、是否显示图例颜色标识以及itemStyle等
	*@param isOverWrite 是否覆盖已有的数据  默认不覆盖
	*/
	bindData:function (options,isOverWrite){
		var self=this;
		var data=options.data || [];
		var bindflds=options.bindFields || [];
		var keyfld=options.keyField;
		var mapoptions=self.getOption();
		var series=mapoptions.series;
		var isOverWrite=arguments.length>1 ? isOverWrite: false;
		var dataRange_max=0;
		if(series!=undefined){
			var maptype=series[0].mapType; 
		}else{
			alert('未指定地图,请在series参数中指定地图');
			return;
		}
		var len=data.length;
		if(len<1){ return;}
		var mappingvalue=ThemeMap.GeoField2name.geoMapping; 
		var key_len=Object.keys(mappingvalue).length;
		var series=[];
		var keyfld_value=[];
		var series_Len=bindflds.length;
		for(var j=0;j<series_Len;j++){  //几个系列的数据
		var seriesName=bindflds[j];
		var bindData=[];
		for(var i=0;i<len;i++){
			var obj=data[i];
			var region=obj[keyfld]; 
			var regionName=region;
			if(key_len>0){
				regionName=mappingvalue[region];
			}
			var bindvalue=obj[seriesName];
			var record={name:regionName,value:bindvalue};
			bindData.push(record);
			}
			var tmpseries={name:seriesName,type:'map',mapType:maptype,data:bindData
            };
            
			series.push(tmpseries);
		}  
		var newLegend={data:bindflds}; //图例
		var chart_option=self.getOption();
		if(isOverWrite){
			chart_option.series=series;
			chart_option.legend.data=bindflds; 
		}else{
			chart_option.series=chart_option.series.concat(series);
			chart_option.legend.data=chart_option.legend.data.concat(bindflds);
		}
		this.bindOption=chart_option;		
	 },
	 setLegend: function (data){  //{data:[]}
	 	this.bindOption.legend.data = data;  
	 },
	 removeAllData:function (){
	 	var chart_option=this.getOption();
	 	var mapSeries=chart_option.series;
	 	for(var i=0,len=mapSeries.length;i<len;i++){
	 		if(mapSeries[i].type=='map'){
	 			mapSeries[i].data=[];
	 		}
	 	}
		if(chart_option.legend){
			chart_option.legend.data=[];
		}
		chart_option.dataRange={show:false};
        this.setOption(chart_option,true);
	 },
	 //绑定数据后执行刷新  参数option 配置其他参数
	refresh:function (){
	 	var options=this.bindOption || {}; 
	 	this.eChart.setOption(options,true);
	 },
	 //mapSelected、pieSelected、legendSelected、mapRoam、dblclick、resize
	 on:function (evtType,callback){ 
	 	this.eChart.on(evtType,callback);
	 },
	setOption:function (option,notMerge){ 
	 	if(arguments.length>1){
	 		this.eChart.setOption(option,notMerge);
	 	}else{
	 		this.eChart.setOption(option);
	 	}
	 },
	 setTimelineOption:function (){
	 },
	 setSeries:function (series, notMerge){
	 	if(arguments.length>1){
	 		this.eChart.setSeries(series, notMerge);
	 	}else{
	 		this.eChart.setSeries(series);
	 	}
	 },
	getOption:function (){
	 	return this.eChart.getOption(); //获取的克隆对象
	 },
	getSeries:function (){
	 	return this.eChart.getSeries();
	 },
	 //获取地图上所有区域名
	getGeoNames:function (){  
		return ThemeMap.map_geoNames;
	},
	getMaptype:function (){
		var _option=this.getOption();
		var series=_option.series; 
		var maptype='nomap';  
		if(series){
		for(var i=0,len=series.length;i<len;i++){
			var maptype=series[i].mapType;
			if(maptype){
				return maptype;
			}
		}
		}
		return maptype;
	},
	/**
	*@param maptype 地图名
	*@param pt 数组 地理坐标 [x,y]
	*/
	getPosByGeo:function(maptype,pt){   
		return this.eChart.chart.map.getPosByGeo(maptype,pt);
	},
	/** 添加饼图  pieArr:[param1,param2....]  param1 {name:,center:,radius:,roseType:,pieStyle:,showLegend:}形式如下
	*@param name：闵行区，
	*@param center:[x,y]  ||  '闵行区',  //使用地区中心坐标[x,y]或者地区name 根据name与地图上的地名进行匹配
	*@param data:{field:value,....},
	*@param radius: [R] | [R1,R2]  非环状饼图| 环状饼图  
	*@param roseType: 'radius'|  'area'   可选，生成玫瑰图时使用
	*@param pieStyle  {itemStyle：{}，}        其他的饼图样式设置 itemStyle、selectMode、markLine等
	*@param showLegend:bool,   //可选 是否显示饼图的图例
	*/
	addPies:function (pieArr){    
		var allSeries=this.getSeries();
		this.eChart._hasPie=true; 
		this.eChart.pieData=this.eChart.pieData.concat(pieArr);  //已添加的饼图数据 刷新时备用
        var option=this.getOption();
		var _option=this._getPieOption(option);	
		var isloadPie=this.pieScript;
		var theme=this;
		if(!isloadPie){
			/*require([  //引入依赖模块
        	'echarts/chart/pie'
        	 ],
        	function (ec,pie) {  
        		theme.pieScript=true;  
        		theme.setOption(_option,true);   
           }
       	);*/
			theme.pieScript=true;  
        	theme.setOption(_option,true);  
		}else{
			theme.setOption(_option,true);
		} 
	},
	//添加漏斗图
	addFunnel:function (funnelData){
		var allSeries=this.getSeries();
		this.eChart._hasFunnel=true; 
		this.eChart.funnelData=this.eChart.funnelData.concat(funnelData); 
		var theme=this;
		var option=this.getOption();
		var mapoption=this._getFunnelOption(option);
		var isloadFunnel=this.funnelScript;
		if(!isloadFunnel){   
			/*require(['echarts/chart/funnel'], function (ec,funnel) { //引入依赖模块
        		theme.funnelScript=true;  
        		theme.setOption(mapoption,true);   
            	}
        	);*/
			theme.funnelScript=true;  
        	theme.setOption(mapoption,true);  
		}else{
			theme.setOption(mapoption,true);
		}	
	},
	//清除地图上的饼图、漏斗图等
	clearChart:function (){
		if(this.eChart._hasPie){
			clearPies();
		}
		if(this.eChart._hasFunnel){
			clearFunnels();
		}
	},
	clearPies:function (){
		var pieLgend=this.legend.pie;
		var mapoption=this.getOption();
		var series=mapoption.series; 
		var newSeries=[];
		var mapLegend=mapoption.legend ? mapoption.legend.data :[];
		this.eChart._hasPie=false;
		this.eChart.pieData=[];
		for(var i=0;i<series.length;i++){   
			var pieFlag=series[i].seriesType;
			if(pieFlag!='pie_series'){
				newSeries.push(series[i]);
			}
		} 
		for(var ii=0;ii<pieLgend.length;ii++){
			for(var j=0;j<mapLegend.length;j++){
				if(mapLegend[j]==pieLgend[ii]){
					mapLegend.splice(j,1);
				}
			}
		} 
		
		mapoption.series=newSeries;
		if(mapoption.legend){
			mapoption.legend.data=mapLegend;
		}
		this.legend.pie=[];
		this.setOption(mapoption,true);  
	},
	clearFunnels:function (){
		var funnelLgend=this.legend.funnel;
		var mapoption=this.getOption();
		var series=mapoption.series; 
		var newSeries=[];
		this.eChart._hasFunnel=false;
		this.eChart.funnelData=[];
		var mapLegend=mapoption.legend ? mapoption.legend.data :[];
		for(var i=0;i<series.length;i++){   
			var Flag=series[i].seriesType;
			if(Flag!='funnel_series'){
				newSeries.push(series[i]);
			}
		}
		for(var ii=0;ii<funnelLgend.length;ii++){
			for(var j=0;j<mapLegend.length;j++){
				if(mapLegend[j]==funnelLgend[ii]){
					mapLegend.splice(j,1);
				}
			}
		} 
		mapoption.series=newSeries;
		if(mapoption.legend){
			mapoption.legend.data=mapLegend;
		}
		this.legend.funnel=[];
		this.setOption(mapoption,true);  
	},
	getName2center:function (){
		var maptype=this.getMaptype();
		var name2center={};
		//console.log(theme.eChart.chart.map._mapDataMap[maptype].transform);
		//console.log('pathArray',theme.eChart.chart.map._mapDataMap[maptype].pathArray);
		var pathArr=this.eChart.chart.map._mapDataMap[maptype].pathArray;
		for(var p=0,pathLen=pathArr.length;p<pathLen;p++){
			var field=ThemeMap.GeoField2name.geoField || 'name';
			var realname=pathArr[p].properties[field];
		 	var cxy=pathArr[p].center;
			name2center[realname]=cxy;
		}  console.log('name2center',name2center);
		return name2center;
	},
	//地图漫游--刷新
	_getPieOption:function (newoption){  
		var theme=this;
		var _option=newoption;
		if(!theme.eChart._hasPie){ return _option; }
		var pieArr=theme.eChart.pieData;
		var pieSeries_all=[]; 
		var pieLgend=[];   //_option.legend ? _option.legend.data || [] : []; 
		if(pieArr.length<1){   return _option;}
		var isshowLgend=pieArr[0].showLegend || false; 
		var maptype=theme.getMaptype();
		var name2center=this.getName2center();
		if(maptype=='nomap'){ return;}
		for(var i=0,len=pieArr.length;i<len;i++){
			var pieOptions=pieArr[i];
			var seriesName=pieOptions.name || '饼图';
			var _roseType=pieOptions.roseType ? pieOptions.roseType : '' ;
			var wxy=pieOptions.center; 
			if(!(wxy instanceof Array)){
				var centerXY=name2center[wxy];
				if(centerXY){
					wxy=centerXY;
				}else{
					continue;
				}
			}
			var radius=pieOptions.radius;  
			var screenXY=theme.getPosByGeo(maptype,[parseFloat(wxy[0]),parseFloat(wxy[1])]); 
			var data=pieOptions.data;
			var otherStyles=pieOptions.optionalStyle;
			var dataArr=[];
			var _pieRadius;
			if(radius.length==1){
				_pieRadius=radius[0];
			}else if(radius.length>1){
				_pieRadius=[radius[0],radius[1]];
			}
			for(var key in data){
			  	if(_indexOfInArray(key,pieLgend)<0){
			  		if(isshowLgend) pieLgend.push(key);
			  	}
				var obj={name:key,value:data[key]};
				dataArr.push(obj);
			}
			var _pieSeries={
				name:seriesName,
				type:'pie',
				roseType:_roseType,
				tooltip:{
        			trigger: 'item',
        			formatter: "{a} <br/>{b} : {c} ({d}%)"
    			},
        		center:[screenXY[0],screenXY[1]],
        		radius: _pieRadius,
        		data:dataArr,
        		seriesType:'pie_series'
			};
			_pieSeries['itemStyle']=otherStyles ? (otherStyles.itemStyle || {normal : {label : {show : false},labelLine : {show : false}}} ) : {normal : {label : {show : false},labelLine : {show : false}}};  //设置itemStyle的默认样式 
			if(otherStyles!=undefined){
				for(var key in otherStyles){
					_pieSeries[key]=otherStyles[key];
				}
			}
			pieSeries_all.push(_pieSeries);
		}  
		
		_option.series=_option.series.concat(pieSeries_all); 
		this.legend.pie=pieLgend;
		var newLegend=[];
		newLegend=newLegend.concat(pieLgend,this.legend.funnel);
		if(isshowLgend){  
			_option.legend=_option.legend || {orient: 'vertical', x:'left'};
			_option.legend.data=newLegend;
		} 
		return  _option; 
	},
	_getFunnelOption:function (newoption){
		var funnelData=this.eChart.funnelData;
		var maptype=this.getMaptype();
		var mapoption=newoption;  
		var isloadFunnel=this.funnelScript;
		var funnelSeries=[];
		var theme=this;
		var funnelLgend=[];
		var isshowLgend=funnelData[0].showLegend || false; 
		var name2center=this.getName2center();
		for(var i=0,len=funnelData.length;i<len;i++){
			var param=funnelData[i];
			var _name=param.name || '漏斗图';
			var size=param.size || {w:100,h:100};
			var wxy=param.position;
			// wxy= wxy instanceof Array ? wxy : ThemeMap.name2center[wxy];
			var data=param.data;
			var sort=param.sort || 'ascending';
			var optionalStyle=param.optionalStyle || {};
			var dataArr=[];
			var minValue=Number.POSITIVE_INFINITY;
			var maxValue=0;
			if(!(wxy instanceof Array)){  
				var centerXY=name2center[wxy];
				if(centerXY){
					wxy=centerXY;
				}else{
					continue;
				}
			}   
			var screenXY=this.getPosByGeo(maptype,[parseFloat(wxy[0]),parseFloat(wxy[1])]); 
			for(var key in data){
				if(_indexOfInArray(key,funnelLgend)<0){
			  		if(isshowLgend) funnelLgend.push(key);
			  	}
				var obj={name:key,value:data[key]};
				if(data[key]>maxValue){
				 	maxValue=data[key]; 
				  }
				  if(minValue>data[key]){
				  	minValue=data[key];
				  }
				dataArr.push(obj);
			}
			var curSeries={
				name:_name,
            	type:'funnel',
            	x:parseFloat(screenXY[0])-parseFloat(size.w)/2,
            	y:parseFloat(screenXY[1])-parseFloat(size.h)/2,
            	width: size.w || 40,
            	height:size.h || 60,
            	sort: sort,
            	data:dataArr,
            	min:minValue,
                max:maxValue,
                minSize:'0%',
                maxSize:'100%',
            	seriesType:'funnel_series'
			};
			if(!optionalStyle.itemStyle){
				optionalStyle.itemStyle={
					normal: {
                    label: { show: false},
                    labelLine: {show: false}
                },
                emphasis: {
                    label: {show: false,},
                    labelLine: {show: false}
                    }
				};
			}
			for(var key in optionalStyle){
				curSeries[key]=optionalStyle[key];
			}
			funnelSeries.push(curSeries);
		}
		this.legend.funnel=funnelLgend;
		var newLegend=[];
		newLegend=newLegend.concat(funnelLgend,this.legend.pie);
		mapoption.series=mapoption.series.concat(funnelSeries);
		if(isshowLgend){  
			mapoption.legend=mapoption.legend || {orient: 'vertical', x:'left'};
			mapoption.legend.data=newLegend;
		}  
		return mapoption;
	},
	//根据选择的地图区域的数据，生成柱状图的series
	makeBarSerie:function (selected){
		var barSeries=[];
    	var mapSeries=this.getSeries();
    	var selectedName=[];  //地图上的地名  id/name
    	var nameMaping=ThemeMap.name2GeoField.nameMapping;
    	var selectedRealName=[];
    	for(var p in selected){
        if(selected[p]){
            selectedName.push(p); 
            if(!nameMaping[p]){
                selectedRealName.push(p); 
            }else{
                selectedRealName.push(nameMaping[p]); 
            }
        	}
    	}  
    	for(var i=0,len=mapSeries.length;i<len;i++){
        	var curSeries=mapSeries[i];
        	var type=curSeries.type;
        	var seriesName=curSeries.name;
        	var seriesData=[];
        	if(type=='map'){ //利用专题图上的数据
            var data=curSeries.data;
            for(var k=0,selectLen=selectedName.length;k<selectLen;k++){
                var selname=selectedName[k];
                for(var j=0,dataLen=data.length;j<dataLen;j++){
                    if(data[j].name==selname){
                        seriesData.push(data[j].value);
                    }                
                }
            }            
        }
        var obj= {name:seriesName,type:'bar',data:seriesData};
        barSeries.push(obj);
      }
      return barSeries;
	},
	//根据选择的地图区域，生成饼图的series
	makePieSerie:function (selected){
	
	},
	//请求表中的数据{url:,port:,db:,table:,fields:[],filter:}
	queryData:function (params,callback){  
		// var websqlUrl="http://"+ThemeMap.requrl+":"+ThemeMap.port+"/WebSQL";
		var websqlUrl="https://ccgis.cn/mapb/WebSQL";
		var dbname=params.db;
		var tabname=params.table;
		var fieldArr=params.fields;
		var fldStr=params.fields.join(','); console.log(fldStr);
		//fldStr.substr(0,fldStr.length-1);
		var filter=params.filter;
		var sql='select '+fldStr+" from "+tabname;
		ThemeMap.ajaxType='SQLDATA';
		if(filter!=undefined && filter!=''){
			sql=sql+" where "+filter;
		}
		var qryParams={
            	"mt":"SQLQuery",
                "GeoDB":dbname,
                "SQL":sql
            }
        var datastr = JSON.stringify(qryParams);
        var para = {
            req: datastr
          };
        _ajax("POST", websqlUrl, para, true, function(data){ 
          	var jsonparase;
            var jsonparase_tmp=data;
            var returnfields=jsonparase_tmp.data;  
            var returnfields_len=returnfields.length;
            var allFieldsArr=jsonparase_tmp.fldsDef;
            var allFlds=[];
            var returnArrays=[];
            //取出所有字段的名称
            for(var ii=0;ii<allFieldsArr.length;ii++){
                var fldname=allFieldsArr[ii].name;
                allFlds.push(fldname);
            }  
            for(var nn=0;nn<returnfields_len;nn++){
                var tmprecords=returnfields[nn];//此时是一个数组     
                if(fldStr!='*'){ //如果不是查询所有字段，进行字段数判断
                var returnFields_len=tmprecords.length;
                if(returnFields_len!=fieldArr.length){
                    alert('查询字段与返回字段个数不统一，问题：存在数据库中不存在字段！');
                    return;
                }
                var recordjson={}; 
                for(var tt=0;tt<returnFields_len;tt++){
                    var fieldname=fieldArr[tt];
                    var fieldvalue=tmprecords[tt];
                    recordjson[fieldname]=fieldvalue; 
                }
                   returnArrays.push(recordjson);   
                }else{   //返回所有字段
                   var recordjson={};
                   var returnFields_len=tmprecords.length;
                   for(var tt=0;tt<returnFields_len;tt++){
                       var fieldname=allFlds[tt]; 
                       var fieldvalue=tmprecords[tt];  
                       recordjson[fieldname]=fieldvalue; 
                   }
                   returnArrays.push(recordjson);
                        } 
                 }
                  
              jsonparase=returnArrays;  
              callback(jsonparase);

          },function() {
                alert('websql请求超时');
            },500000);
	}

 };

/**
 * Ajax请求
 *otherParams主要为了给callback函数
 */
function _ajax(method, url, data, async, callback,timoutFunc,timeout,otherParams) {
	var timer_out;//设置超时id
	var parames_len=arguments.length;
	if(arguments.length==7||arguments.length==8){
		//创建计时器
		timer_out=setTimeout(function(){
			if (xdr){  
                xdr.abort(); 
            }else if(xhr){
            	//alert(typeof xhr);
            	
            	xhr.abort(); 
            }
			timoutFunc();
		},timeout);  
	}
	var xhr = null;
	var xdr = null;
	if (data instanceof Object) {  
		var str = "";
		for (k in data) { 
			str += k + "=" + encodeURIComponent(data[k]) + "&";
			//str += k + "=" + escape(data[k]) + "&";
		}
		data = str;   
	}
	if (window.XDomainRequest) {
		xdr = new XDomainRequest();
		if (xdr) {
			xdr.onerror = showerr;
			xdr.onload = function () {
				if (timer_out){  
                   clearTimeout(timer_out);  
                }
                if(arguments.length==8){
                    var json=JSON.parse(xhr.responseText);
                    callback(_decode(json),otherParams);
                }else{
                	var json=JSON.parse(xhr.responseText);
                    callback(_decode(json));
                	
                }
				
			};
			if ("get" == method.toLowerCase()) {
				if (data == null || data == "") {
					xdr.open("get", url);
				} else {
					xdr.open("get", url + "?" + data);
				}
				xdr.send();
			} else if ("post" == method.toLowerCase()) {
				xdr.open("post", url);
				xdr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
				xdr.send(data);
			}
		}
	} else {
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xhr.onreadystatechange = function (e) {
			if (4 == xhr.readyState) {
				if (200 == xhr.status) {
					if (callback) {
						if (timer_out){
                           clearTimeout(timer_out);  
                        }
                        if(parames_len==8){ 
                        	var json=JSON.parse(xhr.responseText);
                            callback(_decode(json),otherParams);
                        }else{
                        	var json=JSON.parse(xhr.responseText); console.log('json',json);
                        	switch (ThemeMap.ajaxType){
                        		case "SQLDATA":
                        		callback(json);
                        		break;
                        		case "GeoJson":
                        		callback(_decode(json));
                        		break;
                        	}
                        	
                        }
					}
				} else if (404 == xhr.status) {
					if (hander404) {
						hander404();
					}
				} else if (500 == xhr.status) {
					if (hander500) {
						hander500();
					}
				}
			}
		}
		if ("get" == method.toLowerCase()) {
			if (data == null || data == "") {
				xhr.open("get", url, async);
			} else {
				xhr.open("get", url + "?" + data, async);
			}
			xhr.send(null);
		} else if ("post" == method.toLowerCase()) {
			xhr.open("post", url, async);
			xhr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
			xhr.send(data);
		}
	}
	function handler404() {
		alert("ReqUrl：not found");
	}
	function handler500() {
		alert("服务器错误，请稍后再试");
	}
	function showerr(e){
	}
}
//解码
/*编码规则：1、坐标整形化，将浮点型的坐标乘以一个scale值，经纬度的scale值取100000，上海坐标的
scale值取2,  2、将要素的第一个坐标（整形化后的）设为encodeOffsets,第一个坐标存储为0，
后面每个坐标存储为与前面坐标的差值   据此进行解码*/
function _decode(json){ 
	ThemeMap.map_geoNames=[];
	//ThemeMap.name2center=[];
	var scale=json.scale;    
	ThemeMap.name2GeoField.nameMapping={};
	ThemeMap.GeoField2name.geoMapping={};
	if(!json.UTF8Encoding) {  
		var features = json.features; 
		for (var f = 0; f < features.length; f++) {
            var feature = features[f];
            var coordinates = feature.geometry.coordinates;
            var encodeOffsets = feature.geometry.encodeOffsets[0];
            var mappingValue=feature.properties.name;  //地图上的标示地名
            var cp=feature.properties.cp;
            var _name=feature.properties[ThemeMap.GeoField2name.geoField]; //实际的地名
            // ThemeMap.name2center[_name]=cp;  
            // if(ThemeMap.GeoField2name.geoField!='name'){  
            	var _name=feature.properties[ThemeMap.GeoField2name.geoField]; //实际的地名
                ThemeMap.GeoField2name.geoMapping[_name]=mappingValue;
                ThemeMap.name2GeoField.nameMapping[mappingValue]=_name;
            //}  
            ThemeMap.map_geoNames.push(mappingValue);
            if (feature.geometry.type == 'Polygon') { 
             	   feature.geometry.coordinates=_decodePolygon(coordinates,encodeOffsets,scale);  
			}  
        } 
      }
      console.log(ThemeMap.name2GeoField);
      console.log(ThemeMap.GeoField2name);
      var themeSucc=ThemeMap.themeSucceed;
      if(themeSucc){ 
      	themeSucc();
      	ThemeMap.themeSucceed=null;
      }
      //console.log('解码后',JSON.stringify(json));
      return json;
}
function _decodePolygon(coordinate,encodeOffsets,scale){ 
	var coord=[];
	var ptarr=[]; 
    var startX = parseFloat(encodeOffsets[0]);
    var startY = parseFloat(encodeOffsets[1]);  
    for(var i=0,len=coordinate.length;i<len-1;i=i+2){ 
    	var dltx=parseFloat(coordinate[i]);
    	var dlty=parseFloat(coordinate[i+1]);  
    	if(i==0){
    		var x=parseFloat(startX/scale);
    		var y=parseFloat(startY/scale);
    		var pt=[new Number(x.toFixed(4)),new Number(y.toFixed(4))];
    		ptarr.push(pt);
    	}else{ 
    		var prevXY=ptarr[ptarr.length-1]; 
 
    		var x=(parseFloat(prevXY[0])+parseFloat(dltx/scale)); 
    		var y=(parseFloat(prevXY[1])+parseFloat(dlty/scale));
    		var pt=[new Number(x.toFixed(4)),new Number(y.toFixed(4))];
    		ptarr.push(pt);
    	}	
    }
    coord.push(ptarr);  
    return coord;
}
 /**
 * 上海市坐标转经纬度
 * @param x
 * @param y
 * @returns {{lat: number, lng: number}}
 */
function _shToLngLat(x, y) {
	var A = 95418.0172735741;
	var B = 48.3052839794785;
	var C = -11592069.1853624;
	var D = 63.9932503167748;
	var E = 110821.847990882;
	var F = -3469087.15690168;
	var lat = parseFloat((D * x - A * y - (C * D - A * F)) / (B * D - A * E));
	var lng = parseFloat((E * x - B * y - (C * E - B * F)) / (A * E - B * D));
	return [lng,lat];
}
 /**
 * 获取元素在数组中的位置
 * @param ele  数组元素  也可可能是对象 obj
 * @param arr  目标数组
 * @returns index  
 */
function _indexOfInArray(ele,arr){
	for(var i=0,len=arr.length;i<len;i++){
		if(_equalObject(ele,arr[i])){
			return i;
		}
	}
	return -1;
}
/**
* 对象比较
* @param obj1
* @param obj2
* @return bool
*/
 function _equalObject(obj1, obj2){
    if(typeof obj1 != typeof obj2)return false;
    if(obj1 == null || obj2 == null)return obj1 == obj2;
    if(typeof obj1 == 'object'){
    for (var key in obj1){
    if(typeof obj2[key] == 'undefined') return false;
    if(!_equalObject(obj1[key],obj2[key])) return false;
   }
   return true;
   }else{
   return obj1 == obj2;
  }
}
// return {
// 	addMap: _extendMapData, //扩展地图数据
// 	Theme: Theme,           //专题图
// 	setReqURL: _setRequrl, //设置请求专题图的url
// 	requrl: 
// 	port: 
// 	ajaxType:;            //GeoJson(编码的数据，需要解码后传给回调函数)、SQLDATA（sql查询）、ZIPGeoJson（需解压、解码）
// 	name2GeoField:        //name与指定字段的对应关系
// }




})();










