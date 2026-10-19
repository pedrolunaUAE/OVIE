requirejs.config({
	urlArgs: "version=" + (new Date()).getTime(), 
	paths: {
		inputNumber:'app/widgets/inputNumber/jquery.ui.inputNumber',
		mapping:'app/widgets/mapping/mapping',
		areas:'app/widgets/areas/jquery.ui.areas',
		results:'app/widgets/results/jquery.ui.results',
		searchWidget:'app/widgets/searchWidget/jquery.ui.searchWidget',
		customTab:'app/widgets/tab/jquery.ui.tab',
		metadata:'app/metadata',
		compararMetadata:'app/compararMetadata',
		tooltip:'app/tooltip',
		information:'app/widgets/information/jquery.ui.information',
		activityList:'app/widgets/activityList/jquery.ui.activityList',
		ficha:'app/widgets/ficha/jquery.ui.ficha',
		questionnaire:'app/widgets/questionnaire/questionnaire',
		login:'app/widgets/login/jquery.ui.login'
	}
});
define(['code/ui','inputNumber','searchWidget','customTab','mapping','areas','results','metadata','tooltip','information','activityList','ficha','questionnaire','login'],function(ui,ajusteCargas,cardAgeb,inputNumber,customTab,mapping,areas,Results,metadata,tooltip, information,activityList,ficha,questionnaire,login){
	var localUrl = require.toUrl("code");
		localUrl = localUrl.split('?')[0];
		var v=("version=" + (new Date()).getTime());
	$.when(
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/css/main.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/inputNumber/jquery.ui.inputNumber.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/mapping/css/mapping.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/areas/jquery.ui.areas.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/results/jquery.ui.results.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/searchWidget/jquery.ui.searchWidget.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/tab/jquery.ui.tab.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/css/metadata.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/information/jquery.ui.information.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/activityList/jquery.ui.activityList.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/ficha/jquery.ui.ficha.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/questionnaire/questionnaire.css?'+v}).appendTo('head'),
		$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/widgets/login/jquery.ui.login.css?'+v}).appendTo('head'),
		$.Deferred(function( deferred ){
			$( deferred.resolve );
		})
	).done(function(){
		ui.init();	
	});
})