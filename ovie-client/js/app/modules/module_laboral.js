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
                    if (obj.lab_consultar) {
                        $("#laboral_areaMap").mapping('update');
                    }else{
                        $("#lab_questionnaireMap_container").mapping('update');
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
                lab_consultar:true,
                existeMapa2:false,
                dataExport:{},
                //
                
                init:function(main){
                    var obj = this;
                    obj.main = main;
                    obj.getData = getData.getData;
                     
                    var localUrl = require.toUrl("code");
                        localUrl = localUrl.split('?')[0];
            
                    $.when(
                        $('<link>', {rel: 'stylesheet',type: 'text/css',href: localUrl+'/modules/module_laboral.css?v=2'}).appendTo('head'),
                        $.Deferred(function( deferred ){
                            $( deferred.resolve );
                        })
                    ).done(function(){
                        obj.createUI();
                    });
                    
                    obj.eventScroll();
                   
                    var logeo=config.login.status;
                    if (logeo==true) {
                       $("#lab_itemLogin").css("color", "#4CAF50");
                    }else{
                       $("#lab_itemLogin").css("color", "#d22726"); 
                    }
                },
                
                _refresh:function(){
                    var obj = this;
                    $("#laboral_areaMap").mapping({features:[]});
                    $("#laboral-geoArea_list").areas({data:obj.main.localData.geoList});
                    var logeo=config.login.status;
                    if (logeo==true) {
                       $("#lab_itemLogin").css("color", "#4CAF50");
                    }else{
                       //$("#lab_itemLogin").css("color", "#d22726");
                       obj.desloguear();
                    }
                    obj.updateMapping();
                },
                
                displayFeatures:function(features){
                    var map = $("#laboral_areaMap");
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
                    var cadena = '<input id="radiovalueLaboral" placeholder="Ingrese el valor" type="number" />'
                    var btnAccept = function(){
                        var val = parseInt($('#radiovalueLaboral').val()|0);
                        $("#laboral_areaMap").mapping('addBufferToGeometry',item.id,val,item.tabla,item.label);
                        $("#laboral-tabArea").customTab('activate','laboral-geoArea_list');
                    }
                    if (item.geometry=='polygon') {
                        btnAccept();
                    }else{
                        obj.main.openModal('Indique el &aacute;rea de influencia alrededor del elemento seleccionado',cadena,function(){
                            btnAccept();
                        });
                        $('#radiovalueLaboral').focus();
                        $('#radiovalueLaboral').keyup(function(e){
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
				$("#laboral_areaMap").mapping('goCoords',item.wkt);
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
				$("#laboral_results").html("");//para limpiar el área de resultados 
			},
            
            displayAreas:function(){
				var obj = this;
				$('#laboral-geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						$("#laboral_areaMap").mapping('removeFeatureByDB',item.db);
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
                  $("#laboral_filtros input:checked").each(function() {
                        var val = $(this).val();
                        if (val!='all') {
                            selected.push(val);
                        }
                  });
                  var map = $("#laboral_areaMap");
                  map.mapping('setParamsToLayer',{layer:'Vectorial',forceRefresh:true,params:{layers:selected.join(',')}});
            },
            
            //
             displayRecordCard:function(data,point){
                  var obj = this;
                  var map = $("#laboral_areaMap");
                  var title = 'Identificaci&oacute;n';
                  var chain = '';
                  var chain2= '';
                  var mainContent=config.laboral.ficha.mainContent;
                  var secondaryContent=config.laboral.ficha.secondaryContent;
                  
                  if (data.length>0) {
                        title='';
                        
                        for(var x in mainContent){
                              var i = mainContent[x];
                              var value=data[0][i.field];
                              if((data[0][i.field])&&(obj.getField(i.field,data[0]))){
                                    if ((i.field=="modalidad")||(i.field=="sueldo")) {
                                        for (var y in i.items){
                                           var item=i.items[y];
                                           var val=item.value;
                                           if (value==item.value) {
                                               value=item.label;
                                           }
                                           
                                        }
                                    }
                                    chain+= '<tr class="labPopup_Row"><td style="padding:5px; width:50%">'+i.label+':</td><td style="padding:5px; color:#6E1A1A">'+value+'</td></tr>';
                              }
                        }
                        
                         chain+='<tr id="verMasRow"><td></td><td id="verMas"><div class="ovieSprite ovieSprite-menu-plusS" style="float:left"></div><div id="labTxt_verMas">ver más</div></td></tr>';

                         for(var x in secondaryContent){
                              var i = secondaryContent[x];
                              var value=data[0][i.field];
                              if(obj.getField(i.field,data[0])){
                                    if (i.field=="categoria") {
                                        for(var y in i.items){
                                            var item=i.items[y];
                                            var val=item.value;
                                            if (value==item.value) {
                                                value=item.label;
                                            }
                                        }
                                    }
                                    chain2+= '<tr class="labPopup_Row"><td style="padding:5px; width:50%">'+i.label+':</td><td style="padding:5px; color:#6E1A1A">'+value+'</td></tr>';
                              }
                              
                         }
                        
                         chain2+= '<tr id="verMenosRow"><td></td><td id="verMenos"><div class="ovieSprite ovieSprite-menu-restS" style="float:left"></div><div id="labTxt_verMas">ver menos</div></td></tr>';
                         
                        
                         chain='<div id="labPopup_container"><table id="primario">'+chain+'</table><table id="secundario" style="display:none">'+chain2+'</table></div>';
                        
                  }
                  var evento=function(){
                        //$("#"+obj._id+" .spinnerExport").hide();
                        //$("#verMas").click(function(){
                        
                          $("#laboral_areaMap_popup #verMas").click(function(){   
                             $("#laboral_areaMap_popup #secundario").show();
                             $("#laboral_areaMap_popup #verMasRow").hide();
                         });
                         $("#laboral_areaMap_popup #verMenos").click(function(){
                             $("#laboral_areaMap_popup #secundario").hide();
                             $("#laboral_areaMap_popup #verMasRow").show();
                        
                         });
                  }

                  map.mapping('addMarker',{lon:point.lon,lat:point.lat,type:'identify',zoom:false,showPopup:true,params:{nom:title,desc:{custom:chain},img:'identify', event:evento}});
            
            },
            getField:function(field,data){
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
				var c = config.laboral.identify;
				var r= {
					success:function(json,estatus){
						var error=false;
						if (json){
                              
                            if(json.response.success){
                                    obj.displayRecordCard(json.data.id_lab,e);
                                    obj.dataExport=json.data.id_lab;
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
            //
            
            createUI:function(){
                var obj=this;
                obj._id="laboral-container";
                  var chain='<div id="'+obj._id+'" class="width-content">'+
                              '<div class="row">'+
                                  '<div class="col s12 tabSection">'+
                                          '<div class="row" style="margin-bottom:0px">'+   
                                                '<div class="col s6 m6 l6"><div id="itemTab1" step="1" module="lab_consultar" class="itemTab  active">Consultar</div></div>'+
                                                '<div class="col s6 m6 l6">'+
                                                        '<div id="lab_itemLogin" step="4"><i id="lab_logOut" class="small material-icons tooltipped" data-position="bottom" data-tooltip="cerrar sesión">perm_identity</i></div>'+//logearse y deslogearse
                                                        '<div id="itemTab3" step="3" module="lab_modificar" class="itemTab" style="float:right; display:none">Modificar oferta</div>'+
                                                        '<div id="itemTab2" step="2" module="lab_registrar" class="itemTab" style="float:right; margin-right:20px">Agregar nueva oferta</div>'+
                                                '</div>'+
                                          '</div>'+     
                                  '</div>'+
                              '</div>'+
                              '<div class="row moduleSection">'+
                                      '<div class="col s12 module show" id="lab_consultar_Container" >'+
                                            '<div class="row">'+
                                                  '<div class="col s12 m5" style="margin-top:-7px">'+
                                                        '<div id="laboral-tabArea"></div>'+
                                                  '</div>'+
                                                  '<div class="col s12 m7">'+
                                                        '<div id="laboral_areaMap" class="laboral-areaMap"></div>'+
                                                  '</div>'+
                                            '</div>'+
                                                  '<div class="col s12">'+
                                                      '<div id="demoQuestionnaire"></div>'+
                                                  '</div>'+
                                      '</div>'+
                                      '<div class="col s12 module" id="lab_registrar_Container">'+
                                            '<div id="lab_modifyList_container" style="display:none">'+
                                                  '<ul class="collection" id="lab_modifyList">'+
                                                  '</ul>'+
                                            '</div>'+
                                            '<div class="lab-registro-wrap">'+
                                                  '<div id="lab_questionnaireMap_container" style="height:350px"></div>'+
                                                  '<div id="lab_questionnaire_container" style="margin-top:25px"></div>'+
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
                $('#container_mnu_laboral').html(chain);
                //$("#laboral-tabArea").customTab({sections:[{label:'Buscar en el mapa',id:'laboralSearchArea',overflow:false},{label:'&Aacute;reas de selecci&oacute;n',id:'laboral-geoArea_list',overflow:true}],height:610});
                $("#laboral-tabArea").customTab({sections:[{label:'Buscar en el mapa',id:'laboralSearchArea',overflow:false},{label:'Aplicar filtro',id:'laboral_filtros',overflow:true}],height:610});
                $("#submenu_lab").customTab({sections:[{label:'consultar',id:'laboralSearchArea',overflow:false},{label:'registrar',id:'lab_registrar',overflow:true},{label:'modificar',id:'lab_modificar', overflow:true}],height:610});
                
                $('#laboralSearchArea').searchWidget({
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
						$("#laboral_areaMap").mapping('goCoords',data.wkt);
					},  
					events:function(trigger,value){
						switch(trigger){
							case 'mdi-content-add-circle':
								obj.addAreaMap(value);
							break;
						}
					}	
				});
                
               $("#laboral_areaMap").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:$.extend({}, config.mapping),controls:{addFeatures:false},features:[],                              
														onAddFeature:function(data){
															obj.onAreaAdded(data);
														},
														identify:function(point){
                                                                $("#laboral_areaMap").mapping('actionMarker',{action:'delete',items:'all',type:'identify'});
                                                                var resolution = $("#laboral_areaMap").mapping('getResolution');
																obj.requestRecordCard(point,resolution);
                                                        }
													});
                $('#laboral-geoArea_list').areas({
					xclose:true,
					data:obj.main.localData.geoList,
					eventClickItem:function(item){
						obj.onAreaSel(item);
					},
					eventCloseItem:function(item){
						
						$("#laboral_areaMap").mapping('removeFeature',item.id);
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
                  var containers='<div id="category"></div>'+
                                 '<div id="salary" style="display:none"></div>'
                                 //'<div id="category" style="height:250px; overflow:auto"></div>'+
                                 //'<div id="salary" style="height:250px; overflow:auto"></div>'
                  $("#laboral_filtros").html(containers);
                  
                  var categoria='<div class="barTitle"><p class="labFilterTitle">Perfil académico</p></div>'+
                                '<form><ul class="collection">';
                  var categoryFilter=config.laboral.filter.perfil;
                  
                  for (var x in categoryFilter){
                        //filterLabel=catFilter[x].label
                        var i=categoryFilter[x];
                        var idItem = obj._id+'_perfil'+x;
                        categoria+='<li class="collection-item filter-Row">'+
                                    '<input type="checkbox" name="'+obj._id+'_perfil" id="'+idItem+'" value="'+i.value+'"/>'+
                                    '<label for="'+idItem+'">'+i.label+'</label>'+
                                '</li>';
                  }
                  
                  '</ul></form>';
                  
                  $("#category").html(categoria);
                  
                  var salario='<div class="barTitle"><p class="labFilterTitle">Salario</p></div>'+
                                '<form><ul class="collection">';
                  var salaryFilter=config.laboral.filter.salario;
                  
                  for (var x in salaryFilter){
                        //filterLabel=salfilter[x].label
                        var i=salaryFilter[x];
                        var idItem = obj._id+'_salary'+x;
                        salario+='<li class="collection-item filter-Row">'+
                                    '<input type="checkbox" name="'+obj._id+'_salary" id="'+idItem+'" value="'+i.value+'"/>'+
                                    '<label for="'+idItem+'">'+i.label+'</label>'+
                                 '</li>';
                  }
                  '</ul></form>';
                  
                  $("#salary").html(salario);
                  
                  $("#laboral_filtros #category :input").each(function(){
                        $(this).click(function(){
                              var val = $(this).val();
                              var status = $(this).is(':checked');
                              if (val=='all') {
                                    $("#laboral_filtros #category :input").prop('checked', status);
                              }else{
                                    if (!status) {
                                        $("#laboral_filtros #category input[value='all']").prop('checked', status);
                                    }
                              }
                              obj.runClockUpdateMap();
                        });
                  });
                  
                  $("#laboral_filtros #salary :input").each(function(){
                        $(this).click(function(){
                              var val = $(this).val();
                              var status = $(this).is(':checked');
                              if (val=='all') {
                                    $("#laboral_filtros #salary :input").prop('checked', status);
                              }else{
                                    if (!status) {
                                        $("#laboral_filtros #salary input[value='all']").prop('checked', status);
                                    }
                              }
                              obj.runClockUpdateMap();
                        });
                  });
                  
                  //*****************************************Inicializar Tooltip y click de logOut********************************************//
                  $('.tooltipped').tooltip({delay: 50});
                  $("#lab_logOut").click(function(){
                        obj.requestlogOut();
                  });
                  
                  $('select').material_select();
                  obj.eventScroll();
                  
                  $("#laboral-container .exportBtn").click(function(){
					obj.report(obj.dataExport[0]);
                  });
            },
            
            showStep:function(opc, module){
                  var obj=this;
                  if (opc==3) {
                    module="lab_registrar";
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
               //Si es click a consultar ocultar modificar oferta
               if (opc==1) {
                  obj.lab_consultar=true;
                  $("#"+obj._id+" #itemTab"+3).css("display", "none");
                  $("#lab_registrar_Container").css("display", "none");
                  $("#lab_consultar_Container").css("display", "block");
                 
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
                  
                  //obj.buildTable(params);
               }
               //si es click a registrar mostrar tab de modificar ofertas
               if(opc==2){
                  obj.lab_consultar=false;
                  $("#"+obj._id+" #itemTab"+3).css("display", "block");
                  $("#lab_consultar_Container").css("display", "none");
                  $("#lab_registrar_Container").css("display", "block");
                  $("#lab_modifyList_container").css("display", "none");
                  $(".lab-registro-wrap").css("display", "block");
                  
                  //widget ficha de informacion COLOCADO AQUÍ DE MANERA TEMPORAL                    
                  /*$('#lab_registrar_Container').ficha({
                        params:{    
                                tipo:{title:"Tipo de oferta", value:"Oficina", dataType:"string"},
                                superficie:{title:"Superficie", value:60.5, dataType:"superficie"},
                                uso:{title:"Uso permitido", value: "C4/20", dataType:"string"},
                                oferta:{title:"Oferta", value:10500, dataType:"dinero"},
                                tel:{title:"Teléfono", value:4491252381, dataType:"telefono"}
                               }
                  });*/
                  
                  var buildQuestionnaire=function(){
                        $("#"+obj._id+" #itemTab"+3).css("display", "block");
                        $(".lab-registro-wrap").css("display", "block");
                        $("#lab_modifyList_container").css("display", "none");
                        
                        
                        var token=$('#login').login('getToken');
                        
                        //widget cuestionario
                        $('#lab_questionnaire_container').questionnaire({
                                                                              token:token,
                                                                              fields:config.questionnaire.labor,
                                                                              validator:validator,
                                                                              dataSource:config.dataSource.questionnaire.labor,
                                                                              data:null
                                                                        });
                  }
                  
                  var loginUser=function(){
                       $("#lab_itemLogin").css("color", "#4CAF50"); //color verde
                  }
                  
                  var loginStatus=function(status){
                      config.login.status=status;
                  }
                  
                  var cancelTabs=function(){
                        obj.showStep(1,"consultar");
                        obj.stepsEvents(1,"consultar");
                  }
              
                  $('#login').login({config:config, eventos:{buildQuestionnaire:buildQuestionnaire, loginUser:loginUser, loginStatus:loginStatus, cancelTabs:cancelTabs}, validator:validator, tipo:"lab"});
                 
                  
                  //obtener el punto del mapa
                  var eventoIdentify = function(e){
						   obj.punto = 'POINT('+e.lon+' '+e.lat+')';
                           $('#lab_questionnaire_container').questionnaire('setPoint',obj.punto);
				  };
                  
                  if (!obj.existeMapa2) {
                       obj.existeMapa2=true;
                  }
                  
                  //mapa área de cuestionario
                  $("#lab_questionnaireMap_container").mapping({proxy:config.proxyImage,geometry:config.geometry,layers:$.extend({}, config.mapping),controls:{addFeatures:false},features:obj.main.localData.geoList,
														onAddFeature:function(data){
															obj.onAreaAdded(data);
														},identify:eventoIdentify});
														
				  //widget cuestionario
                  /*$('#lab_registrar_Container').questionnaire({
                                                            fields:config.questionnaire.labor,
                                                            validator:validator,
                                                            dataSource:config.dataSource.questionnaire.labor
                                                      });*/
                  obj.clearMarks();
              }
              
              if (opc==3) {
                 obj.lab_consultar=false; 
                 $("#lab_consultar_Container").css("display", "none");
                 $("#lab_registrar_Container").css("display", "block");
                 $(".lab-registro-wrap").css("display", "none");
                 $("#lab_modifyList_container").css("display", "block");
                 /* $("#inm_registrar_Container").css("max-height","590px");
                 $("#inm_registrar_Container").css("overflow", "auto");*/
                 obj.requestModify();
                 
                 
                 
                 
              }
              //obj.updateMapping();
            },
            
            clearMarks:function(){
                var obj=this;
                //limpiar del mapa del cuestionario la chincheta
                $("#lab_questionnaireMap_container").mapping('actionMarker',{action:'delete',items:'all',type:'identify'});
            },
            
            showMarker:function(){
                   var obj = this;
                  if (obj.punto) {
                        var map = $("#lab_questionnaireMap_container");
                        map.mapping('actionMarker',{action:'delete',items:'all',type:'identify'});
                        var section = obj.punto.replace('POINT(','');
                        section = section.replace(')','');
                        section = section.split(' ');
                        var lon = parseInt(section[0]);
                        var lat = parseInt(section[1]);
                        map.mapping('addMarker',{lon:lon,lat:lat,type:'identify',zoom:false,params:{nom:'identificacion',desc:'',img:'identify'}});
                  }
            }, 
            
            eventScroll:function(){
				var obj = this;
				$("#main").scroll(function() {
					clearTimeout($.data(this, 'scrollTimerLab'));
					$.data(this, 'scrollTimerLab', setTimeout(function() {
						obj.updateMapping();
                        //obj.runClock();
                    }, 250));
				});
			},
            
            requestModify:function(){
                var obj = this;
				var msg = 'Servicio no disponible intente m&aacute;s tarde';
				var c = config.laboral.modifyList;
				//var tab = $("#tabVocEcoAct");
				var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success){
								valid=true;
                                obj.buildModifyList(json.data.id_lab);
									
							}else{
                                  msg=json.response.message;
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
                var c = config.laboral.modifyItem;
                var token=$('#login').login('getToken');
				
				var r= {
					success:function(json,estatus){
						var error=false;
						if (json){
                             $('#lab_modifyList_container').css("display","none");
                             $('.lab-registro-wrap').css("display","block");
                             $('#lab_questionnaire_container').questionnaire({
                                    token:token,
                                    fields:config.questionnaire.realState,
                                    validator:validator,
                                    dataSource:config.dataSource.questionnaire.realState,
                                    data:json[0],
                                    point:json[0].geometry
                              });
                              obj.punto = json[0].geometry;
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
				r.url=r.url+'id_lab='+id;
				$.ajax(r);
            },
            
             //Función que se manda llamar cuando el servicio devuelve que el token ha expirado
            tokenExpired:function(){
               var obj=this;
               var deslogueo=$('#login').login('resetToken');
               var loginUser=function(){
                        $("#lab_itemLogin").css("color", "#4CAF50");
                      /*$("#itemLogin").css("display", "block");*/
               }
                  
                  var buildQuestionnaire=function(){
                        $("#"+obj._id+" #itemTab"+3).css("display", "block");
                        //$(".inm-registro-wrap").css("display", "block");
                        //$("#inm_modifyList_container").css("display", "none");
                       
                        //var token=$('#login').login('getToken');
                        
                       //widget cuestionario
                        $('#lab_questionnaire_container').questionnaire({
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
                  
                  $('#login').login({config:config, eventos:{buildQuestionnaire:buildQuestionnaire, loginUser:loginUser, loginStatus:loginStatus, cancelTabs:cancelTabs}, validator:validator, tipo:"lab"});
               
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
                                /*$("#lab_itemLogin").css("color", "#d22626");
                                obj.showStep (1,"lab_consultar");
                                obj.stepsEvents(1,"lab_consultar");
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
                       cadena+='<li class="collection-item lab-collection-item" id="lab_item'+i.id_lab+'" idItem='+i.id_lab+' style="cursor:pointer">'+i.titulo_oferta+'</li>';
                  }
                                   
                  $("#lab_modifyList").html(cadena);
                  $(".lab-collection-item").click(function(){
                        var id=$(this).attr('idItem');
                        obj.requestIdModify(id);
                        obj.clearMarks();
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
                         
                  //$("#lab_consultar_Container").append(chain);
                  
                  for  (var x in params)
                  {
                      tableValue+='<tr class="cellValue"><tr>';   
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
                   $("#lab_itemLogin").css("color", "#d22626");
                   obj.showStep (1,"lab_consultar");
                   obj.stepsEvents(1,"lab_consultar");
                   var deslogueo=$('#login').login('resetToken');
                   config.login.status=false;
            },
            
            sendFilter:function(){
                  var obj=this;
            },
            
            report:function(data){
                console.log(data);  
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
					var itemMap=$("#laboral_areaMap");
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
					doc.setDrawColor(226, 0 ,122);
					doc.line(20, top, 590, 80);
				}
				var addFooter = function(top,left,doc){
						var f = blocks.foot;
						var o = f.observation;
						var l = f.legend;
						doc.setFontSize(7);doc.setTextColor(150, 151, 152);
						var a = 95;
						for(var x in l){
							doc.text(l[x],left,top+a);
							a+=10;
						}
				}
                var getValueForType = function(field,value){
                  var response = null;
                  var c = config.questionnaire.labor;
                  for(var x in c){
                        if (c[x].field==field) {
                              switch (c[x].type){
                                    case 'radio':
                                    case 'checkbox':
                                    case 'select':
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
						doc.text('Oferta laboral',20,top+20);
						doc.setFontSize(10);doc.setTextColor(150, 151, 152);
                        var tituloLaboral = (data.titulo_oferta)?data.titulo_oferta:'Sin titulo';
						doc.text(tituloLaboral,20,top+35);
					
					
					//datos-----------------------------------
						left=365;
                        top=100;
                        
                        var infoBlock = [
                                    {label:'Nombre: ',items:[{field:'nombre_contacto'}]},
                                    {label:'Teléfono: ',items:[{field:'telefono'}]},
                                    {label:'Correo eléctronico: ',items:[{field:'correo_electronico'}]},
                                    {label:'Calle: ',items:[{field:'calle_vacante'}]},
                                    {label:'No. Exterior: ',items:[{field:'no_ext'}]},
                                    {label:'No. Interior: ',items:[{field:'no_int'}]},
                                    {label:'Colonia: ',items:[{text:'Colonia',field:'colonia'}]},
                                    {label:'Delegación: ',items:[{field:'delegacion'}]},
                                    {label:'Código Postal: ',items:[{field:'cp'}]},
                                    {label:'Categoria: ',items:[{field:'categoria'}]},
                                    {label:'Tiempo de contratación: ',items:[{field:'tiempo_contratacion'}]},
                                    {label:'Modalidad de oferta: ',items:[{field:'modalidad'}]},
                                    {label:'Vacante: ',items:[{field:'vacante'}]}
                                    
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
                            if ((value!='null')&&(value!='')) {
                                    backTop = top+0;
                                    top = addTable(top,left,[{variable:title+value}],doc,[{field:"variable",maxCharacter:55}]);
                                    doc.setTextColor(87, 84, 85);
                                    doc.text( title,left+5,backTop);
                            }
                            
                            
						}
                  //footer--------------------------------------------------------------------
						addFooter(625,30,doc);
					     
                  // descripcion de actividades-----------------------------------------------
                     
                        left = 25;                       
                        
                        if(top<=515){
                              top=515
                        }else{
                              top+=(7+increment)
                        }
                        
                        if (data.description_actividades) {
                              var descriptions = (data.description_actividades)?data.description_actividades:'Sin Información';
                              top = addTable(top+5,left,[{variable:descriptions}],doc,[{field:"variable",maxCharacter:127}],'Descripción de actividades');
                        }
                  
				  //-----------------------------------------------------------
					
					$("#laboral_areaMap").mapping('exportMap','png',{event:function(img){
						
							//mapping area ---------------------
							var widthMap = parseFloat($("#laboral_areaMap").width());
							var heightMap = parseFloat($("#laboral_areaMap").height());
							var ancho = 325;
							var alto = Math.round(((1/widthMap)*ancho)*heightMap);
							doc.addImage(img, 'PNG',20,125,ancho,alto);
                            
                            // Perfil----------------------------------------------
                              if (data.perfil_postulante) {
                                    var profile = (data.perfil_postulante)?data.perfil_postulante:'Sin Información';
                                    top = addTable(top+5,left,[{variable:profile}],doc,[{field:"variable",maxCharacter:127}],'Perfil esperado del postulante');
                              }
                              
                           // Requisitos-----------------------------------------------
                              if (data.requisitos_entrega) {
                                    var requirements = (data.requisitos_entrega)?data.requisitos_entrega:'Sin Información';
                                    top = addTable(top+5,left,[{variable:requirements}],doc,[{field:"variable",maxCharacter:127}],'Requisitos para la entrevista');
                              }
                           // contacto -----------------------------------------------
                              if (data.contact) {
                                    var contact = (data.contact)?data.contact:'Sin Información';
                                    top = addTable(top+5,left,[{variable:contact}],doc,[{field:"variable",maxCharacter:127}],'Contacto');
                              }
                              
                  
                            doc.save('reporte.pdf');
							obj.hideSpinnerExport();
					}});
					
				}
				
			}

            
            }//return
            })
