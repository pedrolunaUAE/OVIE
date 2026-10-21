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
			
			getIdContainer:function(){
					return config.menu[1].id;
			},
			showSpinnerExport:function(){
				
				$("#vocation-container .fixed-action-btn").hide();
				$("#vocation-container .spinnerExport").show();
			},
			hideSpinnerExport:function(){
				$("#vocation-container .spinnerExport").hide();
				$("#vocation-container .fixed-action-btn").show();
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
				$("#vocationMapa").mapping('update');
			},
			eventScroll:function(){
				var obj = this;
				$("#main").scroll(function() {
					clearTimeout($.data(this, 'scrollTimerVoc'));
					$.data(this, 'scrollTimerVoc', setTimeout(function() {
						obj.updateMapping();
						
					}, 250));
					setTimeout(function(){
						tooltip.clearClock();
						tooltip.hide();
					},100);
					
				});
			},
			
			//variables globales
			cveScian:null,
			errorCount:0,
			ajax:null,
			
			init:function(main){
				var obj = this;
				obj.main = main;
				obj.getData=getData.getData;
				var localUrl = require.toUrl("code");
					localUrl = localUrl.split('?')[0];
		
				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_vocEco.css'}).appendTo('head'),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					obj.createUI();
				});
			},
			_refresh:function(){
				this.eventos();
			},
			displayFeatures:function(features){
				var map = $("#vocationMapa");
				map.mapping('actionMarker',{action:'delete',items:'all',type:'eco'});
				for(var x in features){
					var f = features[x];
					var c = f.position.mercator.split(',');
					switch (f.geometry) {
                        case 'point':
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'eco',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
							break;
						default:
							map.mapping('addMarker',{lon:c[1],lat:c[0],store:false,type:'eco',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
                    }
				}
			},
			createUI:function(){
				var obj = this;
				obj.buildStructure();
				obj.eventos();
				obj.eventScroll();
				obj.requestActCatalog();
				
			},
			actSelected:{clave:null,label:null,value:null},
			item:null,
			getActiveAreaDb:function(){
				var obj=this;
				if (obj.item && obj.item.db != null) {
					return obj.item.db;
				}
				var list=obj.main.localData.geoList;
				if (list && list.length>0) {
					return list[list.length-1].db;
				}
				return null;
			},
			normalizeActpre:function(actpre){
				var rows=(actpre && actpre.length)? actpre.slice(0):[];
				var i;
				for (i=0;i<rows.length;i++) {
					if (!rows[i].cve_scian) {
						rows[i].cve_scian='461110';
					}
					if (!rows[i].desc) {
						rows[i].desc='—';
					}
					if (rows[i].total == null) {
						rows[i].total=0;
					}
				}
				while (rows.length<3) {
					rows.push({desc:'—', total:0, cve_scian:'461110'});
				}
				return rows;
			},
			actpredIconClass:function(cveScian){
				var cve=cveScian || '461110';
				return (!validator.isGeneric(cve))? validator.getIcon(cve): cve;
			},
			
			eventos:function(){
				var obj=this;
				$('#vocationAreas-Container').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						$("#vocationMapa").mapping('goCoords',item.wkt);
						obj.requestResultados(item.db, item);
						obj.item=item;
					},
					eventCloseItem:function(item){
						$("#vocationMapa").mapping('removeFeatureByDB',item.db);
						$("#vocationMapa").mapping('actionMarker',{action:'delete',items:'all',type:'search'});
						obj.onAreaDeleted(item.db);
					}
				});
				
				var areas=obj.main.localData.geoList;
				if (areas.length<=0) {
					$('#vocEco_results').html("");
				}
				//setTimeout(function(){
				$("#vocationMapa").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:true},features:obj.main.localData.geoList,onAddFeature:function(data){
															obj.onAreaAdded(data);
														}});
				//},500);
				$('#headerinfoActEcoSeeAll').unbind();
				$('#headerinfoActEcoSeeAll').click(function(){
					//$("#tabVocEcoAct").customTab('activate','headerinfoActEcoSeeAll');
					obj.BuildActPopup();
				});
				
			},
			
			//Listado completo de Actividades Económicas 
			BuildActPopup:function(){
				var obj=this;
				var chain=//'<div class="actEco-list-container card" style="width:563px; height:623px; background:white; position:absolute; top:8px; right:82px">'+
								'<div class="actEco-list-header" >'+
									'<div class="actEco-list-title">Lista de actividades económicas'+
										'<div class="actEco-closeIcon"><img class="close" src="js/app/css/img/close-icon.png"></div>'+
									'</div>'+
									'<div style="margin-top: -10px;">'+
										'<div>'+
											'<p  class="actEco-list-columnTitle">Cve scian</p>'+
											'<div class="actEco-list-columnDivider"></div>'+
											'<p  class="actEco-list-columnTitle" style="margin-left:8px">Actividad económica</p>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="actEco-list">'+
									'<table>'+
										/*'<thead>'+
											'<tr>'+
												'<th data-field="id">Clave scian </th>'+
												'<th data-field="name">Actividad econ&oacute;mica</th>'+
											'</tr>'+
										'</thead>'+*/
										'<tbody id="actEco-tabulado">'+
										'</tbody>'+
									'</table>'+	
							    '</div>';
								/*'<div class="actEco-list-footer">'+
									'<div class="verMas-container">'+
										'<div class="actEco-footer-icon"><img src="js/app/css/img/plus-icon.png"></div>'+
										'<div class="actEco-verMas-txt"><p>ver más</p></div>'+
									'</div>'+	
								'</div>'+*/
						  //'</div>';
				$("#vocationMapa").hide();
				$(".actEco-list-container").html(chain).show();
				
				
				var page=1;
				var limit=50;
				obj.requestActividades(page, limit);
				page=page+1;
				/*$('.verMas-container').click(function(){
					if (page<=19) {
                        //code
						obj.requestActividades(page, limit);
						page=page+1;
					}
                })*/
				//var scroll=$('.actEco-list').scrollTop();
				
				var containerHeight=$('.actEco-list').height();
				$(".actEco-list").scroll(function() {
					var scroll=$('.actEco-list').scrollTop();
					var tabHeight=$('#actEco-tabulado').height();
					if (scroll==(tabHeight-containerHeight)) {
                        if (page<=19) {
							 obj.requestActividades(page, limit);
							page=page+1;
						}
                    }
					
				});
				
				
				
				$('.actEco-closeIcon .close').click(function(){
					$('.actEco-list-container').hide();
					$("#vocationMapa").show();
				});
				
			
				
				$('#vocation-container .ovie-results-information').mouseenter(function(){
						var ref= $(this).attr("ref");
						var positions=$(this).offset();
						tooltip.show(ref,positions);
				 }).mouseleave(function(){
						tooltip.runClock();
				 });
			},
			
			actEcoTabular:function(data){
				var obj=this;
				var chain="";
				for (var x in data.Elementos) {
                    var i=data.Elementos[x];
					var cveScian=i.scian;
					var activity=i.descripcion;
				    chain+='<tr class="actEco-row-container"   id="actEco-row-'+x+'"  idref="'+x+'" style="cursor:pointer">'+
								'<td class="actEco-row actEco-cve">'+cveScian+'</td>'+
								'<td class="actEco-row actEco-descripcion">'+activity+'</td>'+
							'</tr>';
					
				}
					$('#actEco-tabulado').append(chain);
					
					$(".actEco-row-container").click(function(){
					  obj.clearItems();
					  $(this).addClass('active');
					  var idRef=$(this).attr("idref");	
					  //var actTxt=$('#actEco-row-'+idRef+' .actEco-descripcion').text();
					  var actTxt=$(this).find( ".actEco-descripcion" ).html();
					  var cveScian=$(this).find(".actEco-cve").html();
					  //var cveScian=$('#actEco-row-'+idRef+' .actEco-cve').text();
					  obj.activitySelected(idRef,actTxt,cveScian);
					});
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
			
			displayProviders:function(data){
				var obj = this;
				$("#vocationMapa").mapping('actionMarker',{action:'delete',items:'all',type:'search'});
				if (data.length==0) {
				   // Materialize.toast('No hay establecimientos dentro de esta área', 4000);
                }else{
					for(var x in data){
						var i = data[x];
						var lonlat = i['geom'].substring(6,i['geom'].length-1);
						lonlat = lonlat.split(' ');
						
						var icon = (!validator.isGeneric(i['cve_scian']))?validator.getIcon(i['cve_scian']):i['cve_scian'];
						var description = obj.getDescription(i);
						var idMarker = $("#vocationMapa").mapping('addMarker',{lon:lonlat[0],lat:lonlat[1],store:false,type:'search',zoom:false,params:{nom:i.Nombre,desc:description,image:icon}});
					}
				}
				
			},
			
		showMarks:function(parent){
		 var obj=this;
		 var params={id:obj.item.db, parent:parent, point:"POINT(-11037320.825583 2203873.0278605)", type:obj.cveScian, limit:0};
		 obj.request(params);
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
								$('.actividadContador').html('('+json.data.providers.length+')');
							}else{
							msg=json.response.message;
							}
						}
						if (!valid) {
							 Materialize.toast(msg, 4000);
						}
					
					},
					beforeSend: function(solicitudAJAX) {
						
						//obj.showBlocker();
					},
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					},
					complete: function(solicitudAJAX,estatus) {
						//obj.hideBlocker();
					}
				};
				r = $.extend(r, c);
				r.url=config.dataSource.server+r.url;
				r.data = (c.stringify)?JSON.stringify(params):params;
				$.ajax(r);
			},
			requestActividades:function(page,limit){
				    var obj=this;
					if (obj.ajax) {
						obj.ajax.abort();
					}
					page=page.toString();
					limit=limit.toString();
					
					var msg="No es posible cargar esta sección debido a problemas de red"
					var act= obj.main.localData.actEco.cve;
					var request = {
					type: config.dataSource.listActEco.type,
					dataType: config.dataSource.listActEco.dataType,
					url:config.dataSource.server+config.dataSource.listActEco.url+'?page='+page+'&limit='+limit+'',
					data: JSON,
					contentType:config.dataSource.listActEco.contentType,
					success:function(json,estatus){
					  var error=false;
					  if(json){
						  if(json.response.success){
							  //$(".vocEco-results").results({dataSource:json.data.indicators});
							 //obj.displayResults(json.data.indicators,id, item);
							  console.log(json.data);
							  obj.actEcoTabular(json.data);
						  }else{
							  error=true;
							  
						  }
					  }else{
						  error=true
					  }
					  if(error){
						  alert("no valido")
						  obj.displayResults(null,id,item);
						  
					  }
					},
					beforeSend: function(solicitudAJAX) {
					  //obj.clearResults();
					  //obj.showBlocker();
					},
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					  //obj.displayResults(null,id,item);
					  //obj.hideBlocker();
					  if (obj.errorCount<2) {
                        obj.requestActividades(page,limit);
						obj.errorCount=obj.errorCount+1;
                      }else{
						obj.errorCount=0;
						Materialize.toast(msg, 4000);
					  }
					  
					},
					complete: function(solicitudAJAX,estatus) {
					  //obj.hideBlocker();
					}
				 };
				 
				 obj.ajax=$.ajax(request);
			},
			
			createBoxes:function(){
					var obj = this;
					var cadena='<div class="row bloques-area">'+
										'<div class="col s3 vocacionBloque1"></div>'+
										'<div class="col s3 vocacionBloque2"></div>'+
										'<div class="col s3 vocacionBloque3"></div>'+
										'<div class="col s3 vocacionBloque4"></div>'+
								   '</div>'
								   
						$('#vocEco_results').html(cadena);		
			},
			requestResultados:function(id,item, type){
			  var obj=this;
			  var parent=false;
			  var msg = 'No hay información disponible en este radio';
			  var act=(obj.actSelected.clave)?obj.actSelected.clave:0;
			  
			 var request = {
			  type: config.dataSource.vocIndicators.type,
			  dataType: config.dataSource.vocIndicators.dataType,
			  //url: 'http://10.1.30.102:8181/ovie/economic/vocation/indicators/'+act+'',
			  url:config.dataSource.server+config.dataSource.vocIndicators.url+'/'+act+'',
			  //url: 'json/servicio.txt',
			  data: JSON.stringify({id:id}),
			  contentType:config.dataSource.vocIndicators.contentType,
			  success:function(json,estatus){
				var error=false;
				if(json){
					if(json.response.success){
						//$(".vocEco-results").results({dataSource:json.data.indicators});
						if (json.data.indicators.actpre.length>0) {
							obj.displayResults(json.data.indicators,id, item);
							if (json.data.indicators.actcons.desc_cort!=null) {
								obj.actConsValue(json.data.indicators,id, item);
								   obj.actSelected.value = json.data.indicators.actcons.count;
								   if (type=="2") {
									  parent=true;
								   }
								   obj.showMarks(parent);
							}
						}else{
							Materialize.toast(msg, 4000);
						}
						
					}else{
						error=true;
						
					}
				}else{
					error=true
				}
				if(error){
					Materialize.toast(json.response.message, 4000);
					//obj.displayResults(null,id,item);
				}
			  },
			  beforeSend: function(solicitudAJAX) {
				obj.clearResults();
				obj.showBlocker();
			  },
			  error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
				Materialize.toast(msg, 4000);
				obj.displayResults(null,id,item);
				
				
			  },
			  complete: function(solicitudAJAX,estatus) {
				obj.hideBlocker();
			  }
		   };
		   
		   $.ajax(request);
		},
		createBoxes:function(){
			var obj = this;
			var cadena='<div class="row bloques-area">'+
						   		'<div class="col s3 vocacionBloque1"></div>'+
								'<div class="col s3 vocacionBloque2"></div>'+
								'<div class="col s3 vocacionBloque3"></div>'+
								'<div class="col s3 vocacionBloque4"></div>'+
						'</div>'
						   
				$('#vocEco_results').html(cadena);		   
				
		},
		
		//buildResults:function(data){
//		},
		//Indice social
	indSoc:function(valor){
		var obj=this;
		var color="";
		if ((valor>=0)&&(valor<=0.25)){
			color="#BE1621";
		}
		if ((valor>=0.26)&&(valor<=0.50)){
			color="#E6332A"; 
		}
		if ((valor>=0.51)&&(valor<=0.75)){
			color="#F39200"; 
		}
		if ((valor>=0.76)&&(valor<=1)){
			color="#3AA935"; 
		}
		return color;
	},
	
	formatNumber : function(nStr){
		var bandera=(parseFloat(nStr)<0)?'*':null;
		if (bandera==null){
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			//alert('antes');
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}else{
			return bandera;	
		}
		
	},
	
	
		displayResults:function(data,id, item){
		var obj = this;
		var kmlData=[];
		var cadena="";
		var area=obj.main.localData.geoList;
		
		for (var x in area){
			if (area[x].db==id) {
                		var superficie=area[x].area;
            		}
		}
		
		
		
		if (data!=null) {
			data.actpre=obj.normalizeActpre(data.actpre);
			//actividad consultada
			var act= obj.main.localData.actEco.cve;
			var actLabel= obj.main.localData.actEco.label;
			//obj.main.localData.actEco.value=data.actcons.count;
			
			kmlData.push({label:"Actividad consultada",value:actLabel});
			
			//var display="none";
			//if(act!=0){display="block";}
			
			//Indice de desarrollo social
			var indice=data.indsoeco;
			var color=obj.indSoc(indice);
			kmlData.push({label:"&Iacute;ndice de desarrollo econ&oacute;mico",value:indice});
			
			//Especialización Definida
			var especializacion=obj.getSpecializationData(data);
			especializacionUe=especializacion.ue.value;
			especializacionPo=especializacion.po.value;
			especializacionPb=especializacion.pb.value;
			
			kmlData.push({label:"Especializaci&oacute;n definida: unidades econ&oacute;micas",value:especializacionUe});
			kmlData.push({label:"Especializaci&oacute;n definida: personal ocupado",value:especializacionPo});
			kmlData.push({label:"Especializaci&oacute;n definida: producci&oacute;n bruta total",value:especializacionPb});
			
			//Convertir a enteros remuneracion promedio y productividad laboral
			var reprom=Math.round(data.reprom);
			reprom=obj.formatNumber(reprom);
			kmlData.push({label:"Remuneraci&oacute;n promedio por empleado mensual",value:reprom});
			
			var pl=Math.round(data.pl);
			pl=obj.formatNumber(pl);
			kmlData.push({label:"Productividad laboral promedio(anual)",value:pl});
			
			//llenar data para exportacion de kml 
			var uetotal=obj.formatNumber(data.uetotal);
			kmlData.push({label:"Total de unidades econ&oacute;micas",value:uetotal});
			var totemple=obj.formatNumber(data.totemple);
			kmlData.push({label:"Total de personal ocupado",value:totemple});
			
			kmlData.push({label:"Actividad predominante" +data.actpre[0].desc, value:data.actpre[0].total});
			kmlData.push({label:"Actividad predominante" +data.actpre[1].desc, value:data.actpre[1].total});
			kmlData.push({label:"Actividad predominante" +data.actpre[2].desc, value:data.actpre[2].total});
			
			kmlData.push({label:"El " +data.moda[0].porcentaje +" de las unidades econ&oacute;micas tienen de ", value: data.moda[0].estrato});
			
			var comer=Math.round(data.compeco.comerciop);
			var indus=Math.round(data.compeco.industriap);
			var serv=Math.round(data.compeco.serviciop);
			kmlData.push({label:"Composici&oacute;n de unidades econ&oacute;micas por sector comercio",value:comer});
			kmlData.push({label:"Composici&oacute;n de unidades econ&oacute;micas por sector comercio",value:indus});
			kmlData.push({label:"Composici&oacute;n de unidades econ&oacute;micas por sector comercio",value:serv});
			
			
			//llenar data para exportacion de reporte
			obj.cveScian=obj.actSelected.clave;
			if (obj.actSelected.clave!=null) {
				obj.actSelected.clave=((!validator.isGeneric(obj.actSelected.clave))?validator.getIcon(obj.actSelected.clave):obj.actSelected.clave);
            }
			
			
			    var reportData={
									superficie:superficie,
									uetotal:uetotal,
									totemple:totemple,
									reprom:'$ '+reprom,
									pl:'$ '+pl,
									/*
									actConsul:{
												clave:null,
												label:null,
												value:null
											  },
											  */
									
									actConsul:obj.actSelected,
									actpre:[{
												cve_scian:data.actpre[0].cve_scian,
												desc:data.actpre[0].desc,
												total:data.actpre[0].total
											},
											{
												cve_scian:data.actpre[1].cve_scian,
												desc:data.actpre[1].desc,
												total:data.actpre[1].total
											},
											{
												cve_scian:data.actpre[2].cve_scian,
												desc:data.actpre[2].desc,
												total:data.actpre[2].total
											}
											],
												  
									compeco:{
												comerciop:Math.round(data.compeco.comerciop),
												industriap:Math.round(data.compeco.industriap),
												serviciop:Math.round(data.compeco.serviciop),
											},
									moda:[
											{
												estrato:data.moda[0].estrato, 
												porcentaje:data.moda[0].porcentaje
											}
										 ],
									specialization:{
													especializacionUe:{
																		value:Math.round(especializacionUe),
																		tipo:data.compeco.tipo
													},
													especializacionPo:{
																		value:especializacionPo,
																		tipo:data.specialization.perocupado.tipo
													},					
													especializacionPb:{
																		value:especializacionPb,
																		tipo:data.specialization.probruta.tipo
													}					
													
									},
									
									indsoeco:data.indsoeco
								}
			
			var showRatio='';
			if (item.ratio>0) {
				showRatio='block';
				 reportData.radio=validator.getFormatNumber(item.ratio)+' mts';
			}else{showRatio='none'}
			
			cadena='<div class="row bloques-area">'+
									
									//totales
									'<div class="col s12 m12 l4 vocacionBloque1">'+
										'<div class="superficie totales" style="display:'+showRatio+'">'+
											'<div class="ovie-results-icon ovieSprite ovieSprite-radio"></div>'+
											'<div class="ovie-results-title title" id="ovie-results-surface" style="width:70%">Radio de consulta'+
												'<div class="ovie-results-data data">'+validator.getFormatNumber(item.ratio)+' mts</div>'+
											'</div>'+
											
										'</div>'+
										
										'<div class="tooltipSquare superficie totales">'+
											'<div class="ovie-results-icon ovieSprite ovieSprite-ueTot"></div>'+
											'<div class="ovie-results-title title" id="ovie-results-surface" style="width:70%">Total de unidades económicas'+
												'<div class="ovie-results-data data">'+uetotal+'</div>'+
												'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="totEcoVoc" style="margin-left:6px"></div>'+
											'</div>'+
											
										'</div>'+ 
										
										'<div class="tooltipSquare superficie totales">'+
											'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="perOcup" style="margin-left:260px"></div>'+
											'<div class="ovie-results-icon ovieSprite ovieSprite-personal"></div>'+
											'<div class="ovie-results-title title" id="ovie-results-surface" style="width:70%">Total de personal ocupado'+
												'<div class="ovie-results-data data">'+totemple+'</div>'+
											'</div>'+
											
										'</div>'+  
										
										'<div class="tooltipSquare superficie totales">'+
										    '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="remProm" style="margin-left:275px"></div>'+
											'<div class="ovie-results-icon ovieSprite ovieSprite-remuneracion"></div>'+
											'<div class="ovie-results-title title" id="ovie-results-surface" style="width:70%">Remuneración promedio por empleado(mensual) '+
												'<div class="ovie-results-data data">$'+reprom+'</div>'+
											'</div>'+
											
										'</div>'+ 
										
										'<div class="tooltipSquare superficie totales">'+
											'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="prodPro" style="margin-left:222px"></div>'+
											'<div class="ovie-results-icon ovieSprite ovieSprite-productividad"></div>'+
											'<div class="ovie-results-title title" id="ovie-results-surface" style="width:70%">Productividad laboral promedio(anual) '+
												'<div class="ovie-results-data data">$'+pl+'</div>'+
											'</div>'+
											
										'</div>'+ 
									
									'</div>'+
									// ((diagonal)?diagonales:'<div class="diagonal"></div>')+
									//Actividad Consultada y Predominante
									'<div class="col s12 m5 l3 vocacionBloque2 marked">'+
										'<div class="vocEco-actConsul-mainWrap tooltipSquare" style="height:auto; display:none; position:relative; margin-bottom:15px">'+
											'<div class="ovie-results-title" style="width:100%; text-align:center; font-weight:bold">Actividad consultada'+
												'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="actCons" style="margin-left:3px"></div>'+
											'</div>'+
											'<div class="vocEco-actConsul-container" style="position:relative; margin-top:6px">'+
												//'<div class="vocEco-actConsul-icon ovieSprite ovieSprite-actpred-'+act+'" style="float:left"></div>'+
												//'<div class="ovie-results-title" style="margin-top:5px">'+actLabel+'</div>'+
											'</div>'+
										'</div>'+
										//'<div class="DistribucionSexos-container tooltipSquare">'+
												'<div class="vocEco-actpred-mainWrap tooltipSquare" style="position:relative">'+
													'<div class="ovie-results-title" style="width:100%; text-align:center;font-weight:bold; margin-bottom: 25px;">Actividad predominante'+
														'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="actPred" style="margin-left:3px"></div>'+
													'</div>'+ 
													'<div class="vocEco-actpred-container">'+
														'<div class="vocEco-actpred-icon ovieSprite ovieSprite-actpred-'+obj.actpredIconClass(data.actpre[0].cve_scian) +'"></div>'+
														'<div class="vocEco-actpred-data" style="position:relative; top:0px; left:35px">'+data.actpre[0].desc +
															'<div class="vocEco-actpred-data vocEco-actpred-count">('+data.actpre[0].total+')</div>'+
														'</div>'+
													'</div>'+
													'<div class="vocEco-actpred-container">'+
														'<div class="vocEco-actpred-icon ovieSprite ovieSprite-actpred-'+obj.actpredIconClass(data.actpre[1].cve_scian) +'"></div>'+
														'<div class="vocEco-actpred-data" style="position:relative; top:0px; left:35px">'+data.actpre[1].desc +
															'<div class="vocEco-actpred-data vocEco-actpred-count">('+data.actpre[1].total+')</div>'+
														'</div>'+
													'</div>'+
													'<div class="vocEco-actpred-container">'+
														'<div class="vocEco-actpred-icon ovieSprite ovieSprite-actpred-'+obj.actpredIconClass(data.actpre[2].cve_scian) +'"></div>'+
														'<div class="vocEco-actpred-data" style="position:relative; top:0px; left:35px">'+data.actpre[2].desc +
															'<div class="vocEco-actpred-data vocEco-actpred-count">('+data.actpre[2].total+')</div>'+
													    '</div>'+
													'</div>'+
												'</div>'+
										//'</div>'+
									'</div>'+
									
									//GRAFICAS
									'<div class="col s12 m7 l5 vocacionBloque3 tooltipSquare">'+
										'<div class="ovie-results-title desarrolloSocial-title" style="width:100%; text-align:center">Composición de unidades económicas por sector</div>'+
										'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="compEco" style="margin-left:-6px"></div>'+
										'<div class="ovie-compeco-container"></div>'+
									'</div>'+
						'</div>'+
									
						//renglón 2
						'<div class="row bloques-area">'+
							//empleados
									'<div class="col s12 m4 l4 vocacionBloque4 tooltipSquare marked">'+
										
										'<div class="vocEco-results-title" style="width: 90%">El '+ data.moda[0].porcentaje +'% de las unidades económicas tienen de:</div>'+
										'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="tamPred"></div>'+
										'<div><div class="ovieSprite ovieSprite-empleado" style="margin: 0 auto; margin-top: 10px;"></div></div>'+
										'<div class="vocEco-results-txt">'+data.moda[0].estrato+'</div>'+
									'</div>'+
							//especialización definida
									'<div class="col s12 m4 l4 vocacionBloque5  tooltipSquare">'+
										'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="espDef" style="margin-left:251px"></div>'+
										'<div class="vocEco-results-title">Especialización definida</div>'+
										'<div class="vocEco-espDef-mainWrap">'+
											'<div class="vocEco-espDef-container">'+
												'<div class="vocEco-espDef-title">Unidades económicas</div>'+
												'<div class="vocEco-espDef-icon"><img src="js/app/css/img/'+especializacion.ue.icon+'.png"></div>'+
												'<div class="vocEco-espDef-value">'+Math.round(especializacion.ue.value)+' %</div>'+
											'</div>'+
											'<div class="vocEco-espDef-container">'+
												'<div class="vocEco-espDef-title">Personal ocupado</div>'+
												'<div class="vocEco-espDef-icon"><img src="js/app/css/img/'+especializacion.po.icon+'.png"></div>'+
												'<div class="vocEco-espDef-value">'+especializacion.po.value+' %</div>'+
											'</div>'+
											'<div class="vocEco-espDef-container">'+
												'<div class="vocEco-espDef-title">Producción bruta total</div>'+
												'<div class="vocEco-espDef-icon"><img src="js/app/css/img/'+especializacion.pb.icon+'.png"></div>'+
												'<div class="vocEco-espDef-value">'+especializacion.pb.value+' %</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
							
							//Índice de desarrollo económico		
									'<div class="col s12 m4 l4 vocacionBloque6 marked">'+
										'<div class="tooltipSquare desarrolloSocial-container">'+
											'<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="desEco" style="margin-left:279px"></div>'+
											'<div class="ovie-results-title desarrolloSocial-title" style="width:100%; text-align:center">Índice de desarrollo econ&oacute;mico</div>'+
											'<div class="ovie-indice-container">'+
											'<div class="ovie-indice-wrap">'+
												'<center style="margin-top:20px;">'+
													'<div style="position:relative;top:49px;left:-32px;width:1px;height:1px;">'+
														'<div class="desarrolloSocial-indice" style="color:'+color+';">'+data.indsoeco+'</div>'+
													'</div>'+
													'<div class="ovie-results-icon ovieSprite ovieSprite-termometro"></div>'+
													'<div style="position:relative;top:-72px;left:30px;width:1px;height:1px;">'+
														'<div class="gradosTermometro">'+
															'<div class="grado4 ovie-results-title">0.75-1.00</div>'+
															'<div class="grado3 ovie-results-title" style="margin-top:5px">0.50-0.75</div>'+
															'<div class="grado2 ovie-results-title" style="margin-top:4px">0.25-0.50</div>'+
															'<div class="grado1 ovie-results-title" style="margin-top:4px">0.00-0.25</div>'+
														'</div>'+
													'</div>'+
												'</center>'+
											'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
						'</div>'+
						//'<div class="row exportarPDF">'+
						'<div class="fixed-action-btn" style="bottom: 24px; right: 24px;">'+
						'<a class="btn-floating btn-large " style="background:#E2007A">'+
							'<i class="material-icons">'+
								'<img src="js/app/widgets/results/export.png" style="margin-top: 5px;">'+
							'</i>'+
						'</a>'+
						'<ul>'+
							'<li><a class="btn-floating exportKml" style="background:#E2007A"><i class="material-icons"><img src="js/app/widgets/results/kml.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
							'<li><a class="btn-floating exportBtn" style="background:#E2007A"><i class="material-icons"><img src="js/app/widgets/results/pdf.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
						'</ul>'+
					'</div>';
						
						/*'<div class="fixed-action-btn horizontal" style="bottom: 45px; right: 24px;">'+
								'<a class="class="btn-floating btn-large" style="background-color:#E2007A; float:left; ">'+
									'<i><img src="js/app/widgets/results/export.png" style="margin-top:3px"></i>'+
								'</a>'+
								'<ul>'+
									'<li><a class="btn-floating pink  btn exportBtn"><i class="material-icons"><img src="js/app/widgets/results/pdf.png" style="margin-top:-4px; margin-left:0px"></i></a></li>'+
									'<li><a class="btn-floating pink darken-1"><i class="material-icons"><img src="js/app/widgets/results/kml.png" style="margin-top:-4px; margin-left:0px"></i></a></li>'+
								'</ul>'+
								
							'</div>'*/
						//'</div>'
						
						$('#vocEco_results').html(cadena);
						$('#vocation-container .ovie-results-information').mouseenter(function(){
							var ref= $(this).attr("ref");
							var positions=$(this).offset();
							 tooltip.show(ref,positions);
						}).mouseleave(function(){
							 tooltip.runClock();
						});
				
		}else{
				obj.hideBlocker();
				//var cadena="<center>Su búsqueda no arrojó resultados</center>"; 
				//$('#vocEco_results').html(cadena); 
			}	
                   
                
				var chainGraph=obj.buildGraph(data);
		
				
			    $("#comercio_Container .highcharts-container").children().attr("id","comercio_svg");
				$("#industria_Container .highcharts-container").children().attr("id","industria_svg");
				$("#servicio_Container .highcharts-container").children().attr("id","servicio_svg");
				
				$("#vocation-container .exportBtn").unbind();
				$("#vocation-container .exportBtn").click(function(){
					var parametros = $.extend({}, {areaName:obj.item.name}, reportData);
					obj.report(parametros);
				});
				$("#vocation-container .exportKml").unbind();
				$("#vocation-container .exportKml").click(function(){
					//var getKmlData=obj.extraerDatos();
					var seleccionado=$("#vocationAreas-Container").areas('getSelected');
					var id=seleccionado.db;
					var data= kmlData;
					$('#vocationMapa').mapping('getKml',{id:id,addMarkers:false,data:data}); 
					 
				});
		
		},
		
	//Gráficas
		buildGraph:function(data){
			var obj=this;
			var chain='<div class="ovie-compeco-wrap">'+	
							'<div class="graph_mainContainer">'+
								'<div id="comercio_Container" style="position:absolute"></div>'+
								'<div class="graph-icon"><img id="comercio-icon"></div>'+
								'<div class="graphPercent" id="comercio-percent"></div>'+
								'<div class="ovie-graph-title">Comercio</div>'+
							'</div>'+
					  
							'<div class="graph_mainContainer">'+
								'<div id="industria_Container" style="position:absolute"></div>'+
								'<div class="graph-icon"><img id="industria-icon"></div>'+
								'<div class="graphPercent" id="industria-percent"></div>'+
								'<div class="ovie-graph-title">Industria</div>'+
							'</div>'+
					  
							'<div class="graph_mainContainer">'+
								'<div id="servicio_Container" style="position:absolute"></div>'+
								'<div class="graph-icon"><img id="servicio-icon"></div>'+
								'<div class="graphPercent" id="servicio-percent"></div>'+
								'<div class="ovie-graph-title">Servicios</div>'+
							'</div>'+
						'</div>';	
		
		$('.ovie-compeco-container').append(chain);
		obj.graphData(data);
		},
		
		graphData:function(dataResponse){
		
		var obj=this;	
		var cont=0;
		var i =dataResponse.compeco;
		var data={};
			
				 
		while(cont<3)
		{
			data={
						comercio:{
									y:null,
									yComplemento:null,
									color: '#660f80',
									container:"comercio",
									colorGris:'#dddddd',
									icon:null
						},
						industria:{
									y:null,
									yComplemento:null,
									color:'#00bbb5',
									container:"industria",
									colorGris:'#dddddd',
									icon:null
						},	
						servicio:{
									y:null,
									yComplemento:null,
									color:'#0075c9',
									container:"servicio",
									colorGris:'#dddddd',
									icon:null
						},
						
				 };
				 
			if (cont<=3){
				switch (cont) {
					case 0:
						data=data.comercio;
						data.y= Math.round(i.comerciop);
						data.yComplemento=100-data.y;
						//D:\xampp\htdocs\OVIE\js\app\css\img	
						data.icon="js/app/css/img/comercio.png"
						
					break;
					case 1:
						data=data.industria;
						data.y= Math.round(i.industriap);
						data.yComplemento=100-data.y;
						data.icon="js/app/css/img/industria.png"
						
					break;
					case 2:
						data=data.servicio;
						data.y= Math.round(i.serviciop);
						data.yComplemento=100-data.y;
						data.icon="js/app/css/img/servicio.png"	
						
					break;
				}
				cont++;	
				obj.creaGrafica(data);
				obj.placeValues(data);
				//placePercent(data);
				
			 }
		 }//fin while
	},
	
	creaGrafica:function(graphData){
		var obj=this;
		data = [{
				 y:graphData.y,
				 color:graphData.color,
				}, {
				 y: graphData.yComplemento,
				 color:graphData.colorGris,
				//name: 'Industria',
				},
				{
				  container:graphData.container,
				}],
       
	  
		graph_Data=[],
		dataLen = data.length,
    	container=data[2].container;

		// Build the data arrays
		for (i = 0; i < dataLen-1; i ++) {
	
		//add browser data
			graph_Data.push({
			   y: data[i].y,
			   color: data[i].color,
			});
		 }
		
		 $('#'+container+'_Container').highcharts({
				chart: {
					type: 'pie',
					//backgroundColor: '#FAAC58',
					backgroundColor: 'none',
					width: 113,
					height: 113
					
				},
				title: {
					text: ' '
				},
				
				credits:{
					enabled:false
				},
				//credits, para quitar el link de highcharts que sale por default
				
				navigation:{
					buttonOptions:{
						enabled:false
					}
				},
				//navigation, para quitar el botón de menú que sale por default
				
				plotOptions: {
					pie: {
						shadow: false,
						center: ['50%', '50%']
					}
					
					
				},
				tooltip: {
					enabled: false,
					//valueSuffix: '%'
				},
				series: [{
					//name: 'Unidades económicas',
					//data: graph_Data,
					size: '60%',
					dataLabels: {
						formatter: function () {
							return this.y > 5 ? this.point.name : null;
						},
					 color: '#ffffff',
					 distance: -30
				 }
					
				}, {
					//name: 'Unidades económicas',
					data: graph_Data,
					//size regula el tamaño de la gráfica
					size: '130%',
					innerSize: '70%',
					dataLabels: {
						formatter: function () {
							// display only if larger than 1
							//return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
						}
					}
				}]
			});
	
		},
		
		placeValues:function(data){
			var icon=data.icon;
			var percent=data.y;
			var color=data.color;
			$('#'+container+'-icon').attr("src",icon);
			$('#'+container+'-percent').html(percent+"%");
			$('#'+container+'-percent').css("color", color);
	    },
	
		// fin grafica
		
		//íconos especialización
		getSpecializationData:function(data){
			var obj=this;
			var specializationData={ue:{icon:'comercio', value:0}, po:{icon:'comercio', value:0}, pb:{icon:'comercio', value:0}};
			var emptySector={tipo:'comercio', comerciop:0, industriap:0, serviciop:0};
			var compeco = (data && data.compeco) ? data.compeco : emptySector;
			var perocupado = (data && data.specialization && data.specialization.perocupado) ? data.specialization.perocupado : emptySector;
			var probruta = (data && data.specialization && data.specialization.probruta) ? data.specialization.probruta : emptySector;
				//ue
				specializationData.ue.icon=compeco.tipo || 'comercio';
				var ue_tipo=specializationData.ue.icon;
				specializationData.ue.value=compeco[ue_tipo+"p"] != null ? compeco[ue_tipo+"p"] : 0;
				//po
				specializationData.po.icon=perocupado.tipo || 'comercio';
				var po_tipo=specializationData.po.icon;
				specializationData.po.value=perocupado[po_tipo+"p"] != null ? perocupado[po_tipo+"p"] : 0;
				//pb
				specializationData.pb.icon=probruta.tipo || 'comercio';
				var pb_tipo=specializationData.pb.icon;
				specializationData.pb.value=probruta[pb_tipo+"p"] != null ? probruta[pb_tipo+"p"] : 0;
				
			/*icons.ue=data.compeco.tipo;
			icons.po=data.specialization.perocupado.tipo;
			icons.pb=data.specialization.probruta.tipo;*/
			
			return specializationData;
		},
		
		//lista de principales actividades económicas mediante un servicio 
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
		
		clearItems:function(notSearch){
			$("#vocation-container .act-item.active").removeClass('active');
			if(!notSearch){
                $("#infoActEcoSearch .collection-item.active").removeClass('active');
            }
			
			$('#vocation-container .actEco-row-container.active').removeClass('active');
		},
		displayActCatalog:function(actList){
			var obj = this;
			var cadena = '<div class="collection">';
			var list = actList;
			for (var x in list){
				var item = list[x];
				cadena+= '<a href="#!" idref="'+item.id+'" type="'+item.type+'" class="act-item collection-item">'+item.desc_corto+'</a>'
				
			}
				cadena+= '</div>';
				$('.vocEco-act-list').html(cadena);
				$('.act-item').click(function(){
						obj.clearItems();
						$(this).addClass('active');
					    var id = $(this).attr('idref');
						var actividad=$(this).html();
						obj.main.localData.actEco.cve=id;
						obj.actSelected.clave=id+'';
						obj.actSelected.label = $(this).text()+'';
						item.desc_corto=actividad;
						item.id=obj.actSelected.clave;
						var list=obj.main.localData.geoList;
						var type=$(this).attr('type');
						var areaDb=obj.getActiveAreaDb();
						if (list.length>0 && areaDb!=null) {
                            obj.requestResultados(areaDb, item, type);
                        } else if (list.length>0) {
							Materialize.toast('Seleccione un área en el mapa antes de consultar', 4000);
                        }
				});
		},
		
		//
		
		//click al listado de las actividades mediante el buscador
			activitySelected:function(actRow,actTxt,cveScian){
				var obj=this;
				var item={};
				//$('.collection-item').removeClass('active');
				//$(this).addClass('active');
				obj.main.localData.actEco.cve=cveScian;
				obj.actSelected.clave=cveScian;
				obj.actSelected.label = actTxt;
				item.desc_corto=actTxt;
				item.id=cveScian;
				var list=obj.main.localData.geoList;
				var areaDb=obj.getActiveAreaDb();
				if (list.length>0 && areaDb!=null) {
                    obj.requestResultados(areaDb, item);
                } else if (list.length>0) {
					Materialize.toast('Seleccione un área en el mapa antes de consultar', 4000);
                }
			},
		
		actConsValue:function(data,id,item){
			var obj=this;
			if (data.actcons!=null) {
                obj.main.localData.actEco.value=data.actcons.count;
				if (item.desc_corto) {
					obj.main.localData.actEco.label=item.desc_corto;
                }else{
					obj.main.localData.actEco.label=data.actcons.desc_corto;
				}
				obj.showActividad(item);
            }
			
		},
		
		showActividad:function(item){
			var obj=this;
			//actividad consultada
			var act= obj.main.localData.actEco.cve;
			if (item.desc_corto){
				var actLabel= item.desc_corto;
			}
			else{actLabel=obj.actSelected.label;}
			var actValue= obj.main.localData.actEco.value;
			//'<div class="vocEco-actConsul-container">'+
			var cadena=	'<div class="vocEco-actConsul-icon ovieSprite ovieSprite-actpred-'+((!validator.isGeneric(act))?validator.getIcon(act):act) +'" style="position:absolute"></div>'+
						'<div class="vocEco-actpred-data" style="position:relative; left:35px; top:0px">'+actLabel+
							'<div class="vocEco-actpred-data vocEco-actpred-count actividadContador">('+actValue+')</div>';
						'</div>'+
			$(".vocEco-actConsul-container").html(cadena);
			$(".vocEco-actConsul-mainWrap").css("display", "block");
		},
		
		
		getChainActivityEconomic:function(){
			var obj = this;
			var chain = ''+
								//'<div>'+
									//'<h6 id="title">Actividad económica</h6>'+
									//'<div class="vocEco-search-actEco"><input class="vocEco-search-field"><i class="Small material-icons" style="float:right">search</i></input></div>'+
									//'<div class="vocEco-launch-actEco"><i class="Small material-icons vocEco-launch-icon">launch</i></div>'+								
								//'</div>'+
								'<div class="vocEco-act-list"></div>';
			return chain;
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
				$("#vocEco_results").html("");
				if (list<=0) {
                  $('.act-item.active').removeClass('active');
				}
				
		},
		onAreaAdded:function(data){
				var obj = this;
				obj.main.localData.geoList.push(data);
				obj.displayAreas();
		},
		displayAreas:function(){
				var obj = this;
				$('#vocationAreas-Container').areas({
					data:obj.main.localData.geoList
				});
		},
		addAreaMap:function(item){
				var obj = this;
				var id = 'radiovalueVocEco';
				var cadena = '<input id="'+id+'" placeholder="Ingrese el valor en metros" type="number" />'
				var btnAccept = function(){
					var val = parseInt($('#'+id).val()|0);
					if (val<0) {
                        alert("elemento no v&aacute;lido");
                    }else{
						$("#vocationMapa").mapping('addBufferToGeometry',item.id,val,item.tabla,item.label);
						$("#tabVocEco").customTab('activate','vocationAreas-Container');
					}
				}
				if (item.geometry=='polygon') {
                    btnAccept();
                }else{
					obj.main.openModal('Indique el &aacute;rea de influencia alrededor del elemento seleccionado',cadena,function(){
						btnAccept();
						
					});
					
					$('#'+id).focus();
					$('#'+id).keyup(function(e){
						if(e.keyCode == 13){
							btnAccept();
							obj.main.closeModal();
						}
					});
				}
				//obj.displayResults(item.id);
		},
		
		buildStructure:function(){
			var obj=this;
			var chain = '';
			    chain+= '<div id="vocation-container" class="width-content">'+
							'<div class="row">'+
								'<div class="col s12 m5" >'+
									'<div id="tabVocEco"></div>'+
									'<div id="tabVocEcoAct"></div>'+
								'</div>'+
								'<div class="col s12 m7">'+
									'<div class="actEco-list-container card" style="display:none"></div>'+
									'<div class="vocEco-areaMap" id="vocationMapa"></div>'+
								'</div>'+
								'<div class="col s12">'+
									'<div id="vocEco_results" class="vocEco-results"></div>'+
									obj.getBlocker()+
								'</div>'+
								
								'<div class="col s12">'+
									'<div id="vocEco_foot"></div>'+
								'</div>'+
								Footer.get()+
							'</div>'+
							obj.getSpinnerExportFile()+
						'</div>';

			$('#container_mnu_vocacion').html(chain);
			$("#tabVocEco").customTab({sections:[{label:'Buscar en el mapa',id:'infoActEcoFind',overflow:false},{label:'&Aacute;reas de selecci&oacute;n',id:'vocationAreas-Container',overflow:true}],height:300});
			$("#tabVocEcoAct").customTab({title:'Actividad econ&oacute;mica',sections:[{label:'Principales',id:'infoActEco',overflow:true},{label:'Buscar',id:'infoActEcoSearch',overflow:true},{label:'Ver todas',id:'infoActEcoSeeAll',overflow:true}],height:300});
			$("#infoActEco").html(obj.getChainActivityEconomic());
			//buscador de areas en vocacion economica
			$('#infoActEcoFind').searchWidget({
					 searchType:'areas',
					 enabled:true,
					 inactiveText:'Buscar áreas',
					 dataSource:config.dataSource.searchAreas,
					 response:{
						  asMenu:false,
						  height:166,
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
						$("#vocationMapa").mapping('goCoords',data.wkt);
					},  
					events:function(trigger,value){
						switch(trigger){
							case 'mdi-content-add-circle':
								obj.addAreaMap(value);
							break;
						}
					}	
			});
			//buscador de actividades
			$('#infoActEcoSearch').searchWidget({
					 activitySelected:obj.activitySelected, 
					 searchType:'actividad',
					 enabled:true,
					 inactiveText:'Buscar actividad económica',
					 dataSource:config.dataSource.searchAct,
					 response:{
						  asMenu:false,
						  height:166,
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
						obj.activitySelected(a,b,c);
					}
					
			});
		},
			clearResults:function(){
				var obj = this;
				$("#vocEco_results").html('');
			},
		    
			showBlocker:function(){
				var obj = this;
				$("#vocEco-spinner").show();
			},
			hideBlocker:function(){
				var obj=this;
				$("#vocEco-spinner").hide();
			},
			getBlocker:function(){
				var obj = this;
				var chain = '<div id="vocEco-spinner" class="col s12 blocker" style="text-align:center; display:none">'+
								'<div class="blocker-container">'+
									'<img class="image" src="img/icons/mark.png" style="position:absolute; margin-top:13px; margin-left:18px">'+
									'<div class="preloader-wrapper big active">'+
										'<div class="spinner-layer spinner-blue-only" style="border-color: #E2007A;">'+
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
				return chain;
			},
		
		
		report:function(data){
			
			var obj = this;
			obj.showSpinnerExport();
				var blocks = {
					first:[
						{label:'Radio de consulta:',field:'radio'},
						{label:validator.convertToHtml('Total de unidades econ&oacute;micas:'),field:'uetotal'},
						{label:'Total de personal ocupado:',field:'totemple'},
						{label:validator.convertToHtml('Remuneraci&oacute;n promedio:'),field:'reprom'},
						{label:'Productividad laboral',field:'pl'},
						{label:'Superficie:',field:'superficie'}
					],
					second:{
						rank:[
							{a:'0.75',b:'1.00',color:{r:53,g:170,b:65}},
							{a:'0.50',b:'0.75',color:{r:243,g:147,b:23}},
							{a:'0.25',b:'0.50',color:{r:233,g:67,b:59}},
							{a:'0.00',b:'0.25',color: {r:223,g:19,b:43}}
						],
						field:'indsoc',
						label:'Indce de desarrollo social:'
					},
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
						"900001":null,
						"900002":null,
						"900003":null,
						"900004":null,
						"900005":null,
						"900006":null,
						"900007":null,
						"900008":null,
						"900009":null,
						"900010":null, 
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
						vivtot:null,
						genservicio:null,
						genindustria:null,
						gencomercio:null,
						superficie:null
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
					
					if (active) {
						var display = $(".actEco-list-container").css('display');
                        if (display=='block') {
							$("#vocationMapa").show();
							$(".actEco-list-container").hide().attr('report','true');
						}
                    }else{
						var attReport = $(".actEco-list-container").hide().attr('report');
						if (attReport) {
							$("#vocationMapa").hide();
							$(".actEco-list-container").show().removeAttr('report');
						}
					}
					var itemMap=$("#vocationMapa");
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
				var loadGraphsImages = function(doc,array,pos,evento,Left,top){
						svg_to_pdf(document.querySelector("#"+array[pos]), function (urlImage) {
							doc.addImage(urlImage, 'PNG',Left,top,75,75);
							if (pos<array.length-1) {
								pos+=1;
								Left+=60;
                                loadGraphsImages(doc,array,pos,evento,Left,top);
                            }else{
								evento();
							}
						});
				}
				var buildPdf = function(){
					var doc = new jsPDF('p','pt','letter');
					
					
					//header-------------------------------------------------------------------------------------------------
						var top = 80;
						doc.addImage(images['logo'], 'PNG',25,15);
						doc.addImage(images['header'],'PNG',400,30);
						doc.setDrawColor(226, 0 ,122);
						doc.line(20, top, 590, 80);
						doc.setFontSize(12);doc.setTextColor(87, 84, 85);
						doc.text('Análisis económico',20,top+20);
						doc.setFontSize(10);doc.setTextColor(150, 151, 152);
						doc.text(data.areaName,20,top+35);
					
					
					//first block-----------------------
						var left = 400;
						top = (data.actConsul.value)?91:105;
						for(var x in blocks.first){
							var i = blocks.first[x];
							if (data[i.field]) {
								doc.addImage(images[i.field], 'PNG',left,top);
								doc.setFontSize(10);doc.setTextColor(87, 84, 85);
								doc.text(i.label,left+50,top+15);
								doc.setFontSize(11);doc.setTextColor(225, 0, 122);
								var num = data[i.field];
								var isNumber = (typeof(num)=='number')?true:false;
								num = (isNumber)? num:num.replace('<sup>2</sup>','²');
								num=num+'';
								doc.text(num,left+50,top+30);
								top+=45;
							}
						}
						
						//second block-------------------------------------------
						if (data.actConsul.value) {
                            //code
                       
							top+=10;
							
							
							doc.setDrawColor(0);
							doc.setFillColor(242,243,244);
							doc.rect(left-20, top-5, 260, 22, 'F');
							
							doc.setFontSize(11);doc.setTextColor(87, 84, 85);
							doc.text('Actividad consultada:',left+20,top+10);
							top+=20;
							doc.setFontSize(10);doc.setTextColor(87, 84, 85);
							var value = data.actConsul.label+' ('+data.actConsul.value+')';
							
							
							
							var arrayLabel = validator.getChains(value,27);
							var increment=0;
							for(var x in arrayLabel){
								doc.text(arrayLabel[x],left+40,top+16+increment);
								increment+=5;
								if(arrayLabel.length>1){
                                    top+=8;
                                }
								
							}
							doc.addImage(images[data.actConsul.clave], 'PNG',left+10,(top)-((arrayLabel.length>1)?((arrayLabel.length-1)*8):0));
							
							
						}
				
						
					//third block-------------------------------------------
						top+=35;
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left-20, top-5, 260, 22, 'F');

						doc.setFontSize(11);doc.setTextColor(87, 84, 85);
						doc.text('Actividad predominante:',left+20,top+10);
						top+=20;
						var increment = 0;
						doc.setFontSize(10);doc.setTextColor(225, 0, 122);
						for(var x in data.actpre){
							var i = data.actpre[x];
							var value = i.desc+' ('+(validator.getFormatNumber(i.total))+')';
							
							var arrayLabel = validator.getChains(value,27);
							var incrementText=0;
							for(var y in arrayLabel){
								doc.text(arrayLabel[y],left+40,top+16+incrementText+increment);
								incrementText+=5;
								if(arrayLabel.length>1){
                                    top+=5;
                                }
								
							}
							//doc.text(value,left+40,top+increment+16);
							var claveScian = (!validator.isGeneric(i.cve_scian))?validator.getIcon(i.cve_scian,'gen'):i.cve_scian;
							doc.addImage(images[claveScian], 'PNG',left+10,(top+increment)-((arrayLabel.length>1)?((arrayLabel.length-1)*5):0));
							increment+=25;
						}
						
						var lastTop = top+=increment+20;
						
					//composicion de unidades-----------------------------------
						top=lastTop;
						left=30;
						var info =[
							{field:'comerciop',image:'comercio',label:'Comercio',color:{r:102,g:15,b:128}},
							{field:'industriap',image:'industria',label:'Industria',color:{r:0,g:187,b:181}},
							{field:'serviciop',image:'servicio',label:'Servicios',color:{r:0,g:117,b:201}},
						]
						
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(0, top-15, 180, 32, 'F'); 
						
						doc.setFontSize(10);doc.setTextColor(87, 84, 85);
						doc.text( validator.convertToHtml('Composici&oacute;n de unidades:'),left+3,top-2);
						doc.text( validator.convertToHtml('econ&oacute;micas por sector'),left+13,top+9);
						top+=40;
						left-=15;
						var increment=0;
						for(var x in info){
							var i = info[x];
							
							var percent = data.compeco[i.field];
							percent = Math.round(percent);
							doc.setFontSize(7);doc.setTextColor(i.color.r, i.color.g, i.color.b);
							doc.text(percent+'%',left+increment+14,top+5);
							doc.addImage(images[i.image], 'PNG',left+increment+7,top+5,25,25);
							doc.setFontSize(10);doc.setTextColor(87, 84, 85);
							doc.text( validator.convertToHtml(i.label),left+increment,top+63);
							increment+=60;
						}
						
					//unidades ----------------------------------------
						top=lastTop;
						left=184;
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left, top-15, 140, 32, 'F'); 
						
						doc.setFontSize(10);doc.setTextColor(87, 84, 85);
						doc.text('El '+data.moda[0].porcentaje+'% de las unidades',left+11,top-2);
						doc.text( validator.convertToHtml('econ&oacute;micas tienen de:'),left+21,top+9);
						top+=9;
						doc.addImage(images['empleado'], 'PNG',left+45,top+15);
						doc.setFontSize(10);doc.setTextColor(87, 84, 85);
						doc.text( data.moda[0].estrato,left+25,top+95);
					
					//especializacion-----------------------------------
						top=lastTop;
						left=328;
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left, top-15, 130, 32, 'F'); 
						
						doc.setFontSize(10);doc.setTextColor(87, 84, 85);
						doc.text( validator.convertToHtml('Especializaci&oacute;n definida:'),left+11,top+5);
						
						var infoBlock = [
							{label:'Unidades econ&oacute;micas',image:data.specialization.especializacionUe.tipo,field:'especializacionUe'},
							{label:'Personal ocupado',image:data.specialization.especializacionPo.tipo,field:'especializacionPo'},
							{label:'Producci&oacute;n bruta total',image:data.specialization.especializacionPb.tipo,field:'especializacionPb'}
						]
						var increment=0;
						top+=40;
						doc.setFontSize(9);doc.setTextColor(87, 84, 85);
						for(var x in infoBlock){
							var i = infoBlock[x];
							doc.text( validator.convertToHtml(i.label),left+5,top+increment-7);
							doc.text( data.specialization[i.field].value+'%',left+40,top+increment+3);
							doc.addImage(images[i.image], 'PNG',left+98,top+increment-20);
							increment+=30;
						}
						
					//indice de desarrollo-----------------------------------
						top=lastTop;
						left=462;
						var b = blocks.second;
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left, top-15, 150, 32, 'F'); 
						
						doc.setFontSize(10);doc.setTextColor(87, 84, 85);
						doc.text( validator.convertToHtml('&Iacute;ndice de desarrollo:'),left+25,top-1);
						doc.text( validator.convertToHtml('econ&oacute;mico'),left+40,top+10);
						
						top+=20;
						left-=15;
						var color = null;
						for(var x in b.rank){
							var i = b.rank[x];
							if ((data.indsoeco>=i.a)&&(data.indsoeco<=i.b)) {
                               color = i.color;
							   break;
							}
						}
						doc.setFontSize(10);doc.setTextColor(color.r, color.g, color.b);
						var value = data.indsoeco+'';
						doc.text(value,left+30,top+40);
						doc.addImage(images['indsoc'], 'PNG',left+55,top);
						for(var x in b.rank){
							var i = b.rank[x];
							doc.setFontSize(10);doc.setTextColor(150, 151, 152);
							var label = i.a + ' - '+i.b;
							doc.text(label,left+95,top+20);
							top+=15;
						}
						
					
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
					
					$("#vocationMapa").mapping('exportMap','png',{event:function(img){
						var evento = function(){
							//mapping area ---------------------
							var widthMap = parseFloat($("#vocationMapa").width());
							var heightMap = parseFloat($("#vocationMapa").height());
							//var widthMap = 547;
							//var heightMap = 596;
							var ancho = 325;
							var alto = Math.round(((1/widthMap)*ancho)*heightMap);
							doc.addImage(img, 'PNG',45,125,ancho,alto);
							doc.save('reporte.pdf');
							obj.hideSpinnerExport();
						}
						var graphs = ['comercio_svg','industria_svg','servicio_svg'];
						loadGraphsImages(doc,graphs,0,evento,-2,lastTop+19);
						
					}});
					
				}
				
			}
	}
})