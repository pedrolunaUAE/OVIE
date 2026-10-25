define(['code/config',
		'code/getData',
		'code/modules/validator',
		'code/ovieFooter',
		'tooltip'
		],function(
		config,
		getData,
		validator,
		Footer,
		tooltip
		){	return{
			localData:{areaSel:null},
			getIdContainer:function(){
					return config.menu[0].id;
			},
			updateMapping:function(){
				$("#calculator_areaMap").mapping('update');
			},
            //aqui van las variables globales
			gralCont:0,
			varList:[],
			clase:"ovieSprite-menu-plusS",
			varsTable:[],
			calcTable:[],
			//variables que tienen los valores de los atributos de calcTable
			alg:null,
			op:null,
			unid:"",
			cveScian:null,
			//variables contadoras de las listas en las tablas
			varsCont:1,
		    calcCont:1,
			//variables para llenar reportes pdf
			variables:[],
			calculos:[],
			varAlias:null,
			operador:false,
			
			
			
			init:function(main){
				var obj = this;
				obj.main = main;
				obj.getData = getData.getData;
				
				var localUrl = require.toUrl("code");
					localUrl = localUrl.split('?')[0];
		
				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_calculator.css?v=2'}).appendTo('head'),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					obj.createUI();
				});
				 obj.eventScroll();
			},
            _refresh:function(){
				var obj = this;
				$("#calculator_areaMap").mapping({features:obj.main.localData.geoList});
				$("#calculator-geoArea_list").areas({data:obj.main.localData.geoList});
			},
            displayFeatures:function(features){
				var map = $("#calculator_areaMap");
				map.mapping('actionMarker',{action:'delete',items:'all',type:'soc'});
				for(var x in features){
					var f = features[x];
					var c = f.position.mercator.split(',');
					switch (f.geometry) {
                        case 'point':
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'soc',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
							break;
						default:
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'soc',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
                    }
				}
			},
			displayFeatures2:function(features){
				var map = $("#calculator_areaMap");
				map.mapping('actionMarker',{action:'delete',items:'all',type:'soc'});
				for(var x in features){
					var f = features[x];
					var c = f.position.mercator.split(',');
					switch (f.geometry) {
                        case 'point':
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'soc',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
							break;
						default:
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'soc',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
                    }
				}
			},
            addAreaMap:function(item){
				var obj = this;
				var cadena = '<input id="radiovalue" placeholder="Ingrese el valor" type="number" />'
				var btnAccept = function(){
					var val = parseInt($('#radiovalue').val()|0);
					$("#calculator_areaMap").mapping('addBufferToGeometry',item.id,val,item.tabla,item.label);
					$("#calculator-tabArea").customTab('activate','calculator-geoArea_list');
				}
				if (item.geometry=='polygon') {
                    btnAccept();
                }else{
					obj.main.openModal('Indique el &aacute;rea de influencia alrededor del elemento seleccionado',cadena,function(){
						btnAccept();
					});
					$('#radiovalue').focus();
					$('#radiovalue').keyup(function(e){
						if(e.keyCode == 13){
							btnAccept();
							obj.main.closeModal();
						}
					});
				}
			},
            onAreaAdded:function(data){
				var obj = this;
				obj.main.localData.geoList.push(data);
				obj.displayAreas();
			},
            onAreaSel:function(item){
				var obj = this;
				obj.localData.areaSel = item;
				//obj.displayResults(item);  
				$("#calculator_areaMap").mapping('goCoords',item.wkt);
			},
            onAreaDeleted:function(id){
				var list=this.main.localData.geoList;
				var pos=null;
				for(var x in list){
						var i=list[x].db;
						if(id==i){
							pos=x;
							break;
						}
					}
				if(pos){
					list.splice(pos,1);
				}
				$("#calculator_results").html("");//para limpiar el área de resultados 
			},
            displayAreas:function(){
				var obj = this;
				$('#calculator-geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						$("#calculator_areaMap").mapping('removeFeatureByDB',item.db);
						obj.onAreaDeleted(item.db);
					}
				});
			},
			getSpinnerExportFile:function(){
				var obj = this;
				var chain = '<div class="spinnerExport">'+
								'<div class="export-container">'+
									'<img class="image" src="img/icons/export.png">'+
									'<div class="preloader-wrapper big active">'+
										'<div class="spinner-layer spinner-blue-only">'+
										  '<div class="circle-clipper left">'+
												'<div class="circle"></div>'+
										  '</div><div class="gap-patch">'+
												'<div class="circle"></div>'+
										  '</div><div class="circle-clipper right">'+
												'<div class="circle"></div>'+
										  '</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
				return chain;
			},
            createUI:function(){
				var obj = this;
				obj._id="calculator-container";
				var chain='<div id="'+obj._id+'" class="width-content">'+
                            '<div class="row">'+
                                '<div class="col s12 m5" style="margin-top:-7px">'+
                                    '<div id="calculator-tabArea"></div>'+
                                '</div>'+
                                '<div class="col s12 m7"><div id="calculator_areaMap" class="calculator-areaMap"></div></div>'+
						  	'</div>'+	
                            '<div class="row">'+
                                '<div class="col s12 m5 l7">'+
									'<div id="calculator-tabVars"></div>'+
									'<div id="calculator_activities"></div>'+
									//'<div class="actEco-list-container card"></div>'+
								'</div>'+
								'<div class="col s12 m7 l5"><div id="calculator-interfaceWrap"></div></div>'+
							'</div>'+
						    '<div class="row">'+
								'<div id="calculator-reports"></div>'+
							'</div>'+
							//Botón de exportación
							'<div class="fixed-action-btn" style="bottom: 24px; right: 24px;">'+
								'<a class="btn-floating btn-large " style="background:#6E1A1A">'+
									'<i class="material-icons">'+
										'<img src="js/app/widgets/results/export.png" style="margin-top: 5px;">'+
									'</i>'+
								'</a>'+
								'<ul>'+
									//'<li><a class="btn-floating exportKml" style="background:#6E1A1A"><i class="material-icons"><img src="js/app/widgets/results/kml.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
									'<li><a class="btn-floating exportBtn" style="background:#6E1A1A"><i class="material-icons"><img src="js/app/widgets/results/pdf.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
								'</ul>'+
							'</div>'+
							Footer.get()+
							obj.getSpinnerExportFile()+
						  '</div>';
                            
                $('#container_mnu_calculator').html(chain);
				
				//Botones asociados a las tablas de la calculadora ***deshabilitados
				/*var btnClean='<div>'+
								'<center><div class="ovieSprite ovieSprite-calculator-clean" ></div></center>'+
								'<div style="font-size:10pt">Borrar</div>'+
							 '</div>';
				var btnPrint='<div>'+
								'<center><div class="ovieSprite ovieSprite-calculator-print" ></div></center>'+
								'<div style="font-size:10pt">Imprimir</div>'+
							 '</div>';
				var btnDownload='<div>'+
								'<center><div class="ovieSprite ovieSprite-calculator-download" ></div></center>'+
								'<div style="font-size:10pt">Descargar</div>'+
							 '</div>';*/
							 
				var backArrow='<div style="margin-top:-7px;"><img src="js/app/css/img/backArrowPink.png" style="margin-bottom:-3px;margin-left:7px"><p class="backLabel">regresar</p></div>';
				//var information='<div style="margin-left:-15px"><img src="img/icons/information.png"></div>';
				var information='Descripción de variables';
				var widthWindow=$(window).width();
				if (widthWindow<=993){
					information='<div><img src="img/icons/information.png"></div>';
				}
				
				
				$("#calculator-tabArea").customTab({sections:[{label:'Buscar en el mapa',id:'calculatorSearchArea',overflow:false},{label:'&Aacute;reas de selecci&oacute;n',id:'calculator-geoArea_list',overflow:true}],height:610});
				//$("#calculator-tabVars").customTab({title:'Actividad econ&oacute;mica',sections:[{label:backArrow,id:'backArrow_tab',overflow:true},{label:'Selección de variables',id:'varSelection',overflow:true},{label:'Actividades econ&oacute;micas',id:'calculator_ActEco',overflow:true}],height:550});
                $("#calculator-tabVars").customTab({sections:[{label:'Selección de variables',id:'varSelection',overflow:true},{label:'Selección de actividad', id:'actSelection'},{label:information, id:'metadato'}],height:550});
				$("#calculator_activities").customTab({title:'Actividad econ&oacute;mica',sections:[{label:backArrow,id:'backArrow_tab',overflow:true},{label:'Principales',id:'calculator_ActEco',overflow:true},{label:'Buscar',id:'calculator_EcoSearch',overflow:true},{label:'Ver todas',id:'calculator_EcoSeeAll'}],height:550});
				$("#calculator-reports").customTab({sections:[{label:'Reportes',id:'calculatorReports',overflow:true}/*,{label:btnClean,id:'calculatorTableDelete',overflow:false},{label:btnDownload,id:'calculatorTableDownload',overflow:false},{label:btnPrint,id:'calculatorTablePrint',overflow:false}*/],height:300});
              
				$("#calculator_activities").css("display", "none");
							  
                 $('#calculatorSearchArea').searchWidget({
					 searchType:'areas',
					 enabled:true,
					 inactiveText:'Buscar áreas',
					 dataSource:config.dataSource.searchAreas,
					 response:{     
						  asMenu:false,
						  height:550,
						  resultPath:'response.docs',
						  countPath:'response.numFound',
						  btnIcon:'mdi-content-add-circle',
						  btnTitle:'Agregar área',
						  propertiesTranslate:{
								busqueda:'label',
								tipo:'typeLabel',
								'coord_merc':'position.mercator',
								'locacion':'position.geographic',
								id:'id',
								'tabla':'tabla',
								wkt:'wkt'
						  }  
					  },
					  onResponse:function(data){
						obj.displayFeatures(data);
					},
					onClear:function(){
						obj.displayFeatures();
					},
					onClickItem:function(data){
						$("#calculator_areaMap").mapping('goCoords',data.wkt);
					},  
					events:function(trigger,value){
						switch(trigger){
							case 'mdi-content-add-circle':
								obj.addAreaMap(value);
							break;
						}
					}	
				});
				 
				//Contenedor del nombre del giro seleccionado
				var giroContainer='<div class="showGiro"><span style="font-weight:bold; color:#4A1212;">Giro seleccionado:</span><span class="giroValue"></span></div>';
				$("#varSelection").html(giroContainer);
				
				//buscador de actividades
				$('#calculator_EcoSearch').searchWidget({
						 activitySelected:obj.activitySelected, 
						 searchType:'actividad',
						 enabled:true,
						 inactiveText:'Buscar actividad económica',
						 dataSource:config.dataSource.searchAct,
						 response:{
							  asMenu:false,
							  height:384,
							  resultPath:'response.docs',
							  countPath:'response.numFound',
							  btnIcon:null,
							  btnTitle:null,
							  propertiesTranslate:{
									nombre:'label',
									tipo:'typeLabel',
									'coord_merc':'position.mercator',
									'locacion':'position.geographic',
									id:'id',
									'tabla':'tabla'
							  }  
						  },
						onClickItem:function(a,b,c){
							obj.clearItems(true);
							$("#calculator-container #sa_results_calculator_EcoSearch #"+a+"").addClass('active');
							//desplegar valor del giro seleccionado en la sección de variables
							obj.giroValue(b);
							
							obj.activitySelected(a,b,c);
							console.log(a,b,c);
							obj.cveScian=c;
						}
						
				});
				
				//Ver lista completa de actividades
				$("#calculator_EcoSeeAll").activityList({
					config:config,
					//esta funcion selected me trae los valores que tiene esta misma funcion internamente en el widget
					selected:function(label,id){
						obj.cveScian=id;
						console.log(obj.cveScian);
						//desplegar valor del giro seleccionado en la sección de variables
						obj.giroValue(label);	
					}
				});
				//
				 
                $("#calculator_areaMap").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:true},features:obj.main.localData.geoList,
														onAddFeature:function(data){
															obj.onAreaAdded(data);
														},
														identify:function(point){
																
														}
													});
                $('#calculator-geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						
						$("#calculator_areaMap").mapping('removeFeature',item.id);
						obj.onAreaDeleted(item.db);
					}
				});
				
				//Construccion de estructura de menu de variables
				var cadena='<div class="tree-menu demo" id="tree-menu">'+
						   '</div>';
					
				$("#varSelection").append(cadena);
				
				//Construccion de estructura de listado de actividades
				var listContainer='<div class="calculator-actlist-wrap">'+
								  '</div>'+
				$("#calculator_ActEco").html(listContainer);			  
				
				//$('#varSelection').ntm();
				
				obj.requestVariables(0,"tree-menu","tree"); //peticion para obtencion de variables
				obj.requestActCatalog();
				obj.buildCalculator(); //constructor de módulo calculadora
				obj.buildReports();
				
				//Clicks a botones de exportacion 
				$("#calculator-container .exportBtn").click(function(){
					var indice=1;
					for(var x in obj.calculos){
						var id=obj.calculos[x].notaID;
						//var valor=$("#"+id).html();
						//var user= $("#"+obj.id+" input[id=login_user]").val();
						//var valor= $("#"+obj.id+" input[id=login_user]").val();
						var valor=$("#input-field"+indice).children().val();
						if (!valor) {
                            valor=$("#"+id).html();
                        }
						obj.calculos[x].nota=valor;
						indice=indice+1;
					}
					var params = {variables:obj.variables,calculations:obj.calculos,areaName:obj.localData.areaSel.name};
					obj.report(params);
				});
				
				$("#calculator-container .exportKml").click(function(){
					var seleccionado=$("#calculator-geoArea_list").areas('getSelected');
					var id  = null;
					var data  = null;
					if (seleccionado) {
                        id = seleccionado.db;
						var data = [{label:'&Aacute;rea',value:seleccionado.area}];
                    }
					$("#calculator_areaMap").mapping('getKml',{id:id,addMarkers:true,data:data});
				});
				
				
				
			},// fin de create
			
			//request lista de principales actividades economicas (es necesario seleccionar alguna para emplear la variable giro)
			requestActCatalog:function(clv){
				var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.dataSource.providers.catalog;
				var tab = $("#tabVocEcoAct");
				var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success){
								valid=true;
								var catalog = json.data.providers;
								obj.displayActCatalog(catalog);	
							}else{
							msg=json.response.message;
							 }
						}
						if (!valid) {
							 Materialize.toast(msg, 4000);
						}
					
					},
					beforeSend: function(solicitudAJAX) {
						
                            tab.customTab('showSpinner');
                        
					},
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					},
					complete: function(solicitudAJAX,estatus) {
						
                            tab.customTab('hideSpinner');
                       
					}
				};
				r = $.extend(r, c);
				r.url=config.dataSource.server+r.url+((clv)?'/'+clv:'');
				//r.data = (c.stringify)?JSON.stringify(params):params;
				$.ajax(r);
			},
			
			displayActCatalog:function(actList){
				var obj = this;
				var cadena = '<div class="collection">';
				var list = actList;
				for (var x in list){
					var item = list[x];
					if (item.type==1) {
					   cadena+= '<a href="#!" idref="'+item.id+'" type="'+item.type+'" class="act-item collection-item">'+item.desc_corto+'</a>'
					}
				}
					cadena+= '</div>';
					$('#calculator_ActEco').html(cadena);
					$('.act-item').click(function(){
							obj.clearItems();
							$(this).addClass('active');
							var id = $(this).attr('idref');
							obj.cveScian=id;//almacena la clave scian para mandarla al request del servicio
							var actividad=$(this).html();
							//desplegar valor del giro seleccionado en la sección de variables
							obj.giroValue(actividad);	
							//$("#calculator-tabVars").customTab('activate','varSelection');
							//$("#calculator_activities").css("display", "none");
							//$("#calculator-tabVars").css("display", "block");
					});
			},
			
			clearItems:function(notSearch){
				$("#calculator-container .act-item.active").removeClass('active');
				$(".activity-row-container").removeClass('active');
				if(!notSearch){
					$("#infoActEcoSearch .collection-item.active").removeClass('active');
				}
				$('#calculator-container .actEco-row-container.active').removeClass('active');
				$('#calculator-container #sa_results_calculator_EcoSearch .collection-item.active').removeClass('active');
			},
		    
			//click al listado de las actividades mediante el buscador
			activitySelected:function(actRow,actTxt,scian){
				var obj=this;
				obj.cveScian=scian;
				//$("#calculator_activities").css("display", "none");
				//$("#calculator-tabVars").css("display", "block");
			},
			
			giroValue:function(label){
				var obj=this;
				$(".giroValue").html("");
				$(".giroValue").html(" "+label);
			},
		
			//Request variables
			requestVariables:function(idVar,idRow,requesType,idArea,cveScian,alias){		
				var obj=this;
				//revisar que tipo de peticion se debe hacer
				if (requesType=="tree"){
					urlVar="variable/"+idVar;
				}
					if(requesType=="vars"){
						urlVar=idArea+'/'+idVar;
					}
						if (requesType=="giro"){
							if (cveScian!=null) {
                               urlVar=idArea+'/'+cveScian+'/'+idVar;
                            }else{
								  Materialize.toast('Para poder continuar elige una actividad económica', 3000);
							}
						}
				var request = {
				type: config.dataSource.calculator.type,
				dataType: config.dataSource.calculator.dataType,
				url:config.dataSource.server+config.dataSource.calculator.url+urlVar,
				data: JSON,
				contentType:config.dataSource.calculator.contentType,
				success:function(json,estatus){
					  var error=false;
					  if(json){
						  if(json.response.success){
							  console.log(json.data);
							  if(requesType=="tree"){obj.buildvarsMenu(json.data,idVar,idRow);}
							  if(requesType=="vars" || requesType=="giro"){obj.showVarvalue(json.data);obj.saveVarsTable(json.data, idVar,alias);}
							  //if(){obj.showVarvalue(json.data);}
						  }else{
							  error=true;
							  
						  }
					  }else{
						  error=true
					  }
					  if(error){
						  alert("no valido")
					 }
					},
					beforeSend: function(solicitudAJAX) {
					  
					},
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					  
					},
					complete: function(solicitudAJAX,estatus) {
					  
					}
				};
				$.ajax(request);
			},
			//
			
			buildvarsMenu:function(data,idVar,idRow){
				var obj=this;
				var varsData=data.variable;
				var id=null;
				var type=null;
				var arrowClass="";
				var chain="";
				
				for(var x in varsData){
					var varName=varsData[x].name;
					var menu=varsData[x].name.trim();
					var alias=varsData[x].alias;
					id=varsData[x].id;
					type=varsData[x].type;
					
					if (type>3) {
                            arrowClass="ovieSprite-arrowRight-large";
							var units=varsData[x].units
					}
					
					chain+='<ul id="treeMenu_'+id+'">'+
								'<li class="varRow" id="calculator_'+id+'" idVar='+id+' varLevel="'+type+'">'+
									'<a href="#">'+
										((type<=3)?'<div id="sprite_'+id+'" class="ovieSprite ovieSprite-menu-plusS" style="float:left; margin-top:3px; cursor:auto"></div>':'')+
										'<span id="varName_'+id+'" alias='+alias+' units='+units+'>'+varName+'</span>'+
										'<div id="arrow_'+id+'" idVar='+id+' class="addVar-arrow ovieSprite '+arrowClass+'" style="float:right"></div>'+
									'</a>'+
								'</li>'+
							'</ul>';
						   
				}
				
				
                   $('#'+idRow).append(chain);
				   obj.events(idRow);
            },	
			
			events:function(id){
				var obj=this;
				
			    $('#'+id+' .varRow').each(function(){
					
					$(this).click(function(event){
						var idVar=$(this).attr("idVar");
						var idRow=$(this).attr("id");
						var level=$(this).attr("varLevel");
						var varName=$('#varName_'+idVar+'').html();
						var spriteClass=$('#sprite_'+idVar+'').attr('class');
						
						$('#sprite_'+idVar+'').removeClass('ovieSprite-menu-plusS');
						$('#sprite_'+idVar+'').removeClass('ovieSprite-menu-restS');
						
						if (level>3) {
                           $('#arrow_'+idVar+'').addClass('ovieSprite-arrowRight-large');
						   $(this).attr('last','true');
						   /*Agregar la variable con darle click al renglón no necesariamente en la flecha*/
						   var idVar=$(this).attr("idVar");
						   var spriteClass=$('#sprite_'+idVar+'').attr('class');
						   var idVar=$(this).attr("idVar");
						   var varTxt=$('#varName_'+idVar+'').attr('alias');
					
						   //verifica si hay un area seleccionada
					       if (obj.localData.areaSel) {
                           var idArea=obj.localData.areaSel.db;
						   var unitChain=$('#varName_'+idVar+'').attr('units');
						   //***************************************************************
						   var valor=$('.calculator-varsOperation').html();
						   var longitud=valor.length;
						   var caracter=valor.substring(longitud-1);
						   var operador=['(', ')', '+', '-', '/', '*'];
								if (longitud>0) {
									if ((caracter=='(')||(caracter==')')||(caracter=='+')||(caracter=='-')||(caracter=='/')||(caracter=='*')) {
										obj.unid=obj.unid+unitChain;
									}
								}else{
										obj.unid=unitChain;
										//obj.unid="";
									 }
								
							//***************************************************************
							//obj.unid=obj.unid+unitChain;
						}else{
							Materialize.toast('Debes seleccionar un área', 3000);
							varTxt="";
						}
						if (obj.cveScian) {
                             obj.requestVariables(idVar, null, "giro", idArea, obj.cveScian, varTxt);
							 //obj.cveScian=null;
                        }else{
							    //Si la variable es superficie tomar el valor que despliega el widget áreas
								if((idVar==179)&&(level==4)){
									var val=obj.localData.areaSel.area;
									var newVal=val.split(' ');
									newVal=parseFloat(newVal[0],10);
									var data={valor:newVal};
									obj.showVarvalue(data);
									obj.saveVarsTable(data, idVar,varTxt);
								}else{
									obj.requestVariables(idVar, null, "vars", idArea, null, varTxt);
								}
						}
						   
						   /********/
                        }
						//cambiar de tab al seleccionar giro
						if (idVar==3 && varName=="Giro" && obj.gralCont==0) {
							obj.gralCont=obj.gralCont+1;
							obj.toggleTab('actividades');
							//$("#calculator_activities").css("display", "block");
							//$("#calculator_activities").customTab('activate','calculator_ActEco');
							//$("#calculator-tabVars").css("display", "none");
                           Materialize.toast('Elige una actividad económica', 3000);
						}
						
						var exist=obj.verifica(idVar);
						var ultimo=$(this).attr('last');
						
						if ((exist==false)&&(!ultimo)) {
							//Parametros para el request (idVar,idRow,requesType,idArea,cveScian)
                            obj.requestVariables(idVar, idRow, "tree",null, null,null);
							
                        }
						
						if (!spriteClass) {
                            $('#sprite_'+idVar+'').addClass('ovieSprite-menu-restS');
							$('#'+idRow+' ul').show();
                        }else{
								if ((spriteClass.indexOf("plus")!=-1)&&(!ultimo)) {
									$('#sprite_'+idVar+'').addClass('ovieSprite-menu-restS');
									$('#'+idRow+' ul').show();
									
								}else{
									$('#'+idRow+' ul').hide();
									$('#sprite_'+idVar+'').addClass('ovieSprite-menu-plusS');   
								}
						}	
						 event.stopPropagation();
						
					});	
				})
				
				$(".addVar-arrow").each(function(){
					$(this).unbind('click');
					$(this).click(function(e){
						var idVar=$(this).attr("idVar");
						var varTxt=$('#varName_'+idVar+'').attr('alias');
						//verifica si hay un area seleccionada
					    if (obj.localData.areaSel) {
						   var idArea=obj.localData.areaSel.db;
						   var unitChain=$('#varName_'+idVar+'').attr('units');
						   //***************************************************************
						   var valor=$('.calculator-varsOperation').html();
						   var longitud=valor.length;
						   var caracter=valor.substring(longitud-1);
						   var operador=['(', ')', '+', '-', '/', '*'];
								if (longitud>0) {
									if ((caracter=='(')||(caracter==')')||(caracter=='+')||(caracter=='-')||(caracter=='/')||(caracter=='*')) {
										obj.unid=obj.unid+unitChain;
									}
								}else{
										obj.unid=unitChain;
										//obj.unid="";
									 }
							//***************************************************************
							//obj.unid=obj.unid+unitChain;
						}else{
							Materialize.toast('Debes seleccionar un área', 3000);
							varTxt="";
						}
						if (obj.cveScian) {
                             obj.requestVariables(idVar, null, "giro", idArea, obj.cveScian, varTxt);
							 //obj.cveScian=null;
                        }else{
								var prueba=$(this).attr("giro");
								//Si la variable es superficie tomar el valor que despliega el widget áreas
								if(idVar==179){
									var val=obj.localData.areaSel.area;
									var newVal=val.split(' ');
									newVal=parseFloat(newVal[0],10);
									var data={valor:newVal};
									obj.showVarvalue(data);
									obj.saveVarsTable(data, idVar,varTxt);
								}else{
									obj.requestVariables(idVar, null, "vars", idArea, null, varTxt);
								}
							
						}
						
						e.stopPropagation();
					})
				})
				
				$('#headeractSelection').click(function(){
					obj.toggleTab("actividades");
					//$("#calculator_activities").css("display", "block");
					//$("#calculator_activities").customTab('activate','calculator_ActEco');
					//$("#calculator-tabVars").css("display", "none");
				});
				
				$('#headerbackArrow_tab').click(function(){
					if (obj.cveScian!=null) {
                        obj.toggleTab("variables");
						$(".showGiro").css("display", "block");
						$("#tree-menu").css("top", "35px");
                    }else{
						 Materialize.toast('Para poder continuar elige una actividad económica', 3000);
						 obj.toggleTab("actividades");
					}
					e.stopPropagation();
				});
				
				$("#headermetadato").unbind();
				$("#headermetadato").click(function(){
					window.open("docs/variablesCalculadora.pdf");
				});
					
			
			},
		
			//Revisa si entre variables hay un operador matematico  
			hayOperador:function(varTxt){
				var obj=this;
				var siHay=false;
				obj.operador=false;
				//validar que haya un operador ( * / ( ) + - ) entre variables
				var valor=$('.calculator-varsOperation').html();
				var longitud=valor.length;
				var caracter=valor.substring(longitud-1);
				var operador=['(', ')', '+', '-', '/', '*'];
					if (longitud>0) {
                        if ((caracter=='(')||(caracter==')')||(caracter=='+')||(caracter=='-')||(caracter=='/')||(caracter=='*')) {
							$('.calculator-varsOperation').append(varTxt);
							siHay=true;
							obj.operador=true;
							//$('.calculator-numbersOperation').append(varNum);
						}else{
								Materialize.toast('Debes seleccionar un operador', 3000);
							}
                    }else{
							$('.calculator-varsOperation').append(varTxt);
							siHay=true;
							obj.operador=true;
							//$('.calculator-numbersOperation').append(varNum);
						 }
				return siHay;		 
						//
			//
			},
			
			
			//cambia las pestañas según se necesite entre actividades y variables
			toggleTab:function(id){
					var obj=this;
					if (id=="actividades") {
                       $("#calculator_activities").css("display", "block");
					   $("#calculator_activities").customTab('activate','calculator_ActEco');
					   $("#calculator-tabVars").css("display", "none"); 
                    }else{
					   $("#calculator-tabVars").css("display", "block");
					   $("#calculator-tabVars").customTab('activate','varSelection');
					   $("#calculator_activities").css("display", "none");
					}
			},
			
			//muestra el valor de la variable seleccionada
			showVarvalue:function(data){
				var obj=this;
				//obj.hayOperador(null,data.valor);
				//$('.calculator-numbersOperation').append(data.valor);
				var valor=$('.calculator-numbersOperation').html();
				var longitud=valor.length;
				var caracter=valor.substring(longitud-1);
				var operador=['(', ')', '+', '-', '/', '*'];
					if (longitud>0) {
                        if ((caracter=='(')||(caracter==')')||(caracter=='+')||(caracter=='-')||(caracter=='/')||(caracter=='*')) {
							$('.calculator-numbersOperation').append(data.valor); 
						}else{
							 //Materialize.toast('Debes seleccionar un operador', 3000);
							//reiniciar valores que se almacenan para llenar la tabla2
								//obj.varsTable=[];
								obj.calcTable=[];
							 }
                    }else{
						  $('.calculator-numbersOperation').append(data.valor);
						 
						  }
				
			},
			 
			//LLenar objeto con datos para llenar la tabla1
			saveVarsTable:function(data,idVar,alias){
				var obj=this;
				var operatorOn=obj.hayOperador(alias);
				var varSelected=$('#varName_'+idVar+'').html();
				var varValue=data.valor;
				var units=$('#varName_'+idVar+'').attr('units');
				var existe=obj.verifica(idVar);
				var params={variable:varSelected, dato:varValue, alias:alias, unidades:units, idVar};
				if ((existe==false)&&(operatorOn==true)) {
                   obj.varsTable.push(params);
                }else{
					 obj.verificaTable(idVar, params);	
				}
				
			},
			
			//funcion que verifica si a ese item del menu ya se le dio click una vez 
			verifica:function(idVar){
				var obj=this;
				var exist=false;
				for (var x in obj.varList){
					if (idVar==obj.varList[x]) {
                       var exist=true;
					}
				}
				if (exist==false) {
                    obj.varList.push(idVar);
                }
				return (exist);
			},
			
			verificaTable:function(idVar,params){
				var obj=this;
				var exist=false;
				var varsTable=obj.varsTable;
				for (var x in varsTable){
					if (idVar==varsTable[x].idVar) {
                     exist=true;   
                    }
				}
				if ((!exist)&&(obj.operador==true)) {
                    //code
					varsTable.push(params);
                }
				
			},
			
			
			buildCalculator:function(){
              var obj=this;
              var chain='<div class="calculator-mainContainer">'+
							//Calculadora screen
							'<div class="calculator-displayWrap valign-wrapper">'+
								'<div class="calculator-displayContainer valign">'+
									'<div class="calculator-varsOperation display-section" style="font-size:13pt"></div>'+
									'<div class="calculator-numbersOperation display-section"></div>'+
								'</div>'+
							'</div>'+
							//Calculadora buttons
							'<div class="calculator-buttonsContainer">'+
								//obj.getButtons()+
							'</div>'+
							//Calculadora footer
							'<div class="calculator-footerWrap">'+
								'<div class="calculator-cleanButton row">'+
									'<div class="col s2 calculator-cleanBtn" style="float:left">'+
										'<div class="calculator-cleanIcon ovieSprite ovieSprite-calculator-cleanB"></div>'+
										'<span class="calculator-iconLabel">Limpiar</span>'+
									'</div>'+
								'<div class="calculator-saveButton">'+
									'<div class="col s2 calculator-saveBtn" style="float:left">'+
										'<div class="calculator-saveIcon ovieSprite ovieSprite-calculator-save"></div>'+
										'<span class="calculator-iconLabel">Guardar</span>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
				$("#calculator-interfaceWrap").html(chain);
				obj.getButtons();
            },
			
			getButtons:function(){
				var obj=this;
				var btns={
						  linea1:['atras','7','8','9','(',')'],	
						  linea2:['.','4','5','6','+','-'],
						  linea3:['0','1','2','3','/','*'],
						  linea4:['=','% colonia','% municipio','% Nayarit']
				}
				
				var chain=" ";
				var cont=0;
				var conty=1
				var btnLabel=""
				var clase="";
				var color="";
				var stylePos="";
				var styleBorder="";
				
				var firstBtn=null;
				
					while (cont<3) {
					   btnLabel='linea'+conty;
					   if (cont==0) {
							clase="ovieSprite ovieSprite-calculator-arrow";
							firstBtn="";
							color="#6E1A1A";
							stylePos="float:left";
							styleBorder="none";
							
					   }else{
							clase="btn-labelStyle";
							firstBtn=btns[btnLabel][0];
							color="#f3f3f3";
							stylePos="";
							styleBorder="";
							}
					  
						
                       chain+='<div class="row buttons-fila">'+
								'<div class="col s2 button-wrap">'+
									'<div class="btn-border" style="background-color:'+color+'; border:'+styleBorder+'" btnValue='+btns[btnLabel][0]+'><center><span class="'+clase+'" style="'+stylePos+'">'+firstBtn+'</span></center></div>'+
								'</div>'+
								'<div class="col s2 button-wrap">'+
									'<div class="btn-border" btnValue='+btns[btnLabel][1]+'><center><span class="btn-labelStyle">'+btns[btnLabel][1]+'</span></center></div>'+
								'</div>'+
								'<div class="col s2 button-wrap">'+
									'<div class="btn-border" btnValue='+btns[btnLabel][2]+'><center><span class="btn-labelStyle">'+btns[btnLabel][2]+'</span></center></div>'+
								'</div>'+
								'<div class="col s2 button-wrap">'+
									'<div class="btn-border" btnValue='+btns[btnLabel][3]+'><center><span class="btn-labelStyle">'+btns[btnLabel][3]+'</span></center></div>'+
								'</div>'+
								'<div class="col s2 button-wrap">'+
									'<div class="btn-border" btnValue='+btns[btnLabel][4]+' style="background:#6E1A1A; border:none"><center><span class="btn-labelStyle" style="color:#FFF">'+btns[btnLabel][4]+'</span></center></div>'+
								'</div>'+
								'<div class="col s2 button-wrap">'+
									'<div class="btn-border" btnValue='+btns[btnLabel][5]+' style="background:#6E1A1A; border:none"><center><span class="btn-labelStyle" style="color:#FFF">'+btns[btnLabel][5]+'</span></center></div>'+
								'</div>'+
						      '</div>'
                    cont=cont+1;
					conty=conty+1;
				    }
					if (cont==3) {
						btnLabel='linea'+conty;
						chain+= '<div class="row buttons-fila">'+
									'<div class="col s4" style="height:100%"><div></div></div>'+
									'<div class="col s4 button-wrap">'+
										'<div class="btn-border" btnValue='+btns[btnLabel][0]+'><center><span class="btn-labelStyle">'+btns[btnLabel][0]+'</span></center></div>'+
									'</div>'+
									'<div class="col s4" style="height:100%"><div></div></div>'+
									
									/*'<div class="col s10 buttons-sections">'+
										'<div class="row btn-border" style="width:100%; background:#6E1A1A; border:none; padding-top: 7px;">'+
											'<div class="col s4"><center><span class="bar-btn-style">% <br>colonia</span></center></div>'+
											'<div class="col s4"><center><span class="bar-btn-style">% <br>delegación</span></center></div>'+
											'<div class="col s4"><center><span class="bar-btn-style">% <br>Nayarit</span></center></div>'+
										'</div>'+
									'</div>'+*/
								'</div>'		
                    }
					
				//}
				$('.calculator-buttonsContainer').append(chain);
				obj.calculatorEvents ();
			},
			
			calculatorEvents:function(){
				var obj=this;
				var value="";
				var expression="";
				var varExpression="";
				var result=null;
				var bandera=false;
				
				$(".btn-border").each(function(){
					$(this).click(function(){
						value=$(this).attr('btnValue');
						expression=$('.calculator-numbersOperation').html();
						varExpression=$('.calculator-varsOperation').html();
						
						//validar si hay un operador y sumarlo a la variable global unidades que se muestra en la tabla2
						if (value=="(" || value==")" || value=="+" || value=="-" || value=="/" || value=="*") {
						   obj.unid=obj.unid+value;
						   bandera=false;
                        }else{
							if ((value=="0" || value=="1" || value=="2" || value=="3" || value=="4" || value=="5" || value=="6"|| value=="7"|| value=="8"|| value=="9")&&(bandera==false)) {
                                bandera=true;
								obj.unid=obj.unid+'número';
							}
						}
						
						if (value=="atras") {
							value="";
							var varNumber=obj.backSpace(expression);
							var varValue=obj.backSpace(varExpression);
							
							if (varNumber=="") {
                                varValue="";
                            }
							
							$('.calculator-varsOperation').html("");
							$('.calculator-varsOperation').html(varValue);
									
							$('.calculator-numbersOperation').html("");
							$('.calculator-numbersOperation').html(varNumber);
							
						}
						
						if (value=="=") {
                            value="";
							bandera=false;
							var e=function evaluate (expr) {
								var r = null;
								try{
									var ans = math.eval(expr);
									r = true;
								}catch(err) {
									return math.format(ans);
								}
								return r;
							  }
							var a = e(expression);
							if (a && a!="undefined") {
								var error=obj.validValue(expression);
								if (error==true) {
									Materialize.toast('Hay un error en tu expresión, intenta de nuevo por favor', 3000);
									$('.calculator-numbersOperation').html("");
									$('.calculator-varsOperation').html("");
									//reiniciar valores que se almacenan para llenar la tabla2
									//obj.varsTable=[];
									obj.calcTable=[];
									obj.unid="";
									//eliminar las variables agregadas a varlist
									//obj.varList=[];
									
								}else{
									value=math.eval(expression);
									
									if (value % 1 != 0) {
									   value=value.toFixed(2);
									   //reportData.radio=validator.getFormatNumber(item.ratio)+' mts';
									}
									value=validator.getFormatNumber(value);
									//almacenar el valor operación para llenar la tabla de reporte2
									
									obj.op=$('.calculator-numbersOperation').html()+'='+value;
									obj.alg=$('.calculator-varsOperation').html();
									
									obj.calcTable.push({nota:null, algoritmo:obj.getSpaces(obj.alg), operacion:obj.getSpaces(obj.op), unidades:obj.getSpaces(obj.unid)});
									obj.unid=""; //prueba
									$('.calculator-numbersOperation').html("");
									$('.calculator-varsOperation').append("");
								}
                            }else{
								Materialize.toast('Hay un error en tu expresión, intenta de nuevo por favor', 3000);
								$('.calculator-numbersOperation').html("");
								$('.calculator-varsOperation').html("");
								//reiniciar valores que se almacenan para llenar la tabla2
								//obj.varsTable=[];
								obj.calcTable=[];
								obj.unid="";
								    //eliminar las variable agregadas a varlist
									//obj.varList=[];
									
							}
						}else{
							$('.calculator-varsOperation').append(value);
						}
						
						$('.calculator-numbersOperation').append(value);
						
					});	
				})
				
				$(".calculator-cleanBtn").click(function(){
					$('.calculator-numbersOperation').html("");
					$('.calculator-varsOperation').html("");
					obj.varsTable=[];
					obj.calcTable=[];
					obj.unid="";
				});
				
				$(".calculator-saveBtn").click(function(){
					//obj.calcTable.push({nota:null, algoritmo:obj.alg, operacion:obj.op, unidades:obj.unid});
					
					obj.fillTables();
					obj.calcTable=[];
					$('#calculator-reports').css('display', 'block');
					
					$('.calculator-varsOperation').html("");
					$('.calculator-numbersOperation').html("");
				});
			
			},
			
			validValue:function(value){
				var obj=this;
				var operador=["(", ")", "+", "-", "/", "*"];
				var test=null;
				var error=false;
				
				for (var x in operador){
					test=value.indexOf(operador[x]);
					if (test==-1) {
                        error=true;
                    }else{
						  error=false;
						  break;
						  }
				}
				return error;
			},
			
			backSpace:function(value){
				var obj=this;
				var e=value;
				var d = '';
				var operator = ['+','-','*','/','(',')'];
				for(var x=0; x < e.length;x++){
					var c = e.substr(x,1);
					if(operator.indexOf(c)>=0)
						{
							if(x==e.length-1){
                                d+='|'+c;
                            }else{
								if ((d[d.length-1]=='|')||(x==0)){
									 d+=c+'|';
								}else{
								  d+='|'+c+'|';
								}
							}
						}else{
								d+=c;
							 }
				}
				var op = d.split('|');
				var indice= op.length-1;
				op.splice(indice,1);
				
				var result=op.join("");
				return(result);
				
			},
			
			
			//estructura de los reportes
			buildReports:function(){
				var obj=this;
				var chain="";
				var tableHeaders=[];
				var cont=1;
				
					while (cont<=2) {
						if(cont==1){
							var tableHeaders=["Variables","checkbox","varNumber","variable","alias","dato","unidades"];
							obj.buildtableStructure(tableHeaders);
							
						}else{
							var tableHeaders=["Cálculos","checkbox","varNumber","nota","algoritmo","operación","unidades"];
							obj.buildtableStructure(tableHeaders);
						}
							cont=cont+1;
					}
			},
			
			buildtableStructure:function(tableHeaders){
				var obj=this;
				var chain="";
				chain+='<div class="table-mainWrap">'+
							'<div class="row reportBarTitle">'+
								'<div class="col s7 m9 l10 reporTitle">'+tableHeaders[0]+'</div>'+
							    '<div class="col s5 m3 l2">'+
									'<div class="row">'+
										'<div class="col s4 m5 l4 reportBtn" id="'+tableHeaders[0]+'btn_delete" type="'+tableHeaders[0]+'" funcion="delete"><span style="float:right">borrar</span></div>'+
										'<div class="col s8 m7 l8 reportBtn" id="'+tableHeaders[0]+'btn_deleteAll" type="'+tableHeaders[0]+'" funcion="deleteAll"><span style="float:left">borrar todo</span></div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							
							'<div class="table-content">'+
								'<table>'+
									'<thead>'+
										'<tr id="tableHeader_'+tableHeaders[0]+'" class="responsive-table">'+
											/*'<th id="checkboxTable"></th>'+
											'<th id="varNumber"></th>'+
											'<th>variable</th>'+
											'<th>dato</th>'+
											'<th>unidades</th>'+*/
										'</tr>'+
									'</thead>'+
									
									'<tbody id="tableBody_'+tableHeaders[0]+'" class="responsive-table">'+
										/*'<tr>'+
											'<td> <input type="checkbox" id="indeterminate-checkbox" />'+
												  '<label></label></td>'+
											'<td> 1 Población mujeres</td>'+
											'<td> 12,584</td>'+
											'<td> Personas</td>'+
										'</tr>'+*/
									'</tbody>'+
									
								'</table>'+
							'</div>'+
						  
						  '</div>';
						  
				$('#calculatorReports').append(chain);
				var headers=""
				var cont=1;
				var length=tableHeaders.length;
				
				for (var x in tableHeaders){
					if(cont<length){
						if (cont<=2) {
                            tableHeaders[cont]="";
                        }
						headers+='<th class="reportTable-header">'+tableHeaders[cont]+'</th>';
						cont=cont+1;
						$('#tableHeader_'+tableHeaders[0]+'').html(headers);
					}
				}
				
				$(".reportBtn").click(function(){
					//var obj=this;
					var type=$(this).attr('type');
					var funcion=$(this).attr('funcion');
					obj.reportBtnClick(type,funcion);
				});
			},
			reportBtnClick:function(tipo, funcion){
				var obj=this;
				if (funcion=="delete") {
					var i=(tipo=="Variables")?'var':'calc';
					var temp=(tipo=="Variables")?obj.variables:obj.calculos;
					obj.varLimit=obj.varLimit-1;
                   $("#tableBody_"+tipo+' input:checked').each(function(){
						var id=$(this).attr('id');
						var parent=$(this).attr('parent');
						$('#'+parent).remove();
						obj.deleteRow(temp,id);
						//Borrar el id de la variable de la lista de variables seleccionadas para que permita volver a ponerla en la tabla en caso de volver a seleccionarla
						if (i=="var") {
							var ideVar=$(this).attr('ideVar');
							obj.refreshvarList(ideVar);
						}
					});
				  
				   
				}
				if (funcion=="deleteAll") {
					obj.variables=[];
					obj.calculos=[];
					obj.varsTable=[];
					obj.calcTable=[];
					obj.varList=[],
					obj.varLimit=1;
					
					$('#tableBody_'+tipo+'').html('');
                }
			},
			
			deleteRow:function(temp,id){
				var obj=this;
				var pos=null;
				for(var x in temp){
					if (temp[x].id==id) {
                        pos=x;
						break;
                    }
				}
				if (pos) {
                    temp.splice(pos,1);
                }
				
			},
			
			//actualizar los valores de varList
			refreshvarList:function(ideVar){
				var obj=this;
				var deletePos=null;
				for (var y in obj.varList){
					if (ideVar==obj.varList[y]) {
                       deletePos=y;
					   obj.varList.splice(deletePos,1);
					   break;
					}
					var prueba=obj.varList;
				}	
			},
			
			fillTables:function(){
				var obj=this;
				var chain="";
				var cadena="";
				var vars = obj.varsTable;
					for (var x in vars){
						var i=vars[x];
						i.dato=validator.getFormatNumber(i.dato);
						//obj.variables.push({id:'varTest'+obj.varsCont, variable:i.variable, alias:i.alias, dato:i.dato, unidades:i.unidades});
						//verificar si ese elemento ya está agregado una vez en la tabla
						var printExist = $('input[ideVar='+i.idVar+']').attr('id');
						if (!printExist) {
							obj.variables.push({id:'varTest'+obj.varsCont, variable:i.variable, alias:i.alias, dato:i.dato, unidades:i.unidades});
							chain+='<tr id="varsRow'+obj.varsCont+'">'+
										'<td><form action="#"><p><input class="varTableCheckbox" type="checkbox" parent="varsRow'+obj.varsCont+'" id="varTest'+obj.varsCont+'" ideVar="'+i.idVar+'"/><label for="varTest'+obj.varsCont+'"></label></p></form></td>'+
										'<td>'+obj.varsCont+'</td>'+
										'<td>'+i.variable+'</td>'+
										'<td>'+i.alias+'</td>'+
										'<td>'+i.dato+'</td>'+
										'<td>'+i.unidades+'</td>'+
								   '</tr>';
							obj.varsCont=obj.varsCont+1;
						}
						
					}
				    //limitar a 10 el desplegado de variables en la tabla
					if (obj.variables.length<=8) {
						$('#tableBody_Variables').append(chain);
						$('#tableBody_Variables').css('display','');
                    }else{
					 Materialize.toast('El máximo de variables para guardar ha llegado a su limite', 3000);
					 }	
					
				
				//tabla de cálculos
					
					for (var x in obj.calcTable)
					{
						var item=obj.calcTable[x];
						
						cadena+='<tr id="calcRow'+obj.calcCont+'">'+
									'<td><form action="#"><p><input  class="calcTableCheckbox" type="checkbox" parent="calcRow'+obj.calcCont+'" id="calcTest'+obj.calcCont+'" /><label for="calcTest'+obj.calcCont+'"></label></p></form></td>'+
									'<td>'+obj.calcCont+'</td>'+
									'<td>'+
										'<div class="input-field" id="input-field'+obj.calcCont+'">'+
											'<input type="text" />'+
											'<label id="calcTable_Note'+obj.calcCont+'">"Analisis'+obj.calcCont+'"</label>'+
										'</div>'+
									'</td>'+
									'<td>'+item.algoritmo+'</td>'+
									'<td>'+item.operacion+'</td>'+
									'<td>'+item.unidades+'</td>'+
								'</tr>';
						
						obj.calculos.push({id:'calcTest'+obj.calcCont, notaID:'calcTable_Note'+obj.calcCont,nota:'', algoritmo:item.algoritmo, operacion:item.operacion, unidades:item.unidades});
						obj.calcCont=obj.calcCont+1;
					}
					
					$('#tableBody_Cálculos').append(cadena);
					$('#tableBody_Cálculos').css('display','');
					
			},
			
			getSpaces:function(chain){
				var obj=this;
				chain=chain+'';
				chain = chain.replace(/[\u0028]/gi,' ( ');
				chain = chain.replace(/[\u0029]/gi,' ) ');
				chain = chain.replace(/[\u002B]/gi,' + ');
				chain = chain.replace(/[\u002D]/gi,' - ');
				chain = chain.replace(/[\u002F]/gi,' / ');
				chain = chain.replace(/[\u002A]/gi,' * ');
				chain = chain.replace(/[\u003D]/gi,' = ');
				
				return chain;
			},
			
			showSpinnerExport:function(){
				var obj = this;
				$("#"+obj._id+" .fixed-action-btn").hide();
				$("#"+obj._id+" .spinnerExport").show();
			},
			
			hideSpinnerExport:function(){
				var obj = this;
				$("#"+obj._id+" .spinnerExport").hide();
				$("#"+obj._id+" .fixed-action-btn").show();
			},
			report:function(data){
				var obj = this;
				obj.showSpinnerExport();
				var blocks = {
					foot:{
						observation:[
							'Este programa es de carácter público, no es patrocinado ni promovido por partido político alguno y sus',
							'recursos provienen de los impuestos que pagan todos los contribuyentes.'
						],
						legend:[
							'Este programa es de carácter público, no es patrocinado ni promovido por partido político alguno y sus recursos provienen de los impuestos que pagan todos los contribuyentes.',
							'Está prohibido el uso de este programa con fines políticos, electorales, de lucro y de otros distintos a los establecidos. Quien haga uso indebido de los recursos de este programa',
							'deberá ser denunciado y sancionado con la Ley aplicable y ante la autoridad competente. Los datos y la información que se proporcionan son de carácter informativo para fines',
							'de asesoría y orientación a los ciudadanos. El usuario consultante es responsable del uso, aplicación o difusión de la información contenida en este reporte. La información',
							'contenida proviene de fuentes oficiales y se actualiza periódicamente. Para consultar el año en que los datos fueron recabados se sugiera revisar el apartado de metadatos.'

						]
					}
				}
				
				var images = {
						header:null,
						logo:null
				}
				var getImageFromUrl = function(url,image,callback) {
						var img = new Image();
					
						img.onError = function() {
							alert('Cannot load image: "'+url+'"');
						};
						img.onload = function() {
							images[image] = img;
							callback(img);
						};
						img.src = url;
				}
				var imagesReady = function(){
					var ready = true;
					for(var x in images){
						if (!images[x]){
							ready = false;
							break;	
						}
					}
					return ready;
				}
				var modePdf = function(active){
					var itemMap=$("#calculator_areaMap");
					var width = itemMap.width()+14;
					if (active) {
                        itemMap.addClass('pdfClass');
						itemMap.css('width',width+'px');
                    }else{
						itemMap.removeClass('pdfClass');
						itemMap.css('width','100%');
					}
				}
				for(var x in images){
					getImageFromUrl('img/reports/'+x+'.png',x,function(){
						if (imagesReady()){
							modePdf(true);
							buildPdf();
							modePdf(false);
						};
					});		
				}
				var addHeaderTable = function(top,left,results,doc,headers){
						var increment = 0;
						for(var x in headers){
							var i = headers[x];
							doc.setDrawColor(0);
							doc.setFillColor(236,125,171);
							doc.rect(left+increment, top, i.width, 22, 'F');
							
							doc.setFontSize(9);doc.setTextColor(255, 255, 255);
							doc.text(validator.convertToHtml(i.label),left+increment+i.margin,top+14);
							increment+=(i.width+2);	
						}
				}
				var addTable = function(top,left,results,doc,headers){
					
						var increment = 0;
						addHeaderTable(top,left,results,doc,headers);
						top+=20;
						var providers = results;
						increment=0;
						counterRow=1;
						var grayRow = true;
						for(var x in providers){
									
									
									var drawLine=false;
									var i =  providers[x];
									var additionalSpaces=0;
									var backHeightRect = null;
									for(var y in headers){
										var additionalSpacesBlock = 0;
										var e = headers[y];
										var label = '';//'S/D';
										if (i[e.field]) {
                                            label = $.trim(i[e.field]+'');
											label= validator.convertToHtml(label);
											label = (e.field=='Distancia')?label+" m":label;
                                        }
										var arrayLabel = validator.getChains(label,e.maxCharacter);
										
										var incrementTopArray=15;
										doc.setDrawColor(0);
										if (grayRow) {
											doc.setFillColor(243,243,243);
										}else{
											doc.setFillColor(249,220,232);
										}
										var heightRect = 28;
										doc.rect(left+increment, top, e.width, heightRect, 'F');
										doc.setFontSize(7);doc.setTextColor(85, 85, 85);
										for(var y in arrayLabel){
											doc.setFontSize(7);doc.setTextColor(85, 85, 85);
											doc.text(arrayLabel[y],left+increment+5,top+incrementTopArray);
											incrementTopArray+=8;
											if (y>1) {
                                                additionalSpacesBlock+=1;
                                            }
										}
										increment+=(e.width+2);
										if (additionalSpacesBlock>additionalSpaces) {
                                            additionalSpaces=additionalSpacesBlock+0;
                                        }
										
									}
									increment=0;
									top+=(30+(additionalSpaces*8));
									if ((top>630)&&((parseInt(x)+1)< providers.length)) {
                                        top=124;
										doc.addPage();
										addHeader(80,doc);
										addFooter(610,30,doc);
										addPageText(770,'P&aacute;gina 2 de 2',doc);
										addHeaderTable(100,left,results,doc,headers);
                                    }
									var leftLine = left;
									
									
									
                                        grayRow=!grayRow;
										counterRow=0;
										
									
									doc.setDrawColor(255, 255 ,255);
									doc.setLineWidth(3);
									doc.line(leftLine, top, 590, top);
									counterRow+=1;
									
						}
				}
				
				var addHeader = function(top,doc){
					doc.addImage(images['logo'], 'PNG',25,15);
					doc.addImage(images['header'],'PNG',400,30);
					doc.setDrawColor(226, 0 ,122);
					doc.line(20, top, 590, 80);
				}
				var addFooter = function(top,left,doc){
						var f = blocks.foot;
						var o = f.observation;
						var l = f.legend;
						/*
						doc.setLineWidth(1);
						doc.setDrawColor(225, 0, 122);
						doc.setFillColor(255,255,255);
						doc.circle(left+5, top, 5, 'FD');
						doc.setDrawColor(226, 0 ,122);
						doc.line(left+10, top, 480, top);
						doc.setFontSize(11);doc.setTextColor(225, 0, 122);
						doc.text('Observaciones',left+20,top+20);
						
						doc.setFontSize(11);doc.setTextColor(87, 84, 85);
						var a = 37;
						for(var x in o){
							doc.text(o[x],left+20,top+a);
							a+=15;
						}
						doc.setDrawColor(225, 0, 122);
						doc.setFillColor(255,255,255);
						doc.circle(555, top+70, 5, 'FD');
						doc.setDrawColor(226, 0 ,122);
						doc.line(70, top+70, 550, top+70);
						*/
						doc.setFontSize(7);doc.setTextColor(150, 151, 152);
						var a = 95;
						for(var x in l){
							doc.text(l[x],left,top+a);
							a+=10;
						}
				}
				var addPageText = function(top,text,doc){
					doc.setFontSize(11);doc.setTextColor(87, 84, 85);
					doc.text(validator.convertToHtml(text),515,top);
				}
				
				var buildPdf = function(){
					var doc = new jsPDF('p','pt','letter');
					
					
					$("#calculator_areaMap").mapping('exportMap','png',{event:function(img){
						
							//mapping area ---------------------
							var widthMap = parseFloat($("#calculator_areaMap").width());
							var heightMap = parseFloat($("#calculator_areaMap").height());
							var ancho = 275;
							var alto = Math.round(((1/widthMap)*ancho)*heightMap);
							doc.addImage(img, 'PNG',20,125,ancho,alto);
							
							//header-------------------------------------------------------------------------------------------------
							var top = 80;
							left=30;
							addHeader(top,doc);
							doc.setFontSize(12);doc.setTextColor(87, 84, 85);
							doc.text('Calculadora territorial',20,top+20);
							doc.setFontSize(10);doc.setTextColor(150, 151, 152);
							doc.text(validator.convertToHtml(data.areaName),20,top+35);
							
							//footer-----------------------------------------------------
							top=610;
							left=30;
							addFooter(top,left,doc);
						
							//Page number----------------------------------------------------
							top= 770;
							addPageText(top,'P&aacute;gina 1 de 2',doc);
						
							
							//table variables-------------------------------------------------------------------------------------------------
							
							top=80;
							left=310;
							doc.setFontSize(10);doc.setTextColor(226, 0 ,122);
							doc.text(validator.convertToHtml('Variables'),left+10,top+35);
							
							top+=45;
							doc.setDrawColor(0);
							doc.setFillColor(226, 0 ,122);
							doc.rect(left, top, 284, 22, 'F');
							doc.setFontSize(10);doc.setTextColor(255, 255, 255);
							doc.text(validator.convertToHtml('Poblaci&oacute;n y vivienda'),left+100,top+14);
							top+=23;
							var headers =[
								{label:"Variable",field:'variable',width:80,margin:25,maxCharacter:25},
								{label:"Alias",field:'alias',width:80,margin:31,maxCharacter:20},
								{label:"Dato",field:'dato',width:60,margin:20,maxCharacter:20},
								{label:"Unidades",field:'unidades',width:58,margin:10,maxCharacter:20}
							]; 
							addTable(top,left,data.variables,doc,headers);
							
						
							//table calculations-------------------------------------------------------------------------------------------------
							
							top=450;
							left=20;
							doc.setFontSize(10);doc.setTextColor(226, 0 ,122);
							doc.text(validator.convertToHtml('C&aacute;lculos'),left+20,top);
							top+=10;
							var headers =[
								{label:"Nota",field:'nota',width:150,margin:65,maxCharacter:40},
								{label:"Algoritmo",field:'algoritmo',width:156,margin:57,maxCharacter:35},
								{label:"Operaci&oacute;n",field:'operacion',width:156,margin:55,maxCharacter:35},
								{label:"Unidades",field:'unidades',width:105,margin:35,maxCharacter:25}
							]; 
							addTable(top,left,data.calculations,doc,headers);
							
						
							
							
							doc.save('reporte.pdf');
							obj.hideSpinnerExport();
							
					}});
					
				}
				
			},
			
			eventScroll:function(){
				var obj = this;
				$("#main").scroll(function() {
					clearTimeout($.data(this, 'scrollTimerComparation'));
					$.data(this, 'scrollTimerComparation', setTimeout(function() {
						obj.updateMapping();
					}, 250));
				});
			},
			
		}//return
})
