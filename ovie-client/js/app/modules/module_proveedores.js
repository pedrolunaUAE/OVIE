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
			localData:{activity:null},
			getIdContainer:function(){
					return config.menu[2].id;
			},
			init:function(main){
				var obj = this;
				obj.main = main;
				var localUrl = require.toUrl("code");
					localUrl = localUrl.split('?')[0];
		
				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_proveedores.css'}).appendTo('head'),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					obj.createUI();
				});
				//obj.listProveed();
				obj.requestCatalog('main');
			},
			_refresh:function(){
				var obj = this;
				this.events();
			},
			displayFeatures:function(features){
				var map = $("#proveed_areaMap");
				map.mapping('actionMarker',{action:'delete',items:'all',type:'prov'});
				for(var x in features){
					var f = features[x];
					var c = f.position.mercator.split(',');
					switch (f.geometry) {
                        case 'point':
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'prov',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
							break;
						default:
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'prov',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
                    }
				}
			},
			showSpinnerExport:function(){
				
				$("#proveed-container .fixed-action-btn").hide();
				$("#proveed-container .spinnerExport").show();
			},
			hideSpinnerExport:function(){
				$("#proveed-container .spinnerExport").hide();
				$("#proveed-container .fixed-action-btn").show();
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
			updateMapping:function(){
				$("#proveed_areaMap").mapping('update');
			},
			addAreaMap:function(item){
				var obj = this;
				var cadena = '<input id="radiovalueProv" placeholder="Ingrese el valor" type="number" />'
				var btnAccept = function(){
					var val = parseInt($('#radiovalueProv').val()|0);
					$("#proveed_areaMap").mapping('addBufferToGeometry',item.id,val,item.tabla,item.label);
					$("#tabProvider").customTab('activate','proveed-geoAreaList');
					
				}
				if (item.geometry=='polygon') {
                    btnAccept();
                }else{
					obj.main.openModal('Indique el &aacute;rea de influencia alrededor del elemento seleccionado',cadena,function(){
						btnAccept();
						
					});
					
					$('#radiovalueProv').focus();
					$('#radiovalueProv').keyup(function(e){
						if(e.keyCode == 13){
							btnAccept();
							obj.main.closeModal();
						}
					});
				}
				//obj.displayResults(item.id);
				
			},
			requestCatalog:function(type,clv){
				var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.dataSource.providers.catalog;
				var tab = $("#tabProviderFindAreas");
				var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success){
								valid=true;
								var catalog = json.data.providers;
								obj.displayCatalog(type,catalog,clv);	
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
			displayCatalog:function(type,catalog,clv){
				var obj = this;
				var idSection = (type=='main')?'searchProveed':'searchProveedSecond';
				var cadena = '<div class="collection">';
				cadena+= (type!='main')?'<a href="#!" idref="'+clv+'" all="true" class="act-item collection-item" typeref="'+type+'">Todos</a>':'';
				for (var x in catalog){
					var i = catalog[x];
					var insert = (type=='main')?((i.type=='1')?true:false):true;
					if (insert) {
						cadena+= '<a href="#!" idref="'+i.id+'" class="act-item collection-item" typeref="'+type+'">'+i.desc_corto+'</a>';
					}
				}
				cadena+= '</div>';
				$('#'+idSection).html(cadena);
				$('#'+idSection+' .act-item').click(function(){
						$('#'+idSection+' .act-item.active').removeClass('active');
						$(this).addClass('active');
						var id = $(this).attr('idref');
						var type = $(this).attr('typeref');
						if (type=='main') {
							obj.dataSelected.type = null;
							obj.dataSelected.label = $(this).text();
							obj.activitySelected=$(this).text();
							obj.requestCatalog('subclass',id);
							$("#tabProviderFindAreas").customTab('activate','searchProveedSecond');
							obj.clearItems('item');
							obj.showOptionProvider(true);
							obj.providerSelectedBySection='provider';
                        }else{
							var parent = ($(this).attr('all'))?true:false;
							obj.dataSelected.type=id;
							obj.dataSelected.label = (parent)?obj.dataSelected.label:$(this).text();
							obj.dataSelected.parent = parent;
							obj.providerSelected=(parent)?'Todos':$(this).text();
							obj.dataSelected.limit = 10;
							obj.findProviders();
							obj.clearItems('item');
							obj.providerSelectedBySection='provider';
						}
				});
			},
			listProveed:function(){
				var obj = this;
				var cadena = '<div class="collection">';
				var list = config.var_estab;
				for (var x in list){
					var item = list[x];
					cadena+= '<a href="#!" idref="'+item.id+'" class="act-item collection-item">'+item.label+'</a>'
				}
				cadena+= '</div>';
				$('#searchProveed').html(cadena);
				$('.act-item').click(function(){
						$('.act-item.active').removeClass('active');
						$(this).addClass('active');
						var id = $(this).attr('idref');
						obj.dataSelected.type=id;
						obj.findProviders();
				});
			},
			loadResults:function(){
				var obj = this;
				if (obj.localData.activity){
					
					
				}
			},
			showBlocker:function(){
				var obj = this;
				$("#"+obj.id + ' .blocker').show();
			},
			hideBlocker:function(){
				var obj=this;
				$("#"+obj.id + ' .blocker').hide();
			},
			getBlocker:function(){
				var obj = this;
				var chain = '<div class="col s12 blocker">'+
								'<div class="blocker-container">'+
									'<img class="image" src="img/icons/mark.png">'+
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
									'<div class="label">Comparando &aacute;reas...</div>'+
								'</div>'+
							'</div>';
				return chain;
			},
			dataSelected:{
				type:null,
				point:null,
				id:null
			},
			providerSelectedBySection:null,
			activitySelected:'',
			providerSelected:'',
			resetParams:function(){
				var obj = this;
				obj.dataSelected={
					type:null,
					point:null,
					id:null
				};
			},
			getParams : function(){
				var obj = this;
				var valid = false;
				var params = $.extend({}, obj.dataSelected);
				if ((params.type)&&(params.point)) {
                    valid=true;
                }
				return {valid:valid,params:params};
			},
			clock:null,
			findProviders:function(){
					var  obj = this;
					var time = 300;
					if (obj.clock) {
                        clearTimeout(obj.clock);
                    }
					obj.clock = setTimeout(function(){
						var response = obj.getParams();
						if (response.valid) {
							obj.request(response.params);
						}else{
							obj.showErrorMessage(response.params);
						}
					},time);
					
			},
			showErrorMessage:function(params){
				var messages = [];
				if (!params.type){
					messages.push('Debe seleccionar la actividad econ&oacute;mica');
                }
				if (!params.point) {
                    messages.push('De clic en el mapa para seleccionar la ubicaci&oacute;n del negocio');
                }
				for(var x in messages){
					var i = messages[x];
					Materialize.toast(i, 4000);
				}
			},
			clearResults:function(){
				var obj = this;
				$("#"+obj.id+" .proveedor-results").html('');
				$("#"+obj.id+" .proveedor-mesage").hide();
				$("#"+obj.id+" .proveedor-export").hide();
			},
			request:function(params){
				var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.dataSource.providers.search;
				var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success){
								valid=true;
								obj.providers = json.data.providers;
								obj.displayProviders(json.data.providers);	
							}else{
							msg=json.response.message;
							}
						}
						if (!valid) {
							 Materialize.toast(msg, 4000);
						}
					
					},
					beforeSend: function(solicitudAJAX) {
						obj.clearResults();
						obj.showBlocker();
					},
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					},
					complete: function(solicitudAJAX,estatus) {
						obj.hideBlocker();
					}
				};
				r = $.extend(r, c);
				r.url=config.dataSource.server+r.url;
				r.data = (c.stringify)?JSON.stringify(params):params;
				$.ajax(r);
			},
			getDataProvider:function(a){
				var obj = this;
				var response=[];
				for(var x in a){
					if (a[x]!='geom') {
                        response.push({label:validator.getFormatHtml2(x+''),value:validator.getFormatHtml2(a[x]+'')});
                    }
				}
				return response;
			},
			getDescriptionProvider:function(data){
				var chain = '';
				for (x in data){
					     chain+='<div>'+data[x].label+': '+data[x].value+'</div>';
                }
				return chain;
			},
			getDescription :function(data){
				var items = {Calle:'Calle',Colonia:'Colonia',Delegacion:'Delegaci&oacute;n',Telefono:'Tel&eacute;fono'};
				var chain ='';
				for(var x in items){
					var i = items[x];
					if (data[x]) {
                       chain+='<div>'+i+': '+data[x]+'</div>';
                    }
					
				}
				return chain;
			},
			clearMarks:function(){
					$("#proveed_areaMap").mapping('actionMarker',{action:'delete',items:'all',type:'search'});
			},
			displayProviders:function(data){
				var obj = this;
				obj.clearMarks();
				if (data.length==0) {
                     $(".proveedor-mesage").fadeIn();
                }else{
					$("#"+obj.id+" .proveedor-export").show();
					var obj = this;
					var dataTitle='';
					var dataBody='';
					var chain='';
					//var titles = ['Nombre','Distancia','Transporte','Establecimiento','Calle','N&uacute;m','Colonia','Delegaci&oacute;n','Tel&eacute;fono','Correo'];
					var titles = ['Nombre','Distancia','Transporte','Establecimiento','Calle','N&uacute;m','Colonia','Tel&eacute;fono','Delegaci&oacute;n','Correo'];
					var fields = ['Nombre','Distancia','Transporte','Establecimiento','Calle','Num','Colonia','Telefono','Delegacion','Correo'];
					
					for(var x in titles){
						dataTitle+='<th data-field="" class="headProvider">'+titles[x]+'</th>';
					}
					
					for(var x in data){
						var i = data[x];
						var lonlat = i['geom'].substring(6,i['geom'].length-1);
						lonlat = lonlat.split(' ');
						var dataProvider = obj.getDataProvider(i);
						var icon = (!validator.isGeneric(i['cve_scian']))?validator.getIcon(i['cve_scian']):i['cve_scian'];
						var description = obj.getDescription(i);
						var idMarker = $("#proveed_areaMap").mapping('addMarker',{lon:lonlat[0],lat:lonlat[1],store:false,type:'search',zoom:false,params:{nom:dataProvider[0].value,desc:description,image:icon,dataProvider:dataProvider}});
						dataBody+='<tr class="itemProvider" id="'+idMarker+'" poi="'+i['geom']+'">';
						for(var y in fields){
								var value = (i[fields[y]])?i[fields[y]]:'S/D';
								value =(fields[y]=='Distancia')?value+' m':value;
								if (fields[y]=='Correo') {
                                    var words = validator.getChains(value,10);
									value = words.join(' ');
                                }
								dataBody+='<td class="cellProvider">'+value+'</td>';
						}
						dataBody+='</tr>';
					}
					var chain = '<h6 class="titleResults-Provider">Proveedores</h6>'+
								'<div id="infoProviders">'+
								'<table class="infoProviders bordered highlight responsive-table">'+
									'<thead>'+
										'<tr>'+
											dataTitle+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
											dataBody+
									'</tbody>'+
							   '</table>'+
							   '</div>';
				
					$(".proveedor-results").html(chain);
					$(".itemProvider").each(function(){
						$(this).click(function(){
							var wkt = $(this).attr('poi');
							obj.selectArea(wkt);
							$(".itemProvider.selected").removeClass('selected');
							$(this).addClass('selected');
						});
					});
				}
				validator.endPage();
				
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
				$(".proveedor-results").html("");
				
			},
			onAreaAdded:function(data){
				var obj = this;
				obj.main.localData.geoList.push(data);
				obj.displayAreas();
				
			},
			displayAreas:function(){
				var obj = this;
				$('#proveed-geoAreaList').areas({
					data:obj.main.localData.geoList
				});
			},
			selectArea:function(wkt){
				$("#proveed_areaMap").mapping('goCoords',wkt);
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
				$(".proveedor-results").html("");
			},
			showFreeItems:function(show){
				var obj = this;
				
				$("#"+obj.id+" #tabProviderFindAreas .optionSpetial").hide();
				$("#"+obj.id+" #tabProviderFindAreas .separator").hide();
				if (show) {
                    $("#"+obj.id+" #headersearchActEcoProveed").css('display','block');
					$("#"+obj.id+" #headerallDataProveed").css('display','block');
					$("#"+obj.id+" #headerallDataProveed").prev().css('display','block');
					$("#"+obj.id+" .rowBack").css('display','block');
					$("#tabProviderFindAreas").customTab('activate','searchActEcoProveed');
                }else{
					$("#"+obj.id+" #headersearchProveed").css('display','');
					$("#"+obj.id+" #headersearchProveedSecond").css('display','');
					$("#"+obj.id+" #headersearchProveedSecond").prev().css('display','');
					$("#"+obj.id+" #headerfreeProveed").css('display','');
					$("#"+obj.id+" #headerfreeProveed").prev().css('display','');
					$("#"+obj.id+" .rowBack").css('display','none');
					var tab = (obj.dataSelected.label==undefined)?'searchProveed':'searchProveedSecond';
					tab = (obj.providerSelectedBySection!='provider')?'searchProveed':'searchProveedSecond';
					if ((obj.providerSelectedBySection!='provider')&&(obj.providerSelectedBySection)) {
                       obj.showOptionProvider(false);
                    }
					$("#tabProviderFindAreas").customTab('activate',tab);
				}
			},
			events:function(){
						var obj = this;
						var eventoIdentify = function(e){
							var wkt = 'POINT('+e.lon+' '+e.lat+')';
							obj.dataSelected.point=wkt;
							//obj.dataSelected.id=null;
							//$("#proveed-geoAreaList").areas('cleanSelected');
							obj.findProviders();
						};
						//setTimeout(function(){
							$("#proveed_areaMap").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:true},features:obj.main.localData.geoList,onAddFeature:function(data){
															obj.onAreaAdded(data);
														},identify:eventoIdentify});
						//},500);
						
						
						$("#proveed-geoAreaList").areas({
							xclose:true,
							data:obj.main.localData.geoList,
							eventClickItem:function(item){
								//obj.dataSelected.id = item.db;
								obj.findProviders();
								obj.selectArea(item.wkt);
							},
							eventCloseItem:function(item){
								
								$("#proveed_areaMap").mapping('removeFeatureByDB',item.db);
								obj.onAreaDeleted(item.db);
								if (obj.dataSelected.id==item.db) {
                                    obj.dataSelected.id = null;
									obj.clearMarks();
									obj.findProviders();
                                }
								
							}
						});
			},
			createUI:function(){
				var obj = this;
				obj.id = "proveed-container";
				var cadena = '';
					cadena = '<div id="'+obj.id+'" class="width-content">';
					cadena+= '	<div class="row">'
					cadena+= '		<div class="col s12"><div id="proveed_areaMap" class="proveed-areaMap"></div></div>';
					cadena+= '		<div class="col s12 m6" style="margin-top: 7px;"><div id="tabProvider"></div></div>';
					cadena+= '		<div class="col s12 m6" style="margin-top: 7px;"><div id="tabProviderFindAreas"></div></div>';
					
					//cadena+= '		<div id="proveed-geoAreaList_container" class="col s8"><div id="proveed-geoAreaList"></div></div>'; 
					cadena+= '		<div class="col s12"><div class="proveedor-results"></div></div>';
					cadena+=        obj.getBlocker();
					cadena+= '		<div class="col s12 proveedor-mesage"><div class="proveedor-message-container card">No hay informaci&oacute;n relacionada</div></div>';
					cadena+='		<div class="col s12 proveedor-export">'+
										/*
										'<a class="waves-effect waves-light btn exportPdf">'+
											'<i><img src="img/icons/pdf.png" class="image"></i>'+
											'<p class="label">Exportar</p>'+
										'</a>'+
										*/
										  '<div class="fixed-action-btn" style="bottom: 24px; right: 24px;">'+
											'<a class="btn-floating btn-large " style="background:#E2007A">'+
											  '<i class="material-icons">'+
													'<img src="js/app/widgets/results/export.png" style="margin-top: 5px;">'+
											  '</i>'+
											'</a>'+
											'<ul>'+
											  '<li><a class="btn-floating exportKml" style="background:#E2007A"><i class="material-icons"><img src="js/app/widgets/results/kml.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
											  '<li><a class="btn-floating exportPdf" style="background:#E2007A"><i class="material-icons"><img src="js/app/widgets/results/pdf.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
											'</ul>'+
										  '</div>'+
									'</div>'+
									Footer.get();
					cadena+= '	</div>';
					cadena+= obj.getSpinnerExportFile();
					cadena+= '</div>';
    
				$('#container_mnu_proveedor').html(cadena);
				$("#tabProvider").customTab({sections:[{label:'Buscar en el mapa',id:'searchProveedAreas',overflow:false},{label:'&Aacute;reas de selecci&oacute;n',id:'proveed-geoAreaList',overflow:true}],height:370});
				$("#tabProviderFindAreas").customTab({title:'Actividad econ&oacute;mica',sections:[{label:'Cadena',id:'searchProveed',overflow:true},{label:'Proveedor',id:'searchProveedSecond',overflow:true},{label:'Libre',id:'freeProveed',overflow:true},{label:'Buscar',id:'searchActEcoProveed',overflow:false},{label:'Ver todas',id:'allDataProveed',overflow:false}],height:370});
				
				$('#searchProveedAreas').searchWidget({
					 searchType:'areas',
					 enabled:true,
					 inactiveText:'Buscar áreas',
					 dataSource:config.dataSource.searchAreas,
					 response:{
						  asMenu:false,
						  height:226,
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
						$("#proveed_areaMap").mapping('goCoords',data.wkt);
					},  
					events:function(trigger,value){
						switch(trigger){
							case 'mdi-content-add-circle':
								obj.addAreaMap(value);
							break;
						}
					}	
				});
				$('#searchActEcoProveed').searchWidget({
					 activitySelected:obj.activitySelected, 
					 searchType:'actividad',
					 enabled:true,
					 inactiveText:'Buscar actividad económica',
					 dataSource:config.dataSource.searchAct,
					 response:{
						  asMenu:false,
						  height:230,
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
							obj.clearItems('search');
							obj.providerSelectedBySection='search';
							var parent = false;
							obj.showOptionProvider(false);
							obj.dataSelected.type=c+'';
							obj.dataSelected.label = b+'';
							obj.dataSelected.parent = parent;
							obj.providerSelected=b+'';
							obj.dataSelected.limit = 10;
							obj.findProviders();
					},
					onClear:function(){
							obj.clearItems('search');
							obj.providerSelectedBySection='search';
							obj.dataSelected.type=null;
							obj.dataSelected.label = null;
							obj.dataSelected.parent = null;
							obj.providerSelected=null;
							obj.dataSelected.limit = null;
							obj.clearResults();
					},
				});
				$("#allDataProveed").activityList({
					config:config,
					selected:function(label,id){
						obj.clearItems('all');
						obj.providerSelectedBySection='all';
						obj.showOptionProvider(false);
						var parent = false;
						obj.dataSelected.type=id+'';
						obj.dataSelected.label = label+'';
						obj.dataSelected.parent = parent;
						obj.providerSelected=label+'';
						obj.dataSelected.limit = 10;
						obj.findProviders();
						
					}
				}); 
				this.events();
				obj.showFreeItems(false);
				obj.showOptionProvider(false);
				$("#"+obj.id+" #headerfreeProveed").unbind();
				$("#"+obj.id+" #headerfreeProveed").click(function(){
					obj.showFreeItems(true);
				});
				$("#"+obj.id+" #tabProviderFindAreas").append('<img class="rowBack" src="js/app/css/img/backArrow.png">');
				$("#"+obj.id+" .rowBack").click(function(){
					obj.showFreeItems(false);
				});
				$("#"+obj.id+" .exportPdf").click(function(){
					var parametros = {providers:obj.providers};
					obj.report(parametros);
				});
				$("#"+obj.id+" .exportKml").click(function(){
					var seleccionado=$("#proveed-geoAreaList").areas('getSelected');
					var id  = null;
					var data  = null;
					if (seleccionado) {
                        id = seleccionado.db;
						var data = [{label:'&Aacute;rea',value:seleccionado.area}];
                    }
					$('#proveed_areaMap').mapping('getKml',{id:id,addMarkers:true,data:data});
				});
				this.eventScroll();
			},
			showOptionProvider:function(show){
				var obj = this;
				$("#"+obj.id+" #headersearchProveedSecond").hide();
				$("#"+obj.id+" #headersearchProveedSecond").prev().hide();
				if (show) {
                    $("#"+obj.id+" #headersearchProveedSecond").show();
					$("#"+obj.id+" #headersearchProveedSecond").prev().show();
                }
			},
			clearItems:function(item){
				var obj = this;
				if (item!='item'){
					$("#"+obj.id+" #searchProveed .act-item.active").removeClass('active');
					$("#"+obj.id+" #searchProveedSecond .act-item.active").removeClass('active');
				}
				if (item!='search') {
                    $("#"+obj.id+" #searchActEcoProveed .collection-item.active").removeClass('active');
					
                }
				if (item!='all') {
                    $("#"+obj.id+" #allDataProveed .activity-row-container.active").removeClass('active');
                }
				
			},
			eventScroll:function(){
				var obj = this;
				$("#main").scroll(function() {
					clearTimeout($.data(this, 'scrollTimerProv'));
					$.data(this, 'scrollTimerProv', setTimeout(function() {
						obj.updateMapping();
					}, 250));
				});
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
						"311830":null,
						"323119":null,
						"461110":null,
						"461121":null,
						"461122":null,
						"461130":null,
						"461160":null,
						"461190":null,
						"463211":null,
						"463310":null,
						"464111":null,
						"465311":null,
						"465912":null,
						"466312":null,
						"467111":null,
						"467115":null,
						"468211":null,
						"561432":null,
						"621113":null,
						"621211":null,
						"722511":null,
						"722513":null,
						"722514":null,
						"722515":null,
						"722518":null,
						"72257":null,
						"811111":null,
						"811499":null,
						"812110":null,
						comercio:null,
						distribucion:null,
						empleado:null,
						map:null,
						escolaridad:null,
						grandesgrupos:null,
						header:null,
						indsoc:null,
						indicador:null,
						industria:null,
						line1:null,
						line2:null,
						line3:null,
						logo:null,
						pcompleta:null,
						pincompleta:null,
						pobtot:null,
						posbsica:null,
						pl:null,
						radio:null,
						reprom:null,
						scompleta:null,
						servicio:null,
						sincompleta:null,
						area:null,
						totemple:null,
						uetotal:null,
						vivtot:null
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
					var itemMap=$("#proveed_areaMap");
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
				
				var buildPdf = function(){
					var doc = new jsPDF('p','pt','letter');
					
					
					//header-------------------------------------------------------------------------------------------------
						var top = 80;
						left=30;
						doc.addImage(images['logo'], 'PNG',25,15);
						doc.addImage(images['header'],'PNG',400,30);
						doc.setDrawColor(226, 0 ,122);
						doc.line(20, top, 590, 80);
						doc.setFontSize(12);doc.setTextColor(87, 84, 85);
						doc.text('Buscador de proveedores',20,top+20);
						doc.setFontSize(10);doc.setTextColor(150, 151, 152);
						doc.text(validator.convertToHtml('Actividad econ&oacute;mica: '+obj.activitySelected),20,top+35);
						doc.text(validator.convertToHtml('Proveedor: '+obj.providerSelected),20,top+50);
					
					//table-------------------------------------------------------------------------------------------------
						top = 372;
						left=30;
						var headers =[
							{label:"Nombre",field:'Nombre',width:80,margin:25,maxCharacter:15},
							{label:"Distancia",field:'Distancia',width:45,margin:3,maxCharacter:15},
							{label:"Transporte",field:'Transporte',width:55,margin:5,maxCharacter:15},
							{label:"Establecimiento",field:'Establecimiento',width:68,margin:2,maxCharacter:16},
							{label:"Calle",field:'Calle',width:80,margin:30,maxCharacter:15},
							{label:"N&uacute;m",field:'Numero',width:30,margin:5,maxCharacter:15},
							{label:"Colonia",field:'Colonia',width:60,margin:15,maxCharacter:10},
							{label:"Tel&eacute;fono",field:'Telefono',width:50,margin:7,maxCharacter:15},
							//{label:"Delegaci&oacute;n",field:'Delegacion',width:80,margin:25,maxCharacter:15},
							{label:"Correo",field:'Correo',width:80,margin:25,maxCharacter:15}
						]; 
						doc.setFontSize(12);doc.setTextColor(87, 84, 85);
						doc.text('Proveedores',30,top+5);
						top+=15;
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
						top+=20;
						var providers = data.providers;
						increment=0;
						
						
						
						for(var x in providers){
								if (x<5) {
									var i =  providers[x];
									var additionalSpaces=0;
									for(var y in headers){
										var additionalSpacesBlock = 0;
										var e = headers[y];
										var label = 'S/D';
										if (i[e.field]) {
                                            label = $.trim(i[e.field]+'');
											label= validator.convertToHtml(label);
											label = (e.field=='Distancia')?label+" m":label;
                                        }
										var arrayLabel = validator.getChains(label,e.maxCharacter);
										doc.setFontSize(7);doc.setTextColor(85, 85, 85);
										var incrementTopArray=15;
										for(var y in arrayLabel){
											doc.text(arrayLabel[y],left+increment,top+incrementTopArray);
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
									doc.setDrawColor(224, 224 ,224);
									doc.line(left, top, 590, top);
								}else{
									break;
								}
						}
						
						
						
						/*
						doc.setFontSize(12);doc.setTextColor(87, 84, 85);
						doc.text('Buscador de proveedores',20,top+20);
						
						doc.setFontSize(10);doc.setTextColor(150, 151, 152);
						doc.text(validator.convertToHtml('Servicios de impresi&oacute;n'),20,top+35);
						
						doc.setDrawColor(226, 0 ,122);
						doc.line(20, top, 590, 80);
						*/
					
					//footer-----------------------------------------------------
						top=630;
						left=30;
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
					
					//-----------------------------------------------------------
					
					$("#proveed_areaMap").mapping('exportMap','png',{event:function(img){
						
							//mapping area ---------------------
							var widthMap = parseFloat($("#proveed_areaMap").width());
							var heightMap = parseFloat($("#proveed_areaMap").height());
							//var widthMap = 547;
							//var heightMap = 596;
							var ancho = 520;
							var alto = Math.round(((1/widthMap)*ancho)*heightMap);
							doc.addImage(img, 'PNG',45,145,ancho,alto);
							
							/*
							doc.setFont("helvetica");
							doc.setFontType("bold");
							doc.setFontSize(9);
							var source = $('#infoProviders')[0]; 
							var specialElementHandlers = {
								'#bypassme': function(element, renderer) {
									return true
								}
							};
							var margins = {
								top: 405,
								bottom: 100,
								left: 30,
								width: 50
							};
							
							
							doc.fromHTML(
									source, 
									margins.left, 
									margins.top, {
										'width': margins.width, 
										'elementHandlers': specialElementHandlers
									},
									function(dispose) {
										doc.setFont("helvetica");
										doc.setFontType("bold");
										doc.setFontSize(9);
										doc.save('reporte.pdf');
									},
									margins
							);
							*/				
							doc.save('reporte.pdf');
							obj.hideSpinnerExport();
						
					}});
					
				}
				
			}
	}
})