requirejs.config({
	urlArgs: "version=" + (new Date()).getTime(), 
	baseUrl:'js',
	paths: {
		lib:'libs',
		libs:'libs/libs',
		app:'app/app',
		code:'app'
	},
	shim:{
		'app':{
            deps:['libs']	
		}	
	}
});
require(['libs','app'],function(libs,app) {
		
});