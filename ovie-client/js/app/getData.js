define(function(){
	return{
		getData:function(source,params,callback,error,before,complete){
				var obj = this;
				var spinner = this.spinner;
				
				//Anexo de parametros que vengan definidos desde fuente de datos
				var s_params = source.params;
				var stringify = source.stringify;
				
				if (!(s_params === undefined)){
					for (var x in s_params){ //anexo de la conifuracion del origen de datos
						params[x] = s_params[x];
					};
				}
				if (!(stringify === undefined) && stringify){
					params = JSON.stringify(params);
				}
				//Estructura basica de peticion
				var dataObject = {
					   data: params,
					   success:function(json,estatus){callback(json,estatus);},
					   beforeSend: function(solicitudAJAX) {
							//$('#'+obj.id+'_spinner').addClass('ajax-loader');
							if ($.isFunction(before)){
								before(params);
							};
							
							var chain = '<div class="col s12 blocker" style="text-align:center">'+
											'<div class="blocker-container">'+
												'<img class="image" src="img/icons/mark.png" style="position:absolute; margin-top:13px; margin-left:18px">'+
												'<div class="preloader-wrapper big active">'+
													'<div class="spinner-layer spinner-blue-only" style="border-color: #6E1A1A;">'+
													  '<div class="circle-clipper left">'+
															'<div class="circle"></div>'+
													  '</div><div class="gap-patch">'+
															'<div class="circle"></div>'+
													  '</div><div class="circle-clipper right">'+
															'<div class="circle"></div>'+
													  '</div>'+
													'</div>'+
												'</div>'+
												'<div class="label" style="font-weight: bold;color: #757575;font-size: 110%;margin-top: 15px;">Cargando resultados...</div>'+
											'</div>'+
										'</div>';
							
							$('#geoArea_results').html(chain);
							
							
					   },
					   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
							Materialize.toast('Error en servicio de datos', 3000);
							if ($.isFunction(error)){
								error(errorDescripcion,errorExcepcion);
							};
					   },
					   complete: function(solicitudAJAX,estatus) {
						   $('.blocker').remove();
							//$('#'+obj.id+'_spinner').removeClass('ajax-loader');
							if ($.isFunction(complete)){
								complete(solicitudAJAX,estatus);
							};
					   }
				};
				//anexo de la conifuracion del origen de datos
				for (var x in source){ 
					if ( !(/field|name|id|params|stringify/.test(x)))dataObject[x] = source[x];
				};
				jQuery.support.cors = true;
				$.ajax(dataObject);
		}	
		
		
	}
});