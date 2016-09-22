
define(function (require, exports, module){

	datamgr = {

		init:function(root){
			/*this.year = 2008;
			this.cnty = '中国'; */
			this.show();
		},
		show:function(){
			var modelId = this.getmodelId();
			var winclass = this.getwindowclass();
			$('.'+winclass).hide();
			$('#'+modelId).show();
		},
		hide:function(){
			var modelId = this.getmodelId();
			$('#'+modelId).hide();
		},
		getmodelId:function(){
			return 'modelwin';
		},
		getwindowclass:function(){
			return 'window';
		}

	};

	module.exports = datamgr;

});
