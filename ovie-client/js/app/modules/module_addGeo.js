
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
				$("#geoArea_areaMap").mapping('update');
			},
			eventScroll:function(){
				var obj = this;
				$("#main").scroll(function() {
					clearTimeout($.data(this, 'scrollTimerAdd'));
					$.data(this, 'scrollTimerAdd', setTimeout(function() {
						obj.updateMapping();
					}, 250));
					setTimeout(function(){
						tooltip.clearClock();
						tooltip.hide();
					},100);
				});
			},
			init:function(main){
				var obj = this;
				obj.main = main;
				obj.getData = getData.getData;
				
				var localUrl = require.toUrl("code");
					localUrl = localUrl.split('?')[0];
		
				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/moduleAddGeo.css'}).appendTo('head'),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					obj.createUI();
					obj.eventScroll();
					//tmp
					//$('#geoArea_results').results();
				});
			},
			_refresh:function(){
				var obj = this;
				
				$("#geoArea_areaMap").mapping({features:obj.main.localData.geoList});
				$("#geoArea_list").areas({data:obj.main.localData.geoList});
				var areas=obj.main.localData.geoList;
				if (areas.length<=0) {
					$('#geoArea_results').html("");
                }
			},
			displayFeatures:function(features){
				var map = $("#geoArea_areaMap");
				map.mapping('actionMarker',{action:'delete',items:'all',type:'soc'});
				for(var x in features){
					var f = features[x];
					var lon, lat;
					if (f.position && f.position.mercator) {
						var c = f.position.mercator.split(',');
						lon = c[1];
						lat = c[0];
					} else if (f.position && f.position.lon != null && f.position.lat != null) {
						lon = f.position.lon;
						lat = f.position.lat;
					} else {
						continue;
					}
					map.mapping('addMarker',{lon:lon,lat:lat,store:false,type:'soc',zoom:false,params:{nom:f.label,desc:f.typeLabel,image:'point'}});
				}
			},
			showSpinnerExport:function(){
				
				$("#geoadd-container .fixed-action-btn").hide();
				$("#geoadd-container .spinnerExport").show();
			},
			hideSpinnerExport:function(){
				$("#geoadd-container .spinnerExport").hide();
				$("#geoadd-container .fixed-action-btn").show();
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
			deleteAreaMap:function(id){
				//$("#map_compare2").mapping('actionFeature',{action:'delete',id:'feature.id'});
			},
			addAreaMap:function(item){
				var obj = this;
				var cadena = '<input id="radiovalue" placeholder="Ingrese el valor" type="number" />'
				var btnAccept = function(){
					var val = parseInt($('#radiovalue').val()|0);
					$("#geoArea_areaMap").mapping('addBufferToGeometry',item.id,val,item.tabla,item.label);
					$("#tabArea").customTab('activate','geoArea_list');
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
				//obj.displayResults(item.id);
				
			},
			onAreaAdded:function(data){
				var obj = this;
				obj.main.localData.geoList.push(data);
				obj.displayAreas();
			},
			onAreaSel:function(item){
				var obj = this;
				obj.localData.areaSel = item;
				obj.displayResults(item);
				$("#geoArea_areaMap").mapping('goCoords',item.wkt);
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
				$("#geoArea_results").html("");
			},
			
			displayAreas:function(){
				var obj = this;
				$('#geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						$("#geoArea_areaMap").mapping('removeFeatureByDB',item.db);
						obj.onAreaDeleted(item.db);
					}
				});
			},
	
			displayResults:function(item){
				var obj = this;
				var ds = $.extend(true,{},config.dataSource.indicators);
				ds.url = config.dataSource.server+ds.url;
				ds.params = {id:item.db};
				var evento=function(){
						var parametros = {
							areaName:item.name
						};
						var data = $("#geoArea_results").results('getReportData')
						//var data=$('#geoArea_results').results('extraerDatos');
						parametros = $.extend({}, parametros, data);
						obj.report(parametros);
					};
				$('#geoArea_results').results({
					indicators:config.var_indic,
					getData:obj.getData,
					dataSource:ds,
					creaPdf:evento,
					area:item.area,
					radio:item.ratio,
					tooltip:tooltip,
					endPage:validator.endPage,
					validator:validator
				});
			},
			createUI:function(){
				var obj = this;
				var cadena = '';
					cadena = '<div id="geoadd-container" class="width-content">';
					cadena+= '	<div class="row">'
					cadena+= '		<div class="col s12 m5" style="margin-top:-7px"><div id="tabArea"></div></div>';
					cadena+= '		<div class="col s12 m7"><div id="geoArea_areaMap" class="geoArea-areaMap"></div></div>';
					cadena+= '		<div class="col s12"><div id="geoArea_results" class="geoArea-results"></div></div>';
					cadena+= 		Footer.get();
					cadena+= '	</div>';
					cadena+=    obj.getSpinnerExportFile();
					cadena+= '</div>';
					
    
				$('#container_mnu_addGeo').html(cadena);
				$("#tabArea").customTab({sections:[{label:'Buscar en el mapa',id:'searchArea',overflow:false},{label:'&Aacute;reas de selecci&oacute;n',id:'geoArea_list',overflow:true}],height:610});
				$('#searchArea').searchWidget({
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
						$("#geoArea_areaMap").mapping('goCoords',data.wkt);
					},  
					events:function(trigger,value){
						switch(trigger){
							case 'mdi-content-add-circle':
								obj.addAreaMap(value);
							break;
						}
					}	
				});
				
				//setTimeout(function(){
					$("#geoArea_areaMap").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:true},features:obj.main.localData.geoList,
														onAddFeature:function(data){
															obj.onAreaAdded(data);
														},
														identify:function(point){
																
														}
													});
				//},500);
				$('#geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						$("#geoArea_areaMap").mapping('removeFeature',item.id);
						obj.onAreaDeleted(item.db);
					}
				});
			},
			
			
			
			report:function(data){
				var obj = this;
				obj.showSpinnerExport();
				var blocks = {
					first:[
						{label:'Radio:',field:'radio'},
						{label:'Superficie:',field:'superficie'},
						{label:'Población total:',field:'pobtot'},
						{label:'Viviendas totales:',field:'vivtot'},
						{label:'Total de unidades económicas',field:'uetotal'}
					],
					second:{
						rank:[
							/*
							{a:'0.75',b:'1.00',color:{r:223,g:19,b:43}},
							{a:'0.50',b:'0.75',color:{r:233,g:67,b:59}},
							{a:'0.25',b:'0.50',color:{r:243,g:147,b:23}},
							{a:'0.00',b:'0.25',color:{r:53,g:170,b:65}}*/
							
							
							{a:'0.75',b:'1.00',color:{r:53,g:170,b:65}},
							{a:'0.50',b:'0.75',color:{r:243,g:147,b:23}},
							{a:'0.25',b:'0.50',color:{r:233,g:67,b:59}},
							{a:'0.00',b:'0.25',color: {r:223,g:19,b:43}}
							
						],
						field:'indsoc',
						label:'Indice de desarrollo social:'
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
						superficie:null,
						totemple:null,
						uetotal:null,
						vivtot:null
				}
				var modePdf = function(active){
					var itemMap=$("#geoArea_areaMap");
					var width = itemMap.width()+14;
					if (active) {
                        itemMap.addClass('pdfClass');
						itemMap.css('width',width+'px');
                    }else{
						itemMap.removeClass('pdfClass');
						itemMap.css('width','100%');
					}
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
						doc.addImage(images['logo'], 'PNG',25,15);
						doc.addImage(images['header'],'PNG',400,30);
						doc.setDrawColor(226, 0 ,122);
						doc.line(20, top, 590, 80);
						doc.setFontSize(12);doc.setTextColor(87, 84, 85);
						doc.text('Perfil Sociodemográfico',20,top+20);
						doc.setFontSize(10);doc.setTextColor(150, 151, 152);
						doc.text(data.areaName,20,top+35);
					
					
					//first block-----------------------
						var left = 400;
						top = 125;
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
					/*
						top+=20;
						var b = blocks.second;
						
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left-20, top-5, 260, 22, 'F');

						doc.setFontSize(11);doc.setTextColor(87, 84, 85);
						doc.text(b.label,left+20,top+10);
						top+=30;
						var color = null;
						for(var x in b.rank){
							var i = b.rank[x];
							if ((data[b.field]>=i.a)&&(data[b.field]<=i.b)) {
                               color = i.color;
							   break;
							}
						}
						doc.setFontSize(10);doc.setTextColor(color.r, color.g, color.b);
						var value = data[b.field]+'';
						doc.text(value,left+30,top+40);
						doc.addImage(images[b.field], 'PNG',left+55,top);
						for(var x in b.rank){
							var i = b.rank[x];
							doc.setFontSize(10);doc.setTextColor(150, 151, 152);
							var label = i.a + ' - '+i.b;
							doc.text(label,left+95,top+20);
							top+=15;
						}
						*/
					//grandes grupos de edadd-----------------------------------
						top=535;
						left=25;
						var aditional = '%';
						var edades = [
								{field:'e_0_14',r:242,g:144,b:106},
								{field:'e_15_24',r:246,g:160,b:23},
								{field:'e_25_44',r:137,g:124,b:122},
								{field:'e_45_64',r:0,g:159,b:158},
								{field:'e_65_mas',r:241,g:144,b:169}
								
						]
						
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(0, top-15, 210, 22, 'F'); 
						
						doc.setFontSize(11);doc.setTextColor(87, 84, 85);
						doc.text('Grandes grupos de edad:',left+25,top);
						doc.addImage(images['grandesgrupos'], 'PNG',left+6,top);
						
						doc.setLineWidth(4);
						var leftLine = left+10;
						/*
						var widthLine = 98;
						var increment = widthLine-leftLine;
						*/
						var widthLine = 0;
						var increment = 0;
						var totalWidth = 154;
						var incrementText = 32;
						var leftText = left+13;
						for(var x in edades){ 
							var i = edades[x];
							var percent = data[i.field];
							doc.setDrawColor(i.r, i.g ,i.b);
							increment = (percent*totalWidth)/100;
							widthLine = leftLine+increment;
							doc.line(leftLine, top+66, widthLine, top+66);
							leftLine=widthLine;
							widthLine+=increment;
							
							doc.setFontSize(9);doc.setTextColor(225, 0, 122);
							var etiqueta = (percent)+aditional;
							doc.text(etiqueta,leftText,top+81);
							leftText+=incrementText;
						}
					//distribucion por sexo ----------------------------------------
						top=535;
						left=240;
						var aditional = '%';
						
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left-25, top-15, 137, 22, 'F');
						
						doc.setFontSize(11);doc.setTextColor(87, 84, 85);
						doc.text('Distribución por sexo',left-5,top);
						doc.addImage(images['distribucion'], 'PNG',left+15,top+25);
						var distribucion = [
								{field:'pobmas',color:{r:7,g:178,b:174}},
								{field:'pobfem',color:{r:231,g:38,b:136}}
						]
						
						var incrementText = 41;
						var leftText = left+11;
						for(var x in distribucion){
							var i = distribucion[x];
							var percent = data[i.field];
							var color = i.color;
							doc.setFontSize(9);doc.setTextColor(color.r, color.g, color.b);
							var etiqueta =percent+aditional;
							doc.text(etiqueta,leftText,top+82); 
							var plus = (etiqueta.length==1)?2:0;
							leftText+=incrementText+plus;
						}
					
					//escolaridad grupos de edadd-----------------------------------
						top=535;
						left=320;
						var aditional = '%';
						var escolaridad = [
								{field:'pres'},
								{field:'prim'},
								{field:'secu'},
								{field:'bach'},
								{field:'univ'},
								{field:'posg'}
								
						]
						doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left+38, top-15, 260, 22, 'F');
						
						doc.setFontSize(11);doc.setTextColor(87, 84, 85);
						doc.text('Nivel de escolaridad:',left+100,top);
						doc.addImage(images['escolaridad'], 'PNG',left+67,top+10);
						
						var incrementText = 30;
						var leftText = left+68+((data[escolaridad[0].field]>9)?0:2);
						for(var x in escolaridad){
							var i = escolaridad[x];
							var percent = data[i.field];
							doc.setFontSize(8);doc.setTextColor(87, 84, 85);
							var etiqueta = percent+aditional;
							doc.text(etiqueta,leftText,top+81);
							var plus = (percent>9)?1:2;
							leftText+=incrementText+plus;
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
					
					$("#geoArea_areaMap").mapping('exportMap','png',{event:function(img){
						
						//mapping area ---------------------
						var widthMap = parseFloat($("#geoArea_areaMap").width());
                        var heightMap = parseFloat($("#geoArea_areaMap").height());
						//var widthMap = 547;
						//var heightMap = 596;
						var ancho = 352;
						var alto = Math.round(((1/widthMap)*ancho)*heightMap);
						doc.addImage(img, 'PNG',20,125,ancho,alto);
						doc.save('reporte.pdf');
						obj.hideSpinnerExport();
					}});
					
				}
				
			}
			
	}
})