
require.config({
  paths: {
    echarts: '../common/js/dist'
  }
});

define(function (require, exports, module){  

  require('echarts/chart/map');

	mapviewMod = {

		init:function(){
			var ec = require('echarts');
			var mapId = this.getMapId();
			var dom = document.getElementById(mapId);
			this.myChart = ec.init(dom).showLoading({effect:'bubble'}).hideLoading();
			this.initOpt();
			this.initRoute();
			this.getAllStatesInfo('stateInfo');	
		},
		initOpt:function(){
			this.option = {
				backgroundColor: '#71b7fd',
     		color: ['rgba(30,144,255,1)','lime'],
      		tooltip : {
        		trigger: 'item',
        		formatter: '{b}'
      		},
      		series:[]
			};
		},
		initMap:function(){
			var option = this.option;
			this.myChart.setOption(option);
		},
		initRoute:function(){
			var self = this;
			this.option.series.push({
				      name: '陆上丝绸之路',
          		type: 'map',
          		roam: true,
          		hoverable: true,
          		mapType:  'world', //'new',
          		tooltip : {
          		  trigger: 'item',
          		},
          		itemStyle:{
              		normal:{
                  		borderColor:'rgba(100,149,237,1)',
                  		borderWidth:0.5,
                  		areaStyle:{
                    		color: '#9ec7f3'
                  		},
                  		label:{show:false,textStyle: {color:'#439f55',fontSize:12,fontFamily:'Microsoft YaHei'}}
              		},
              		emphasis:{
                		areaStyle:{
                    		color: '#feda9d'
                	},
                		label:{show:true,textStyle: {color:'#439f55',fontSize:12,fontFamily:'Microsoft YaHei'}}
              		}
          		},
          		textFixed:{'China':[10,30]},
          		mapLocation:{x:'-850',y:'-185',height:'1950',width:'1950'},
          		data:[
            		{name: '中国',value: 0,itemStyle:{normal:{color:'#f9fbc1',label:{show:true,textStyle: {fontWeight:'bold'}}},emphasis:{label:{textStyle: {fontWeight:'bold'}}}}},
            		{name: '蒙古',value: 3401,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            
            		{name: '吉尔吉斯斯坦',value: 3792,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            
            		{name: '俄罗斯',value: 5018,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '哈萨克斯坦',value: 3741,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '泰国',value: 3503,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '乌兹别克斯坦',value: 3758,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '塔吉克斯坦',value: 3809,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '土库曼斯坦',value: 3775,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '伊朗',value: 3894,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '新加坡',value: 3554,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '土耳其',value: 0,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '乌克兰',value: 4916,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '白俄罗斯',value: 4933,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '波兰',value: 5035,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '菲律宾',value: 3571,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '德国',value: 5086,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '荷兰',value: 5477,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
              
            		{name: '缅甸',value: 3520,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '老挝',value: 3469,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '文莱',value: 3605,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '东帝汶',value: 0,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},

            		{name: '格鲁吉亚',value: 3826,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '阿塞拜疆',value: 3843,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '巴基斯坦',value: 3639,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '以色列',value: 3996,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		{name: '柬埔寨',value: 3486,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
              
              
            		{name: '卡塔尔',value: 4047,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		{name: '黎巴嫩',value: 3945,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		{name: '亚美尼亚',value: 3860,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		{name: '马其顿',value: 0,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		{name: '斯洛文尼亚',value: 5426,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		{name: '斯洛伐克',value: 5052,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		{name: '摩尔多瓦',value: 4950,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
              
              
            		{name: '孟加拉国',value: 3656,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '阿富汗',value: 3877,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '尼泊尔',value: 3673,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '马尔代夫',value: 3724,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '不丹',value: 3690,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
              
            		{name: '沙特阿拉伯',value: 4030,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '阿联酋',value: 0,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '阿曼',value: 4098,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '科威特',value: 4013,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		  
            		{name: '伊拉克',value: 3928,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '约旦',value: 3962,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '巴林',value: 4064,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		  
            		{name: '也门',value: 4115,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '叙利亚',value: 3911,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '巴勒斯坦',value: 3979,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '罗马尼亚',value: 5273,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		
            		{name: '捷克共和国',value: 5154,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},              
            		{name: '保加利亚',value: 5324,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		
            		{name: '匈牙利',value: 5069,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '拉脱维亚',value: 4984,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		
            		{name: '立陶宛',value: 5001,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		  
            		{name: '爱沙尼亚',value: 4967,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '克罗地亚',value: 5409,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		
            		{name: '阿尔巴尼亚',value: 5256,itemStyle:{normal:{color:'#fafafa',label:{show:false}}}},
            		
            		{name: '塞尔维亚',value: 5290,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},             
            		{name: '波黑',value: 0,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '黑山',value: 5307,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '日本',value: 3435,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
            		{name: '韩国',value: 3418,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},

            		{name: '意大利',value: 0,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},             
          		  {name: '希腊',value: 5341,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
          		  {name: '埃及',value: 4133,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
          		  {name: '肯尼亚',value: 4303,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},             
          		  {name: '斯里兰卡',value: 3707,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
          		  {name: '印度',value: 3622,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
          		  {name: '马来西亚',value: 3537,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},
          		  {name: '印度尼西亚',value: 3588,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}},           
          		  {name: '越南',value: 3452,itemStyle:{normal:{color:'#fafafa',label:{show:true}}}}
          		],
          		nameMap : util.nameMap,
          		markPoint : {
            		symbolSize: 3,       // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            		itemStyle: {
              			normal: {
              		  		color:'#4d2c15',
              		  		borderColor: '#4d2c15', //地点标注边框色
              		  		borderWidth: 1,            // 标注边线线宽，单位px，默认为1
              		  		label: {
              		  	  		show: false
              		  		}
              			},
              			emphasis: {
              			  	/*color:'#71b7fd',
              			  	borderColor:'#71b7fd',*/
              			  	borderWidth: 5,
              			  	label: {
              			    	show: false
              			  	}
              			}
            		},
            		data : [
              			{name: "西安", value: 9},
              			{name: "兰州", value: 12},
              			{name: "乌鲁木齐", value: 12},
              			{name: "霍尔果斯", value: 12},
              			{name:"阿拉木图",value:14},
              			{name:"比什凯克",value:14},
              			{name:"塔什干",value:14},
              			{name:"杜尚别",value:14},
              			{name:"阿什哈巴德",value:14},
              			{name:"德黑兰",value:14},
              			{name:"伊斯坦布尔",value:14},
              			{name:"基辅",value:14},
              			{name:"莫斯科",value:14},
              			{name:"明斯克",value:14},
              			{name:"华沙",value:14},
              			{name:"柏林",value:14},
              			{name:"鹿特丹",value:14}             
            		]
          		},
          		markLine : {
              		symbol: ['circle', 'circle'],  
              		symbolSize : 1,
              		effect : self.effect(0),
              		itemStyle : self.itemStyle(0),
              		smooth:true,
              		data : [
                  		[{name:'西安'}, {name:'兰州'}],
                  		[{name:'兰州'}, {name:'乌鲁木齐'}],                  
                  		[{name:'乌鲁木齐'}, {name:'霍尔果斯'}],
                  		[{name:'霍尔果斯'}, {name:'阿拉木图'}],
                  		[{name:'阿拉木图'}, {name:'比什凯克'}],
                  		[{name:'比什凯克'}, {name:'塔什干'}],
                  		[{name:'塔什干'}, {name:'杜尚别'}],
                  		[{name:'杜尚别'}, {name:'阿什哈巴德'}],
                  		[{name:'阿什哈巴德'}, {name:'德黑兰'}],
                  		[{name:'德黑兰'}, {name:'伊斯坦布尔'}],
                  		[{name:'伊斯坦布尔'}, {name:'基辅'}],
                  		[{name:'基辅'}, {name:'莫斯科'}],
                  		[{name:'莫斯科'}, {name:'明斯克'}],
                  		[{name:'明斯克'}, {name:'华沙'}],
                  		[{name:'华沙'}, {name:'柏林'}],
                  		[{name:'柏林'}, {name:'鹿特丹'}]
              		]
          		}
			},
			{
				name: '海上丝绸之路',
          		type: 'map',
          		mapType: 'world', //'new'
          		itemStyle:{
              		normal:{
                  		borderColor:'rgba(100,149,237,1)',
                  		borderWidth:0.5,
                  		areaStyle:{
                    		color: '#9ec7f3'
                  		},
                  		label:{show:false,textStyle: {color:'#439f55',fontSize:10,fontFamily:'Microsoft YaHei'}}
              		},
              		emphasis:{
                		areaStyle:{
                  			color: '#feda9d'
                		},
                		label:{show:true,textStyle: {color:'#439f55',fontSize:10,fontFamily:'Microsoft YaHei'}}
              		}
          		},
          		data:[],
          		markPoint : {
            		symbolSize: 3,       // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            		itemStyle: {
              			normal: {
                			color:'#448ed8',
                			borderColor: '#448ed8',  //地点标注边框色
               	 			borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                			label: {
                  				show: false
                			}
              			},
              			emphasis: {
                			//borderColor: '#6495ED',
                			borderWidth: 5,
                			label: {
                  				show: false
                			}
              			}
            		},
            		data : [
              			{name:"福州",value:14},
              			{name:"泉州",value:14},
              			{name:"广州",value:14},
              			{name:"湛江",value:14},
              			{name:"海口",value:14},
              			{name:"北海",value:14},
              			{name:"河内",value:14},
              			{name:"雅加达",value:14},
              			{name:"吉隆坡",value:14},
              			
              			{name:"加尔各答",value:14},
              			{name:"科伦坡",value:14},
              			{name:"内罗毕",value:14},
              			{name:"开罗",value:14},
              			{name:"雅典",value:14},
              			{name:"威尼斯",value:14},
              
            		]
          		},
          		markLine : {
            		symbol: ['circle', 'circle'],  
            		symbolSize : 1,
            		effect : self.effect(1),
            		itemStyle : self.itemStyle(1),
            		smooth:true,
            		data : [
              			[{name:'福州'}, {name:'泉州'}],
              			[{name:'泉州'}, {name:'广州'}],      
              			[{name:'广州'}, {name:'湛江'}],        
              			[{name:'湛江'}, {name:'海口'}],
              			[{name:'海口'}, {name:'北海'}],
              			[{name:'北海'}, {name:'河内'}],
              			[{name:'河内'}, {geoCoord:[110.03, 14.58]}],
              			[{geoCoord:[110.03, 14.58]}, {geoCoord:[107.03, 4.85]}],
              			[{geoCoord:[107.03, 4.85]},{name:'雅加达'}],
              			[{name:'雅加达'}, {name:'吉隆坡'}],
              			[{name:'吉隆坡'}, {name:'科伦坡'}],

              			[{name:'加尔各答'}, {name:'科伦坡'}],

              			[{name:'加尔各答'}, {geoCoord:[82.728, 2]}],
              			[{geoCoord:[82.728, 2]}, {name:'内罗毕'}],
              			[{name:'内罗毕'}, {geoCoord:[44.608, 0.93]}],
              			[{geoCoord:[44.608, 0.93]},{geoCoord:[53, 13.4]}],
              			[{geoCoord:[53, 13.4]},{geoCoord:[44.7, 11.7]}],
              			[{geoCoord:[44.7, 11.7]},{name:'开罗'}],
              			[{name:'开罗'}, {name:'雅典'}],
              			[{name:'雅典'}, {name:'威尼斯'}]
            		]
          		},
          		geoCoord: {
                	'西安':[108.95000,34.26667],
                	'兰州':[103.73333,36.03333],
                	'乌鲁木齐':[87.68333,43.76667],
                	'霍尔果斯':[80.25,44.12],
                	'阿拉木图':[76.876144,43.251204],
                	'比什凯克':[74.612231,42.874934],
                	'塔什干':[69.224854,41.277548],
                	'杜尚别':[68.779178,38.536219],
                	'阿什哈巴德':[58.309679,37.965102],
                	'德黑兰':[51.25,35.40],
                	'伊斯坦布尔':[28.58,41.02],
                	'基辅':[30.523764,50.458461],
                	'莫斯科':[37.3704,55.4521],
                	'明斯克':[27.555492,53.913625],
                	'华沙':[21.024459,52.236512],
                	'柏林':[13.422190,52.482099],
                	'鹿特丹':[4.29,51.55],

                	'福州':[119.28,26.08],
                	'泉州':[118.664017,24.877107],
                	'广州':[113.274536,23.128755],
                	'湛江':[110.320587,21.242861],
                	'海口':[110.211067,20.027752],
                	'北海':[109.316711,21.657244],
                	'河内':[105.84,21.034],
                	'雅加达':[106.49,-6.10],
                	'吉隆坡':[101.42,3.08],
                	'科伦坡':[79.84278,6.93444],

                	'加尔各答':[88.20,22.33],

                	'内罗毕':[36.49,-1.17],
                	'开罗':[31.234518,30.067288],
                	'雅典':[23.43,37.58],
                	'威尼斯':[12.311018,45.441137]
          		}
			});
		},
		effect:function(idx){
			return {
        		show: true,
        		scaleSize: 1,
        		period: 50,             // 运动周期，无单位，值越大越慢
        		color: ['rgb(54,22,6)','rgb(40,90,200)'][idx],
        		shadowColor: 'rgba(220,220,220,0.4)',
        		shadowBlur : 3 
      		}
		},
		itemStyle:function(idx){
			return {
        		normal: {
          			color:'#fff',
          			borderWidth:1.5,
          			borderColor:['rgba(77,44,21,1)','rgb(67,92,224)'][idx],
          			lineStyle: {
              			type: 'dashed'
          			}
        		}
      		}
		},
		showStasInfo:function(stasInfo){
			var self = this;
			this.option.series[0].tooltip.formatter = function(params){
				var info = self._getStateInfoByName(stasInfo,params.name);
				if(typeof params.value=='number' && info){
					if(params.name == '中国'){
            info.NATION = '56个民族';
            info.CLIME = '温带季风气候、亚热带季风气候、<br/>热带季风气候、温带大陆性气候、高原山地气候';
          } 
          return params.name +'<br/>地理位置：'+info.GEO_POS+'<br/>气候：'+info.CLIME+
          '<br/>首都：'+info.CAPITAL+'<br/>语言：'+info.LAN+'<br/>民族：'+info.NATION+'<br/>宗教：'+info.RELIGION;
        }else{
          return params.name;
        }
			}
      if($(window).width()<=1200){
        var loc = self.option.series[0].mapLocation;
        loc.x = -880;
        loc.y = -158;
        loc.height = 1800;
        loc.width = 1800;
      }
			this.initMap();
		},
		_getStateInfoByName:function(stasInfo,staName){
			var staInfo = stasInfo.filter(function(item){
				return item.STATE == staName;
			});
			return staInfo[0];
		},

		getAllStatesInfo:function(tablename){
			var self = this;
			//var _callback=succ || function (){}; 
			var option={
      			"scriptname":"OBOR.initMap.getStateInfo",
      			"tablename":tablename,
    		};
    		var succ = self.showStasInfo;
    		var sqlservice=new gEcnu.WebsqlScript({'processCompleted':function(data){
      			var queryResult=data.queryResult;
      			util.bindContext(self,succ,queryResult);
      			//_callback(queryResult);
    		},'processFailed':function(){alert('请求失败');}});
    		sqlservice.processAscyn(option);
		},
		getMapId: function (){ 
			return 'mapview';
		}

	}

	module.exports = mapviewMod;

});