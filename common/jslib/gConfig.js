var gEcnu={};

/**********gEcnu的相关配置信息****************/
gEcnu.config = {
  'version': '1.0.0',//地图对象版本编号
  //'port': 81,//地图对象，wms,wfs服务请求端口
  'maxLevel': 10,//地图对象版本号最大缩放级别
  'minLevel': 1,//地图对象版本号最小缩放级别
  'tileWidth': 250,//地图对象中切片大小
  'tileHeight': 200,//地图对象中切片大小
  //'webHostIP': '58.198.183.6', //地图对象请求IP地址 http://58.198.183.10:81/
  // 'geoserver':'http://58.198.183.39:81/mapb/',
  //'geoserver':'http://172.29.80.174:8090/',  
  'geoserver':'/OBOR/', //实用相对路径
  //'geoserver':'https://ccgis.cn/mapb/',   //https://webgis.ecnu.edu.cn/geosvr185/  本地测试：http://58.198.183.6:81/
  'imgPath':'../common/jslib/images/'
};
