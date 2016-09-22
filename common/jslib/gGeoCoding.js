gEcnu.WebGeoCoding= gClass.extend({
    init: function(eventsListener) {
        if (typeof eventsListener != "undefined") {
            this.events._events.processCompleted = eventsListener.processCompleted;
            this.events._events.processFailed = eventsListener.processFailed;
        }
    },
    geoCoding:function(feature){
    	//var webgeoCodingUrl = 'http://' + gEcnu.config.webHostIP + ":" + gEcnu.config.port + "/GeoUtils";
        var webgeoCodingUrl = gEcnu.config.geoserver+"GeoUtils";
        var geoParmas={
       		"mt":"GeoCoding",
            "shape":feature.shape
        }
        var datastr = JSON.stringify(geoParmas);
        var params = {
            req: datastr
        };
        var webgeocodingServices = this;
        try {
            gEcnu.Util.ajax("POST", webgeoCodingUrl, params, false, function(data){
                if (typeof(webgeocodingServices.events._events.processCompleted) != "undefined") {
                	var jsonparase=JSON.parse(data);
                    webgeocodingServices.events._events.processCompleted(jsonparase);
                }
            },function() {
                alert('webgeocoding请求超时');
            },500000);
        }catch (e) {
            if (typeof(webgeocodingServices.events._events.processFailed) != "undefined") {
                webgeocodingServices.events._events.processFailed(e);
            }
        }
    },
    deGeoCoding:function(geoCode){

    },
    events: {
        _events: {},
        on: function(eventType, callback) {
            switch (eventType) {
                case 'processCompleted':
                    this._events.processCompleted = callback;
                    break;
                case 'processFailed':
                    this._events.processFailed = callback;
                    break;
            }
        }
    }
});