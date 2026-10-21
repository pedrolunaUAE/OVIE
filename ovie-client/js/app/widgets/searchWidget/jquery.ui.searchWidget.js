$.widget( "custom.searchWidget", {
  // default options
  currentData:{text:'',cat:''},
  rows:null,
  options: {
	  enabled:true,
	  areaName:null,
	  translate:null,
	  asMenu:false,
	  inactiveText:'Ingrese texto para búsqueda',
	  response:{
		  height:null,
		  resultPath:'response.docs',
		  countPath:'response.numFound',
		  catPath:'facet_counts.facet_fields.tipo',
		  btnIcon:'mdi-content-add-circle',
		  btnTitle:'',
		  propertiesTranslate:{
				nombre:'label',
				tipo:'typeLabel',
				'coord_merc':'position.mercator',
				'locacion':'position.geographic',
				id:'id',
				geomtype:'geometry'
		  }  
	  },
	  onClear:function(){},
	  onResponse:function(data){},
	  onClickItem:function(data){},
	  events:function(trigger,value){
			  
	  }
  },
  results:null, //almacena los resultados de la busqueda
  // the constructor
  _create: function() {
	var obj = this;
	obj.element
	  // add a class for theming
	  .addClass( "custom-searchWidget")
	  // prevent double click to select text
	  .disableSelection();
	  
	obj.id = this.element.attr('id');
	obj.createUI();
	obj._refresh();
	
	if(!obj.options.enabled){
		obj.disable();	
	}
	
  },
  createUI:function(){
	var obj = this;
	var height = obj.options.response.height;
	
	var cadena = '';
        cadena+= '  	<div class="sa-search-container" style="height: 592px">';
        cadena+= '    		<div class="card-content">';
		cadena+= '    			<input id="sa_search_input_'+obj.id+'" class="sa-search-input" placeholder="'+obj.options.inactiveText+'">';
		cadena+= '				<i id="sa_search_btn_'+obj.id+'" class="material-icons sa-search-btn">search</i>';
		cadena+= '				<i id="sa_clearsearch_btn_'+obj.id+'" class="sa-clearsearch-btn small mdi-content-clear"></i>';
        cadena+= '    			<div  class="search-results"></div>';
        cadena+= '  		</div>';
		cadena+= '    		<div id="sa_results_'+obj.id+'" style="'+((height)?'height:'+height+'px;overflow-y:auto':'')+'" class="card-action contentSearch">';
		cadena+= '    		</div>';
		cadena+= '  		<div id="sa_detail_'+obj.id+'" class="sa-search-detail" style="display:none">'; 
		cadena+= '    		</div>';
		cadena+= '  	</div>';
		
		
	obj.element.html(cadena);
	obj.restrictCharacters();
	
	if(obj.options.asMenu){
		obj.element.addClass('search-asmenu');
	}else{
		obj.element.addClass('search-asbox');
		obj.element.find('.sa-search-container').css('height',(obj.options.response.height+60)+'px')
	}
	  
	$('#sa_clearsearch_btn_'+obj.id).click(function(){
		obj.clearResults();
		obj.options.onClear();
	});
	//ajuste para comportamiento
	if(obj.options.asMenu){
		this.element.css('height','80px');
	}
	
  },
  disable:function(){
	var obj = this;
	$('#sa_search_input_'+obj.id).attr('disabled','disabled');
  },
  search:function(text){
	 var obj = this;
	 if(obj.options.enabled){
		 if(text === undefined)
			text = $('#sa_search_input_'+obj.id).val();
		 
		 if(text && text != ''){
			var obj = this;
			var source	= $.extend({},true,obj.options.dataSource);
			if (obj.rows) {
                source.params.rows=obj.rows;
            }
			source.params.q = text;
			obj.currentData.text = text;
			
			obj.currentData.isCat = false;
			if(obj.currentData.cat != ''){
				source.params.fq = 'tipo:"'+obj.currentData.cat+'"';
				obj.currentData.isCat = true;
				obj.currentData.cat = '';
			}
			
			obj.getData(source,{},function(data){
				obj.proccessSearch(data);
				delete source.params.fq;
			})
		 }
	 }
  },
  proccessSearch:function(data){
		var obj = this;
		var properties = obj.options.response.propertiesTranslate;
		var resultsPos = obj.options.response.resultPath.split('.');
		var countPos = obj.options.response.countPath.split('.');
		
		var catPos = null;
		if(obj.options.response.catPath)
			catPos = obj.options.response.catPath.split('.');
	  
		if($.isFunction(obj.options.translateResponse)){
			data = 	obj.options.translateResponse(data);
		}
		
		var count = data;
		for(var x in countPos){
			count = count[countPos[x]];
		}
		
		var results = data;
		for(var x in resultsPos){
			results = results[resultsPos[x]];
		}
		var dataList = [];
		if(results){
			//extracting values
			if (obj.options.searchType=="areas") {
			  for(var r in results){
				  var row = results[r];
				  var result = {};
				  for(var p in properties){
					  var s_prop = p.split('.'); //propertie source
					  var t_name = properties[p].split('.'); //propertie target
					  var value = $.extend({},row);
					  for (var e in s_prop){
						  value = value[s_prop[e]];
					  }
					  if(value){ //si encontro el valor en la ruta
						  var t_result = result;
						  var pointer = null;
						  for (var e in t_name){
							  if(e == t_name.length-1){
								  t_result[t_name[e]] = value;	
							  }else{
								  if(!t_result[t_name[e]])
									  t_result[t_name[e]] = {};	
								  t_result = t_result[t_name[e]];
							  }
						  }
					  }
				  }
				  dataList.push(result);
			  }
			}else{
				 for(var y in results){
					dataList.push({activity:results[y].nombre_corto, cve:results[y].scian, id:results[y].id});
				 }
			 }  
		}
		//Extract categories
		  if (obj.options.searchType=="areas") {
          if(catPos){
				var cats = data;
				for(var x in catPos){
					cats = cats[catPos[x]];
				}
				var  listCats = null;
				if (cats){
					listCats = [];
					for(var x = 0;x < cats.length;x++){
						if(cats[x+1] > 0){
							var item = {label:cats[x],val:cats[x+1]};
							listCats.push(item);
						}
						x++;
					}
				}
			}
		  }
			
		//------------------------------------
		obj.printResult(dataList);
		if(catPos && !obj.currentData.isCat)
			obj.printDetail(listCats);
		obj.results =  dataList;
		obj.options.onResponse(dataList);
  },
  clearResults:function(){
		var obj =this;
		this.element.removeClass('showing-results');  
		$('#sa_results_'+obj.id).html('');
		$('#sa_search_input_'+obj.id).val('').focus(); 
		$('#sa_detail_'+obj.id).html('').css('display','none');
		//quitar la actividad consultada y limpiar el mapa de chinchetas 
		$('.vocEco-actConsul-mainWrap').css('display', 'none');
		
  },
  printDetail:function(detail){
	    var obj = this;
		var element = $('#sa_detail_'+obj.id);
			element.css('display','none');
		var cadena = '';
		for(var x in detail){
			var item = detail[x];
			cadena+= '<div class="chip cat-searh-item" idref="'+item.label+'">'+item.label+' (<b>'+item.val+'</b>)</div>';
		}
		element.html(cadena);
		
		$('.cat-searh-item').each(function(index, element) {
            $(this).click(function(){
				var val = $(this).attr('idref');
				obj.currentData.cat = val;
				obj.rows = parseInt($(this).children('b').html())
				obj.search();
			});
        });
		
		var newHeight = obj.options.response.height-($('#sa_detail_'+obj.id).height()+28);
		//console.log(newHeight);
		$('#sa_results_'+obj.id).css('height',newHeight+'px');
		element.show();
  },
  printResult:function(results){
		var obj = this;
		var response = obj.options.response;
		if(results){
		   var cadena = '';
		   cadena+= '<ul class="collection">';
				for(var x in results){
					var item = results[x];
					var newLabel=(obj.options.searchType=="actividad")?item:obj.formatLabel(item.label);
					cadena+= '<li class="collection-item avatar itemSearch" idpos="'+x+'" idref="'+item.id+'" idval="">';
					cadena+= '	<img src="img/icons/'+item.geometry+'.jpg" alt="" class="circle">';
					cadena+= '	<p>'+newLabel.name+' <br/>'+newLabel.label+' <br/> '+item.typeLabel+'</p>';
					cadena+= '	<a idpos="'+x+'" idref="'+item.id+'" title="'+response.btnTitle+'" idval="'+response.btnIcon+'" href="#!" class="secondary-content sa-btn-item"><i class="small '+response.btnIcon+'"></i></a>';
					cadena+= '</li>';
				}
				cadena+= '</ul>';
			
			var chain='';
			var chain='<ul class="collection">';
			    for(var x in results){
					var item = results[x];
					chain+= '<li id="'+item.id+'"class="collection-item avatar" idpos="'+x+'" idref="'+item.id+'" idval="" style="padding-left: 20px !important;">';
					chain+=	 '	<p class="activity-label" activity="'+item.activity+'">'+item.activity+'</p>';
					chain+=  '  <p class="activity-clave" cve='+item.cve+'><span class="cve-title" style="color: #3e3f41;font-weight: 400;">Clave scian: </span>'+item.cve+'</p>';
				}
				chain+= '</ul>';
				
			this.element.addClass('showing-results');
			
			if (obj.options.searchType=="actividad") {
               cadena=chain;
            }
			$('#sa_results_'+obj.id).html(cadena);
			
			if (obj.options.searchType=="areas") {
               $('#sa_results_'+obj.id+' .collection-item').click(function(e){
				  var idref = $(this).attr('idref');
				  var idval = $(this).attr('idval');
				  var item = obj.results[parseInt($(this).attr('idpos'))];
				  obj.options.events('item',item);
				  obj.options.onClickItem(item);
				  e.stopPropagation();
				});
			
				$('#sa_results_'+obj.id+' .sa-btn-item').click(function(e){
				  var idref = $(this).attr('idref');
				  var idval = $(this).attr('idval');
				  var item = obj.results[parseInt($(this).attr('idpos'))];
				  obj.areaName=item.label;
				  obj.options.events(idval,item);
				  e.stopPropagation();
				}); 
            }else{
				$('#sa_results_'+obj.id+' .collection-item').click(function(e){
				  $(this).addClass('active');
				  var actRow=$(this).attr("idref");
				  var actTxt=$('#'+actRow+' .activity-label').text();
				  var cveScian=$('#'+actRow+' .activity-clave').attr('cve');
				  obj.options.onClickItem(actRow,actTxt,cveScian);
				});
			}
		}
  },
  
//  getAreaName:function(){
//  	var obj=this;
//	var getAreaName=obj.areaName;
//	return getAreaName;
//  },
  formatLabel:function(label){
	  var obj=this;
	  var result=label.split(',');
	  var newLabel={name:result[result.length-1]};
	  var nuevo=result.pop();
	  result=result.join();
	  newLabel.label=result;
	  return(newLabel);
  },
  getData:function(source,params,callback,error,before,complete){
			var obj = this;
			//Anexo de parametros que vengan definidos desde fuente de datos
			var s_params = source.params;
            var stringify = source.stringify;
			
			if (!(s_params === undefined)){
            	for (var x in s_params){ //anexo de la conifuracion del origen de datos
                	params[x] = s_params[x];
            	};
            }
			if (!(stringify === undefined) && stringify){
				params = JSON.stringify(params);
			}
			//Estructura basica de peticion
            var dataObject = {
                   data: params,
                   success:function(json,estatus){callback(json,estatus);},
                   beforeSend: function(solicitudAJAX) {
					    //$('#'+obj.id+'_spinner').addClass('ajax-loader');
                        if ($.isFunction(before)){
                            before(params);
                        };
                   },
                   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
                        if ($.isFunction(error)){
                            error(errorDescripcion,errorExcepcion);
                        };
                   },
                   complete: function(solicitudAJAX,estatus) {
					    //$('#'+obj.id+'_spinner').removeClass('ajax-loader');
                        if ($.isFunction(complete)){
                            complete(solicitudAJAX,estatus);
                        };
                   }
            };
            //anexo de la conifuracion del origen de datos
            for (var x in source){ 
                if ( !(/field|name|id|params|stringify/.test(x)))dataObject[x] = source[x];
            };
            jQuery.support.cors = true;
            $.ajax(dataObject);
    },
	restrictCharacters:function() {
		 var obj = this;
		 var id = 'sa_search_input_'+obj.id;
		 $('#'+id).bind("keypress", function(evt){
			var otherresult = 12;
			if(window.event != undefined){
                otherresult = window.event.keyCode;
			};
			var charCode = (evt.which) ? evt.which : otherresult;  
			if(charCode == 13 || charCode == 12){
				if (charCode==13)
				if (charCode ==12 && evt.keyCode == 27){  //atrapa esc y limpia
                    //setTimeout(function(){$('#'+id).val('');},100);
					obj.clearResults();
				};
			}else{
                var keyChar = String.fromCharCode(charCode);
                var keyChar2 = keyChar.toLowerCase();
                var re = /[\u0020\u0027\u00B0\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9\-\,\.]/;
				//var re = /[\u00E0-\u00E6\u00E8-\u00EB\u00EC-\u00EF\u00F2-\u00F6\u00F9-\u00FC\u0061-\u007a\u00f10-9\-\,\.]/;
                var result = re.test(keyChar2);
                result = (charCode == 8)?true:result;
                return result; 
			};
		}).keyup(function(e){
                //if ($.isFunction(callback))callback($('#'+id).val());
                if (e.which == 13){
					obj.rows=null;
					obj.search();
				}
				if (e.which == 27){
					obj.clearResults();
					//setTimeout(function(){$('#'+id).val('');},100);
				}
        });
		 
		 $('#sa_search_btn_'+obj.id).click(function(){
			obj.rows=null;
			obj.search();
		  });
	},
  //-------------------------------------------------------------------------------------------------------------------------------------------------------------
  // called when created, and later when changing options
  _refresh: function() {
	// trigger a callback/event
  },

  // events bound via _on are removed automatically
  // revert other modifications here
  _destroy: function() {
	this.element
	  .removeClass( "custom-searchWidget" )
	  .enableSelection();
  },

  // _setOptions is called with a hash of all options that are changing
  // always refresh when changing options
  _setOptions: function() {
	// _super and _superApply handle keeping the right this-context
	this._superApply( arguments );
	this._refresh();
  },

  // _setOption is called for each individual option that is changing
  _setOption: function( key, value ) {
	// prevent invalid color values
	this._super( key, value );
  }
});