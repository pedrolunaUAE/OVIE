define(['code/config',
		'code/getData',
		'code/modules/validator',
		'code/ovieFooter',
		'code/compararMetadata',
		'tooltip'
		],function(
		config,
		getData,
		validator,
		Footer,
		compararMetadata,
		tooltip
		){	return{
			
			getIdContainer:function(){
					return config.menu[3].id;
			},
			init:function(main){
				var obj = this;
				obj.main = main;
				var localUrl = require.toUrl("code");
					localUrl = localUrl.split('?')[0];

				$.when(
					$('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_compare.css'}).appendTo('head'),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					obj.createUI();
				});
			},
			_refresh:function(){
				this.events();
			},
			createUI:function(){
				var obj = this;
				
				this.buildStructure();
				this.events();
			},
			paramsSelected:{
				area1:null,
				area2:null,
				turn:null
			},
			resultsComparation:{
				area1:null,
				area2:null
			},
			step:1,
			mappingLoaded:false,
			editMode:false,
			changeMode:false,
			dataReport:[],
			dataKml:{
				area1:[],
				area2:[]
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
			showBlocker:function(){
				var obj = this;
				$("#"+obj._id + ' .blocker').show();
			},
			hideBlocker:function(){
				var obj=this;
				$("#"+obj._id + ' .blocker').hide();
			},
			buildStructure:function(){
				var obj=this;
				obj._id="container_mnu_compare";
				var chain = '<div id="compare_container" class="width-content">'+
				
								'<div class="row compare_container">'+
									'<div class="col s12 tabSection">'+
										'<div id="itemTab1" step="1" class="itemTab active">Paso 1</div>'+
										'<div id="itemTab2" step="2" class="itemTab">Paso 2</div>'+
										'<div id="itemTab3" step="3" class="itemTab">Paso 3</div>'+
									'</div>'+
									'<div class="col s12 labelSection">'+
										'Seleccione la zona 1 a comparar'+
									'</div>'+
									'<div class="col s12 m6 l6 tab">'+
										'<div id="TabAreaSelector"></div>'+
									'</div>'+
									'<div class="col s12 m6 l6 map1">'+
										'<div id="map_compare1" class="map_compare"></div>'+
									'</div>'+
									'<div class="col s12 m6 16 map2">'+
										'<div id="map_compare2" class="map_compare"></div>'+
									'</div>'+
									'<div class="col s12"><div id="TabSelect_turn"></div></div>'+
									obj.getBlocker()+
									'<div class="col s12"><div id="resultsComparation"></div></div>'+
									
									'<div class="col s12 compare-export" style="display:none">'+
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
									Footer.get()+
									obj.getSpinnerExportFile()+
								'</div>'+
								'<div class="row buttonsCompare">'+
									'<div class="col s6 buttonPrev buttonCompare"><a class="button waves-effect waves-light btn-large">Anterior</a></div>'+
									'<div class="col s12 buttonNext buttonCompare"><a class="button waves-effect waves-light btn-large">Siguiente</a></div>'+
								'</div>'+
								'<div class="blocker_compare"></div>'+
							'</div>';
												
				$("#container_mnu_compare").append(chain);
				$("#TabSelect_turn").customTab({sections:[{label:'Principales',id:'select_turn',overflow:true},{label:'Buscar',id:'searchInfoCompare',overflow:false},{label:'Ver todas',id:'allDataCompare',overflow:false}],height:370});
				$("#TabAreaSelector").customTab({sections:[{label:'Buscar en el mapa',id:'searchAreaCompare',overflow:false},{label:'&Aacute;reas de selecci&oacute;n',id:'compare_areas',overflow:true}],height:370});
				$('#searchAreaCompare').searchWidget({
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
						$("#map_compare"+obj.step).mapping('goCoords',data.wkt);
					},  
					events:function(trigger,value){
						switch(trigger){
							case 'mdi-content-add-circle':
								obj.addAreaMap(value);
							break;
						}
					}	
				});
				$('#searchInfoCompare').searchWidget({
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
						obj.paramsSelected.turn={label:b,id:c};
						if (!obj.editMode) {
                            obj.showComparation();
                        }
					}
				});
				
				$("#allDataCompare").activityList({
					config:config,
					selected:function(label,id){
						obj.clearItems('all');
						obj.paramsSelected.turn={label:label,id:id};
						if (!obj.editMode) {
                            obj.showComparation();
                        }
					}
				}); 
				obj.requestCatalog('main');
				$("#"+obj._id+" .itemTab").click(function(){
					var valid = obj.isValidStep();
					if (valid) {
                        var step = parseInt($(this).attr('step'));
						obj.step=step;
						obj.showStep(step);
                    }
					
				});
				//obj.showEditonMode(true);
			},
			clearItems:function(item){
				var obj = this;
				$("#"+obj._id+" #select_turn .act-item.active").removeClass('active');
				if (item!='search') {
                    $("#"+obj._id+" #searchInfoCompare .collection-item.active").removeClass('active');
                }
				if (item!='all') {
                    $("#"+obj._id+" #allDataCompare .activity-row-container.active").removeClass('active');
                }
				
			},
			showStep:function(opc){
				var obj = this;
				obj.editMode=true;
				var Footer =$("#"+obj._id+" .FooterSection"); 
				$("#"+obj._id+" .itemTab.active").removeClass("active");
				$("#"+obj._id+" #itemTab"+obj.step).addClass("active");
				var label = $("#"+obj._id+" .labelSection");
				var tabSection = $("#"+obj._id+" .tabSection");
				var tab =$("#"+obj._id+" .tab");
				var map =$("#"+obj._id+" .map1");
				var map2 =$("#"+obj._id+" .map2");
				var mapButtons = $("#"+obj._id+" .map1 .Buttons");
				var mapButtons2 = $("#"+obj._id+" .map2 .Buttons");
				var turn = $("#"+obj._id+" #TabSelect_turn");
				var btnNext = $("#"+obj._id+" .buttonNext");
				var btnNextLabel = $("#"+obj._id+" .buttonNext a");
				var btnPrevLabel = $("#"+obj._id+" .buttonPrev a");
				btnPrevLabel.html('Anterior');
				var blocker = $("#"+obj._id+" .blocker_compare");
				var btnPrev = $("#"+obj._id+" .buttonPrev");
				var results = $("#"+obj._id+" #resultsComparation");
				var exportBtn = $("#"+obj._id+" .compare-export");
				tab.hide();
				map.hide();
				map2.hide();
				turn.hide();
				btnPrev.hide();
				Footer.hide();
				label.show();
				blocker.fadeIn();
				tabSection.show();
				results.hide();
				exportBtn.hide();
				mapButtons.hide();
				mapButtons2.hide();
				btnNext.removeClass('s6').removeClass('s12');
				$("#compare_container .Title").hide();
				$("#compare_container .Change").hide();
				$('#compare_areas').areas('clearItems');
				$('#compare_areas').areas('showAll');
				var reference = obj.paramsSelected['area'+obj.step];
				if (reference) {
                    $('#compare_areas').areas('seleccionarItem',reference);
                }
				var step = (opc)?opc:obj.step;
				switch (step+'') {
                    case '1':
						$('#compare_areas').areas('hide',obj.paramsSelected['area'+(obj.step+1)]);
						tab.show();
						map.show();
						label.html('Seleccione la zona 1 a comparar');
						btnNextLabel.html('Siguiente');
						btnNext.addClass('s12');
						$("#map_compare1").mapping({features:obj.main.localData.geoList});
						$("#map_compare1").mapping('activeControl',{control:'identify',active:true});
						mapButtons.show();
						$("#TabAreaSelector").customTab('activate','searchAreaCompare');
						$("#sa_clearsearch_btn_searchAreaCompare").click();
						break;
					case '2':
						
						$('#compare_areas').areas('hide',obj.paramsSelected['area'+(obj.step-1)]);
						tab.show();
						map2.show();
						label.html('Seleccione la zona 2 a comparar');
						btnNextLabel.html('Siguiente');
						mapButtons2.show();
						btnNext.addClass('s6');
						btnPrev.show();
						if (!obj.mappingLoaded) {
                            obj.mappingLoaded=true;
							obj.loadMapping();
                        }else{
							$("#map_compare2").mapping({features:obj.main.localData.geoList});
							$("#map_compare2").mapping('activeControl',{control:'identify',active:true});
						}
						$("#TabAreaSelector").customTab('activate','searchAreaCompare');
						$("#sa_clearsearch_btn_searchAreaCompare").click();
						break;
					case '3':
						turn.show();
						label.html('Seleccione el giro econ&oacute;mico');
						btnNextLabel.html('Finalizar');
						
						btnNext.addClass('s6');
						btnPrev.show();
						break;
					case 'map1':
						$("#TabAreaSelector").customTab('activate','compare_areas');
						$("#sa_clearsearch_btn_searchAreaCompare").click();
						$('#compare_areas').areas('hide',obj.paramsSelected['area'+(obj.step+1)]);
						tabSection.hide();
						tab.show();
						map.show();
						label.html('Seleccione la zona 1 a comparar');
						btnNextLabel.html('Aceptar');
						btnNext.addClass('s12');
						btnNext.show();
						//btnPrev.show();
						btnPrevLabel.html('Cancelar');
						$("#map_compare1").mapping({features:obj.main.localData.geoList});
						$("#map_compare1").mapping('activeControl',{control:'identify',active:true});
						mapButtons.show();
						break;
					case 'map2':
						$("#TabAreaSelector").customTab('activate','compare_areas');
						$("#sa_clearsearch_btn_searchAreaCompare").click();
						$('#compare_areas').areas('hide',obj.paramsSelected['area'+(obj.step-1)]);
						tabSection.hide();
						tab.show();
						map2.show();
						label.html('Seleccione la zona 2 a comparar');
						btnNextLabel.html('Aceptar');
						btnNext.addClass('s12');
						btnNext.show();
						//btnPrev.show();
						btnPrevLabel.html('Cancelar');
						$("#map_compare2").mapping({features:obj.main.localData.geoList});
						$("#map_compare2").mapping('activeControl',{control:'identify',active:true});
						mapButtons2.show();
						break;
					default :
						tabSection.hide();
						btnNext.hide();
						label.hide();
						map.show();
						map2.show();
						$("#"+obj._id+" .blocker_compare").fadeOut();
						turn.show();
						$("#compare_container .Title").show();
						$("#compare_container .Change").show();
						obj.editMode=false;
						obj.changeMode=false;
						Footer.show();
						$("#map_compare1").mapping({title:'&Aacute;rea 1',change:{title:'Cambiar',event:function(){obj.changeMode=true;obj.step=1;obj.showStep('map1')}}});
						$("#map_compare2").mapping({title:'&Aacute;rea 2',change:{title:'Cambiar',event:function(){obj.changeMode=true;obj.step=2;obj.showStep('map2')}}});
						$("#map_compare1").mapping('activeControl',{control:'identify',active:true});
						$("#map_compare2").mapping('activeControl',{control:'identify',active:true});
						mapButtons.hide();
						mapButtons2.hide();
						obj.showComparation();
						break;
					
                }
			},
			showComparation:function(){
				var obj = this;
				var p = obj.paramsSelected;
				var evento = function(){
					obj.requestResults(p.area2.db,p.turn.id,null,'area2');
				}
				obj.requestResults(p.area1.db,p.turn.id,evento,'area1');
			},
			isValidArea:function(item){
				var obj=this;
				var valid = true;
				var step = (obj.step==1)?2:1;
				if (obj.paramsSelected['area'+step]) {
                    if (item.id==obj.paramsSelected['area'+step].item) {
						valid = false
					}
                }
				return valid;
			},
			addAreaMap:function(item){
				var obj = this;
				var valid = obj.isValidArea(item);
				var msg = 'El &aacute;rea seleccionada ya es usada para comparar seleccione otra';
				if (valid) {
					
					var id = 'radiovalue';
					var cadena = '<input id="'+id+'" placeholder="Ingrese el valor" type="number" />'
					var btnAccept = function(){
						var val = parseInt($('#'+id).val()|0);
						$("#map_compare"+obj.step).mapping('addBufferToGeometry',item.id,val,item.tabla,item.label);
						$("#TabAreaSelector").customTab('activate','compare_areas');
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
				}else{
					 Materialize.toast(msg, 4000);
				}
			},
			displayFeatures:function(features){
				var obj=this;
				var map = $("#map_compare"+obj.step);
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
			loadMapping:function(){
				var obj = this;
				
				//$("#map_compare1").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:false},features:obj.main.localData.geoList,title:'&Aacute;rea 1',change:{title:'Cambiar',event:evento}});
				$("#map_compare2").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:true},features:obj.main.localData.geoList,onAddFeature:function(data){
															obj.onAreaAdded(data);
														}});
			},
			onAreaAdded:function(data){
				var obj = this;
				obj.main.localData.geoList.push(data);
				obj.displayAreas();
			},
			displayAreas:function(){
				var obj = this;
				$('#compare_areas').areas({
					data:obj.main.localData.geoList
				});
				var actualStep = (obj.step==1)?2:1;
				$('#compare_areas').areas('hide',obj.paramsSelected['area'+(actualStep)]);
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
			},
			onAreaSel:function(item){
				var obj = this;
				$("#map_compare"+obj.step).mapping('goCoords',item.wkt);
			},
			events:function(){
				var obj = this;
				if (obj.mappingLoaded) {
					obj.loadMapping();
                }
				
				$("#map_compare1").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:true},features:obj.main.localData.geoList,onAddFeature:function(data){
															obj.onAreaAdded(data);
														}});
				$("#compare_areas").areas({
					xclose:false,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
						obj.paramsSelected['area'+obj.step]=item;
					},
					eventCloseItem:function(item){
						$("#map_compare"+obj.step).mapping('removeFeatureByDB',item.db);
						//$("#map_compare2").mapping('removeFeatureByDB',item.db);
						obj.onAreaDeleted(item.db);
						var itemSelected = obj.paramsSelected['area'+obj.step];
						if (itemSelected.db==item.db) {
                            obj.paramsSelected['area'+obj.step]=null;
                        }
					}
				});
				
				$("#"+obj._id+" .buttonNext a").unbind().click(function(){
					var valid = obj.isValidStep();
					if (valid) {
                        obj.step = (obj.changeMode)?4:obj.step+1;
						obj.showStep(obj.step);
                    }
					
				});
				$("#"+obj._id+" .buttonPrev a").unbind().click(function(){
					
					var valid = obj.isValidStep();
					if (valid) {
						obj.step = (obj.changeMode)?4:obj.step-1;
						obj.showStep(obj.step);
					}
				});
				$("#"+obj._id+" .exportPdf").click(function(){
					var parametros = {selected:obj.paramsSelected,results:obj.dataReport};
					obj.report(parametros);
				});
				$("#"+obj._id+" .exportKml").click(function(){
                    var features = $("#map_compare2").mapping('getFeatures',{id:obj.paramsSelected.area2.db,addMarkers:false,data:obj.dataKml.area2});
					$("#map_compare1").mapping('getKml',{id:obj.paramsSelected.area1.db,addMarkers:true,data:obj.dataKml.area1,additionalFeatures:features});
					
					
				});
				obj.eventScroll();
			},
			isValidStep:function(){
				var obj = this;
				var valid = true;
				var msg = null;
				var o = obj.paramsSelected;
				switch (obj.step) {
                    case 1:
						if (!o.area1) {
							valid=false;
                            msg="Debe seleccionar el &aacute;rea 1 a comparar";
                        }
						if ((o.area1)&&(o.area2)&&(o.area2.db==o.area1.db)) {
							valid=false;
                            msg="Las &aacute;reas a comparar deben ser distintas";
                        }
						break;
					case 2:
						if (!o.area2) {
							valid=false;
                            msg="Debe seleccionar el &aacute;rea 2 a comparar";
                        }
						if ((o.area1)&&(o.area2)&&(o.area2.db==o.area1.db)) {
							valid=false;
                            msg="Las &aacute;reas a comparar deben ser distintas";
                        }
						break;
					case 3:
						if (!o.turn) {
							valid=false;
                            msg="Debe seleccionar un giro a comparar";
                        }
						break;
                }
				if (msg) {
                    Materialize.toast(msg, 4000);
                }
				return valid;
			},
			showEditonMode:function(status){
				var obj = this;
				if (status) {
					$("#"+obj._id+" .blocker_compare").fadeIn();
					$("#"+obj._id+" .selector_areaItem").show();
					$("#"+obj._id+" .map_compare").hide();
					$("#"+obj._id+" #results_compare").hide();
					$("#"+obj._id+" .buttonSection").show();
					$("#"+obj._id+" .compare_container").next().hide();
					
                }else{
					$("#"+obj._id+" .blocker_compare").fadeOut();
					$("#"+obj._id+" .selector_areaItem").hide();
					$("#"+obj._id+" .map_compare").show();
					$("#"+obj._id+" #results_compare").show();
					$("#"+obj._id+" .buttonSection").hide();
					$("#"+obj._id+" .compare_container").next().show();
					obj.loadMapping();
				}
				obj.editMode=status;
			},
			requestCatalog:function(type,clv){
				var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.dataSource.providers.catalog;
				var tab = $("#TabSelect_turn");
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
			buildTableComparation:function(){
					var obj = this;
					obj.dataReport=[];
					obj.dataKml={area1:[],area2:[]};
					var p = obj.paramsSelected;
					var rows = config.comparation;
					var titles = ['Apartado','indicador',p.area1.name/*'&Aacute;rea de an&aacute;lisis 1'*/,p.area2.name/*'&Aacute;rea de an&aacute;lisis 2'*/, 'Unidad del indicador'];
					var Titles='';
					var Rows='';
					for(var x in titles){
						Titles+='<th class="headItem">'+titles[x]+'</th>';
					}
					var flag = false;
					var cont = 1;
					for(var x in rows){
						var i = rows[x];
						flag = !flag;
						classRow = (flag)?'grayRow':'pinkRow';
						classMain = '';
						classBorder = 'itemBorderTop';
						for(var y in i.indicators){
							var itemReport = {section:'',indicator:'',area1:'',area2:'',unit:''};
							var position = Math.round(i.indicators.length/2);
							Rows+='<tr class="'+classBorder+'">';
							classBorder='';
							for(var f in titles){
								extraClass=(y<i.indicators.length)?' itemBorderBottom':'';
								switch (f) {
                                    case '0':
										value = ((parseInt(y)+1)==position)?i.section:'';
										if ((value!='')&&(y==2)) {
                                            value+='('+p.turn.label+')' +' Informaci&oacute;n delegacional';
                                        }
										itemReport.section = value;
										extraClass=' itemCenter';
										break;
									case '1':
										value=i.indicators[y].label;
										itemReport.indicator = value+'';
										value='<div class="ovieSprite ovieSprite-igrey metadata" ref="'+i.indicators[y].id+'"></div>'+i.indicators[y].label;
										break;
									case '2':
										var symbol = i.indicators[y].symbol;
										var symbolPos = i.indicators[y].symbolPosition;
										value = obj.resultsComparation.area1[cont];
										value = (typeof(value)=='number')? validator.getFormatNumber(value):value;
										value = (symbol)?((symbolPos=='left')?symbol+value:value+symbol):value;
										itemReport.area1 = value;
										break;
									case '3':
										var symbol = i.indicators[y].symbol;
										var symbolPos = i.indicators[y].symbolPosition;
										value=obj.resultsComparation.area2[cont];
										value = (typeof(value)=='number')? validator.getFormatNumber(value):value;
										value = (symbol)?((symbolPos=='left')?symbol+value:value+symbol):value;
										itemReport.area2 = value;
										break;
									case '4':
										value=i.indicators[y].unit;
										itemReport.unit = value;
										break;
                                }
								Rows+='<td class="'+classRow+extraClass+'">'+value+'</td>';
							}
							cont+=1;
							Rows+='</tr>';
							obj.dataReport.push(itemReport);
							obj.dataKml.area1.push({label:validator.getFormatHtml2(itemReport.indicator),value:validator.getFormatHtml2(itemReport.area1)+" "+validator.getFormatHtml2(itemReport.unit)});
							obj.dataKml.area2.push({label:validator.getFormatHtml2(itemReport.indicator),value:validator.getFormatHtml2(itemReport.area1)+" "+validator.getFormatHtml2(itemReport.unit)});
						}
						
					}
					var chain= '<table class="responsive-table">'+
									'<thead>'+
										'<tr>'+
											Titles+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
											Rows+
									'</tbody>'+
								'</table>'+
								'<div class="row textInformative">Para consultar detalle de los cálculos ver la sección de <a class="sectionHelp" href="docs/ayuda.pdf" target="_blank">ayuda</div>';
					$("#"+obj._id+" #resultsComparation").html(chain).show();
					
					$('#compare_container #resultsComparation .metadata').mouseenter(function(){
						var ref= $(this).attr("ref");
						var positions=$(this).offset();
						tooltip.show(ref,positions,2200,true);
						}).mouseleave(function(){
							tooltip.runClock();
					   });
					
			},
			clearResults:function(){
				var obj = this;
				$("#"+obj._id+" #resultsComparation").html('');
				$("#"+obj._id+" .compare-export").hide();
			},
			requestResults:function(geom,cve,event,area){
				var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.dataSource.comparation;
				var tab = $("#TabSelect_turn");
				var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success){
								valid=true;
								obj.resultsComparation[area]=json.data.indicators;
								if (!event) {
                                    obj.buildTableComparation();
									$("#"+obj._id+" .compare-export").show();
                                }
							}else{
							msg=json.response.message;
							}
						}
						if (!valid) {
							 Materialize.toast(msg, 4000);
						}
					
					},
					beforeSend: function(solicitudAJAX) {
							obj.showBlocker();
                            tab.customTab('showSpinner');
							obj.clearResults();
					},
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					},
					complete: function(solicitudAJAX,estatus) {
                            tab.customTab('hideSpinner');
							if (event) {
                                event();
                            }
							obj.hideBlocker();
					}
				};
				r = $.extend(r, c);
				r.url=config.dataSource.server+r.url+geom+'/'+cve;
				$.ajax(r);
			},
			updateMapping:function(){
				var obj = this;
				$("#map_compare1").mapping('update');
				if (obj.mappingLoaded) {
                    $("#map_compare2").mapping('update');
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
			displayCatalog:function(type,catalog,clv){
				var obj = this;
				var idSection ='select_turn';
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
						obj.clearItems();
						$('#'+idSection+' .act-item.active').removeClass('active');
						$(this).addClass('active');
						var id = $(this).attr('idref');
						var type = $(this).attr('typeref');
						obj.paramsSelected.turn={label:$(this).text(),id:id};
						if (!obj.editMode) {
                            obj.showComparation();
                        }
						
                        
				});
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
					var itemMap1=$("#map_compare1");
					var itemMap2=$("#map_compare2")
					var width1 = itemMap1.width()+14;
					var width2 = itemMap2.width()+14;
					if (active) {
                        itemMap1.addClass('pdfClass');
						itemMap1.css('width',width1+'px');
						itemMap2.addClass('pdfClass');
						itemMap2.css('width',width2+'px');
                    }else{
						itemMap1.removeClass('pdfClass');
						itemMap1.css('width','100%');
						itemMap2.removeClass('pdfClass');
						itemMap2.css('width','100%');
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
				var addTable = function(top,left,results,doc){
					var headers =[
							{label:"Apartado",field:'section',width:100,margin:30,maxCharacter:25},
							{label:"Indicador",field:'indicator',width:202,margin:88,maxCharacter:70},
							{label:"&Aacute;rea de an&aacute;lisis 1",field:'area1',width:85,margin:7,maxCharacter:15},
							{label:"&Aacute;rea de an&aacute;lisis 2",field:'area2',width:85,margin:7,maxCharacter:16},
							{label:"Unidades",field:'unit',width:90,margin:25,maxCharacter:25}
						]; 
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
										var heightRect = ((e.field=='section')&&(counterRow<3))?((arrayLabel.length>1)?(arrayLabel.length*5)+28:30):30;
										if (backHeightRect) {
                                            heightRect=backHeightRect;
                                        }
										doc.rect(left+increment, top, e.width, heightRect, 'F');
										if (arrayLabel.length>1) {
                                            backHeightRect=heightRect-4;
                                        }
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
									var leftLine = left+100;
									
									
									if (counterRow==3) {
                                        grayRow=!grayRow;
										counterRow=0;
										leftLine=left;
									}
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
					
					//header-------------------------------------------------------------------------------------------------
						var top = 80;
						left=30;
						addHeader(top,doc);
						doc.setFontSize(12);doc.setTextColor(87, 84, 85);
						doc.text('Comparabilidad',20,top+20);
						
						doc.setFontSize(10);doc.setTextColor(226, 0 ,122);
						doc.text(validator.convertToHtml('&Aacute;rea de an&aacute;lisis 1:'),20,top+42);
						doc.text(validator.convertToHtml('&Aacute;rea de an&aacute;lisis 2:'),315,top+42);
						
						doc.setFontSize(10);doc.setTextColor(150, 151, 152);
						doc.text(validator.convertToHtml(data.selected.area1.name),20,top+57);
						doc.text(validator.convertToHtml(data.selected.area2.name),315,top+57);
						
					
					//table-------------------------------------------------------------------------------------------------
						
						top=375;
						left=20;
						var firstSection = data.results.splice(0,9);
						var secondSection = data.results;
						firstSection[7].section=firstSection[8].section+'';
						secondSection[1].section=firstSection[8].section+'';
						firstSection[8].section='';
						addTable(top,left,firstSection,doc);
						
					
					//footer-----------------------------------------------------
						top=610;
						left=30;
						addFooter(top,left,doc);
					
					//Page number----------------------------------------------------
						top= 770;
						addPageText(top,'P&aacute;gina 1 de 2',doc);
					
					//--------------------------------------------------------
					
					$("#map_compare1").mapping('exportMap','png',{event:function(img){
						
							//mapping area ---------------------
							var widthMap = parseFloat($("#map_compare1").width());
							var heightMap = parseFloat($("#map_compare1").height());
							var ancho = 275;
							var alto = Math.round(((1/widthMap)*ancho)*heightMap);
							doc.addImage(img, 'PNG',20,145,ancho,alto);
						
							$("#map_compare2").mapping('exportMap','png',{event:function(img){
						
									var widthMap = parseFloat($("#map_compare2").width());
									var heightMap = parseFloat($("#map_compare2").height());
									var ancho = 275;
									var alto = Math.round(((1/widthMap)*ancho)*heightMap);
									doc.addImage(img, 'PNG',315,145,ancho,alto);
									doc.addPage();
									addHeader(80,doc);
									addTable(100,20,secondSection,doc);
									top=630;
									addFooter(610,30,doc);
									addPageText(770,'P&aacute;gina 2 de 2',doc);
									doc.save('reporte.pdf');
									obj.hideSpinnerExport();
							}});
					}});
					
				}
				
			}
	}
})