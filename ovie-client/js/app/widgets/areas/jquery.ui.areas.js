$.widget("custom.areas", {
	
	selectedItem:null,
	areaSelected:null,
	focus:false,
	
    options: {
        root: 'body',
        controler: null,
        prev: null,
		xclose:true,
		editName:true,
		altura:null,
		type:'list',
		itemSelected:"area01",
		eventCloseItem:function(){},
		eventClickItem:function(){
		},
		
		data:[
				{
				id:"area01",
				type:"polygon",
				name:"area Coyoacán",
				area: "125,040 m2 "
				},
				
				{
				id:"area02",
				type:"line",
				name:"area Tlanepantla",
				area: "25,186 m2"
				},
				
				{
				id:"area05",
				type:"point",
				name:"area Condesa",
				area: "98,362 m2 "
				}
			  ]	
	},

  	_init: function() {
     var obj=this;
	
	},
	
	buildStructure: function() {
		var obj=this;
		var chain='<ul class="collection areas-mainContainer z-depth-1"></ul>';
		this._id=this.element.attr("id");		  
		$("#"+this._id).html(chain);	
		var txtAlert="No hay áreas para mostrar";
		if(obj.options.data.length<=0){
			$("#"+this._id+" .areas-mainContainer").addClass('sinAreas');
			$("#"+this._id+" .areas-mainContainer").html(txtAlert);
		}else{	
			$("#"+this._id+" .areas-mainContainer").removeClass('sinAreas');	
			obj.fill();	
		}
	},
	
	fill:function(){
			$('#'+this._id+' .areas-mainContainer').html('');
			var obj = this;
			var icnArea="";
			chain="";
			
		
			for (var x in obj.options.data)
			{
				var i=obj.options.data;
				var y=parseInt(x);
				var areaId=i[x].db;
				var areaType=i[x].type;
				var areaName=i[x].name;
				var areaNumber=i[x].area;
				
				if(areaType=="polygon" || areaType=="buffer"){
				   icnArea="img/icons/polygon.jpg";
				}else if(areaType=="line"){
					icnArea="img/icons/line.jpg";
				}else if(areaType=="point"){
					icnArea="img/icons/point.jpg";
				}else{
					icnArea="img/icons/polygon.jpg";
				}
			
				chain+='<li id="areas-Row'+ areaId+'" class="collection-item avatar areas-Row">'+
							'<img src="'+icnArea+'" alt="" class="circle">'+
							'<span class="title" id="title'+areaId+'">'+areaName+'</span>'+
							'<input class="areaName-field" id="name'+areaId+'" type="text" style="display:none">'+
							'<p class="areas-extraData">'+areaNumber+'</p>'+
							'<a href="#!" class="secondary-content">'+
								((obj.options.xclose)?'<i class="small mdi-navigation-cancel" style="float:right" id="close'+areaId+'"></i>':'')+
								((obj.options.editName)?'<div id="edit'+areaId+'" class="ovieSprite ovieSprite-edit-grey edit-areaName-grey edit" style="float:right; display:block"></div><div id="edit'+areaId+'" class="ovieSprite ovieSprite-edit-white edit-areaName-white edit" style="float:right; display:none"></div>':'')+
							'</a>'+
						'</li>'
			}
			//$("#areaName").searchWidget('getAreaName');	
//			var prueba=$("#areaName").html();
			
			$("#proveed-geoAreaList").areas('cleanSelected');
			var id=this.element.attr("id");		  
			$("#"+this._id+" .areas-mainContainer").html(chain);
			//si sólo hay una área marcarla como seleccionada
			if(i.length-1 == 0){
				//$("#vocationAreas-Container .areas-Row").addClass('active');
			}
			if(obj.selectedItem!=null){
				$("#vocationAreas-Container #"+obj.selectedItem ).addClass('active');
			}
	},
	
	eventos:function(){ 
		var obj=this;
		
		$('#'+this._id+' .mdi-navigation-cancel').each(function(){
			$(this).click(function(event){
				var idCloser=$(this).attr("id");
				idCloser=idCloser.replace("close", "");
				var item=obj.findItem(idCloser);
				obj.options.eventCloseItem(item);	
				obj.eliminarArea("areas-Row"+idCloser);
				event.stopPropagation();
			});
		});
		
		//evento editar nombre de area
		$('#'+this._id+' .edit').each(function(){
			$(this).click(function(event){
				var idArea=$(this).attr("id");
				
				idArea=idArea.replace("edit", "");
				obj.areaSelected =idArea;
				var prueba=$('#'+obj._id+' #areas-Row'+idArea+ ' .title').html();
				
				$('#'+obj._id+' #areas-Row'+idArea+ ' .title').css("display", "none");
				$('#'+obj._id+' #areas-Row'+idArea+ ' .areaName-field').css("display", "block");
				event.stopPropagation();
			});
		});
		
		
		$('#'+this._id+' .areas-Row').each(function(){
			$(this).click(function(event){
				var id=$(this).attr("id");
				obj.selectedItem=id;
				id=id.replace("areas-Row", '');
				var item=obj.searchItem(id);
				obj.options.eventClickItem(item); 
				
				$('#'+obj._id+ ' .collection-item').removeClass('active');
				$(this).addClass('active');
				
				//activar editar 
				$('.collection-item .edit-areaName-grey').css("display", "block");
				$('.collection-item .edit-areaName-white').css("display", "none");
				$('#areas-Row'+item.id+ ' .edit-areaName-grey').css("display", "none");
				$('#areas-Row'+item.id+ ' .edit-areaName-white').css("display", "block");
				event.stopPropagation();
			});
		});
		
		//validando el enter del input
		
		$('#'+this._id+' .areaName-field').keyup(function (e) {
			if (e.keyCode == 13) {
				var id=obj.areaSelected;
				var newName=$('#'+obj._id+' #areas-Row'+id+ ' .areaName-field').val();
				$('#'+obj._id+' #'+id).text(newName);
				$('#'+obj._id+' #areas-Row'+id+ ' .title').text(newName);
				var prueba=$('#'+obj._id+' #'+id).text();
				$('#'+obj._id+' .areaName-field').hide();
				$('#'+obj._id+' #areas-Row'+id+ ' .title').show();
				obj.findItem(id, newName) ;
				//var x= parseInt(obj.findItem(id))
				//obj.options.data[x].name=newName;
			}
        });
		
		//Validar si el input perdió el foco
		
		$('#'+this._id+' .areaName-field').focusout(function(){
			var id=obj.areaSelected;
			var newName=$('#'+obj._id+' #areas-Row'+id+ ' .areaName-field').val();
			$('#'+obj._id+' #'+id).text(newName);
			$('#'+obj._id+' #areas-Row'+id+ ' .title').text(newName);
			var prueba=$('#'+obj._id+' #'+id).text();
			$('#'+obj._id+' .areaName-field').hide();
			$('#'+obj._id+' #areas-Row'+id+ ' .title').show();
			obj.findItem(id, newName) ;
		});
	
	},
	showAll:function(){
		 $("#"+this._id+" .hide").removeClass('hide');
	},
	hide:function(e){
		var obj = this;
		if (e) {
			for(var x in obj.options.data){
				var i = obj.options.data[x];
				var finded = (e.item!='feature')?(e.item==i.item):(e.db==i.db);
				if (finded) {
					$("#"+this._id+" #areas-Row"+i.db).addClass('hide');
				}
			}
		}
	},
	eliminarArea:function(id){
		$('#'+this._id+' #'+id).remove();
		this.update();
	},
	
	findItem:function(id, newName){
		var obj=this;
		var response=null;
		for(var x in obj.options.data){
			var i = obj.options.data[x];
			if (id==i.db){
				obj.options.data[x].name=newName;
				response=i;
				break;
			}
		}
		return(response);
	},
	

	searchItem:function(id){
		var obj=this;
		
		var resultado=null;
		for (var x in obj.options.data){
			var i=obj.options.data[x];
			if(id==i.db){
				resultado=i;
				break;
			}
		}
		return resultado;
	},
		
	getData:function(source,params,callback,error,before,complete){
	var obj = this;
	},
	
//	cleanSelected:function(id){
//		$('#'+this._id+' .areas-Row').each(function(){
//			$('#'+this._id+ ' .collection-item').removeClass('active');
//		});
//	},
	
	cleanSelected:function(){
		$('#proveed-geoAreaList_container .active').removeClass('active');
	},
	
	getSelected:function(){
		var obj=this;
		var response=null;
		var id=this.selectedItem;
		if (id==null) {
            response:null;
        }
		else{
			id= id.replace('areas-Row','');
			response=obj.searchItem(id);
		}
		return response;
	},
	
	//Limpiar áreas seleccionadas y seleccionar áreas
	clearItems:function(){
		$("#"+this._id+" .active").removeClass('active');
		this.selectedItem=null;
	},
	
	seleccionarItem:function(item){
		$("#"+this._id+" #areas-Row"+item.db).addClass('active');
		this.selectedItem="areas-Row"+item.db;
	},
	
	
		
// the constructor

    _create: function() {
		var obj = this;
		 obj.buildStructure();
		 obj.eventos();
		
	},

	update:function(){
		var txtAlert="No hay áreas para mostrar";
		if(this.options.data.length<=0){
			$("#"+this._id+" .areas-mainContainer").addClass('sinAreas');
			$("#"+this._id+" .areas-mainContainer").html(txtAlert);
		}else{
			$("#"+this._id+" .areas-mainContainer").removeClass('sinAreas');
			this.fill();
			this.eventos();
			$("#"+this._id+"  #"+this.selectedItem ).addClass('active');
		}
		
	},

    // called when created, and later when changing options
    _refresh: function() {
        // trigger a callback/event
        this._trigger("change");
    },
    // revert other modifications here
    _destroy: function() {
        this.options.close();
        this.element.remove();
    },

    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply(arguments);
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
  
    _setOption: function(key, value) {

        this.options[key] = value;
        switch (key) {
            case "data":
				this.options.data=value;
				this.update();
			break;
		
		}
    }
});

