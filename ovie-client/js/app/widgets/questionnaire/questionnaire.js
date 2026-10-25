$.widget("custom.questionnaire", {
	
    options: {
		mainId:"",
		fields:[],
		data:null,
		dataSource:null,
		events:{
			onSave:function(){},
			onCancel:function(){}
		},
		point:null,
		validator:null,
		validExtensions:['png','jpg','jpeg','gif'],
		terms:true
	},
	filesReference:{},
  	filesList:[],
	deleted:[],
	posFiles:{},
	dataFiles:null,
	idRow:null,
	file_upload:{formData:null},
   
	
	_init: function() {
	},
	counterSpinner:0,
	buildStructure: function() {
		var obj=this;
		obj.id=this.element.attr('id');
		var id = obj.id;
		$("#modalImage"+obj.id).remove();
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
		//$('#'+obj._id+' #registrar_Container')			
		//$('#'+obj.options.mainId+' #registrar_Container')
		//$('#'+obj.options.mainId+' #'+id).html(chain);
		$("#"+id).html(chain);
		$("body").append(obj.getModal());
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
	setImages:function(data,field){
		var obj = this;
		var reference = obj.filesReference[field];
		reference.files = data;
		for(var x in data){
			var i = data[x];
			i.nombre = 'imagen.png';
			var position= (parseInt(x)+1);
			$("#lfile"+position).val(i.nombre);
			$("#lfile"+position).attr('reference',i.gid);
			$("#close_file"+position).show();
			$("#close_file"+position).attr('reference',i.gid);
			$("#view_file"+position).show();
		}
	},
	getFileInput:function(item,params){
		var obj = this;
		obj.filesReference[item.field]=item;
		var url = 'http://<server_url>/ovie-oferta/fotosinmobiliaria';
		var chain='<div class="row">'+
						'<div class="col s12 labelInput">'+item.label+'</div>'+
						'<form action="'+url+'" method="POST">';
							for(var x in item.items){
								var i = item.items[x];
								var idItem = params.id+parseInt(x);
								chain+='<div class="col s12" field="'+item.field+'">'+
											'<div class="file-field input-field">'+
												'<div class="btn">'+
												  '<span>'+i.label+'</span>'+
												  '<input field="'+item.field+'" id="'+idItem+'" type="file" name="file'+(parseInt(x)+1)+'" multiple>'+
												'</div>'+
												'<div class="file-path-wrapper">'+
												  '<input id="lfile'+(parseInt(x)+1)+'" class="file-path validate" type="text">'+
												  '<div class="tools">'+
														'<div class="close mdi-navigation-close" id="close_file'+(parseInt(x)+1)+'" file="'+(parseInt(x)+1)+'"></div>'+
														'<div class="view mdi-action-visibility" id="view_file'+(parseInt(x)+1)+'" ref="'+item.field+'" file="'+(parseInt(x)+1)+'"></div>'+
												  '</div>'+
												  
												'</div>'+
											'</div>'+
										'</div>';
							}
		
		chain+='</form></div>';
		return chain;
		
		
	},
	getTitle:function(item,params){
		return 	'<label class="labelTitle">'+item.label+'</label>';
	},
	getFootSection:function(){
		var obj = this;
		var id = this.element.attr('id');
		var chain='<div class="row">'+
						((obj.options.terms)?
						'<div class="col s12 conditionsLab">'+
							'<input name="'+obj.id+'_conditionsLab" type="checkbox" id="'+id+'_conditionsLab"  value="1" />'+
							'<label class="labelOption" for="'+id+'_conditionsLab">He leído y acepto las condiciones</label>'+
						'</div>':'')+
						'<div class="col s12 sectionBtn">'+
							'<a class="waves-effect waves-light btn btnSave">Enviar</a>'+
							'<a class="waves-effect waves-light btn btnCancel" style="margin-left: 50px;">Cancelar</a></div>'+
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
	removeFromDeleted:function(position){
		var obj = this;
		$("#lfile"+position+",#close_file"+position).removeAttr('reference');
		var index = obj.deleted.indexOf(position);
		if (index>-1) {
                        obj.deleted.splice(index,1);
        }
	},
	events:function(){
		var obj=this;
		var id = this.element.attr('id');
		$('#'+obj.id+' select').material_select();
		$("#"+obj.id+" .questionnaire .sectionBtn .btnSave").click(function(){
			var requiredNotFilled = obj.getFieldsRequiredNotFilled();
			//var requiredNotFilled = 0;
			if (requiredNotFilled>0) {
                Materialize.toast("Llene todos los campos requeridos", 4000);
            }else{
				var invalid = obj.getInvalid();
				//var invalid = 0;
				if (invalid>0) {
					Materialize.toast("Campos no validos", 4000);
				}else{
					if (!obj.point) {
						Materialize.toast("De clic sobre el mapa para asociar una ubicación", 4000);
					}else{
						var valid = (obj.options.terms)?(($("#"+obj.id+" #"+id+"_conditionsLab").is(":checked"))?true:false):true;
						if (valid) {
                            obj.send();
                        }else{
							Materialize.toast("Debe aceptar las condiciones", 4000);
						}
                        
                    }
					
				}
			}
		});
		$("#"+obj.id+" .questionnaire .sectionBtn .btnCancel").click(function(){
			obj.options.events.onCancel(); 
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
		elem=$("#"+obj.id+" form");
		obj.file_upload = elem.fileupload({
			formData:{id_upload:0},
			autoUpload: false,
			fileInput: $("#"+obj.id+" input:file"),
			}).on("fileuploadadd", function(e, data){
				var valid = obj.isValidFile(data.files[0].name);
				if (valid) {
					obj.removeField(data.paramName);
					var position =parseInt(data.paramName.replace('file',''));
					obj.filesList[position] = data.files[0];
                    obj.showNameFile(data.files[0],e.delegatedEvent.target.name);
					obj.dataFiles=data;
					obj.showTools(data.paramName);
					obj.removeFromDeleted(position);
                }else{
					Materialize.toast("Archivo no v&aacute;lido", 4000);
				}
			}).on("fileuploadsend",function(e,data){
			}).on("fileuploadsubmit",function(e,data){
			});
		$("#"+obj.id+" .tools .view").click(function(){
				
				var ref = $(this).attr('ref');
				var num = parseInt($(this).attr('file'));
				
				var imagen = obj.filesReference[ref].files[num-1].imagen;
				$("#modalImage"+obj.id+" .title").html(obj.filesReference[ref].items[num-1].label);
				$("#modalImage"+obj.id+" img").attr('src','data:image/png;base64,'+imagen);
				$("#modalImage"+obj.id).openModal();
				
		});
		$("#"+obj.id+" .tools .close").click(function(){
				var num = $(this).attr('file');
				obj.removeField(num);
				$(this).hide();
				$(this).next().hide();
				$("#"+obj.id+" #lfile"+num).val('');
				var reference = $(this).attr('reference');
				if (reference) {
                    obj.deleted.push(reference);
                }
		});
		
		
   },
   getModal:function(){
			var obj = this;
			var chain='<div id="modalImage'+obj.id+'" class="modal modal-fixed-footer modal-container">'+
						'<div class="modal-content">'+
						  '<h4 class="modal-title title"></h4>'+
						  '<center><div><img src=""></div></center>'+
						'</div>'+
						'<div class="modal-footer">'+
						  '<a href="#!" style="color:#FFF; background:#6E1A1A" class="modal-action modal-close waves-effect waves-green btn-flat ">Cerrar</a>'+
						'</div>'+
					  '</div>';
			return chain;
		},
   isValidFile:function(name){
		var obj = this;
		var valid = false;
		name = name.toLowerCase();
		var extension = name.split('.');
		extension = extension[1];
		if ((extension)&&(obj.options.validExtensions.indexOf(extension)!=-1)) {
            valid = true;
        }
		return valid;
   },
   showTools:function(file){
		var obj = this;
		$("#"+obj.id+" #close_"+file).show();
		/*
		if (obj.options.data) {
           $("#"+obj.id+" #view_"+file).show();
        }
		*/
		
   },
   showNameFile:function(file,origin){
		var obj = this;
		$("#l"+origin).val(file.name);
   },
   removeField:function(position){
		var obj = this;
		position = position+'';
		position = position.replace('file','');
		position = parseInt(position);
		if (obj.filesList[position]) {
            obj.filesList[position]=null;
        }
   },
   
   //validar valores de campos tel y correo
   getInvalid:function(){
	var obj=this;
	var valido=null;
	var value=null;
	var invalido=0;
	var parent=null;
	
		for(var x in obj.options.fields){
			var item=obj.options.fields[x];
			value=obj.getValue(item);
			
			if (item.required) {
				switch (item.field) {
						case 'telefono':
							  valido=obj.options.validator.isCellPhone(value);
							  if (valido==false) {
								  valido=obj.options.validator.isPhone(value);
							  }
							  break;
						case 'correo_electronico':
							  valido=obj.options.validator.isEmail(value);
							  break;
				}
				if (valido==false) {
						invalido=1;
						parent = $("#"+obj.id+" input[field='"+item.field+"']").parent();
						valido=null;
					}
				if (parent) {
								parent.removeClass('badInput');
								parent.addClass('badInput');
							}
			} 
		}
		return invalido;
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
		var id = this.element.attr('id');
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
						$("#"+obj.id+" input[name='"+id+"_conditionsLab']").prop('checked', false);
						break;
					case 'select':
						var value = $("#"+obj.id+" select[field='"+item.field+"'] option[value='-1']").prop('selected', true);
						break;
					case 'textarea':
						var value = $("#"+obj.id+" textarea[field='"+item.field+"']").val('');
						break;
					case 'file':
						//$("#"+obj.id+" input[field='"+item.field+"']").children();
						$("#"+obj.id+" .file-path").val('');
						$("#"+obj.id+" div[field='"+item.field+"'] .close").hide();
						$("#"+obj.id+" div[field='"+item.field+"'] .view").hide();
						break;
			}
		}
		obj.filesList=[];
		obj.deleted=[];
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
		fields['geometry']=obj.point;
		fields['estatus']=0;
		//fields['ubicacion']='102,25';
		if (obj.options.data) {
            fields['id_inm']=obj.options.data.id_inm;
        }
		var connection = $.extend({}, obj.options.dataSource.save);
		connection.data = (connection.stringify)? JSON.stringify(fields):fields;
		delete connection.stringify;
		obj.request({connection:connection,event:function(a){obj.options.events.onSave(a)}},'save');
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
		if (item.sendFormat) {
                        switch (item.sendFormat) {
                            case 'real':
									value = parseFloat(value);
								break;
							case 'numeric':
									value = parseInt(value);
								break;
                        }
        }
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
	storeImages:function(id){
		var obj = this;
		if (obj.deleted.length>0) {
            obj.deleteImages(id);
        }else{
			obj.saveImages(id);
			
		}
	},
	deleteImages:function(id){
		var obj = this;
		if (obj.deleted.length>0) {
            var connection = $.extend({}, obj.options.dataSource.remove);
			var fields = {deleted:obj.deleted.join(',')};
			connection.data = (connection.stringify)? JSON.stringify(fields):fields;
			delete connection.stringify;
			obj.request({connection:connection,event:function(){obj.saveImages(id)}},'delete');
        }
	},
	saveImages:function(id){
		var obj=this;
		if ((id)&&(obj.dataFiles)){
			elem=$("#"+obj.id+" form");
			elem.fileupload({
				formData:{id_upload: id},
				headers:{'X-AUTH-TOKEN':obj.options.token}
			});
			var names = [];
			var filesList=[];
			for(var x in obj.filesList){
				if (obj.filesList[x]) {
                    filesList.push(obj.filesList[x]);
                }
				var position = parseInt(x);
				//var reference = $("#lfile"+position).attr('reference');
				//var name = (reference)?reference:'file'+position;
				name ='file'+position;
				names.push(name);
			}
			obj.file_upload.fileupload('send', {files:filesList, paramName: names});
		}
		obj.clearItems();
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
	
	request:function(params,action){
		var extraInformation=null;
		var obj = this;
		var msg = 'Servicio no disponible intente m&aacute;s tarde';
		var r= {
					success:function(json,estatus){
						var valid=false;
						if (json){
							if (json.response.success) {
								valid=true;
								switch (action) {
                                    case 'save':
										params.event(json);
										Materialize.toast(json.response.message, 4000);
										obj.clearBadInput();
										extraInformation =(json.data)?json.data:null;
										if (!extraInformation) {
											obj.clearItems();
										}
										break;
									case 'delete':
										setTimeout(function(){params.event();},100);
										break;
                                }
                                
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
						if (action=='save') {
							if (extraInformation) {
							   var id = (obj.options.data)?obj.options.data.id_inm:extraInformation.id_inm;
							   obj.storeImages(id);
							}
						}
						 obj.spinner('hide');
					}
		};
		r = $.extend(r, params.connection);
		if ((obj.options.data)&&(action=='save')) {
			r.type = 'PUT';
		}
		if (obj.options.token) {
            r.headers = {'X-AUTH-TOKEN':obj.options.token};
        }
		$.ajax(r);
	},
	setPoint:function(point){
		var obj = this;
		obj.point = point;
	},
	fillFields:function(){
		var obj = this;
		if (obj.options.data) {
			var data = obj.options.data;
			var fields = obj.options.fields;
			for(var x in fields){
				var item = fields[x];
				if (data[item.field]) {
					var value = data[item.field];
					switch (item.type) {
							case 'text':
								$("#"+obj.id+" input[field='"+item.field+"']").val(value).next().addClass('active');
								
								break;
							case 'radio':
								
								
							case 'checkbox':
								value = value+'';
								var values = value.split(',');
								for(var x in values){
									var v = values[x];
									$("#"+obj.id+" input[field='"+item.field+"'][value='"+v+"']").prop("checked", true);
								}
								
								break;
							case 'select':
								$("#"+obj.id+" select[field='"+item.field+"']").val(value);
								$("#"+obj.id+" select[field='"+item.field+"']").material_select();
								break;
							case 'textarea':
								$("#"+obj.id+" textarea[field='"+item.field+"']").val(value).next().addClass('active');
								break;
							case 'file':
								break;
					}
				}
			}
		}
	},
	
    _create: function() {
		this.update();
	},

	update:function(){
		this.point=null;
		this.deleted=[];
		this.filesList=[];
		this.buildStructure();
		this.fillFields();
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
            case "data":
				this.options.data = value;
				this.clearItems();
				this.fillFields();
			break;
		  case "token":
			this.options.token = value;
			break;
		  case "point":
			this.point = value;
			break;
		
		}
    }
});