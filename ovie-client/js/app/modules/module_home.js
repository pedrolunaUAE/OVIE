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
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_home.css'}).appendTo('head'),
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
												'<p class="ovie-title-definicion2" style="padding-top: 18px; padding-bottom: 10px;">Podrás obtener información de</br class="spaces"> cualquier lugar de Tepic y Nayarit, ya sea:</p>'+
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
												'<span><a style="color: #e2007a;" href="docs/manualOvie.pdf" target="_blank" >Descarga la guía de uso rápido aquí</a></span>'+
											'</p>'+
										
										'</div>'+
									'</div>'+
								 '</center>'+
								 
								'<div class="row info_contact">'+
										'<div class="col s12"><a href="https://www.facebook.com/OVIECDMX/" target="_blank" style="color:white"><img src="img/home/fbIcon-white.png" style="position:relative; top:7px; margin-right:5px"/></a><a href="https://twitter.com/@OvieCdmx" target="_blank" style="color:white"><img src="img/home/twitterIcon-white.png" style="position:relative; top:7px;margin-right: 5px;"/></a><img src="img/home/ovie-home-mail.png" style="position:relative; top:7px; margin-right:5px"/>ovie@sedecodf.gob.mx <img src="img/home/ovie-home-tel.png" style="position:relative; top:7px;"/> 5536 9040 &oacute; 5682 2096 ext. 330</div>'+
										'<div class="col s12">Cuauht&eacute;moc 898, Narvarte, Benito Ju&aacute;rez, 03020, Ciudad de M&eacute;xico</div>'+
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