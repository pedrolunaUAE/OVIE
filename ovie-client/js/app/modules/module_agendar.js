
define(['code/config',
		'code/getData',
		'code/modules/validator',
		'code/ovieFooter'
		],function(
		config,
		getData,
		validator,
		Footer
		){	return{
				//Aqui va a guardar los datos del servicio de las horas
				data:{
					schedules:[],
					selectedDates:{}
				},
				/*hasta aqui*/
				getIdContainer:function(){
						return config.menu[0].id;
				},
				
				
				
				init:function(main){
					var obj = this;
					obj.main = main;
					obj.getData = getData.getData;
					
					var localUrl = require.toUrl("code");
						localUrl = localUrl.split('?')[0];
			
					$.when(
						$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_agendar.css'}).appendTo('head'),
						$.Deferred(function( deferred ){
							$( deferred.resolve );
						})
					).done(function(){
						//Carga  las horas desde que entra la agenda;despues carga los meses
						obj.loadSchedules(function(){

							//carga siguientes 3 meses de citas
							var today = new Date(); 
							var year = today.getFullYear();
							var month = today.getMonth()+1;//Se incrementa 1 porque esta de 0-11 +1 se quedan los 12 meses
							
							obj.data.selectedDates = {};
						
								 //Aqui solicitamos los 3 meses
								obj.loadMonthDates(year,month,0,function(){
										obj.loadMonthDates(year,month,1,function(){
												obj.loadMonthDates(year,month,2,function(){
														obj.createUI();//La última lanza la creación del UI
												});
										});
								});
						});
						
					});
				},
				//Carga el  mes actual
				loadMonthDates:function(year,month,add,func){
						var obj = this;
						//add incrementa los meses de la fecha
						year = ((month + add ) > 12)?year+1:year;//Si año= (al mes + lo que se agregue) y la suma es mayor que 12 quiere decir que ya pasamos de año entonces(:) el año mas 1: si no sigue el mismo año
						month = ((month + add ) > 12)?(month+add)-12:month+add;//al mes=si al mes le sumas lo que trae add y supera a 12 :el mes va a ser igual al mes actual + lo que trae add y a esto le quitamos un año, para que reinicie el contador 
						
						obj.scheduleDateDay(year,month,function(data){//Se invoca al servicio
								var agenda = data.data.Agenda;
								var mfecha = new Date(year,month,1);
								for(var x in agenda){
									var fecha = agenda[x].fecha_cita.split('-');//Agarramos la fecha para cortarla por año, mes y día
										fecha =  new Date(fecha[0],(parseInt(fecha[1])-1),fecha[2]);
										var tipo=agenda[x].estatus;
									obj.data.selectedDates[fecha] = {date:fecha,type:tipo}
								}
								
								if($.isFunction(func)) //si func es una fución ejecutala, es decir despues de que hagregue a la variable selectedDates todas las fechas va a ejecutar func, esto me va a permitir lanzarlas en cadena.
									func();
						});
				},//fin de loadMonthDates
				
				_refresh:function(){
					var obj = this;
					$("#geoArea_areaMap").mapping({features:obj.main.localData.geoList});
					$("#geoArea_list").areas({data:obj.main.localData.geoList});
					
				},
				/*Para validar si esta vacio o no el input*/
				validateInput:function(){
					var obj=this;
					var chain='';
						var mensajes=[];
						$("#contact input" ).each(function(){
							$(this).css("background","none");
							var required=$(this).attr("required");
								var id=$(this).attr("id");
								var etiqueta=$("#"+id).next().text();
								if(required){
									var valid=validator.isEmpty($(this).val());
									/*Para validar si esta uno u otro lleno  telefono o correo para ello en el html tenemos el attr=ligado*/
									var validLigado=true;
									var validLigado=true;
									var ligando=$(this).attr("ligado");

									if(ligando){
									validLigado=validator.isEmpty($("#"+ligando).val());
									}
									/*Hasta aqui*/
									if((valid)&&(validLigado)){//No tiene nada
											mensajes.push(etiqueta);
											$(this).css("background","#F9DCE8");
									}
								}
						});
						if(mensajes.length>0){
							//console.log(mensajes);
							$("#agendar-container").append(obj.getErrorModal2('¡Los siguientes campos son requeridos!',mensajes));
								$("#modal2").openModal();
													
						}
						
						return (mensajes.length>0)?false:true;
						
				},
				/*Valida el tipo de formato que tiene*/
				formatInput:function(){
					var obj = this;
						var mensajes=[];
						$("#contact input" ).each(function(){
							$(this).css("background","none");
							var format=$(this).attr("format");
								var id=$(this).attr("id");
								var etiqueta=$("#"+id).next().text();
								if(format){
									switch(format){
										case "text":
											var valid=true;
											break;
										case "phone":
											var valid=validator.isPhone($(this).val());
											break;
										case "cell":
										 	
										 	var valid=true;
										 	if($(this).val()!=null && $(this).val()!=''){
										 		valid=validator.isCellPhone($(this).val());	
										 	}
											break; 
										case "email":
											var valid=validator.isEmail($(this).val());
											break;
										case "date":
											var valid=validator.isDate($(this).val());
											break;
									}
									/*Para validar si esta uno u otro lleno  telefono o correo para ello en el html tenemos el attr=ligado*/
									var validLigado=true;
									var ligando=$(this).attr("ligado");

									if(ligando){
									validLigado=validator.isEmpty($("#"+ligando).val());
									}
									/*Hasta aqui*/
									if((!valid)&&(validLigado)){
											mensajes.push(etiqueta);
											$(this).css("background","#F9DCE8");
											
									}
								}
						});
						if(mensajes.length>0){
							//console.log(mensajes);
							$("#agendar-container").append(obj.getErrorModal2('¡Los siguientes campos tienen un formato inválido!',mensajes));
														
								$("#modal2").openModal();
							
						}
						return (mensajes.length>0)?false:true;
						
							
				},

				
				createUI:function(){
					var obj = this;
					var cadena = '';
						cadena = '<div id="agendar-container" class="width-content">';
						cadena+= '	<div class="row">'
						cadena+= '		<div class="col s12 m5" style="margin-top:-7px"><div id="tabArea"></div></div>';
						cadena+= '		<div class="col s12 m7"><div id="geoArea_areaMap" class="geoArea-areaMap"></div></div>';
						cadena+= '		<div class="col s12"><div id="geoArea_results" class="geoArea-results"></div></div>';
						cadena+= 		Footer.get();
						cadena+= '	</div>';
						//cadena+=    obj.getSpinnerExportFile();
						cadena+= '</div>';
						
						
		
					var chain='';
						chain='<div id="agendar-container" class="width-content">'+
								'<div class="row">'+
									//formulario
									'<div class="col s12 m6 l6">'+
										'<form id="contact">'+
											'<div class="row" style="margin-top: 20px;">'+
												'<div class="input-field col s12">'+
													'<input id="contact_name" format="text" required="true" type="text" class="validate" name="name">'+
													'<label for="contact_name">Nombre (*)</label>'+
												'</div>'+
											'</div>'+
											'<div class="row" style="margin-top: 20px;">'+
												'<div class="input-field col s12">'+
													'<input id="contact_address" format="text" type="text" class="validate" name="name">'+
													'<label for="contact_address">Domicilio</label>'+
												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
												  '<input id="contact_phoneField" format="phone" required="true" ligado="contact_email" type="text" class="validate" name="telefono">'+
												  '<label for="contact_phoneField">Teléfono(*)</label>'+
												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
												  '<input id="contact_celular"  format="cell" type="text" class="validate" name="celular">'+
												  '<label for="contact_celular">Celular</label>'+
												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
												  '<input id="contact_email" format="email" required="true"  ligado="contact_phoneField" type="text" class="validate">'+
												  '<label for="contact_email">Correo electrónico(*)</label>'+
												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
												  '<input id="contact_edad" format="text"  type="text" class="validate">'+
												  '<label for="contact_edad">Edad</label>'+
												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
												  '<label id="contact_sexo" style="top: -1.0rem;">Sexo</label><br/>'+

												  '<input name="group1" id="contact_sexoH" format="text" required="true" value="M" type="radio" class="validate">'+
												  '<label for="contact_sexoH">Masculino</label>'+

												  '<input name="group1" id="contact_sexoM" format="text" required="true" value="F" type="radio" class="validate">'+
												  '<label for="contact_sexoM" style="display: -webkit-inline-box;margin:0 0 0 51px;">Femenino</label>'+

												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
												  '<input id="contact_ocupacion" format="text" type="text" class="validate">'+
												  '<label for="contact_ocupacion">Ocupación</label>'+
												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
												  '<input id="typeQueryField" type="text" class="validate">'+
												  '<label for="typeQueryField">Tipo de Consulta</label>'+
												'</div>'+
											'</div>'+
											'<div class="row">'+
												'<div class="input-field col s12">'+
														'<select id="hora" name="horas">';
															//Aqui genero mi lista de horas que trae del servicio
															
															var list1 = obj.data.schedules;
															for(var x in list1){
																var item = list1[x];
																var selected = (x=='0')?' selected="selected" ':''; //el que este en la posicion 0 es el que va  a estar seleccionado
																chain+='<option value="'+item.schedule+'" '+selected+'>'+''+item.hora_in+' a '+item.hora_fn+'</option> ';
															}
																
									chain+='			</select>'+
														'<label for="hora">Seleccione una hora tentativamente deseada</label>'+	
												'</div>'+
											'</div>'+
										'</form>'+
									'</div>'+
									//calendario

									'<div class="col s12 m6 16">'+
										'<center>'+
											'<div id="datePicker-agenda" format="date" type="text" class="datePicker_agenda">'+	
											'</div>'+
										'<div class="leyend">'+	
											'<div><span class="leyenda" style="background:#F9DCE8"></span><label>Amplia disponibilidad</label></div>'+
											'<div><span class="leyenda" style="background:#FCF3CF"></span><label>Poca disponibilidad</label></div>'+
											'<div ><span class="leyenda" style="background:#F4ABAB"></span><label>Sin disponibilidad</label></div>'+
											'<div><span class="leyenda" style="background:#BDBDBD"></span><label>Este día no hay citas</label></div>'+
											'<div><span class="leyenda" style="background:#F2E8EC"></span><label>Días transcurridos</label></div>'+
											
										'</div>'+
										'</center>'+
										
									'</div>'+

										
									
									
									'<div class="row">'+
										'<div class="input-field col s12">'+
											'<input type="checkbox" id="miCheckbox" />'+
												'<label for="miCheckbox" style="padding: 16px;" /><a style="cursor: pointer;" id="abrir">He leído y acepto las condiciones (Ver condiciones)</a>'+
												obj.getModal()+		
													obj.getErrorCheck()+
										'</div>'+
									'</div>'+
									'<div class="row">'+
										'<div class="input-field col s12">'+
												'<a type="submit" id="enviar_solicitud" style="color:#FFF; background:#E2007A" class="modal-action modal-close waves-effect waves-green btn-flat">Enviar Solicitud</a>'+
														obj.getAceptarCheck()+										
										'</div>'+
									'</div>'+
										Footer.get()+
								'</div>'+
							'</div>';	
						
						 
						$('#container_mnu_agendar').html(chain);
						//Para seleccionar la hora
						$('#hora').material_select();
						
						$("#nose").click(function () {
							$("#miCheckbox").prop('checked',true);
						});
						/*ClicK en los input quita el color de error*/
						$("#contact input").click(function () {
							$(this).css("background","none");
						});	









					/*Para la ventana modal de las condiciones*/
						$(function () {
							$("#abrir").click(function () {
								$("#modal1").openModal();
							});
						});
					
					/**/					
					/*Click en en enviar solicitud*/
						$("#enviar_solicitud").click(function(){
							//Primero valido si mi check esta seleccionado de estarlo valida que esten llenos y que tengan el formato, de lo contrario me manda un mensaje donde es requerido checked.
							if($('#miCheckbox').is(':checked')){
								var valid=obj.validateInput();/*Esta validando si los datos de los input estan llenos y tienen el formato esperado*/
								if(valid){
									valid=obj.formatInput();
									if(valid){
										obj.scheduleDate();//Envia los datos al servicio
										$("#modal4").openModal();
										//Limpia el formulario
										$('#contact').each (function(){ 
												this.reset();	
										});
										$("#miCheckbox").prop('checked',false);
									}
								}
							}else{
								//alert("falta aceptar condiciones")
								$("#modal3").openModal();
								}
							
						});//fin de click
						
					
	  
					/*Para Cambiar el Idioma al calendario por default trae el de ingles*/
						$.datepicker.regional['es'] = {
							 
							 closeText: 'Cerrar',
							 prevText: '<Ant',
							 nextText: 'Sig>',
							 currentText: 'Hoy',
							 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
							 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
							 dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
							 dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
							 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
							 weekHeader: 'Sm',
							 dateFormat: 'yy-mm-dd',
							 firstDay: 7,
							 isRTL: false,
							 showMonthAfterYear: false,
							 yearSuffix: ''
						 };
						 $.datepicker.setDefaults($.datepicker.regional['es']);
		
					/*Manda llamar al calendario y pintarlo*/
						$(function(){
							
							var fecha = new Date();
							var max = new Date(fecha.getFullYear(), fecha.getMonth()+1, 0).getDate(); //la nueva fecha retorna el año, mes +1 para que tome los 12, retorn los dias de mes. 

							var getType = function(date){
								var resul = null;
								var fechas = obj.data.selectedDates;
								for(var x in fechas){
									var tDate = fechas[fecha];
									if (tDate){
										resul =  tDate.type;
										break;
									}
								}
								return resul;
							}

							/*:------DATAPICKER:-----:;------*/					
							$('#datePicker-agenda').datepicker({
								minDate: "0", //quita dia anteriores a la fecha actual
								maxDate: "+2M", //Pone la fecha máxima como 60 días a partir de hoy

								beforeShowDay: function(date) {
									var dates = obj.data.selectedDates[date];
									var Highlight = (dates)?'Hola':null; //Encuentra la fecha y ponle a Highlightalgun texto, no tiene valor
									var type = (Highlight)?dates.type:null; 

									var fecha2 = new Date();
									var f = new Date(fecha2.getFullYear(), fecha2.getMonth(),fecha2.getDate());
									var fecha2 = f.getTime();
									var diference=date.getTime() - fecha2;
									diference = ((diference/1000)/3600);



									if((date.getDay() == 0 || date.getDay() == 6 || date.getDay() == 5)||type==5){ //los dias 4 fines de semana estan desabilitados o cae en los dias 0 o 6 pintalos de gris
										return [false,"highlighted4"];
									}else{ //de lo contrario pintalos segun la clase segun su tipo

										if(diference >=0 && diference <= 24){
											return [false,"highlighted6"]; //es un dia muy cercano
										}else{

											type = (!Highlight)?1:type; //Si Highlight viene vacio y no es un fin de semana entonces es 1 de ser si entonces trae lo qu haya hagarrado el tipo								
												if(type==3){
													return [false,"highlighted3"];//[true, "highlighted"+type+"", Highlight];
													}else{
														return [true, "highlighted"+type];
													}
											}	
										}
								}
							});//Fin de manda a llamar datapicker
						});//Fin de mandar llmar al calenadrio y pintarlo
					
				},//Fin createUI
				
		//Para hacer las peticiones al servicio
			//Peticion para el horario
			loadSchedules:function(func){
				var obj = this;
				var ds = $.extend({},true,obj.main.config.dataSource.appointment);
				ds.url =  obj.main.config.dataSource.server+ds.url+'/schedules';//ruta
				obj.main.getData.getData(ds,{},//como no hay parametos queda en
				function(data){
					if(data.response && data.response.success){
						obj.data.schedules = data.data.Horarios//data.data.schedules; //ESTO ES LO QUE QUIERO EN MI DESPLEGABLE DE HORAS
						if($.isFunction(func)){
							func();
						}
					}
				});
			},
			
			
			//Peticion para mandar todos los datos
			scheduleDate:function(){
				var obj = this;
				//var valid=validator.isEmpty($(this).val());
				var ds = $.extend({},true,obj.main.config.dataSource.appointment);
				//ds.url = 'http://10.106.12.71:8080/ovie-analisis/appointment/add';
			
				ds.url =  obj.main.config.dataSource.server+ds.url+'/add'; 
				//Cuando hay parametros
				
				var params = {
								"schedule":$('#hora option:selected').val(),
								"name":$('#contact_name').val(),
								"tel":$('#contact_phoneField').val(),
								"phone":$('#contact_celular').val(),
								"mail":$('#contact_email').val(),
								"question":$('#typeQueryField').val(),
								"request":$('#datePicker-agenda').val(),
								"age":$('#contact_edad').val(),
								"occupation":$('#contact_ocupacion').val(),
								"sex":$('input[name="group1"]:checked', '#contact').val(),
								"address":$('#contact_address').val()
							}
				
				
				 obj.main.getData.getData(ds,params,
				function(data){
					if(data.response && data.response.success){
						//debugger;
					}
				}); 
			
			},	
		//Peticion para pintar el calendario
			scheduleDateDay:function(year,month,func){
				var obj = this;
				//var valid=validator.isEmpty($(this).val());
				var ds = $.extend({},true,obj.main.config.dataSource.appointment);
				ds.url =  obj.main.config.dataSource.server+ds.url+'/days'; //ruta 'http://10.1.30.102:8181/ovie/appointment/days';
				//Cuando hay parametros
				var params = {
								"month":month,
								"year":year

							}
				 obj.main.getData.getData(ds,params,
				function(data){
					if(data.response && data.response.success){
						if($.isFunction(func)){
							func(data)
						}
					}
				}); 
			
			},	
		//***
			/*Contenido de la ventana Modal*/	
			getModal:function(){
				var chain='<div id="modal1"  class="modal modal-fixed-footer modal-container">'+
								'<div class="modal-content">'+
									'<h4 class="modal-title">LEYENDA DE PROTECCIÓN DE DATOS PERSONALES</h4>'+
										'<p class="modal-txt">Los Datos Personales recabados serán protegidos, incorporados y tratados en el Sistema de Datos Personales denominado “Oficina Virtual de Información Económica”, el cual tiene su fundamento legal en los artículos 87 y 115 del Estatuto de Gobierno del Distrito Federal; 2, 3, fracción I, 15, fracción III, 16, fracción IV y 25 de la Ley Orgánica de la Administración Pública del Distrito Federal; 2, fracción XIX, 57 y 58 fracción VI de la Ley para el Desarrollo Económico del Distrito Federal; así como 1º, 2º, 5º, 6º, 7, fracciones I y II, 8º, 9º, 13, 14 y 21 de la Ley de Protección de Datos Personales del Distrito Federal; y los numerales 6, 7, 10, 15 de los Lineamientos para la Protección de Datos Personales del Distrito Federal, cuya finalidad es recabar datos de los consultantes que reciban asesoría personalizada en las instalaciones de la Secretaría de Desarrollo Económico, con elementos que permitan proporcionarle el servicio de manera eficiente, dar seguimiento oportuno a las consultas realizadas y poder medir el impacto generado como resultado del uso de los servicios de la Oficina Virtual, servirá para realizar mejoras en las funcionalidades de la herramienta y generar información estadística que sirva de apoyo en la toma de decisiones de los sectores público y privado, podrán ser transmitidos, a la CDHDF, al INFODF, la ASCM, Órganos de Control y Organismos Jurisdiccionales locales y federales, en cumplimiento a los requerimientos que en el ejercicio de sus funciones y atribuciones que realicen, además de otras transmisiones previstas en la Ley de Protección de Datos Personales para el Distrito Federal.'+
														'<br/><br/><strong>Los datos marcados con asterisco (*) son obligatorios, sin ellos no podrá acceder al servicio o completar el trámite de Registro y Certificación. '+
														'<br/><br/>Asimismo, se le informa que sus datos no podrán ser difundidos sin su consentimiento expreso, salvo las excepciones previstas en la Ley de Protección de Datos Personales para el Distrito Federal.<strong>'+
														'<br/><br/><strong>El Responsable del Sistema de Datos Personales</strong> es la C. Ximena Jacinta García Ramírez, Directora Ejecutiva de Información Económica, <strong>y la dirección donde podrá ejercer los derechos de acceso, rectificación, cancelación y oposición, así como la revocación del consentimiento es <strong> Av. Cuauhtémoc N° 898, PB, Col. Del Narvarte, C.P. 03020, Del. Benito Juárez, México, D.F; correo electrónico: <a>oip@sedecodf.gob.mx</a>'+
														'<br/><br/><strong>El titular de los datos podrá dirigirse al Instituto de Acceso a la Información Pública y Protección de Datos Personales del Distrito Federal, donde recibirá asesoría sobre los derechos que tutela la Ley de Protección de Datos Personales para el Distrito Federal al teléfono: 5636-4636; correo electrónico:<a> datos.personales@infodf.org.mx </a>o <a>www.infodf.org.mx</a></strong>'+
										'</p>'+
								'</div>'+
								'<div class="modal-footer" >'+
									'<a id="nose" href="#!" style="color:#FFF; background:#E2007A" class="modal-action modal-close waves-effect waves-green btn-flat">Aceptar</a>'+
								'</div>'+
						'</div>';
			
						
					return chain;
			},
			
			getErrorModal2:function(title,msgs){
				$("#modal2").remove();
				var chain='';
				for(var x in msgs){
					chain+='<p>'+msgs[x]+'</p>';
				}
				var chain='<div id="modal2" style="height: 259px !important;width: 556px !important;" class="modal modal-fixed-footer modal-container">'+
								'<div class="modal-content">'+
										'<h4 class="modal-title" style="text-align: center;">'+title+'</h4>'+
										'<center>'+
										chain+
										'</center>'+
								'</div>'+
								'<div class="modal-footer" >'+
									'<a  href="#!" style="color:#FFF; background:#E2007A" class="modal-action modal-close waves-effect waves-green btn-flat">Aceptar</a>'+
								'</div>'+
						'</div>';
			
					return chain;
			},
			getErrorCheck:function(){
				var chain='<div id="modal3" style="height: 181px !important;width: 394px !important;" class="modal modal-fixed-footer modal-container">'+
								'<div class="modal-content">'+
									'<h4 class="modal-title" style="text-align: center;">¡Campo requerido!</h4>'+
										
											'<p class="modal-txt" style="text-align: center;">Es necesario que leas y aceptes los términos y condiciones </p>'+
										
								'</div>'+
								'<div class="modal-footer" >'+
									'<a id="nose" href="#!" style="color:#FFF; background:#E2007A" class="modal-action modal-close waves-effect waves-green btn-flat">Aceptar</a>'+
								'</div>'+
						'</div>';
			
						
					return chain;
			},
			getAceptarCheck:function(){
				var chain='<div id="modal4" style="height: 236px !important;width: 467px !important;" class="modal modal-fixed-footer modal-container">'+
								'<div class="modal-content">'+
									'<h4 class="modal-title" style="text-align: center;">¡Tu solicitud se ha enviado con éxito!</h4>'+
										
										'<p class="modal-txt" style="text-align: center;"> En un momento recibirá un mensaje a la cuenta de correo electrónico que proporcionaste, le pedimos de favor revises si este llego a su “Bandeja de Entrada”, de no ser así, revise su bandeja de “Correos no deseados”. ¡Gracias! </p>'+
								'</div>'+
								'<div class="modal-footer" >'+
									'<a id="nose" href="#!" style="color:#FFF; background:#E2007A" class="modal-action modal-close waves-effect waves-green btn-flat">Aceptar</a>'+
								'</div>'+
						'</div>';
			
						
					return chain;
			}
			
		
	}
	
	
	
})