requirejs.config({
	/*paths: {
		highchars:'libs/Highcharts-4.1.5/js/highcharts'
	},
	shim:{
		highchars:{
			exports:'highchars'	
		}
	}*/
});
define(['lib/systemAddons'],function(systemAddons){
	var localUrl = require.toUrl("lib");
				   localUrl = localUrl.split('?')[0];
	systemAddons.init();

	/*$.when(
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/materialize/css/materialize.css'}).appendTo('head'),
		$.Deferred(function( deferred ){
			$( deferred.resolve );
		})
	).done(function(){
		
	});*/
})