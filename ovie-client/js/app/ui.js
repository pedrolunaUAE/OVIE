define([
		'code/config',
		'code/getData',
		'code/modules/module_home',
		'code/modules/module_addGeo',
		'code/modules/module_vocEco',
		'code/modules/module_proveedores',
		'code/modules/module_compare',
		'code/modules/module_analysis',
		'code/modules/module_share',
		'code/modules/module_calculator',
		'code/modules/module_agendar',
		'code/modules/module_inmobiliaria',
		'code/modules/module_laboral'
		],function(
		config,
		getData,
		module_home,
		module_addGeo,
		module_vocEco,
		module_proveedores,
		module_compare,
		module_analysis,
		module_share,
		module_calculator,
		module_agendar,
		module_inmobiliaria,
		module_laboral
		){
	return{
		menuActive:0,
		headerMoved:false,
		localData:{geoList:[], actEco:{cve:0, label:null, value:null}},
		config:config,
		login:function(user,pass){
			var obj = this;

			var dataSource = $.extend(true,{},config.dataSource.login);
				dataSource.url = config.dataSource.server+dataSource.url;
				
			getData.getData(dataSource,{user:user,password:pass},function(data){
				if(data.response){
					var success = data.response.success;
					if(success){
						config.currentUser = config.users[data.data.value.type];
						config.currentUser.dbid = data.data.value.id;
						config.currentUser.username = data.data.value.name;
						config.currentUser.name = data.data.value.typeName;
						config.currentUser.type = data.data.value.type;
						config.logged = true;
						$('#login-modal').closeModal();
						obj.createUI();
					}else{
						Materialize.toast(data.response.message, 3000);	
						$('#username').focus();
					}	
				}
			});
		},
		closeModal:function(){
			var obj = this;
			var id = 'addGeoModal';
			$('#'+id).closeModal();
		},
		openModal:function(title,content,accept,cancel){
			var obj = this;
			var id = 'addGeoModal';
			var cadena = '<div id="'+id+'" class="modal">';
				cadena+= '    <div class="modal-content">';
				cadena+= '      <h5>'+title+'</h5>';
				cadena+= '      <p>'+content+'</p>';
				cadena+= '    </div>';
				cadena+= '    <div class="modal-footer">';
				cadena+= '      <a id="'+id+'_cancel" href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Cancelar</a>';
				cadena+= '      <a id="'+id+'_accept" href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Aceptar</a>';
				cadena+= '    </div>';
				cadena+= '</div>';
			
			$('#'+id).remove();
			$('body').append(cadena);
			$('#'+id).openModal();
			
			if($.isFunction(accept)){
				$('#'+id+'_accept').click(function(){
					accept();
				});
			}
			if($.isFunction(cancel)){
				$('#'+id+'_cancel').click(function(){
					cancel();
				});
			}
		},
		//-----------------------------Logout----------------------------
		logout:function(){
			var obj = this;
			var dataSource = $.extend(true,{},config.dataSource.logout);
				dataSource.url = config.dataSource.server+dataSource.url;
				
			getData.getData(dataSource,{},function(data){
				if(data.response){
					var success = data.response.success;
					if(success){
						Materialize.toast('Ha cerrado su sesión', 2500);	
						setTimeout(function(){
							window.location = window.location.pathname;
						},3000)
					}else{
						Materialize.toast(data.response.message, 3000);	
					}	
				}
			});
		},
		//--------------------------
		
		init:function(){
			var obj = this;
			obj.getData = getData;
			obj.createUI();
			
		},
		createUI:function(){
			var obj = this;
			//Ajuste menu
			var menu = config.menu;
			var user = config.currentUser;
			
			var cadena = '<div class="ms-header-hidden"></div>';
				cadena+= '<div id="main" class="main">';
				cadena+= '<div class="ms-header">';
				
				cadena+= '	<div id="ms_header_logos" class="row width-content">';
				cadena+= '			<div class="pivot"></div>';
				cadena+= '			<img src="js/app/css/img/ovie_logo.jpg" class="main-logo">';
				cadena+= '			<img src="js/app/css/img/logo_cdmx.png" class="cdmx-logo">';
				//cadena+= '          <div class="versionBeta">Versión Beta</div>';
				
				cadena+= '			<img src="js/app/css/img/inegi_logo.png" class="inegi-logo">';
				cadena+= '			<img src="js/app/css/img/sedeco_logo.png" class="sedeco-logo">';
				
				
				cadena+= '			<div id="header_title" class="header-title"></div>';
				cadena+= '			<div class="header-bottombar"></div>';
				cadena+= '	</div>';
				
				cadena+= '	<nav>';
				
				cadena+= '		<div class="nav-wrapper">';
				cadena+= '       <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>'; 
				cadena+= 		  obj.createMenu();
				cadena+= '		</div>';
				cadena+= '      <ul class="side-nav" id="mobile-demo">'+
									obj.getMobileMenu()+
								'</ul>';
				cadena+= '	</nav>';
				
				cadena+= '</div>';
			
				cadena+= '	<div class="ms-content">';
				cadena+= '	</div>';
				cadena+= '	</div>'; //Main
			
				cadena+=obj.getModal();
				$('body').html(cadena);
				$('#modal1').openModal();
				$('.ovie-nav-btn').click(function(e){
					var num = $(this).attr('idref');
					if(config.menu[parseInt(num)].enabled){
						$('.ovie-nav-btn[status=active]').attr('status','inactive');
						$(this).attr('status','active');
						obj.menuClick(parseInt($(this).attr('idref')));
						obj.showModal(config.menu[parseInt(num)].modal);
					}
					e.stopPropagation();
				})
				$(".side-nav").children('li').click(function(){
					$('.side-nav .Active').removeClass('Active');
					$('#button-mobile').sideNav('hide');
					$(this).addClass('Active');
					var num = $(this).attr('idref');
					if(config.menu[parseInt(num)].enabled){
						$('.ovie-nav-btn[status=active]').attr('status','inactive');
						$('.ovie-nav-btn[idref='+parseInt(num)+']').attr('status','active');
						obj.menuClick(parseInt($(this).attr('idref')));
						obj.showModal(config.menu[parseInt(num)].modal);
					}
					
				});
				$('#mnu_help').unbind();
				$('#mnu_quickStart').unbind();
				$("#mnu_home").attr('status','active');
				$(".button-collapse").sideNav();
				var user = config.currentUser;
				$('#header-btnLogout').click(function(){
					obj.logout();
				});
				
				obj.menuClick(0);
				
				$('#main').scroll(function(){
					if(!obj.headerHeight)
						obj.headerHeight = $('.width-content').height();
					if($('#main').scrollTop() > obj.headerHeight){
						if(!obj.headerMoved){
							obj.headerMoved = true;
							$('.ms-header nav').css('height',$('.ms-header nav').height()+'px');
							$('.ms-header-hidden').css('height',$('.ms-header nav').height()+'px');
							var elem = $('.ms-header nav').detach();
							$('.ms-header-hidden').append(elem);
						}
					}else{
						if(obj.headerMoved){
							obj.headerMoved = false;
							var elem = $('.ms-header-hidden nav').detach();
							$('.ms-header-hidden').css('height','0px');
							$('.ms-header').append(elem);
						}
					}
				});
				

		},
		showModal :function(data){
				if (data) {
                    $('body').information({data:data,register:true});
                }
				
		},
		getModal:function(){
			var chain='<div id="modal1" class="modal modal-fixed-footer modal-container">'+
						'<div class="modal-content">'+
						  '<h4 class="modal-title">Bienvenido</h4>'+
						  '<center><div><img src="img/reports/logo-copia.png"></div></center>'+
						  '<p class="modal-txt">La Oficina Virtual de Información Económica (OVIE) es una plataforma GRATUITA de análisis territorial que busca servirte de guía para fundamentar tus decisiones económicas. A través de este portal, podrás acceder al mapa económico de la CDMX y conocer, cuadra por cuadra, el contexto social, económico y urbano de cualquier área de tu interés, así como información relevante para los más de 900 tipos de negocios que existen en la Ciudad.<br><br>'+
'Las estadísticas aquí presentadas son resultado del procesamiento de información de distintas fuentes de la administración pública federal y local, con base en la disponibilidad de información en tiempo y espacio y, están sujetas a una actualización continua.'+ 
'La OVIE es un esfuerzo por poner a tu alcance una caja de herramientas con información útil para iniciar, expandir o consolidar tu negocio. Quien arriesga su patrimonio para el desarrollo económico de la Ciudad debe contar con la mayor información que le ayude a tomar decisiones. '+
'<br><br><center>¡Te invitamos a utilizar esta herramienta!</center>'+

'</p>'+
						'</div>'+
						'<div class="modal-footer">'+
						  '<a href="#!" style="color:#FFF; background:#E2007A" class="modal-action modal-close waves-effect waves-green btn-flat ">Aceptar</a>'+
						'</div>'+
					  '</div>';
			return chain;
		},
		
		getValuesAsVars:function(values){
			var obj = this;
			var user = config.currentUser;
			var url = [];
			for(var x in values){
				var val = values[x].val;
				var _var = values[x]._var;
				if(val.substring(0,1) == '_'){
					val = val.substring(1,val.length);
					val = val.split('_');
					_val = (val[0] == 'user')?user:'';
					val = _val[val[1]];
					url.push(_var+'='+val);
				}else{
					url.push(_var+'='+val);
				}
			}	
			url = '?'+url.join('&');
			return url;
		},
		updateTitle:function(){
			var obj = this;
			var menuActive = obj.menuActive;
			var menu = config.menu;
			$('#header_title').html(menu[menuActive].title);
			
		},
		
		menuClick:function(pos){
			var obj = this;

			obj.menuActive = pos;
			$('.content-display.active').removeClass('active');
			if(typeof(pos) == 'number'){
				obj.updateTitle();
				var menu = config.menu;
				var op = menu[pos];
				if(op.module){
					var div = $('#container_'+op.id).attr('id');
					if(div === undefined){
						$('.ms-content').append('<div id="container_'+op.id+'" class="content-display active"></div>');	
						op.module.init(obj);
					}else{
						$('#container_'+op.id).addClass('active');
						op.module._refresh();
					}
					if (op.childs) {
                        obj.createSubMenu(op.childs);
                    }
				}else{
					/*if(op.url){
						if($('#'+pos).attr('id') === undefined){
							var url = op.url+obj.getValuesAsVars(op.vars);
							$('.ms-content').append('<iframe src="'+url+'" id="'+op.id+'" class="content-display active"></iframe>');	
						}	
						$('#'+op.id).addClass('active');		
					}*/
				}
			}
		},
		unselectMenu:function(){
			$('#nav-mobile li.active').removeClass('active');
		},
		getMobileMenu:function(){
			var obj = this;
			var chain = '';
			var ocultar="";
			var inicio="";
			var menu = config.menu;
			//debugger;
			for(var x in menu){
				var i = menu[x];
				//menu movil oferta inmobiliaria y laboral ocultos
				//if ((x==5)||(x==6))//||(x==9)||(x==10)) 8 es agendar
				if ((x==5)||(x==6)||(x==9)||(x==10))
				{
                    ocultar="display:none";
                }else{ocultar="display:block";}
				//***Agregar ícono de inicio rápido
				if (x==12) {
                    inicio='<img src="img/icons/inicioRapidoBlackS.png">';
				}else{inicio='';}
							chain+='<li idref="'+x+'" style="'+ocultar+'">'+
										'<a href="#" class="opcChoice">'+
											'<div class="iconChoice">'+
												//(x==12)?'<img src="'+i.sprite+'">':'<div class="'+i.sprite+'S"></div>'+
												inicio+
												'<div class="'+i.sprite+'S"></div>'+
											'</div>'+
											i.title+
										'</a>'+
									'</li>';
			}
			
			return chain;
		},
		createMenu:function(){
			var obj = this;
			var menu = config.menu;
			
			menu[0].module = module_home;
			menu[1].module = module_addGeo;
			menu[2].module = module_vocEco;
			menu[3].module = module_proveedores;
			menu[4].module = module_compare;
			menu[5].module = module_analysis;
			menu[6].module = module_share;
			menu[7].module = module_calculator;
			menu[8].module = module_agendar;
			menu[9].module = module_inmobiliaria;
			menu[10].module = module_laboral;
			
			var user = config.currentUser;
		
			var cadena = '';
				cadena+= '<div id="nav-menu" class="ovie-nav-container width-content">';
				
			for(var x in menu){
				var op = menu[x];
				
				cadena+= '<div id="'+op.id+'" idref="'+x+'" class="ovie-nav-btn" status="'+((x == obj.menuActive && x > 3)?'active':'inactive')+'">';
				cadena+= 	(x==11)?'<a href="docs/ayuda.pdf" target="_blank">':'';
				cadena+= 	(x==12)?'<a href="docs/manualOvie.pdf" target="_blank"><img src="'+op.sprite+'">':'';
				//cadena+=    (x==12)?'<img src="'+op.sprite+'">':'';
				cadena+= '	<div class="ovie-nav-btn-img '+op.sprite+'"></div>';
				cadena+= '	<div class="ovie-nav-btn-img btn-img-inactive '+op.inactiveSprite+'"></div>'; 
				cadena+= '	<label class="ovie-nav-btn-label">'+op.label+'</label>';
				cadena+=    (x==11)?'</a>':'';
				cadena+=    (x==12)?'</a>':'';
				cadena+= '</div>';
			}
				cadena+= '</div>';
				
			return cadena;
		},
		
		getData:function(){
		},
		
		createSubMenu:function(childs){
			var obj=this;
			var cadena = '<div style="width:1000px; margin-left:auto; margin-right:auto"><div id="submenu_container" class="z-depth-1" style="display:none">';
		}
		
	}
});