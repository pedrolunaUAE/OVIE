$.widget("custom.ficha", {
    
    options:{
        tipo:"ofice",
        superficie:60.5,
        uso:"c4/20",
        oferta:10500,
        tel:4491251286
        
    },
    
    _init: function() {
        var obj=this;
        obj.buildStructure();
	},
    
    buildStructure:function(){
        var obj=this;
        var fatherId=this.element.attr('id');
        obj.id=this.element.attr('id');
        var cadena='<div class="fichaContainer" id="'+fatherId+'_ficha"></div>';          
      
        obj.element.html(cadena);
        obj.buildRows();
    },
    
    buildRows:function(){
        var obj=this;
        var fatherId=this.element.attr('id');
        var cadena="";
        
        for (var x in obj.options.params){
            var i=obj.options.params[x];
            var dataType=i.dataType;
            var formato=obj.valueFormat(i.value, dataType);
            
            cadena+='<div class="row marginRow" id="'+x+'_row" style="margin-left:10px !important">'+
                        '<div class="col s3 iconWrap inmobSprite inmobSprite_'+x+'B"></div>'+
                        '<div class="col s9 dataWrap">'+
                            '<div class="row marginRow title">'+i.title+'</div>'+
                            '<div class="row marginRow data">'+formato.prefijo+i.value+formato.sufijo+'</div>'+
                        '</div>'+
                    '</div>'
        }           
       
        $('#'+fatherId+'_ficha').append(cadena);
    },
    
    
    valueFormat(valor, tipo){
        var obj=this;
        var formato={prefijo:null,sufijo:null,valor:null};
        var sufijo="";
        var prefijo="";
        
        switch (tipo) {
          case "string":
                formato.prefijo="";
                formato.sufijo="";
          break;
          
          case "superficie":
                formato.prefijo="";
                formato.sufijo="m<sup>2</sup>";
          break;
      
          case "dinero":
                obj.formatNumber(valor);
                formato.prefijo="$"; 
                formato.sufijo="";
          break;
          
          case "telefono":
                formato.prefijo="";
                formato.sufijo="";
          break;
        }
        
        return(formato);
    },
    
    formatNumber : function(nStr){
		var bandera=(parseFloat(nStr)<0)?'*':null;
		if (bandera==null){
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}else{
			return bandera;	
		}
	},
    
    
   _create: function() {
		this.update();
	},
    
    update:function(){
		
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
    
    


});