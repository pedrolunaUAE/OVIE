define(['code/config',
		'code/getData',
		'code/ovieFooter'
		],function(
		config,
		getData,
		Footer
		){	return{
			
			getIdContainer:function(){
					return config.menu[0].id;
			},
			init:function(){
				var obj = this;
				
				var localUrl = require.toUrl("code");
					localUrl = localUrl.split('?')[0];
		
				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_home.css?v=9'}).appendTo('head'),
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
				var cadena = '';
				
				cadena='<div class="home-container">'+
							'<div class=section>'+
								 '<div class="BG"></div>'+
								 
								 '<center>'+
									'<div class="home-greyBG">'+
										'<div class="row">'+
											'<div class="col s12">'+
												'<p class="ovie-title-definicion2"> La <span style="font-weight: 600; font-size: 20pt">OVIE </span> es una plataforma GRATUITA de </br class="spaces">'+
												'información geográfica dirigida a emprendedores,<br class="spaces">'+
												'empresarios e inversionistas, que presenta de </br class="spaces"> manera clara, unificada y comprensible, los </br class="spaces"> principales datos económicos, sociodemográficos <br class="spaces">'+
												'y urbanos del territorio.</p>'+
												'<p class="ovie-title-definicion2" style="padding-top: 18px; padding-bottom: 10px;">Podrás obtener información de</br class="spaces"> lugares de Nayarit, ya sea:</p>'+
											'</div>'+
											
											'<div class="row">'+
												'<div class="col s4 m4"><div class="delegacionB"></div></div>'+
												'<div class="col s4 m4"><div class="coloniaB"></div></div>'+
												'<div class="col s4 m4"><div class="poligonoB"></div></div>'+
											'</div>'+
											
											'<p class="ovie-title-definicion2">Y de cualquier tipo de negocio:</p>'+
											
											'<div class="row">'+
												'<div class="col s4 m4"><div class="comercioB"></div></div>'+
												'<div class="col s4 m4"><div class="industriaB"></div></div>'+
												'<div class="col s4 m4"><div class="servicioB"></div></div>'+
											'</div>'+
											
											'<p class="ovie-title-definicion2" style="padding-top: 20px;">¡Te invitamos a utilizarla!<br>'+
												'<span><a style="color: #6E1A1A;" href="docs/manualOvie.pdf?v=20261026" target="_blank" >Descarga la guía de uso rápido aquí</a></span>'+
											'</p>'+
										
										'</div>'+
									'</div>'+
								 '</center>'+
								 
								'<div class="row info_contact">'+
										'<div class="col s12"><img src="img/home/ovie-home-mail.png" style="position:relative; top:7px; margin-right:5px"/><a href="mailto:sec.economia@nayarit.gob.mx" style="color:white">sec.economia@nayarit.gob.mx</a> <img src="img/home/ovie-home-tel.png" style="position:relative; top:7px;"/> <a href="tel:+523112580929" style="color:white">311 258 09 29</a></div>'+
										'<div class="col s12">Secretar&iacute;a de Desarrollo Econ&oacute;mico y Social del Gobierno del Estado de Nayarit</div>'+
										'<div class="col s12">Av. de los Insurgentes Pte. #854, Col. El Rodeo, Tepic, Nayarit</div>'+
										//'<div class="col s12" style="padding-bottom: 7px;"></div>'+
										/*'<img src="img/datosContacto.png">'+*/
									'</div>'+	
								Footer.get()+ 
							'</div>'+
							
						'</div>';
						
    
				$('#container_mnu_home').html(cadena);
				
			},
			
	}
})