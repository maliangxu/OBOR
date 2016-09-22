
//sea.js配置
/*seajs.config({
	'base':'./modules/'
});*/

//esl.js配置  
require.config({
  baseUrl: './modules/',
});  

define(function (require){

    //统一引进子模块的脚本
    require('menubar/menubar');
    var Eventful = require('mixin/Eventful');
    var mapviewMod = require('mapview/mapview');
    var menuListMod = require('menubar/menubar');
    var subTitleMod = require('subTitle/subTitle');
    var indlistMod = require('indlist/indlist');
    var chartsMod = require('charts/charts');
    var modelMod = require('model/model');
    var datamgrMod = require('datamgr/datamgr');
    util.mixin(
        [
            menuListMod,
            subTitleMod,
            indlistMod,
            chartsMod,
            modelMod,
            datamgrMod
        ],
        Eventful
    );    

    menuListMod.addCustomEvt.on('menuclick', menuListMod_menuclick);
    subTitleMod.addCustomEvt.on('yearOrcntyClick', subTitleMod_yearOrcntyClick);
    subTitleMod.addCustomEvt.on('modelclick',modelMod_modelclick);
    subTitleMod.addCustomEvt.on('dataclick',datamgrMod_dataclick);
    indlistMod.addCustomEvt.on('indclick', indlistMod_indclick);
    chartsMod.addCustomEvt.on('initbox',chartsMod_initbox);

    mapviewMod.init();

    var gl_ind,gl_year,gl_cnty,gl_tab;

    function menuListMod_menuclick(obj,ind,tab){
        gl_ind = ind;
        gl_tab = tab;
        gl_year = $(obj).text()=='水资源'?2012:2008;
        gl_cnty = '中国';
        subTitleMod.init(obj);       
        indlistMod.init(obj);
        chartsMod.init(obj);
    }

    function subTitleMod_yearOrcntyClick(year_cnty,type){
        if(type=='line'){
            gl_cnty = year_cnty;     
        }else{
            gl_year = year_cnty;
        }
        if($('#mainwin').is(':hidden')) chartsMod.show();
        chartsMod.addval2chart(gl_ind,year_cnty,gl_tab,type);
    }

    function indlistMod_indclick(indName,tab,type){
        gl_ind = indName;
        gl_tab = tab;
        var year_cnty = type=='line'?gl_cnty:gl_year;
        chartsMod.addval2chart(indName,year_cnty,tab,type);
    }

    function chartsMod_initbox(type){
        subTitleMod.initbox(type);
    }

    function modelMod_modelclick(){
        modelMod.init();
    }

    function datamgrMod_dataclick(){
        datamgrMod.init();
    }

});
  




  






