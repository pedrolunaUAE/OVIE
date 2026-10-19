$.widget("custom.activityList", {
	
    options: {
        clearAll:function(){},
		selected:function(){}
	},
	
	activityCve:null,
	
  	_init: function() {
    
	
	},
	
	//fatherId:this.element.attr('id'),
	
	buildStructure: function() {
		var obj=this;
		var fatherId=this.element.attr('id');
		var cadena='<div class="activity-list-container card" id="'+fatherId+'_mainContainer" style="width:100%; height:100%; background:white">'+
				   '</div>';
		var chain= '<div class="activity-list-header">'+
						//'<div class="activity-list-title">Lista de actividades económicas'+
							//'<div class="activity-closeIcon"><img class="close" src="js/app/css/img/close-icon.png"></div>'+
						//'</div>'+
						'<div style="margin-top: -10px;">'+
							'<div>'+
								'<p  class="activity-list-columnTitle">Cve scian</p>'+
								'<div class="activity-list-columnDivider"></div>'+
								'<p  class="activity-list-columnTitle" style="margin-left:8px">Actividad económica</p>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="activity-list">'+
						'<table>'+
							'<tbody id="'+fatherId+'_activity-tabulado">'+
							'</tbody>'+
						'</table>'+	
					'</div>';
				 
		
			
			//$("#"+obj.options.id).html(cadena);
			obj.element.html(cadena);
			$('#'+fatherId+'_mainContainer').html(chain);
		
			var page=1;
			var limit=50;
			obj.requestActividades(page, limit);
			page=page+1;
			var containerHeight=$('#'+fatherId+' .activity-list').height();
			$("#"+fatherId+" .activity-list").scroll(function() {
				var scroll=$('#'+fatherId+' .activity-list').scrollTop();
				var tabHeight=$('#'+fatherId+'_activity-tabulado').height();
				if (scroll==(tabHeight-containerHeight)) {
					if (page<=19) {
						obj.requestActividades(page, limit);
						page=page+1;
					}
				}
			});
					
			$('.activity-closeIcon .close').click(function(){
				$('#'+fatherId+'_mainContainer').hide();
				//$("#vocationMapa").show();
			});
	},
	
	requestActividades:function(page,limit){
		page=page.toString();
		limit=limit.toString();
		var obj=this;
		
		//var act= obj.main.localData.activity.cve;
		var request = {
		//type: config.dataSource.listActEco.type,
		//dataType: config.dataSource.listActEco.dataType,
		url:obj.options.config.dataSource.server+obj.options.config.dataSource.listActEco.url+'?page='+page+'&limit='+limit+'',
		data: JSON,
		contentType:obj.options.config.dataSource.listActEco.contentType,
		success:function(json,estatus){
			var error=false;
			if(json){
				if(json.response.success){
					console.log(json.data);
					obj.activityTabular(json.data,'bloque'+page);
				}else{
					error=true;
							  
				}
			}else{
				error=true
			}
			if(error){
				alert("no valido")
				//obj.displayResults(null,id,item);
						  
			}
		},
		beforeSend: function(solicitudAJAX) {
			//obj.clearResults();
			//obj.showBlocker();
		},
		error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
			//obj.displayResults(null,id,item);
			//obj.hideBlocker();
		},
		complete: function(solicitudAJAX,estatus) {
			//obj.hideBlocker();
		}
		};
				 
	 $.ajax(request);
	},
	
	activityTabular:function(data,clase){
		var obj=this;
		var chain="";
		var fatherId=this.element.attr('id');
		
		for (var x in data.Elementos) {
            var i=data.Elementos[x];
			var cveScian=i.scian;
			var activity=i.descripcion;
			chain+='<tr class="activity-row-container '+clase+'"   id="'+fatherId+'activity-row-'+x+ clase+'"  idref="'+x+'" style="cursor:pointer">'+
						'<td class="activity-row activity-cve">'+cveScian+'</td>'+
						'<td class="activity-row activity-descripcion">'+activity+'</td>'+
					'</tr>';
		}
			$('#'+fatherId+'_activity-tabulado').append(chain);
			
			//antes preguntar si tiene la clase 
			
			$('#'+fatherId+'_activity-tabulado .'+clase).each(function(){
				$(this).click(function(){
					var id=fatherId;
					var clase2=clase;
					obj.clearItems();
					$(this).addClass('active');
					var idRef=$(this).attr("idref");	
					var actTxt=$('#'+fatherId+'activity-row-'+idRef+ clase+' .activity-descripcion').text();
					var cveScian=$('#'+fatherId+'activity-row-'+idRef+ clase+' .activity-cve').text();
					obj.options.selected(actTxt,cveScian);
					console.log(actTxt);
					console.log(cveScian);
				    obj.cveScian(cveScian);
					
				});
			});
			
			/*$(".activity-row-container").click(function(){
					
				obj.clearItems();
				$(this).addClass('active');
				var idRef=$(this).attr("idref");	
				var actTxt=$('#'+fatherId+'activity-row-'+idRef+' .activity-descripcion').text();
				var cveScian=$('#'+fatherId+'activity-row-'+idRef+' .activity-cve').text();
				obj.options.selected(actTxt,cveScian);
				obj.cveScian(cveScian);
			});*/
	},
	
	cveScian:function(cve){
		var obj=this;
		obj.activityCve=cve;
	},
	
	 clearItems:function(notSearch){
		var obj=this;
		var id=this.element.attr("id");
		$("#calculator_activities .collection .collection-item.active").removeClass('active');
		
		$("#"+id+" .act-item.active").removeClass('active');
		if(!notSearch){
            $("#infoActEcoSearch .collection-item.active").removeClass('active');
        }
		$("#"+id+" .activity-row-container.active").removeClass('active');
		//$("#"+this.options.moduleId+"-container .activity-row-container.active").removeClass('active');
	},
	
	clearAll:function(){
		$("#"+this.options.moduleId+"-container .act-item.active").removeClass('active');
	},	

	_create: function() {
		this.update();
	},

	update:function(){
		this.buildStructure();
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
			break;
		
		}
    }
});

