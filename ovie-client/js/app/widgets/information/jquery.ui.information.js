$.widget("custom.information", {
	
    options: {
		data:{
			paragraphs:['Esta herramienta te permitira conocer la dinamica economica de cualquier territorio de Tepic y Nayarit, a partir de la consulta y la descarga de indicadores relevantes economicos como: trabajadores, sueldos y salarios, nivel de desarrollo economico y especializacion','Tambien podras identificar y visualizar en el mapa los negocios dedicados a un giro de interes, para conocer el numero y la ubicacion de tus competidores potenciales.'],
			title:'Analisis sociodemografico',
			text:'La radiografia social',
			icon:'provS'
		},
		register:false,
		buttonText:'Continuar'
	},
	id:'customInformation',
	registred:{},
  	_init: function() {
    
	},
	
	buildStructure: function() {
		var obj=this;
		$("."+obj.id).remove();
		var o = obj.options;
		var chain=''+
						'<div class="'+obj.id+'" style="display:none">'+
							'<div class="title">'+o.data.title+'</div>'+
							'<div class="content">'+
								'<div class="row infoDescription">'+
								'<div class="col s12 description">'+o.data.text+'</div>'+
								'<div class="col s12"><center><div class="templateInformation ti-'+o.data.icon+'"></div></center></div>'+
								'</div>'+
								obj.getParagraphs(o.data.paragraphs)+
							'</div>'+
							'<div class="image"></div>'+
							'<a class="button waves-effect waves-light btn-large">'+o.buttonText+'</a>'+
						'</div>';
		$('body').append(chain);
		$('.'+obj.id).fadeIn();
	},
	
	getParagraphs:function(p){
		var obj = this;
		var chain='<div class="row paragraphs">';
		for(var x in p){
				chain+='<div class="col s12 paragraph"><center><span>'+p[x]+'</span></center></div>';
		}
		chain+='</div>';
		return chain;
	},
	events:function(){
		var obj=this;
		$("."+obj.id+" .button").click(function(){
			$("."+obj.id).fadeOut();
		});
   },
   
    _create: function() {
		this.update();
	},

	update:function(){
		var obj = this;
		if (!obj.registred[obj.options.data.icon]) {
			this.buildStructure();
			this.events();
			if (obj.options.register) {
                obj.registred[obj.options.data.icon]=true;
            }
		}
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
		var obj = this;
        this.options[key] = value;
        switch (key) {
            case "data":
				obj.options.data = value;
				obj.update();
			break;
		
		}
    }
});

