define(['code/config',
		'code/getData'
		],function(
		config,
		getData
		){	return{
			
			getIdContainer:function(){
					return config.menu[4].id;
			},
			init:function(){
				var obj = this;
				
				var localUrl = require.toUrl("code");
					localUrl = localUrl.split('?')[0];
		
				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_analysis.css'}).appendTo('head'),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					obj.createUI();
				});
			},
			_refresh:function(){
				
				
			},
			createUI:function(){
				var obj = this;
				
			}
	}
})