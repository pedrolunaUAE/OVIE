$.widget("custom.customTab", {
	
    options: {
        sections:[{label:'',id:'',overflow:false},{label:'',id:''}],
		title:null,
		height:600,
		spinner:'Cargando..'
	},

  	_init: function() {
    
	
	},
	
	buildStructure: function() {
		var obj=this;
		obj._id=this.element.attr('id');
		var id = obj._id;
		$("#"+id).addClass('card').addClass('customTab');
		$("#"+id).css('height',obj.options.height+'px');
		var chain ='<div class="header">'+this.getHeaders()+'</div>'+
				   '<div class="content">'+
				   this.getContainers()+
				   this.getSpinner()+
				   '</div>';
		$("#"+id).html(chain);
	},

	events:function(){
		var obj=this;
		$("#"+obj._id+" .option").click(function(){
			
				var ref =$(this).attr('ref');
				obj.activate(ref);
			
		});
   },

   activate:function(ref){
		var obj = this;
		var option = $("#"+obj._id+" .option.active");
		var id = option.attr('ref');
		if (ref!=id) {
			option.removeClass('active');
			$("#"+obj._id+" #header"+ref).addClass('active');
            $("#"+obj._id+" .optionContainer.active").removeClass('active');
			$("#"+obj._id+" #"+ref).addClass('active');
        }
   },
    _create: function() {
		this.update();
	},

	update:function(){
		this.buildStructure();
		this.events();
	},
	getHeaders:function(){  
		var obj = this;
		var s = obj.options.sections;
		var chain='';
		var additionalOption = (obj.options.title)?' optionSpetial ':'';
		if (obj.options.title) {
            chain+='<div class="titleTab">'+obj.options.title+'</div>';
        }
		for(var x in s){
			var i = s[x];
			var margin = (x==0)?'marginTab':'';
			var active = (x==0)?' active':'';
			if (x!=0) {
				chain+='<div class="separator"></div>';
			}
			chain+='<div class="option '+margin+active+additionalOption+'" id="header'+i.id+'" ref="'+i.id+'">'+i.label+'</div>';
			
		}
		return chain;
	},
	getContainers:function(){
		var obj = this;
		var s = obj.options.sections;
		var chain='';
		for(var x in s){
			var i = s[x];
			var active = (x==0)?' active':'';
			var clase = (i.overflow)?'':' notOverflow ';
			chain+='<div class="optionContainer '+active+clase+'" id="'+i.id+'"></div>';
			
		}
		return chain;
	},
    showSpinner:function(){
				var obj = this;
				$("#"+obj._id + ' .Spinner').show();
	},
	hideSpinner:function(){
				var obj=this;
				$("#"+obj._id + ' .Spinner').hide();
	},
	getSpinner:function(){
				var obj = this;
				var chain = '<div class="col s12 Spinner">'+
								'<div class="Spinner-container">'+
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
									'<div class="label">'+obj.options.spinner+'</div>'+
								'</div>'+
							'</div>';
				return chain;
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

