$.widget("custom.questionnaire", {
	
    options: {
        fields:[],
		data:[],
		dataSource:null,
		events:{
			onSave:function(){}
		},
		validator:null
	},

  	_init: function() {
	},
	counterSpinner:0,
	buildStructure: function() {
		var obj=this;
		obj.id=this.element.attr('id');
		var id = obj.id;
		var chain ='<div class="questionnaire row">'+this.getItems()+
						'<div class="blocker"></div>'+
						'<div class="spinner">'+
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
										 '<div class="label">Procesando...</div>'+
						'</div>'+
					'</div>';
		$("#"+id).html(chain);
	},
	getText:function(item,params){
		return 	'<input field="'+item.field+'" id="'+params.id+'" '+params.required+' type="'+item.type+'" class="validate" format="'+item.format+'">'+
				'<label class="labelInput" for="'+params.id+'">'+item.label+params.textRequired+'</label>';
	},
	getTextarea:function(item,params){
		return 	'<textarea field="'+item.field+'" id="'+params.id+'" '+params.required+'  class="materialize-textarea"></textarea>'+
          		'<label class="labelInput" for="'+params.id+'">'+item.label+params.textRequired+'</label>';
	},
	
	getSelect:function(item,params){
		var chain = '<select id="'+params.id+'" field="'+item.field+'" >'+
						'<option value="-1" disabled selected>Seleccione una opci&oacute;n</option>';
		for(var x in item.items){
			var i = item.items[x];
			chain+='<option field="'+item.field+'" value="'+i.value+'">'+i.label+'</option>';
		}
		chain+=	'</select>'+
				'<label class="labelInput">'+item.label+'</label>';
		return chain;
	},
	getRadio:function(item,params){
		var chain='<div class="row">'+
					'<div class="col s12 labelInput">'+item.label+'</div>';
		for(var x in item.items){
			var i = item.items[x];
			var idItem = params.id+parseInt(x);
			chain+=	'<div class="col s12 m4">'+
					  '<input field="'+item.field+'" name="'+params.id+'" type="radio" id="'+idItem+'" value="'+i.value+'" />'+
					  '<label class="labelOption" for="'+idItem+'">'+i.label+'</label>'+
					'</div>';
		}
		chain+='</div>';
		return chain;
	},
	
	getCheckbox:function(item,params){
		var chain='<div class="row">'+
					'<div class="col s12 labelInput">'+item.label+'</div>';
		for(var x in item.items){
			var i = item.items[x];
			var idItem = params.id+parseInt(x);
			chain+=	'<div class="col s12 m4">'+
					  '<input field="'+item.field+'" name="'+params.id+'" type="checkbox" id="'+idItem+'"  value="'+i.value+'" />'+
					  '<label class="labelOption" for="'+idItem+'">'+i.label+'</label>'+
					'</div>';
		}
		chain+='</div>';
		return chain;
	},
	getFileInput:function(item,params){
		var chain='<div class="row">'+
						'<div class="col s12 labelInput">'+item.label+'</div>';
		for(var x in item.items){
			var i = item.items[x];
			var idItem = params.id+parseInt(x);
			chain+='<div class="col s12" field="'+item.field+'">'+
						'<div class="file-field input-field">'+
							'<div class="btn">'+
							  '<span>'+i.label+'</span>'+
							  '<input field="'+item.field+'" id="'+idItem+'" type="file">'+
							'</div>'+
							'<div class="file-path-wrapper">'+
							  '<input class="file-path validate" type="text">'+
							'</div>'+
						'</div>'+
					'</div>';
		}
		chain+='</div>';
		return chain;
	},
	getTitle:function(item,params){
		return 	'<label class="labelTitle">'+item.label+'</label>';
	},
	getFootSection:function(){
		var chain='<div class="row">'+
						'<div class="col s12 conditionsLab">'+
							'<input name="conditionsLab" type="checkbox" id="conditionsLab"  value="1" />'+
							'<label class="labelOption" for="conditionsLab">He leído y acepto las condiciones</label>'+
						'</div>'+
						'<div class="col s12 sectionBtn"><a class="waves-effect waves-light btn btnSave">Enviar</a></div>'+
				  '</div>';
		return chain;
	},
	getItem:function(item,position){
		var obj  = this;
		var columns = ((item.type=='radio')||(item.type=='checkbox')||(item.type=='file')||(item.type=='title'))?'':'m6';
		var classInput = (item.type=='title')?'titleSection':'input-field';
		var chain = '<div class="'+classInput+' col s12 '+columns+'">';
		var id = obj.id+'_item'+position;
		var params = {id:id,required:'',textRequired:''};
		if(item.required){
			params.required=' required="true" ';
			params.textRequired=' (*)';
		}
		switch (item.type){
			case 'file':
				chain+= obj.getFileInput(item,params);
				break;
            case 'text':
				chain+= obj.getText(item,params);
				break;
			case 'textarea':
				chain+=obj.getTextarea(item,params);
				break;
			case 'select':
				chain+=obj.getSelect(item,params);
				break;
			case 'radio':
				chain+=obj.getRadio(item,params);
				break;
			case 'checkbox':
				chain+=obj.getCheckbox(item,params);
				break;
			case 'title':
				chain+= obj.getTitle(item,params);
				break;
        }
		chain+='</div>';
		return chain;
	},
	getItems:function(){
		var obj = this;
		var chain = '';
		for(var x in obj.options.fields){
			var f = obj.options.fields[x];
			chain+=obj.getItem(f,parseInt(x));
		}
		chain+=obj.getFootSection();
		return chain;
	},
	
	events:function(){
		var obj=this;
		$('#'+obj.id+' select').material_select();
		$("#"+obj.id+" .questionnaire .sectionBtn .btnSave").click(function(){
			var requiredNotFilled = obj.getFieldsRequiredNotFilled();
			
			if (requiredNotFilled>0) {
                Materialize.toast("Llene todos los campos requeridos", 4000);
            }else{
				var invalid = obj.getInvalid();
				if (invalid>0) {
					Materialize.toast("Campos no validos", 4000);
				}else{
					obj.send();
					
				}
				
			}
			
		});
		
		 $('#'+obj.id+' input[format="numeric"]').each(function(){
				$(this).keypress(function(event){
                                          var reg =/^\d+$/;
                                          var value = $(this).val();
                                          if(!reg.test(value+event.key)){
                                                event.preventDefault();
                                          }   
                });
        });
        $('#'+obj.id+' input[format="real"]').each(function(){
                $(this).keypress(function(event){
                                  var reg =/^-?\d*(\.\d+)?$/;
                                  var hasPoint = (event.key=='.')?true:false; 
                                  var value = $(this).val();
                                  if (!reg.test(value+event.key)) {
                                        if ((hasPoint)&&(value.indexOf(event.key)==-1)) {
                                          
                                        }else{
                                              event.preventDefault();
                                        }
                                  }
                });
        });
		
		$("#"+obj.id+" input[type='text']").each(function(){
				$(this).click(function(){
					$(this).parent().removeClass('badInput');
				});
		});
		$("#"+obj.id+" input[type='textarea']").each(function(){
				$(this).click(function(){
					$(this).parent().removeClass('badInput');
				});
		});
		$("#"+obj.id+" input[type='radio']").each(function(){
				$(this).click(function(){
					$(this).parent().parent().removeClass('badInput');
				});
		});
		$("#"+obj.id+" input[type='checkbox']").each(function(){
				$(this).click(function(){
					$(this).parent().parent().removeClass('badInput');
				});
		});
		
   },
   
   getInvalid:function(){
	var obj=this;
	var format=$("#"+obj.id+ ".input-field" ).attr("type");
   },
   
   getFieldsRequiredNotFilled:function(){
		var obj = this;
		var notFilled=0;
		for(var x in obj.options.fields){
			var item = obj.options.fields[x];
			if (item.required) {
                var value = obj.getValue(item);
				if (value=='') {
					notFilled+=1;
					var parent = null;
					switch (item.type) {
							case 'text':
								parent = $("#"+obj.id+" input[field='"+item.field+"']").parent();
								break;
							case 'radio':
							case 'checkbox':
								parent = $("#"+obj.id+" input[field='"+item.field+"']").parent().parent();
								break;
							case 'select':
								parent = $("#"+obj.id+" select[field='"+item.field+"']").parent();
								break;
							case 'textarea':
								parent = $("#"+obj.id+" textarea[field='"+item.field+"']").parent();
								break;
							case 'file':
								break;
					}
                    if (parent) {
                        parent.removeClass('badInput');
						parent.addClass('badInput');
                    }
                }
            }
		}
		return notFilled;
   },
   clearItems:function(){
		var obj = this;
		for(var x in obj.options.fields){
			var item = obj.options.fields[x];
			switch (item.type) {
					case 'text':
						$("#"+obj.id+" input[field='"+item.field+"']").val('');
						break;
					case 'radio':
					case 'checkbox':
						var value = [];
						$("#"+obj.id+" input[field='"+item.field+"']:checked").each(function(){
							$(this).prop('checked', false);
						});
						break;
					case 'select':
						var value = $("#"+obj.id+" select[field='"+item.field+"'] option[value='-1']").prop('selected', true);
						break;
					case 'textarea':
						var value = $("#"+obj.id+" textarea[field='"+item.field+"']").val('');
						break;
					case 'file':
						break;
			}
		}
   },
   clearBadInput:function(){
		var obj = this;
		$("#"+obj.id+" .badInput").each(function(){
			$(this).removeClass('badInput');
		});
   },
   send:function(){
		var obj = this;
		var fields = obj.getParams();
		fields['estatus']=0;
		fields['ubicacion']='102,25';
		var connection = $.extend({}, obj.options.dataSource.save);
		connection.data = (connection.stringify)? JSON.stringify(fields):fields;
		delete connection.stringify;
		obj.request({connection:connection,event:function(a){obj.options.events.onSave(a)}});
   },
   getValue:function(item){
		var obj = this;
		var value = '';
		switch (item.type) {
                case 'text':
					var value = $("#"+obj.id+" input[field='"+item.field+"']").val();
					break;
				case 'radio':
				case 'checkbox':
					var value = [];
					$("#"+obj.id+" input[field='"+item.field+"']:checked").each(function(){
						value.push($(this).val());
					});
					value = value.join(',');
					break;
				case 'select':
					var value = $("#"+obj.id+" select[field='"+item.field+"'] option:selected").val();
					break;
				case 'textarea':
					var value = $("#"+obj.id+" textarea[field='"+item.field+"']").val();
					break;
				case 'file':
					break;
        }
		value = obj.options.validator.removeSpaces(value);
		return value;
   },
   getParams:function(){
		var obj = this;
		var response = {};
		for(var x in obj.options.fields){
			var i = obj.options.fields[x];
			if (i.type!='title') {
				var value = obj.getValue(i);
				response[i.field]=value;
            }
			
		}
		return response;
	},
	saveImages:function(){
		console.log('Guardando imagenes ...');
	},
	spinner:function(status){
		var obj = this;
		if (status=='show') {
			obj.counterSpinner+=1;
			$("#"+obj.id+" .blocker").fadeIn();
			$("#"+obj.id+" .spinner").fadeIn();
        }else{
			if (obj.counterSpinner>0) {
                obj.counterSpinner-=1;
            }
			if (obj.counterSpinner==0) {
                $("#"+obj.id+" .blocker").fadeOut();
				$("#"+obj.id+" .spinner").fadeOut();
            }
			
		}
	},
	
	request:function(params){
		var extraInformation=null;
		var obj = this;
		var msg = 'Servicio no disponible intente m&aacute;s tarde';
		var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success) {
                                valid=true;
								params.event(json);
								Materialize.toast(json.response.message, 4000);
								obj.clearBadInput();
								obj.clearItems();
								extraInformation =(json.response.data)?json.response.data:null;
                            }else{
								msg = json.response.message;
							}
						}
						if (!valid) {
							 Materialize.toast(msg, 4000);
						}
					},
					beforeSend: function(solicitudAJAX) {
                        obj.spinner('show');
					},
					error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
						
					},
					complete: function(solicitudAJAX,estatus) {
						 if (extraInformation) {
                            obj.saveImages();
                         }
						 obj.spinner('hide');
					}
		};
		r = $.extend(r, params.connection);
		$.ajax(r);
	},

    _create: function() {
		this.update();
	},

	update:function(){
		this.buildStructure();
		this.events();
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

        this.options[key] = value;
        switch (key) {
            case "fields":
			break;
		
		}
    }
});