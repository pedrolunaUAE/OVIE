$.widget("custom.login", {
	
    options: {
		config:null,
		//event:function(){},
		eventos:{
			buildQuestionnaire:function(){},
			loginUser:function(){},
			loginStatus:function(){},
			cancelTabs:function(){}
		},
		validator:null
	},
	//variables globales
	clase:'customLogin',
	logToken:null,
	login:false,
	
  	_init: function() {
	   var obj = this;
	   if (obj.logToken==null){
			$('#'+obj.id).openModal();
       }else{obj.options.eventos.buildQuestionnaire();}
	},
	_create: function(){
		this.update();
	},
	buildStructure: function() {
		var obj=this;
		obj.id=this.element.attr('id');
			
			var chain ='<div class="modal-content">'+
								'<h5 class="title">Ingresar al sistema</h5>'+
								'<p class="_contenido">'+
										'<div class="row _loginContent">'+
											'<form class="col s12 ingresar">'+
												'<div class="input-field col s12">'+
												  '<i class="material-icons prefix" style="color:#6E1A1A">account_circle</i>'+
												  '<input id="login_user" type="text" value="">'+
												  '<label for="login_user">Nombre de usuario</label>'+
												'</div>'+
												'<div class="input-field col s12">'+
												  '<i class="material-icons prefix" style="color:#6E1A1A">lock</i>'+
												  '<input id="login_password" type="password" value="">'+
												  '<label for="login_password">Contraseña</label>'+
												'</div>'+
											'</form>'+
											'<div id="registrarse" class="registrarse">'+
											'</div>'+
										    '<div class="warningMsg"><i class="tiny material-icons warningIcon">error_outline</i><span id="errorMsg">Los datos son incorrectos. Vuelve a intentarlo</span></div>'+
										'</div>'+
								'</p>'+
						'</div>'+
						'<div class="modal-footer">'+
								'<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat _cancel">Cancelar</a>'+
								'<a href="#!" class="modal-action waves-effect waves-green btn-flat _accept">Aceptar</a>'+
								'<a href="#!" class="_signIn waves-effect waves-light btn">Registrarse</a>'+
						'</div>';
			$("#"+obj.id).append(chain).addClass(obj.clase+' modal modal-fixed-footer login');
			$('#'+obj.id).openModal();
			
	},
	
	update:function(){
		var obj = this;
		obj.buildStructure();
		obj.events();
	},
	open:function(){
		var obj = this;
		$('#'+obj.id).fadeIn();
	},
	close:function(){
		var obj = this;
		$('#'+obj.id).closeModal();
		$(".lean-overlay").css("display", "none");
	},
	
    _refresh: function() {
        // trigger a callback/event
        this._trigger("change");
    },
    
    _destroy: function() {
        this.options.close();
        this.element.remove();
    },

    
    _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply(arguments);
        this._refresh();
    },

    _setOption: function(key, value) {
		var obj = this;
        this.options[key] = value;
        switch (key) {
            case "data":
				
			break;
		}
    },

	requestLogin:function(params){
                var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var id=obj.options.tipo;
                
				var c = obj.options.config.login.ingresar;
				
				var r= {
					success:function(json,estatus, request){
						var error=false;
						if (json){
							if (json.success==false) {
                                $(".warningMsg").css("display", "block");
								obj.options.eventos.loginStatus(false);
								obj.login=false;
                            }else{
									var token = request.getResponseHeader('X-AUTH-TOKEN');
									obj.logToken = token;
									obj.close();
									obj.options.eventos.buildQuestionnaire();
									obj.options.eventos.loginUser();
									obj.login=true;
									obj.options.eventos.loginStatus(true);
									
									$("#"+id+"_registrar_Container").show();
									$("#"+id+"_consultar_Container").hide();
							}	
						}else{
                              error=true;
							 }
						if (error) {
							 Materialize.toast(msg, 4000);
						}
					},
					beforeSend: function(solicitudAJAX) {
						//tab.customTab('showSpinner');
                    },
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					},
					complete: function(solicitudAJAX,estatus) {
						//tab.customTab('hideSpinner');
                    }
				};
				r = $.extend(r, c);
				//r.url=r.url+'id_inm='+id;
				r.data = (c.stringify)?JSON.stringify(params):params;
				$.ajax(r);
    },
	
	getToken:function(){
		var obj=this;
		return obj.logToken;
	},
	
	resetToken:function(){
		var obj=this;
		obj.logToken=null;
		return obj.logToken;
	},
	
	isLogin:function(){
		var obj=this;
		return obj.login;
	
	},
	
	events:function(){
		var obj=this;
		$("#"+obj.id+" ._accept").click(function(){
			$(".warningMsg").css("display", "none");
			var user= $("#"+obj.id+" input[id=login_user]").val();
			var password= $("#"+obj.id+" input[id=login_password]").val();
			var params={username:user, password:password};
			obj.requestLogin(params);
		});
		$("#"+obj.id+" ._cancel").click(function(){
			var id=obj.options.tipo;
			$(".lean-overlay").css("display", "none");
			$("#"+id+"_registrar_Container").hide();
			$("#"+id+"_consultar_Container").show();
			obj.options.eventos.cancelTabs();
		});	
		
		var fields=[{type:'text',label:'Nombre de usuario',value:'',format:'alphanumeric',required:true,field:'alias'},
						{type:'text',label:'Password',value:'',format:'alphanumeric',required:true,field:'password'},
						{type:'text',label:'Nombre',value:'',format:'alphanumeric',required:true,field:'nombre'},
						{type:'text',label:'Apellido',value:'',format:'alphanumeric',required:true,field:'apellido'},
						{type:'text',label:'Correo electrónico',value:'',format:'email',required:true,field:'correo_electronico'},
						{type:'text',label:'Teléfono',value:'',format:'phone',required:true,field:'telefono'},
						{type:'text',label:'Calle',value:'',format:'alphanumeric',required:true,field:'calle'},
						{type:'text',label:'Número',value:'',format:'numeric',required:true,field:'numero'},
						{type:'text',label:'Colonia',value:'',format:'alphanumeric',required:true,field:'colonia'},
						{type:'text',label:'C.P.',value:'',format:'numeric',required:true,field:'cp'},
						{type:'text',label:'Delegación',value:'',format:'alphanumeric',required:true,field:'delegacion'}
					   ]
		
		var cancelar= function(){
			$("#"+obj.id).removeClass('registration').addClass('login');
			$("#"+obj.id+" .registrarse").hide();
			$("#"+obj.id+" .ingresar").show();
			$("#"+obj.id+" .modal-footer").show();
			
		}
		
		$("#"+obj.id+" ._signIn").click(function(){
				
				$("#"+obj.id).removeClass('login').addClass('registration');
				$("#"+obj.id+" .ingresar").hide();
				$("#"+obj.id+" .registrarse").show();
				$("#"+obj.id+" .modal-footer").hide();
				$("#"+obj.id+ " .title").html("Registrarse");
				$("#"+obj.id+" #registrarse").questionnaire({	
																fields:obj.options.config.questionnaire.registrar,
																validator:obj.options.validator,
																dataSource:obj.options.config.login.registrar,
																data:null,
																terms:false,
																events:{onCancel:cancelar, onSave:cancelar}
															});
		});
		
		
	}
   
    
});

