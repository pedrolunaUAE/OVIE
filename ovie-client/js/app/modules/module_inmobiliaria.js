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
          ){return{
                localData:{areaSel:null},
                getIdContainer:function(){
					return config.menu[0].id;
                },
                updateMapping:function(){
                    obj = this;
                    if (obj.inm_consultar) {
                        $("#inmobiliaria_areaMap").mapping('update');
                    }else{
                        $("#inm_questionnaireMap_container").mapping('update');
                    }
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
                  
                
                //variables globales
                punto:null,
                inm_consultar:true,
                existeMapa2:false,
                dataExport:{},
                pics:[],
                //
                
                init:function(main){
                    var obj = this;
                    obj.main = main;
                    obj.getData = getData.getData;
                    
                    var localUrl = require.toUrl("code");
                        localUrl = localUrl.split('?')[0];
            
                    $.when(
                        $('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_inmobiliaria.css?v=2'}).appendTo('head'),
                        $.Deferred(function( deferred ){
                            $( deferred.resolve );
                        })
                    ).done(function(){
                        obj.createUI();
                    });
                    
                    var logeo=config.login.status;
                    if (logeo==true) {
                       $("#inmob_itemLogin").css("color", "#4CAF50");
                    }else{
                       $("#inmob_itemLogin").css("color", "#d22726"); 
                    }
                    
                },
                
                _refresh:function(){
                    var obj = this;
                    $("#inmobiliaria_areaMap").mapping({features:[]});
                    $("#inmobiliaria-geoArea_list").areas({data:obj.main.localData.geoList});
                    
                    var logeo=config.login.status;
                    
                    if (logeo==true) {
                       $("#inmob_itemLogin").css("color", "#4CAF50");
                    }else{
                       obj.desloguear();
                       //$("#inmob_itemLogin").css("color", "#d22726"); 
                    }
                    obj.updateMapping();
                },
                
                displayFeatures:function(features){
                    var map = $("#inmobiliaria_areaMap");
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
                        $("#inmobiliaria_areaMap").mapping('addBufferToGeometry',item.id,val,item.tabla,item.label);
                        $("#inmobiliaria-tabArea").customTab('activate','inmobiliaria-geoArea_list');
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
				$("#inmobiliaria_areaMap").mapping('goCoords',item.wkt);
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
				$("#inmobiliaria_results").html("");//para limpiar el área de resultados 
			},
            
            displayAreas:function(){
				var obj = this;
				$('#inmobiliaria-geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						$("#inmobiliaria_areaMap").mapping('removeFeatureByDB',item.db);
						obj.onAreaDeleted(item.db);
					}
				});
			},
            clockUpdateMap:null,
            runClockUpdateMap:function(){
                  var obj = this;
                  if (obj.clockUpdateMap) {
                        clearTimeout(obj.clockUpdateMap);
                  }
                  obj.clockUpdateMap = setTimeout(function(){
                        obj.updateMap();      
                  },500);
            },
            updateMap:function(){
                  var obj = this;
                  var selected = ['chitosv3'];
                  $("#inmobiliaria_filtros input:checked").each(function() {
                        var val = $(this).val();
                        if (val!='all') {
                            selected.push(val);
                        }
                  });
                  var map = $("#inmobiliaria_areaMap");
                  map.mapping('setParamsToLayer',{layer:'Vectorial',forceRefresh:true,params:{layers:selected.join(',')}});
            },
            displayRecordCard:function(data,point){
                  var obj = this;
                  var map = $("#inmobiliaria_areaMap");
                  var title = 'Identificaci&oacute;n';
                  var chain = '';
                  var chain2= '';
                  var pics='';
                  var mainContent=config.inmobiliaria.ficha.mainContent;
                  var secondaryContent=config.inmobiliaria.ficha.secondaryContent;
                  
                  if (data.length>0) {
                        title='';
                        
                        for(var x in mainContent){
                              var i = mainContent[x];
                              var value=data[0][i.field];
                              if (value!="") {
                                    if((data[0][i.field])&&(obj.getField(i.field,data[0]))){
                                          if ((i.field=="modalidad_oferta")||(i.field=="tipo_inmueble")) {
                                              for (var y in i.items){
                                                 var item=i.items[y];
                                                 if (value==item.value) {
                                                     value=item.label;
                                                 }
                                                 
                                              }
                                          }
                                          chain+= '<tr class="inmPopup_Row"><td style="padding:5px; width:50%">'+i.label+':</td><td style="padding:5px; color:#6E1A1A">'+value+'</td></tr>';
                                    }
                              }
                        }

                         chain+= '<tr id="verMasRow"><td></td><td id="verMas"><div class="ovieSprite ovieSprite-menu-plusS" style="float:left"></div><div id="inmTxt_verMas">ver más</div></td></tr>';
                         
                         //ovieSprite ovieSprite-menu-plusS
                         for(var x in secondaryContent){
                              var i = secondaryContent[x];
                              var value=data[0][i.field];
                              var result=[];
                              if (value!="") {
                                    if(obj.getField(i.field,data[0])){
                                          if (i.field=="servicios") {
                                               var servicios=data[0].servicios;
                                               value="";
                                               servicios=servicios.split(",");
                                              for (var z in servicios){
                                                for(var y in i.items){
                                                  var item=i.items[y];
                                                  var val=parseInt(servicios[z]);
                                                  if (val==item.value) {
                                                      result.push(item.label);
                                                      value=result.join();
                                                  }
                                                  
                                                }
                                              }  
                                          }
                                          chain2+='<tr class="inmPopup_Row"><td style="padding:5px; width:50%">'+i.label+':</td><td style="padding:5px; color:#6E1A1A">'+value+'</td></tr>';
                                    }
                              }
                         }
                         
                         //estructura carrusel de fotos
                         pics+='<div id="inmCarrusel_container" style="display:none"></div>';
                         //chain2+='<tr id="verMenosRow"><td></td><td id="verMenos"><div class="ovieSprite ovieSprite-menu-restS" style="float:left"></div><div id="inmTxt_verMas">ver menos</div></td></tr>';
                         chain='<div id="inmPopup_container"><table id="primario" style="width:250px">'+chain+'</table><table id="secundario" style="display:none; width:250px">'+chain2+'</table>'+pics+'<div id="verMenos"><div class="ovieSprite ovieSprite-menu-restS" style="float:left"></div><div id="inmTxt_verMas">ver menos</div></div></div>';
                         
                         
                  }
                  var evento=function(){
                         //Estructura interna carrusel de fotos
                         var picContainer="";
                             picContainer+='<div class="inmPic-container">'+
                                                '<div class="inmPic-Arrow inmPic-leftArrow"><img id="inmCarrusel-leftArrow" src="img/icons/pinkArrowLeft.png"></div>'+
                                                '<div class="inmPic-photo-area">'+
                                                      '<div class="inmPic-photo-container" style="position:absolute; height:120px"></div>'+
                                                '</div>'+
                                                '<div class="inmPic-Arrow inmPic-rightArrow"><img id="inmCarrusel-rightArrow" src="img/icons/pinkArrowRight.png"></div>'+
                                           '</div>';
                         
                         
                         $("#inmCarrusel_container").append(picContainer);
                         
                        
                        
                         $("#inmobiliaria_areaMap_popup #verMas").click(function(){
                             $("#inmobiliaria_areaMap_popup #secundario").show();
                             //$("#inmCarrusel_container").show();
                             $("#verMenos").show();
                             $("#inmobiliaria_areaMap_popup #verMasRow").hide();
                             obj.carruselFotos(obj.pics);
                         });   
                              
                         
                         $("#inmobiliaria_areaMap_popup #verMenos").click(function(){
                             $("#inmobiliaria_areaMap_popup #secundario").hide();
                             $("#inmobiliaria_areaMap_popup #inmCarrusel_container").hide();
                             $("#verMenos").hide();
                             $("#inmobiliaria_areaMap_popup #verMasRow").show();
                         });
                  }
                  map.mapping('addMarker',{lon:point.lon,lat:point.lat,type:'identify',zoom:false,showPopup:true,params:{nom:title,desc:{custom:chain},img:'identify', event:evento}});
            },
            
            carruselFotos:function(photos){
                  var obj=this;
                  if (photos.length>0) {
                        $("#inmCarrusel_container").show();
                        //Calcular anchos de fotografías
                        var picWidth=$(".inmPic-photo-area").width(); //Ancho del área donde va la foto
                        var n=photos.length;  //num de fotografías
                        var ancho=picWidth*n; //calcular el ancho del contenedor de todas las fotografías
                        var rigthLimit=ancho-picWidth;
                        var img="";
                        var margen=0;
                        var marginLeft=0;
                                     
                        $(".inmPic-photo-container").css("width", ancho+"px");
                        for (var z in photos){
                              var src=photos[z].imagen;
                              img+='<div class="photo'+z+'" style="width:'+picWidth+'px;height:120px; float:left; overflow:hidden"><a class="fancybox" rel="group" href="data:image/png;base64,'+src+'"><img style="height:120px; overflow:hidden" src="data:image/png;base64,'+src+'"/></a></div>';
                        }
                                     
                        $(".inmPic-photo-container").html(img);
                        
                        if (photos.length==1) {
                              $("#inmCarrusel-leftArrow").hide();
                              $("#inmCarrusel-rightArrow").hide();
                        }
                                     
                        $(".inmPic-rightArrow").click(function(){
                              if (marginLeft==-rigthLimit) {
                                    margen=marginLeft;
                              }else{
                                    marginLeft=margen-picWidth;
                                    margen=marginLeft;
                              }   
                              $(".inmPic-photo-container").css("margin-left", margen+"px");
                        });
                                     
                        $(".inmPic-leftArrow").click(function(){
                              if(marginLeft==0){
                                    margen=0;
                              }else{ 
                                    marginLeft=margen+picWidth;
                                    margen=marginLeft;
                              }
                              $(".inmPic-photo-container").css("margin-left", margen+"px");
                        });
                  
                  }      
            },
            
            getField:function(field, data){
                 var obj = this;
                  var response = false;
                  var q = data;
                  for(var y in q){
                        if (field==y) {
                            response = true;
                            break;
                        }
                  }
                  return response;
            },
            
            requestRecordCard:function(e,resolution){ 
                var obj = this;
                var wkt = 'POINT('+e.lon+' '+e.lat+')';
                var params = {p:wkt,resolution:resolution};
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.inmobiliaria.identify;
				var r= {
					success:function(json,estatus){
						var error=false;
						if (json){
                            if(json.response.success){
                                    var evento = function(){
                                    }
                                    obj.requestFotos(json.data.registros[0].id_inm,evento);
                                    
                                    //setTimeout(function(){obj.requestFotos(json.data.registros[0].id_inm,evento);}, 1);
                                    
                                    obj.displayRecordCard(json.data.registros,e);
                                    obj.dataExport=json.data.registros;
                                    //obj.requestFotos(obj.dataExport[0].id_inm,e);
                             }
                        }else{
                              error=true;
							 }
						if (error) {
							 Materialize.toast(msg, 4000);
						}
					
					},
					beforeSend: function(solicitudAJAX) {
				    },
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					},
					complete: function(solicitudAJAX,estatus) {
					}
				};
				r = $.extend(r, c);
                r.data = (c.stringify)?JSON.stringify(params):params;
				$.ajax(r);
            },
            createUI:function(){
                var obj=this;
                obj._id="inmobiliaria-container";
                var chain='<div id="'+obj._id+'" class="width-content">'+
                            '<div class="row">'+
                                '<div class="col s12 tabSection">'+
                                        '<div class="row" style="margin-bottom:0px">'+   
                                              '<div class="col s3 m6 l6"><div id="itemTab1" step="1" module="inm_consultar" class="itemTab  active">Consultar</div></div>'+
                                              '<div class="col s9 m6 l6">'+
                                                      '<div id="inmob_itemLogin" step="4"><i id="inmob_logOut" class="small material-icons tooltipped" data-position="bottom" data-tooltip="cerrar sesión">perm_identity</i></div>'+//logearse y deslogearse
                                                      '<div id="itemTab3" step="3" module="inm_modificar" class="itemTab" style="float:right; display:none">Modificar oferta</div>'+
                                                      '<div id="itemTab2" step="2" module="inm_registrar" class="itemTab" style="float:right; margin-right:20px">Agregar nueva oferta</div>'+
                                              '</div>'+
                                             
                                        '</div>'+     
                                '</div>'+
						  	'</div>'+
                            '<div class="row moduleSection">'+
                                    '<div class="col s12 module show" id="inm_consultar_Container" >'+
                                          '<div class="row">'+
                                                '<div class="col s12 m5" style="margin-top:-7px">'+
                                                      '<div id="inmobiliaria-tabArea"></div>'+
                                                '</div>'+
                                                '<div class="col s12 m7"><div id="inmobiliaria_areaMap" class="inmobiliaria-areaMap"></div></div>'+
                                                '</div>'+
                                          '</div>'+
                                    '<div class="col s12 module" id="inm_registrar_Container">'+
                                          '<div id="inm_modifyList_container" style="display:none">'+
                                                '<ul class="collection" id="inm_modifyList">'+
                                                '</ul>'+
                                          '</div>'+
                                          '<div class="inm-registro-wrap">'+
                                                '<div id="inm_questionnaireMap_container" style="height:350px"></div>'+
                                                '<div id="inm_questionnaire_container" style="margin-top:25px"></div>'+
                                                
                                          '</div>'+
                                    '</div>'+
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
                            obj.getSpinnerExportFile()+
                            '</div>'+
                            Footer.get()+
                            
                          '</div>';
                          
                $('body').append('<div id="login"></div>');
                $('#container_mnu_inmobiliaria').html(chain);
                
                //$("#inmobiliaria-tabArea").customTab({sections:[{label:'Buscar en el mapa',id:'inmobiliariaSearchArea',overflow:false},{label:'&Aacute;reas de selecci&oacute;n',id:'inmobiliaria-geoArea_list',overflow:true}],height:610});
                $("#inmobiliaria-tabArea").customTab({sections:[{label:'Buscar en el mapa',id:'inmobiliariaSearchArea',overflow:false},{label:'Aplicar filtro',id:'inmobiliaria_filtros',overflow:true}],height:610});
                $("#submenu_inmob").customTab({sections:[{label:'consultar',id:'inmobiliariaSearchArea',overflow:false},{label:'registrar',id:'inmob_registrar',overflow:true},{label:'modificar',id:'inmob_modificar', overflow:true}],height:610});
                
                $('#inmobiliariaSearchArea').searchWidget({
					 searchType:'areas',
					 enabled:true,
					 inactiveText:'Buscar áreas',
					 dataSource:config.dataSource.searchAreas,
					 response:{     
						  asMenu:false,
						  height:550,
						  resultPath:'response.docs',
						  countPath:'response.numFound',
						  btnIcon:null,
						  btnTitle:null,
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
						$("#inmobiliaria_areaMap").mapping('goCoords',data.wkt);
					},  
					events:function(trigger,value){
						switch(trigger){
							case 'mdi-content-add-circle':
								obj.addAreaMap(value);
							break;
						}
					}	
				});
                $("#inmobiliaria_areaMap").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:$.extend({}, config.mapping),controls:{addFeatures:false},features:[],
														onAddFeature:function(data){
															obj.onAreaAdded(data);
														},
														identify:function(point){
                                                                $("#inmobiliaria_areaMap").mapping('actionMarker',{action:'delete',items:'all',type:'identify'});
                                                                var resolution = $("#inmobiliaria_areaMap").mapping('getResolution');
																obj.requestRecordCard(point,resolution);
														}
													});
                $('#inmobiliaria-geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						
						$("#inmobiliaria_areaMap").mapping('removeFeature',item.id);
						obj.onAreaDeleted(item.db);
					}
				});
                
                  $("#"+obj._id+" .itemTab").click(function(){
                        //var valid = obj.isValidStep();
                        //if (valid) {
                            var step = parseInt($(this).attr('step'));
                            var secc = $(this).attr('module');
                            obj.showStep(step, secc);
                            obj.stepsEvents(step,secc);
                        //}
                 });
                  
                  //Listado de filtros aplicables al mapa
                  var cadena='<form><ul class="collection">';
                  var datafilter=config.inmobiliaria.filter;
                  
                  for (var x in datafilter){
                        var i =datafilter[x];
                        var idItem = obj._id+'_test'+x;
                        cadena+='<li class="collection-item filter-Row">'+
                                    '<input type="checkbox" name="'+obj._id+'_filter" id="'+idItem+'" value="'+i.value+'"/>'+
                                    '<label for="'+idItem+'">'+i.label+'</label>'+
                                '</li>';
                  }
                  '</ul></form>';
                  
                  $("#inmobiliaria_filtros").html(cadena);
                  
                  $("#inmobiliaria_filtros :input").each(function(){
                        $(this).click(function(){
                              var val = $(this).val();
                              var status = $(this).is(':checked');
                              if (val=='all') {
                                    $("#inmobiliaria_filtros :input").prop('checked', status);
                              }else{
                                    if (!status) {
                                        $("#inmobiliaria_filtros input[value='all']").prop('checked', status);
                                    }
                              }
                              
                              obj.runClockUpdateMap();
                        });
                  });
                  
                  //*****************************************Inicializar Tooltip y click de logOut********************************************//
                  $('.tooltipped').tooltip({delay: 50});
                  $("#inmob_logOut").click(function(){
                        obj.requestlogOut();
                  });
                  $(".fancybox").fancybox();
                  
                  $('select').material_select();
                  obj.eventScroll();
            
                  $("#inmobiliaria-container .exportBtn").click(function(){
					//var parametros = $.extend({}, {areaName:obj.item.name}, reportData);
                    var evento = function(data){
                        obj.report(obj.dataExport[0],data);
                    }
                    obj.requestFotos(obj.dataExport[0].id_inm,evento);
                  });
            
            },
            
            showStep:function(opc, module){
                  var obj=this;
                  if (opc==3) {
                    module="inm_registrar";
                  }
                  //activar desactivar submenus
                  $("#"+obj._id+" .itemTab.active").removeClass("active");
				  $("#"+obj._id+" #itemTab"+opc).addClass("active");
                  
                  $("#"+obj._id+" .module.show").removeClass("show");
                  $("#"+obj._id+" #"+module+"_Container").addClass("show");
            },
            
            stepsEvents:function(opc,module){
               var obj=this;
               if (obj.existeMapa2) {
                   obj.updateMapping();
               }
               //Si es click a consultar ocultar tab de modificar oferta
               if (opc==1) {
                  obj.inm_consultar=true;
                  $("#"+obj._id+" #itemTab"+3).css("display", "none");
                  $("#inm_registrar_Container").css("display", "none");
                  $("#inm_consultar_Container").css("display", "block");
                 
                  //Construir una tabla temporal
                  var params=[{    
                              tipo:{title:"Tipo de oferta", value:"Oficina", dataType:"string"},
                              superficie:{title:"Superficie", value:60.5, dataType:"superficie"},
                              uso:{title:"Uso permitido", value: "C4/20", dataType:"string"},
                              oferta:{title:"Oferta", value:10500, dataType:"dinero"},
                              tel:{title:"Teléfono", value:4491252381, dataType:"telefono"}
                              },
                              {    
                              tipo:{title:"Tipo de oferta", value:"Local comercial", dataType:"string"},
                              superficie:{title:"Superficie", value:128.8, dataType:"superficie"},
                              uso:{title:"Uso permitido", value: "C4/20", dataType:"string"},
                              oferta:{title:"Oferta", value:20125, dataType:"dinero"},
                              tel:{title:"Teléfono", value:4491023286, dataType:"telefono"}
                              }]
                  
                 // obj.buildTable(params);
               }
               
              
               //si es click a registrar mostrar tab de modificar ofertas
               if(opc==2){
                  obj.inm_consultar=false;
                  $("#"+obj._id+" #itemTab"+3).css("display", "block");
                  $("#inm_consultar_Container").css("display", "none");
                  $("#inm_registrar_Container").css("display", "block");
                  $("#inm_modifyList_container").css("display", "none");
                  $(".inm-registro-wrap").css("display", "block");
                  
                   //$("#inm_modifyList_container").css("display", "none");
                  
                  //widget ficha de informacion COLOCADO AQUÍ DE MANERA TEMPORAL                  
                  /*$('#inm_registrar_Container').ficha({
                        params:{    
                                tipo:{title:"Tipo de oferta", value:"Oficina", dataType:"string"},
                                superficie:{title:"Superficie", value:60.5, dataType:"superficie"},
                                uso:{title:"Uso permitido", value: "C4/20", dataType:"string"},
                                oferta:{title:"Oferta", value:10500, dataType:"dinero"},
                                tel:{title:"Teléfono", value:4491252381, dataType:"telefono"}
                               }
                  });*/
                  
                  //login
                 //$("#"+obj._id+" #"+module+"_Container").removeClass("inm_registrar_wrap");
                  
                  //$('#inm_registrar_Container').login({config:config, event:obj.buildQuestionnaire});
                 
                  
                  var buildQuestionnaire=function(){
                        $("#"+obj._id+" #itemTab"+3).css("display", "block");
                        $(".inm-registro-wrap").css("display", "block");
                        $("#inm_modifyList_container").css("display", "none");
                       
                        var token=$('#login').login('getToken');
                        
                       //widget cuestionario
                        $('#inm_questionnaire_container').questionnaire({
                                                                              token:token,
                                                                              fields:config.questionnaire.realState,
                                                                              validator:validator,
                                                                              dataSource:config.dataSource.questionnaire.realState,
                                                                              data:null
                                                                        });
                  }
                  
                  var loginUser=function(){
                      $("#inmob_itemLogin").css("color", "#4CAF50");//green user
                  }
                  
                  var loginStatus=function(status){
                      config.login.status=status;
                  }
                  
                  var cancelTabs=function(){
                        obj.showStep(1,"consultar");
                        obj.stepsEvents(1,"consultar");
                  }
                  
                  $('#login').login({config:config, eventos:{buildQuestionnaire:buildQuestionnaire, loginUser:loginUser, loginStatus:loginStatus, cancelTabs:cancelTabs}, validator:validator, tipo:"inm"});
                 
                  
                  //obtener el punto del mapa
                  var eventoIdentify = function(e){
						   obj.punto = 'POINT('+e.lon+' '+e.lat+')';
                           $('#inm_questionnaire_container').questionnaire('setPoint',obj.punto);
				  };
                  
                  if (!obj.existeMapa2) {
                       obj.existeMapa2=true;
                  }
                  
                  //mapa área de cuestionario-así se inicializa un mapa 
                  $("#inm_questionnaireMap_container").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:config.mapping,controls:{addFeatures:false},features:obj.main.localData.geoList,
														onAddFeature:function(data){
															obj.onAreaAdded(data);
														},identify:eventoIdentify});
														
                  //widget cuestionario
                 /*$('#inm_questionnaire_container').questionnaire({
                                                                        fields:config.questionnaire.realState,
                                                                        validator:validator,
                                                                        dataSource:config.dataSource.questionnaire.realState,
                                                                        data:null
                                                                  });*/
                  
                  obj.clearMarks();
                  
              }
              
              if (opc==3){
                  obj.inm_consultar=false;
                  $("#inm_consultar_Container").css("display", "none");
                  $("#inm_registrar_Container").css("display", "block");
                  $(".inm-registro-wrap").css("display", "none");
                  $("#inm_modifyList_container").css("display", "block");
                 
                 /*$("#inm_registrar_Container").css("max-height","590px");
                 $("#inm_registrar_Container").css("overflow", "auto");*/
                 obj.requestModify();
              }
              
              
            },
            
            /*
            loginUser:function(){
                  var obj=this;
                  $("#itemLogin").css("display", "block");
            },
            
            
            /*buildQuestionnaire:function(){
                  var obj=this;
                  $("#"+obj._id+" #itemTab"+3).html("display", "block");
                  $(".inm-registro-wrap").css("display", "block");
                  $("#inm_modifyList_container").css("display", "none");
                  
                  //widget cuestionario
                  $('#inm_questionnaire_container').questionnaire({
                                                                        fields:config.questionnaire.realState,
                                                                        validator:validator,
                                                                        dataSource:config.dataSource.questionnaire.realState,
                                                                        data:null
                                                                  });
            },*/
            
            clearMarks:function(){
                var obj=this;
                //limpiar del mapa del cuestionario la chincheta
                $("#inm_questionnaireMap_container").mapping('actionMarker',{action:'delete',items:'all',type:'identify'});
            },
            
           showMarker:function(){
                  var obj = this;
                  if (obj.punto) {
                        var map = $("#inm_questionnaireMap_container");
                        map.mapping('actionMarker',{action:'delete',items:'all',type:'identify'});
                        var section = obj.punto.replace('POINT(','');
                        section = section.replace(')','');
                        section = section.split(' ');
                        var lon = parseInt(section[0]);
                        var lat = parseInt(section[1]);
                        map.mapping('addMarker',{lon:lon,lat:lat,type:'identify',zoom:false,params:{nom:'identificacion',desc:'',img:'identify'}});
                  }
                  
           },
           runClock:function(){
            
           },
           eventScroll:function(){
				var obj = this;
				$("#main").scroll(function() {
					clearTimeout($.data(this, 'scrollTimerInm'));
					$.data(this, 'scrollTimerInm', setTimeout(function() {
                        obj.updateMapping();
					}, 250));
				});
			},
           
            requestModify:function(){
                var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.inmobiliaria.modifyList;
				//var tab = $("#tabVocEcoAct");
				var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success){
								valid=true;
                                obj.buildModifyList(json.data.registros);
									
							}else{
                                  msg=json.response.message;
                                  obj.tokenExpired(json);
							 }
						}
						if (!valid) {
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
                r.headers = {'X-AUTH-TOKEN':$('#login').login('getToken')}; 
				//r.url=config.dataSource.server+r.url+((clv)?'/'+clv:'');
				//r.data = (c.stringify)?JSON.stringify(params):params;
				$.ajax(r);
            },
            
            requestIdModify:function(id){
                var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
                var c = config.inmobiliaria.modifyItem;
                var token=$('#login').login('getToken');
				var r= {
					success:function(json,estatus){
						var error=false;
						if (json){
                             $('#inm_modifyList_container').css("display","none");
                             $('.inm-registro-wrap').css("display","block");
                             $('#inm_questionnaire_container').questionnaire({
                                    token:token,
                                    fields:config.questionnaire.realState,
                                    validator:validator,
                                    dataSource:config.dataSource.questionnaire.realState,
                                    data:json[0],
                                    point:json[0].geometry
                              });
                              obj.punto = json[0].geometry;
                             
                             obj.requestFotos(id);
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
                r.headers = {'X-AUTH-TOKEN' : $('#login').login('getToken')}; 
				r.url=r.url+'id_inm='+id;
				$.ajax(r);
                  
            },
            
            requestFotos:function(id,evento){
                var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
                
				var c = (!evento)?config.inmobiliaria.downloadFotos:config.inmobiliaria.downloadFotosConsulta;
				
				var r= {
					success:function(json,estatus){
						var error=false;
						if (json){
                              if (evento) {
                                evento(json);
                                obj.pics=json;
                              }else{
                                    $('#inm_questionnaire_container').questionnaire('setImages',json,'rutas');
                                    obj.showMarker();
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
                if (!evento) {
                    r.headers = {'X-AUTH-TOKEN' : $('#login').login('getToken')}; 
                }
				r.url=r.url+'id_inm='+id;
				$.ajax(r);
            },
            
            //Función que se manda llamar cuando el servicio devuelve que el token ha expirado
            tokenExpired:function(){
               var obj=this;
                  
                  var deslogueo=$('#login').login('resetToken');
                  var loginUser=function(){
                      $("#inmob_itemLogin").css("color", "#4CAF50"); //colorVerde
                      /*$("#itemLogin").css("display", "block");*/
                  }
                  
                  var buildQuestionnaire=function(){
                        $("#"+obj._id+" #itemTab"+3).css("display", "block");
                        //$(".inm-registro-wrap").css("display", "block");
                        //$("#inm_modifyList_container").css("display", "none");
                       
                        //var token=$('#login').login('getToken');
                        
                       //widget cuestionario
                        $('#inm_questionnaire_container').questionnaire({
                                                                              token:null,
                                                                              fields:config.questionnaire.realState,
                                                                              validator:validator,
                                                                              dataSource:config.dataSource.questionnaire.realState,
                                                                              data:null
                                                                        });
                  }
                  
                  var loginStatus=function(status){
                      config.login.status=status;
                  }
                  
                  var cancelTabs=function(){
                        obj.showStep(1,"consultar");
                        obj.stepsEvents(1,"consultar");
                  }
                  
                  $('#login').login({config:config, eventos:{buildQuestionnaire:buildQuestionnaire, loginUser:loginUser, loginStatus:loginStatus, cancelTabs:cancelTabs}, validator:validator, tipo:"inm"});
               
            },
            
            //request logOut
            requestlogOut:function(){ 
                var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
                
				var c = config.login.logOut;
				
				var r= {
					success:function(json,estatus){
						var error=false;
						if (json){
                            if(json.response.success){
                               obj.desloguear();
                               /* $("#inmob_itemLogin").css("color", "#d22626");
                                obj.showStep (1,"inm_consultar");
                                obj.stepsEvents(1,"inm_consultar");
                                var deslogueo=$('#login').login('resetToken');
                                config.login.status=false;*/
                            }
                        }else{
                              error=true;
							 }
						if (error) {
							 Materialize.toast(msg, 4000);
						}
					
					},
					beforeSend: function(solicitudAJAX) {
				    },
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
					},
					complete: function(solicitudAJAX,estatus) {
					}
				};
				r = $.extend(r, c);
                r.headers = {'X-AUTH-TOKEN' : $('#login').login('getToken')}; 
				//r.url=r.url+'id_inm='+id;
				$.ajax(r);
                  
            },
            
            
            //Listado de ofertas que se pueden modificar
            buildModifyList:function(data){
                  var obj=this;
                  var cadena="";
                                
                  for (var x in data){
                       var i=data[x];
                       cadena+='<li class="collection-item inm-collection-item" id="inm_item'+i.id_inm+'" idItem='+i.id_inm+' style="cursor:pointer">'+i.titulo_oferta+'</li>';
                  }
                                   
                  $("#inm_modifyList").html(cadena);
                  $(".inm-collection-item").click(function(){
                        var id=$(this).attr('idItem');
                        var token=$('#login').login('getToken');
                        if (token==null) {
                            obj.tokenExpired();
                        }else{
                            obj.requestIdModify(id);
                            obj.clearMarks();  
                        }
                        
                        
                  });
            },
          
            //Tabla temporal con los datos de la ficha
            buildTable:function(params){
                  var obj=this;
                  var chain='';
                  var headTitle='';
                  var tableValue='';
                  
                  chain+='<div class="table-mainContainer">'+
                              '<table class="responsiveTable">'+
                                    '<thead>'+
                                          '<tr id="cellTitle">'+
                                          '</tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                          //'<tr id="cellValue">'+
                                          //'</tr>'+
                                    '</tbody>'+
                              '</table>'+
                         '</div>'
                         
                  //$("#inm_consultar_Container").append(chain);
                  
                  for  (var x in params)
                  {
                      tableValue+='<tr class="cellValue"></tr>';   
                      var i=params[x];
                      for(var y in i){
                        var j=i[y];
                        var cont=i.length;                             
                        if(x==0){
                                headTitle+='<th class="tableHead">'+j.title+'</th>';
                                }
                        tableValue+='<td class="tableValue">'+j.value+'</td>';   
                      }  
                  }
                  $("#cellTitle").html(headTitle);
                  $("tbody").html(tableValue);
            },
            
            desloguear:function(){
                  var obj=this;
                  $("#inmob_itemLogin").css("color", "#d22626");
                  obj.showStep (1,"inm_consultar");
                  obj.stepsEvents(1,"inm_consultar");
                  var deslogueo=$('#login').login('resetToken');
                  config.login.status=false;
            },
            
            sendFilter:function(){
                  var obj=this;
                  
                  
            },
            report:function(data,pictures){
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
						line1:null,
						line2:null,
						line3:null,
						logo:null,
                        not:null,
                        ok:null
				}
                
                if (pictures.length>0) {
                    for(var x in pictures){
                        var i = pictures[x];
                        images['i'+x]='data:image/png;base64,'+i.imagen;
                    }
                }
				var getImageFromUrl = function(url,image,callback) {
						var img = new Image();
					
						img.onError = function() {
							alert('Cannot load image: "'+url+'"');
						};
						img.onload = function() {
                            images[image] = img;
                            if ((image=='i0')||(image=='i1')||(image=='i2')||(image=='i3')||(image=='i5')) {
                                var canvas = document.createElement('CANVAS');
                                var ctx = canvas.getContext('2d');
                                var dataURL;
                                canvas.height = this.naturalHeight;
                                canvas.width = this.naturalWidth;
                                ctx.drawImage(this, 0, 0);
                                dataURL = canvas.toDataURL("image/png");
                                images[image]=dataURL;
                            }
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
					var itemMap=$("#inmobiliaria_areaMap");
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
                    var path = (images[x]==null)?'img/reports/'+x+'.png':images[x];
					getImageFromUrl(path,x,function(){
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
                var addTable = function(top,left,results,doc,headers,title){
					
						var increment = 0;
						var counterRow=1;
						var grayRow = true;
						for(var x in results){
									
									var arrayLabel = [];
									var drawLine=false;
									var i =  results[x];
									var additionalSpaces=0;
									var backHeightRect = null;
									for(var y in headers){
										var additionalSpacesBlock = 0;
										var e = headers[y];
										var label = '';//'S/D';
										if (i[e.field]) {
                                            label = $.trim(i[e.field]+'');
											label= validator.convertToHtml(label);
                                        }
										arrayLabel = validator.getChains(label,e.maxCharacter);
                                        if ((top>650)||((arrayLabel.length>4)&&(top>=555))) {
                                                addPageText(780,'P&aacute;gina 1 de 2',doc);
                                                doc.addPage();
                                                addHeader(80,doc);
                                                addFooter(625,30,doc);
                                                addPageText(780,'P&aacute;gina 2 de 2',doc);
                                                top=114;
                                        }
										if (title) {
                                                doc.setDrawColor(0);
                                                doc.setFillColor(242,243,244);
                                                doc.rect(left-6, top-15, 580, 32, 'F');     
                                                doc.setFontSize(10);doc.setTextColor(87, 84, 85);
                                                doc.text( validator.convertToHtml(title),left+10,top+5);
                                                top+=33;
                                        }
										var incrementTopArray=0;
										doc.setDrawColor(0);
										if (grayRow) {
											doc.setFillColor(243,243,243);
										}else{
											doc.setFillColor(249,220,232);
										}
										var heightRect = 28;
										doc.rect(left+increment, top, e.width, heightRect, 'F');
										doc.setFontSize(9);doc.setTextColor(150, 151, 152);
										for(var y in arrayLabel){
											doc.setFontSize(9);doc.setTextColor(150, 151, 152);
											doc.text(arrayLabel[y],left+increment+5,top+incrementTopArray);
											incrementTopArray+=12;
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
									if(arrayLabel.length>1){
                                          top+=(30+(additionalSpaces*8));
                                    }else{
                                          top+=19;
                                    }
									var leftLine = left;
									
                                    grayRow=!grayRow;
									counterRow=0;
										
									doc.setDrawColor(255, 255 ,255);
									doc.setLineWidth(3);
									doc.line(leftLine, top, 590, top);
									counterRow+=1;
									
						}
                        return top;
				}
                var getSections = function(data,sections){
                        var response=[];
                        while(data.length>=sections){
                             var section = data.splice(0,sections);
                             response.push(section); 
                        }
                        if (data.length>0) {
                            response.push(data); 
                        }
                        return response;
                }
                var addPageText = function(top,text,doc){
					doc.setFontSize(11);doc.setTextColor(87, 84, 85);
					doc.text(validator.convertToHtml(text),515,top);
				}
                var addHeader = function(top,doc){
					doc.addImage(images['logo'], 'PNG',25,15);
					doc.addImage(images['header'],'PNG',400,30);
					doc.setDrawColor(110, 26, 26);
					doc.line(20, top, 590, 80);
				}
				var addFooter = function(top,left,doc){
						var f = blocks.foot;
						var o = f.observation;
						var l = f.legend;
						/*
						doc.setLineWidth(1);
						doc.setDrawColor(110, 26, 26);
						doc.setFillColor(255,255,255);
						doc.circle(left+5, top, 5, 'FD');
						doc.setDrawColor(110, 26, 26);
						doc.line(left+10, top, 480, top);
						doc.setFontSize(11);doc.setTextColor(110, 26, 26);
						doc.text('Observaciones',left+20,top+20);
						
						doc.setFontSize(11);doc.setTextColor(87, 84, 85);
						var a = 37;
						for(var x in o){
							doc.text(o[x],left+20,top+a);
							a+=15;
						}
						doc.setDrawColor(110, 26, 26);
						doc.setFillColor(255,255,255);
						doc.circle(555, top+70, 5, 'FD');
						doc.setDrawColor(110, 26, 26);
						doc.line(70, top+70, 550, top+70);
						*/
						doc.setFontSize(7);doc.setTextColor(150, 151, 152);
						var a = 95;
						for(var x in l){
							doc.text(l[x],left,top+a);
							a+=10;
						}
				}
                var getValueForType = function(field,value){
                  var response = null;
                  var c = config.questionnaire.realState;
                  for(var x in c){
                        if (c[x].field==field) {
                              switch (c[x].type){
                                    case 'radio':
                                    case 'checkbox':
                                          for(var y in c[x].items){
                                                if (parseInt(value)==c[x].items[y].value) {
                                                      response = c[x].items[y].label;
                                                      break;
                                                }
                                          }
                                          break;
                                    default:
                                          response = value;
                              }
                            break;
                        }
                  }
                  return response;
                  
                }
                var getValue = function(e,data){
                  var response = '';
                  if (data[e.field]) {
                        var response = getValueForType(e.field,data[e.field]);
                        
                  }
                  return response;
                }
				var buildPdf = function(){
					var doc = new jsPDF('p','pt','letter');
					
					
					//header-------------------------------------------------------------------------------------------------
						var top = 80;
						addHeader(top,doc);
						doc.setFontSize(12);doc.setTextColor(87, 84, 85);
						doc.text('Oferta inmobiliaria',20,top+20);
						doc.setFontSize(10);doc.setTextColor(150, 151, 152);
						doc.text(data.titulo_oferta,20,top+35);
					
					
					//datos-----------------------------------
						left=365;
                        top=100;
						
                        var infoBlock = [
                                    {label:'Nombre: ',items:[{field:'nombre'}]},
                                    {label:'Teléfono: ',items:[{field:'telefono'}]},
                                    {label:'Correo eléctronico: ',items:[{field:'correo_electronico'}]},
                                    {label:'Calle: ',items:[{field:'calle_inmueble'}]},
                                    {label:'No. Exterior: ',items:[{field:'no_ext'}]},
                                    {label:'No. Interior: ',items:[{field:'no_int'}]},
                                    {label:'Colonia: ',items:[{text:'Colonia',field:'colonia'}]},
                                    {label:'Delegación: ',items:[{field:'delegacion'}]},
                                    {label:'Código Postal: ',items:[{field:'cp'}]},
                                    {label:'Tipo de inmueble: ',items:[{field:'tipo_inmueble'}]},
                                    {label:'Superficie: ',items:[{field:'superficie_metros2'}]},
                                    {label:'Modalidad de oferta: ',items:[{field:'modalidad_oferta'}]}//,
                                    //{label:'Servicios con los que cuenta',items:'servicios'},
                                    //{label:'Observaciones',items:'observaciones'}
                                    
                        ];
			
                        var increment=0;
						top+=30;
                        var backTop = 0;
                        for(var x in infoBlock){
							var i = infoBlock[x];
                            
                            var title = validator.convertToHtml(i.label);
                            
                            var value = '';
                            for(var y in i.items){
                                    var e = i.items[y];
                                    //value+=((e.text)?e.text:'')+data[e.field]+' ';
                                    value+=getValue(e,data);
                                   
                            }
                            backTop = top+0;
							top = addTable(top,left,[{variable:title+value}],doc,[{field:"variable",maxCharacter:55}]);
                            doc.setTextColor(87, 84, 85);
                            doc.text( title,left+5,backTop);
                            
                            
						}
                       
                     // servicios-----------------------------------------------
                                               
                        if (top<=360) {
                              top+=(7+increment);
                              var width = 245;
                              var sectionServices = 6;
                        }else{
                              if(top<=515){top=515}else{top+=(7+increment)}
                              left=30;
                              var width = 580;
                              var sectionServices = 3;
                        }
                  
                        /*
                        top=515;
                        left=30;
                        var width = 580;
                        var sectionServices = 3;
                        */
                        doc.setDrawColor(0);
						doc.setFillColor(242,243,244);
						doc.rect(left-10, top-15, width, 32, 'F'); 
						
						doc.setFontSize(10);doc.setTextColor(87, 84, 85);
						doc.text( validator.convertToHtml('Servicios con los que cuenta'),left+28,top+5);
                        
                        var actualServices = data.servicios.split(',');
                        var services = [
                                    {label:'Luz eléctrica',value:'1'},
                                    {label:'Gas natural',value:'2'},
                                    {label:'Seguridad / vigilancia: ',value:'3'},
                                    {label:'Aire acondicionado',value:'4'},
                                    {label:'Estacionamiento',value:'5'},
                                    {label:'Baños',value:'6'},
                                    {label:'Agua potable',value:'7'},
                                    {label:'Internet: ',value:'8'},
                                    {label:'Teléfono',value:'9'},
                                    {label:'Recepción',value:'10'},
                                    {label:'Ascenor',value:'11'},
                        ]
                        
                        var infoServices = getSections(services,sectionServices);
                                               
						top+=40;
                        var incrementLeft = 0;
						doc.setFontSize(9);
                        doc.setTextColor(150, 151, 152);
                        for(var x in infoServices){
                            var increment=0;
                            var section = infoServices[x];
                            for(var y in section){
                                    var e = section[y];
                                    var icon = (actualServices.indexOf(e.value)!=-1)?'ok':'not';
                                    doc.addImage(images[icon],'PNG',left+5+incrementLeft,top+increment-15);
                                    doc.text( e.label,left+20+incrementLeft,top+increment-7);
                                    increment+=18;
                            }
							incrementLeft+=140;
							
                        }
                        //footer-----------------------------------------------------
						addFooter(625,30,doc);
					
					//-----------------------------------------------------------
					
					$("#inmobiliaria_areaMap").mapping('exportMap','png',{event:function(img){
						
							//mapping area ---------------------
							var widthMap = parseFloat($("#inmobiliaria_areaMap").width());
							var heightMap = parseFloat($("#inmobiliaria_areaMap").height());
							var ancho = 325;
							var alto = Math.round(((1/widthMap)*ancho)*heightMap);
							doc.addImage(img, 'PNG',20,125,ancho,alto);
							
						
                          //observaciones----------------------------------------------
                              top+=(19+increment);
                              left=25;
                              var observations = (data.observaciones)?data.observaciones:'Sin observaciones';
                              top = addTable(top+5,left,[{variable:observations}],doc,[{field:"variable",maxCharacter:127}],'Observaciones');
                           
                          // Add images -----------------------------------------------
                              
                              top+=19;
                              
                              increment= 0;
                              if (pictures.length>0) {
                                  top = addTable(top,left,[{variable:''}],doc,[{field:"variable",maxCharacter:55}],'Fotos');
                                  top-=25;
                                  for(var x in pictures){
                                      var i = pictures[x];
                                      doc.addImage(images['i'+x], 'PNG',left+increment,top,90,90);
                                      increment+=110;
                                  }
                              }  
                              //----------------------------------
                            doc.save('reporte.pdf');
							obj.hideSpinnerExport();
					}});
					
				}
				
			}
          
      }//return
})
