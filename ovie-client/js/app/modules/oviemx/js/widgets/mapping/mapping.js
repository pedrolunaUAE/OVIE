$.widget("custom.mapping", {
    clase:'ovie_mapping',
    map:null,
    Layers:{},
    Features:null,
    Markers:null,
    extent:null,
    controls:null,
    restrictedExtent:null,
    options: {
            buttons:[{type:'polygon',status:false,border:'top'},
                       {type:'point',status:false,border:'middle'},
                       {type:'line',status:false,border:'bottom'}
            ],
            initialExtent:{lon:[-104.98, 21.42], lat:[-104.82, 21.58]},
            restrictedExtent:{lon:[-105.55, 20.95], lat:[-104.15, 22.15]},
            projection: 'EPSG:900913',
            displayProjection: "EPSG:4326",
            resolutions: [305.7481130859375,152.87405654296876,76.43702827148438,38.21851413574219,19.109257067871095,9.554628533935547,4.777314266967774,2.388657133483887,1.1943285667419434,0.5971642833709717,0.29858214168548586,0.14929107084274293,0.07464553542137146],
            layers:{
                bases:[
                    {
                        type:'WMS',
                        label:'Base',
                        url:['http://10.152.11.6/fcgi-bin/ms62/mapserv.exe?map=/opt/map/mdm60/mapabase_ovie.map&'],
                        tiled:false,
                        format:'jpeg',
                        layers:{
                            c100:{label:'Base'}
                        }
                    }
                ],
                overlays:[
                    {
                        type:'WMS',
                        label:'Vectorial',
                        url:'http://10.152.11.6/fcgi-bin/ms62/mapserv.exe?map=/opt/map/mdm60/mdm61vector.map&',
                        tiled:true,
                        format:'png',
                        layers:{
                            c431:{label:'Centros de informaci&oacute;n INEGI',active:false},
                            c111servicios:{label:'Centros de informaci&oacute;n INEGI',active:true}
                        }
                    },
                    {
                        type:'WMS',
                        label:'Text',
                        url:'http://10.152.11.6/fcgi-bin/ms62/mapserv.exe?map=/opt/map/mdm60/mdm61texto.map&',
                        tiled:false,
                        format:'png',
                        layers:{
                            t111servicios:{label:'Centros de informaci&oacute;n INEGI',active:true}
                        }
                    }
                ]
            },
            geometry:{
                    store:{
                        url:'http://mdm5beta.inegi.org.mx:8181/map/geometry',
                        type: 'POST',
                        dataType: "json",
                        contentType : "application/json; charset=utf-8"
                        
                    },
                    addBuffer:{
                        url:'http://mdm5beta.inegi.org.mx:8181/map/buffer',
                        type:'POST',
                        dataType:'json',
                        contentType:'application/json; charset=utf-8'
                    },
                    restore:{
                        url:'http://mdm5beta.inegi.org.mx:8181/map/wkt/geometries',
                        type: 'GET',
                        dataType: "json",
                        contentType : "application/json; charset=utf-8"
                    }
            },
            identify:function(){},
            onAddFeature:function(e){
                console.log(e);
            }
            
    },
    getListFeatures:function(){
        var features = [];
        for (var x in  this.Features.features) {
            var i = this.Features.features[x];
            var area = this.getArea(i,true);
            var params = {id:i.id,name:i.custom.name,type:i.custom.typeFeature,area:area};
            features.push(params);
        }
        return features;
    },            
    addButtons:function(){
        var buttons = this.options.buttons;
        var clase = 'template_ovie_mapping tom_';
        var chainButtons = '';
        for(var x in buttons){
            var i = buttons[x];
            chainButtons+='<div id="Button_'+i.type+'" class="sectionButton Border_'+i.border+'" type="'+i.type+'"><div class="template_ovie_mapping tom_'+i.type+' '+((i.status)?'active':'')+'"></div></div>';
        }
        var chain = '<div class="Buttons">'+
                        chainButtons+
                    '</div>';
        this.element.append(chain).addClass(this.clase);
    },
    eventsButtons:function(){
        var obj = this;
        var id = this.element.attr('id');
        $("#"+id+" .sectionButton").each(function(){
            $(this).click(function(){
                var type = $(this).attr('type');
                var id = $(this).attr('id');
                obj.enableControlSelected(id,type);
            });
        });  
    },
    enableControlSelected:function(id,type){
        var clase = 'sectionButton_active';
        var activeItem = $('.'+clase).attr('type');
        if ((activeItem)&&(activeItem==type)) {
            $("#"+id).removeClass(clase);
            this.activeControl({control:'identify',active:true});
        }else{
            $('.'+clase).removeClass(clase);
            $("#"+id).addClass(clase);
            this.activeControl({control:type,active:true});
        }
    },
    getControl : function(name){
        return this.controls[name];
    },
    getControlsMap:function(){
        return [
                new OpenLayers.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    },
                    documentDrag: true
                }),
                new OpenLayers.Control.MousePosition({
                    formatOutput: function(lonLat) {
                        var digits = parseInt(this.numDigits);
                        var newHtml =
                        this.prefix +
                        lonLat.lon.toFixed(digits) +
                        this.separator +
                        lonLat.lat.toFixed(digits) +
                        this.suffix//+
                        /*
                        " "+
                        transformToDegrees(lonLat.lon.toFixed(digits))+ 'W'+//W
                        this.separator+
                        transformToDegrees(lonLat.lat.toFixed(digits))+'N';*/
                        return newHtml;
                    }
                }),
                new OpenLayers.Control.ScaleLine()//,
                //new OpenLayers.Control.LayerSwitcher()
        ];
	
    },
    getClickEvent : function(f,Map){
        return new  OpenLayers.Class(OpenLayers.Control, {                
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': true,
                    'stopDouble': false
                },
                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.trigger
                        }, this.handlerOptions
                    );
                },
                trigger: function(e) {
                    //var Lonlat = Map.map.getLonLatFromViewPortPx(e.xy);
                    f(e);
		}
        });
    },
    getRender : function(){
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
        return renderer;
    },
    
    getVector : function(){
        return this.getStyleByFormat(this.getFormatVector());
    },
    getStyleByFormat : function(format){
        var style = new OpenLayers.Style();
        style.addRules([new OpenLayers.Rule({symbolizer: format})]);
        return this.getStyleMap({"default": style});
    },
    getStyleMap : function(p){
        return new OpenLayers.StyleMap(p);
    },
    formatFeatures :null,
    defineFormatFeatures:function(){
        var obj = this;
        obj.formatFeatures = {
            buffer:{
                polygon:{
                    fColor:"green",
                    lSize:1,
                    lColor:"black",
                    lType:"line",
                    type:'buffer',
                    name:'buffer',
                    item:'feature'
                }
            },
            measure:{
                line:{
                        lColor:'#59590E',
                        lSize:3,
                        lType:'dash',
                        type:'measure',
                        name:'Measure line',
                        item:'feature',
                        unit:'metric'
                    },
                polygon:{
                            fColor:'#EEEEEE',
                            lColor:'#D7D7D7',
                            lSize:2,
                            lType:'line',
                            type:'measure',
                            name:'Measure',
                            item:'feature',
                            unit:'metric'
                        }
            },
            
            georeference:{
                line:{
                        lColor:'black',
                        lSize:3,
                        lType:'line',
                        type:'georeference',
                        name:'geo line',
                        item:'feature',
                        unit:'metric'
                    },
                polygon:{
                            fColor:'yellow',
                            lColor:'black',
                            lSize:1.5,
                            lType:'line',
                            type:'georeference',
                            name:'geo polygon',
                            item:'feature',
                            unit:'metric'
                        },
                route:{
                        lColor:'black',
                        lSize:3,
                        lType:'line',
                        type:'georeference',
                        name:'geo line',
                        item:'feature',
                        unit:'metric'
                    }
            },
            
            get:function(){
                var f = $.extend({},obj.formatFeatures[arguments[0]][arguments[1]]);
                var tipo = (f.fColor)?'polygon':'line';
                if(arguments[1]=='route'){
                    tipo=arguments[1];
                }
                f.name = obj.regFeatures.label[tipo].get();
                f['store']=true;
                return f;
            }
        }
    },
    getFormatVector : function(){
        var format = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#59590E",
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#59590E",
                    strokeDashstyle: "dash",
                    zIndex:0
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#D7D7D7",
                    fillColor: "#EEEEEE",
                    fillOpacity: 0.3,
                    zIndex:0
                }
        };
        return format;
    },
    addEvents : function(item){
        
        var events = item.item.events;
        for(x in item.events){
            events.register(x,item.item,item.events[x]);
        }
        
    },
    addEventControls : function(){
        var obj = this;
        this.addEvents({
            item:obj.getControl('polygon'),
            events:{
                activate:function(){
                    
                },
                deactivate:function(){
                    //eventDisableCtl.execute('measure');
                },
                measure:function(e){
                    if(e.measure>0){
                        obj.addFeature({
                            wkt:e.geometry+'',
                            zoom:false,
                            store:true,
                            params:obj.formatFeatures.get('georeference','polygon'),
                            typeFeature:'polygon'
                        });
                        //Features.showGeoModal();//pendiente
                        obj.options.onAddFeature(obj.getListFeatures());
                    }else{
                        //$("#mdm6DinamicPanel_geo_btnEndAction").click();
                    }
                },
                measurepartial:function(e){
                    
                }
            }   
        });
        
        this.addEvents({
            item:obj.getControl('line'),
            events:{
                activate:function(){},
                deactivate:function(){
                    //eventDisableCtl.execute('measure');
                },
                measure:function(e){
                    if(e.measure>0){
                        obj.addFeature({
                            wkt:e.geometry+'',
                            zoom:false,
                            store:true,
                            params:obj.formatFeatures.get('georeference','line'),
                            typeFeature:'line'
                        });
                        //Features.showGeoModal();//pendiente
                        //var lastFeature = obj.getLastFeature();
                        obj.showModalBuffer(obj.temporalGeoParams);
                    }else{
                        //$("#mdm6DinamicPanel_geo_btnEndAction").click();
                    }
                },
                measurepartial:function(e){
                    
                }
            }   
        });
        
       
    },
    getCustomControls : function(){
        var obj = this;
        var style = this.getVector();
        var c = OpenLayers.Control;
        var h = OpenLayers.Handler;
        var r = this.getRender();
        var p = this.Features;
        var controls = {
            identify: new (obj.getClickEvent(function(e){
                var lonlat = obj.map.getLonLatFromViewPortPx(e.xy);
                obj.actionMarker({action:'delete',items:'all',type:'identify'});
                var params = {lon:lonlat.lon,lat:lonlat.lat,type:'identify',params:{nom:'Identificaci&oacute;n',desc:''}};
                obj.addMarker(params);
                obj.options.identify({lon:lonlat.lon,lat:lonlat.lat});
                },
                
                obj.map
            )),
            point: new (this.getClickEvent(function(e){
                obj.actionMarker({action:'delete',items:'all',type:'identify'});//identify
                var lonlat = obj.map.getLonLatFromViewPortPx(e.xy);
                var nombre = obj.regFeatures.label.point.get();
                var params = {lon:lonlat.lon,lat:lonlat.lat,type:'georeference',params:{nom:nombre,desc:'Sin descripcion'},store:false};
                obj.addMarker(params);
            
                var geoPoint = obj.getLastMarker();
                var geoParams = {id:geoPoint.id,type:'georeference',data:{name:geoPoint.custom.nom,type:'point'}};
                obj.temporalGeoParams = geoParams;
                obj.showModalBuffer(obj.temporalGeoParams);
                },
                Map
            )),
            line: new c.Measure(
                    OpenLayers.Handler.Path, {
                        persist: false,
                        immediate:true,
                        handlerOptions: {
                            layerOptions: {renderers: r, styleMap: style}
                        }
                    }
                ),
            polygon: new c.Measure(
                    h.Polygon, {
                        persist: false,
                        immediate:true,
                        handlerOptions: {
                            layerOptions: {renderers: r,styleMap: style}
                        }
                        
                    }
            )
        }
        for(x in controls) {
                var ctl = controls[x];
        }

        return controls;
    },
    removeEmptySpaces : function(cadena){
		 var resultado = "";
		 resultado = cadena.replace(/^\s*|\s*$/g,"");
		 return resultado;
    },
    activeControl : function(p){
            p.control = (p.control=='none')?'identify':p.control;
            for(x in this.controls) {
                var control = this.controls[x];
                if(p.control == x && p.active) {
                    control.activate();
                    if(p.event){
                    control.Event = p.event;
                    }
                } else {
                    control.deactivate();
                }   
            }
    },
    getFeatureFromWKT : function(){
        var a = arguments;
        var projection = new OpenLayers.Projection(this.options.projection);
        var f = new OpenLayers.Format.WKT(projection).read(a[0]);
        var b;
        var v = false;
        if(f){
                if(f.constructor != Array) {
                    f = [f];
                }
                for(x in f){
                    if (!b) {
                        b = f[x].geometry.getBounds();
                    } else {
                        b.extend(f[x].geometry.getBounds());
                    }
                }
                v = true;
        }
        return {features:f,valid:v,bounds:b};
    },
    setRestrictedExtent:function(newExtent){
        var m = {
                used:this.options.displayProjection,
                base:this.options.projection
            };
        var cloneExtent = newExtent.clone();
        this.map.setOptions({restrictedExtent: cloneExtent.transform(m.used,m.base)});
        var newResolution = this.map.getResolution();
        this.map.setOptions({minResolution:newResolution});
    },
    goCoords : function(){
            var m = {
                used:this.options.displayProjection,
                base:this.options.projection
            };
            var a = arguments;
            var f = 0.001;
            var p;
	    var zoomLevel = false;
            var bandera =false;
            var geographic=false;
            for(var x in arguments){
                if(arguments[x]=='geographic'){
                    geographic=!geographic;
                    break;
                }
		if(typeof(arguments[x])=='object'){
		    if(arguments[x].zoomLevel){
			zoomLevel=parseInt(arguments[x].zoomLevel);
		    }
		}
            }
            if(typeof(a[0]) == 'object'){
                var t=a[0];
            }else{
                if(typeof(a[0]) == 'string'){
		    var response = this.getFeatureFromWKT(a[0]);
		    
		    if(geographic){
			var t = response.bounds.transform(m.used,m.base);
		    }else{
			var t = response.bounds;
		    }
                   this.map.zoomToExtent(t);
                    bandera=true;
                }else{
                    if((typeof(a[2])!='number')&&(typeof(a[3])!='number')){
		    //if((!a[2])&&(!a[3])){
                        bandera=!bandera;
                        if(geographic){
                            var punto = this.transformToMercator(a[0],a[1]);
                        }else{
                            var punto = {lon:a[0],lat:a[1]};
                        }
                        var lonlat = new OpenLayers.LonLat(parseFloat(punto.lon),parseFloat(punto.lat));
                        this.map.setCenter(lonlat,12);
                    }else{
                        bandera=!bandera;
                        if(geographic){
                           var min = this.transformToMercator(a[0],a[1]);
                           var max = this.transformToMercator(a[2],a[3]);
                           var t=new OpenLayers.Bounds(min.lon,min.lat,max.lon,max.lat);
                        }else{
                            var t=new OpenLayers.Bounds(a[0],a[1],a[2],a[3]);
                        }
                        this.map.zoomToExtent(t);
			if((typeof(a[4])=='number')){
			    var centroid = this.map.getCenter();
			    this.map.setCenter(centroid,(a[4])-1);
			}
                    }
                }
            }
            if(!bandera){
                p=t.clone();
                //Map.map.zoomToExtent(p);
                this.map.zoomToExtent(p.transform(m.used,m.base));
            }
	    if(zoomLevel){
		    var centroid = this.map.getCenter();
		    this.map.setCenter(centroid,zoomLevel-1);
	    }
    },
    buildMap:function(){
        var e = this.options.initialExtent;
        var re = this.options.restrictedExtent;
        this.extent = new OpenLayers.Bounds(e.lon[0],e.lon[1], e.lat[0],e.lat[1]);
        this.restrictedExtent = new OpenLayers.Bounds(re.lon[0],re.lon[1], re.lat[0],re.lat[1]);
        var idDiv = this.element.attr('id');
        var o = this.options;
        this.map = new OpenLayers.Map({ 
                div: idDiv,
                controls: this.getControlsMap(),
                projection: o.projection,
                displayProjection: o.displayProjection,
                resolutions: o.resolutions//,
                //eventListeners:getListenersMap()
            });
        this.addLayers();
        this.addFeatureLayer();
        this.addMarkerLayer();
        this.defineFormatFeatures();
        this.addCustomControls();
        this.goCoords(this.extent);
        var re = this.options.restrictedExtent;
        var restrictedExtent = new OpenLayers.Bounds(re.lon[0],re.lon[1], re.lat[0],re.lat[1]);
        this.setRestrictedExtent(restrictedExtent);
        this.activeControl({control:'identify',active:true});
        this.addEventControls();
        
    },
    addCustomControls:function(){
        this.controls = this.getCustomControls();
        for (var x in this.controls){
             this.map.addControl(this.controls[x]);      
        }
    },
    addFeatureLayer:function(){
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

            this.Features = new OpenLayers.Layer.Vector("Features", {
                renderers: renderer,
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                                    fillColor: "${fColor}",
                                    strokeWidth: "${lSize}",
                                    strokeColor: "${lColor}",
                                    strokeDashstyle: "${lType}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    fillOpacity:0.2
                    }, OpenLayers.Feature.Vector.style["default"])),
                    "vertex": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                                    fillColor: "${fColor}",
                                    strokeWidth: 1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    //graphicName: "square",
                                    strokeColor: "#59590E",
                                    strokeDashstyle: "line",
                                    //label : "${nombre}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px"
				    

                    }, OpenLayers.Feature.Vector.style["vertex"]))
                })
            });
            this.map.addLayer(this.Features);
    },
    addMarkerLayer:function(){
                var render = this.getRender();
                this.Markers = new OpenLayers.Layer.Vector("Features", {
                renderers: render,
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                    }, OpenLayers.Feature.Vector.style["default"])),
                    "select": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                    }, OpenLayers.Feature.Vector.style["default"])),
                    "temporary": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                                    fillOpacity:1,
                                    externalGraphic: "${image}",
                                    graphicWidth: "${gWith}",
                                    graphicHeight: "${gHeight}",
                                    labelAlign: "center",
                                    fontColor: "#000000",
                                    fontWeight: "bold",
                                    labelOutlineColor: "white",
                                    labelOutlineWidth: 3,
                                    fontFamily: "Courier New, monospace",
                                    fontSize: "16px",
                                    pointRadius: 10,
                                    graphicYOffset:-43,
                                    graphicOpacity:1
                                    
                    }, OpenLayers.Feature.Vector.style["default"]))
                })
            });
            this.map.addLayer(this.Markers);
    },
    getParamsforType : function(){
        var a = arguments;
        var p=a[0];
        var i = this.dataMarker.image;
        p['image']=this.dataMarker.getImage(a[1]);
        p['gWith']=i.width;
        p['gHeight']=i.height;
        p['type']=a[1];
        if(typeof(a[2])!='undefined'){
             p['group']=a[2];
        }
        if(typeof(p.description)!='undefined'){
            p['description']=p.description;
        }
        
        return p;
    },
    dataMarker : {
        reg:{
            data:{}, 
            type:{},
            add:function(i,t,p){
                var obj = this;
                var c = 'custom';
                i[c]=p;
                i[c]['type']=t;
                i[c]['item']='point';
                var d = obj;
                var data = d.data;
                var type = d.type;
                data[i.id]=i;
                if(!type[t]){
                    type[t]={};
                }
                type[t][i.id]="";
            },
            get:function(i){
                var obj = this;
                var data = obj.data;
                response = (data[i])?data[i]:null;
                return response;
            }
        },
        layer:null,
        layerMirror:null,
        image:{
            active:'active',
            path: ((typeof apiUrl!=='undefined')?((apiUrl)?apiUrl:''):'')+'img/marks/',
            format:'.png',
            width:'35',
            height:'50',
            measure:'px'
        },
        getImage :function(){
            var a = arguments[0];
            return this.image.path+a+this.image.format;
        }
    },
    actionMarker : function(){
        //{action:'remove',items:'all',type:'poi'}
        //{action:'hide',items:'[id1,id2],type:'poi'}
        //{action:'show',items:'all',type:'poi'}
        var a = arguments[0];
        switch(a.action){
            case 'delete':
                this.removeMarker(a.items,a.type);
                break;
            case 'deleteByGroup':
                this.deleteByGroupMarker(a.group,a.type);
                break;
        }
    },
    getSourceMarker : function(){
        var a = arguments;
        var source;
        if(a[0]=='all'){
            source = this.dataMarker.reg.type[a[1]];
        }else{
            source = a[0];
        }
        return source;
    },
    removeMarker : function(){
        var a = arguments;
        var source = this.getSourceMarker(a[0],a[1]);
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            this.dataMarker.reg.data[item].destroy();
            delete this.dataMarker.reg.data[item];
            delete this.dataMarker.reg.type[a[1]][item];
        }
    },
    getLastMarker : function (){
        return this.Markers.features[this.Markers.features.length-1]; 
    },
    removeLastMarker : function(){
        var marker = this.getLastMarker();
        this.removeMarker([{id:marker.id}],arguments[0]);
    },
    addMarker : function(){
        //a[0]={wkt:'',lon:'',lat:'',store:true,type:'',zoom:true,params:{nom:'',desc:''}}
        var a = arguments[0];
        var store = (a.store)?a.store:false;
        var zoom = (a.zoom)?a.zoom:false;
        var store = (a.store)?a.store:false;
        var showPopup = (a.showPopup)?a.showPopup:false;
        var lon,lat,marker;
        var insert=true;
        if(a.wkt){
            var info = this.getFeatureFromWKT(a.wkt);
            if(info.valid){
                lon = info.bounds.bottom;
                lat = info.bounds.top;
            }else{
                insert=false;
            }
        }else{
            lon = a.lon;
            lat = a.lat;
        }
        if(insert){
            var marker = [new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat))];
            var tipo = (a.params.image)?a.params.image:a.type;
            marker[0].attributes=this.getParamsforType(a.params,tipo);
            if(tipo!=a.type){
                marker[0].attributes['pathImage']=tipo;
            }
            this.Markers.addFeatures(marker);
            if(zoom){
                this.map.setCenter(new OpenLayers.LonLat(lon,lat), zoom);
            }
            this.dataMarker.reg.add(marker[0],a.type,a.params);
            //if(store){
                //storeMarker(marker[0]);
            //}
            return marker[0].id;
        }
    },
    getLayers:function(params){
        var layers = [];
        for(var x in params){
            var item = x;
            layers.push(item);
        }
        return layers.join(',');
    },
    addLayer:function(params,isBase){
            var newLayer = new OpenLayers.Layer[params.type](
                                                             params.label,
                                                             params.url,
                                                            {
                                                                layers: this.getLayers(params.layers),
                                                                format:'image/'+params.format
                                                            },
                                                            {
                                                                singleTile: params.tiled
                                                            }
            );
            newLayer.isBaseLayer = isBase;
            this.Layers["'"+params.label+"'"]=newLayer;
            this.map.addLayer(newLayer);
        
    },
    addLayers : function(){
        var l = this.options.layers;
        for(var x in l.bases){
            this.addLayer(l.bases[x],true);
        }
        for(var x in l.overlays){
            this.addLayer(l.overlays[x],false);
        }
    },
    regFeatures:null,
    defineRegFeatures:function(){
        var obj = this;
        obj.regFeatures = {
            label:{
                polygon:{
                    counter:0,
                    text:'&Aacute;rea',
                    get:function(){
                        this.counter++;
                        return obj.ConvertToHtml(this.text)+" "+this.counter;
                    }
                },
                line:{
                    counter:0,
                    text:'Distancia',
                    get:function(){
                        this.counter++;
                        return this.text+" "+this.counter;
                    }
                },
                point:{
                    counter:0,
                    text:'Punto',
                    get:function(){
                        this.counter++;
                        return this.text+" "+this.counter;
                    }
                },
                address:{
                    counter:0,
                    text:'Direcci&oacute;n',
                    get:function(){
                        this.counter++;
                        return this.text+" "+this.counter;
                    }
                },
                route:{
                    counter:0,
                    text:'Ruta',
                    get:function(){
                        this.counter++;
                        return this.text+" "+this.counter;
                    }
                }
            },
            selected:{
                id:null,
                type:null,
                item:null
            },
            setSelected:function(){
                var a = arguments;
                this.selected.id=a[0];
                this.selected.type=a[1];
                this.selected.item=a[2];
                this.clicked = (a[3])?a[3]:false;
            },
            data:{},
            type:{},
            add:function(i){
                var data = this.data;
                var type = this.type;
                var t = i.custom.type;
                data[i.id]=i;
                if(!type[t]){
                    type[t]={};
                }
                type[t][i.id]="";
                //if((i.custom.type=='buffer')&&(i.custom.store)){
                if((i.custom.store)){
                    obj.storeFeature(i);
                }
            },
            get:function(i){
                var data = this.data;
                response = (data[i])?data[i]:null;
                return response;
            }
        }
    },
    RequestObject : function(){
	    this.params=arguments[0];
	    this.setParams=function(a){
		this.params[0].params=a;
	    }
	    this.setUrl=function(a){
		this.params[0].url=a;
	    }
	    this.setExtraFields = function(a){
		this.params[0].extraFields=a;
	    }
	    this.execute = function(){
		    var obj=this;
		    var a = obj.params[0];
		    var f = a.events;
		    var request = {
			   type: ((a.type)?a.type:'POST'),
			   dataType: (a.format)?a.format:'json',
			   url: a.url,
			   data: a.params,
			   success:function(json,estatus){
				if($.isFunction(f.success)){
				    f.success(json,a.extraFields);
				}
			   },
			   beforeSend: function(solicitudAJAX) {
				if($.isFunction(f.before)){
				    f.before(a.params,a.extraFields);
				}
			   },
			   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
				if ($.isFunction(f.error)){
				    f.error(errorDescripcion,errorExcepcion,a.extraFields);
				}
			   },
			   complete: function(solicitudAJAX,estatus) {
				if ($.isFunction(f.complete)){
				    f.complete(solicitudAJAX,estatus,a.extraFields);
				}
			   }
		    };
		    if(a.type =='jsonp'){
			//jsonp:'json.wrf',
			request['jsonCallback']=((a.callback)?a.callback:'json.wrf');
		    }
		    
		    if(a.contentType){
			request['contentType']=a.contentType;
		    }
		    if(obj.params[0].xhrFields){
			request['xhrFields']=obj.params[0].xhrFields;
		    }
		    //console.log(request);
		    $.ajax(request);
	    }
    },
    convertToBuffer : function(){
        var a = arguments;
        var feature = this.regFeatures.get(a[0]);
        var size = a[1];
        if(feature){
            var tipo = (feature.custom.fColor)?'polygon':'line';
            var wkt = feature.geometry+'';
            if(tipo=='line'){
                this.addBufferToBuffer(feature.id,size,tipo);
            }else{
                var params = {wkt:wkt,store:true,zoom:false,params:format.get('buffer','polygon')};
                //
                this.addFeature(params);
            }
        }
    },
    getWktFromCentroid : function(lonlat,meters,sides){
        var feature = OpenLayers.Geometry.Polygon.createRegularPolygon({x:lonlat.lon,y:lonlat.lat},meters,sides);
        return feature+'';
    },
    addBufferToPoint : function(lonlat,meters){
        var sides = 40;
        var wkt = this.getWktFromCentroid(lonlat,meters,40);
                    this.addFeature({
                        wkt:wkt,
                        zoom:false,
                        store:true,
                        params:this.formatFeatures.get('georeference','polygon'),
                        typeFeature:'point'
        });
        //eventFinishedCeationGeo.execute(temporalGeoParams);
    },
    addBufferToBuffer : function(id,size,type,replace,LonLat){
        replace = (replace)?replace:false;
        var f;
        if(type=='point'){
            f = this.dataMarker.reg.get(id);
            if(f){
                var g = f.geometry;
                var lonlat = {lon:g.x,lat:g.y};
                this.addBufferToPoint(lonlat,size);
            }else{
                
                this.addBufferToPoint(LonLat,size);
            }
            if (replace) {
                this.actionMarker({action:'delete',items:[{id:id}],type:'georeference'});
            }
            this.options.onAddFeature(this.getListFeatures());
        }else{
            f = this.regFeatures.get(id);
            if(f){
                var notification = this.showNotification({message:'Generando &Aacute;rea'});
                
                //console.log("mandara:"+f.custom.db);
                this.addBuffer.setExtraFields({id:f.id,type:type,replace:replace,notification:notification});
                //addBuffer.setParams({proyName:dataSource.proyName/*'mdm5'*/,gid:f.custom.db,labelReg:f.custom.name,size:size,tabla:'geometrias',where:''});
                this.addBuffer.setParams(JSON.stringify({id:f.custom.db,size:size}));
                this.addBuffer.execute();
            }
        }
    },//2230735
    addBufferToGeometry:function(id,size){
            var notification = this.showNotification({message:'Generando &Aacute;rea'});
            this.addBuffer.setExtraFields({id:null,type:'polygon',replace:false,notification:notification});
            //addBuffer.setParams({proyName:dataSource.proyName/*'mdm5'*/,gid:f.custom.db,labelReg:f.custom.name,size:size,tabla:'geometrias',where:''});
            this.addBuffer.setParams(JSON.stringify({id:id,size:size}));
            this.addBuffer.execute();
    },
    addBuffer:null,
    defineAddBuffer:function(){
        var obj = this;
        obj.addBuffer = obj.Request({
            
            url:obj.options.geometry.addBuffer.url,
            type:obj.options.geometry.addBuffer.type,
            format:obj.options.geometry.addBuffer.dataType,
            contentType:obj.options.geometry.addBuffer.contentType,
            params:'',
            events:{
                success:function(data,extraFields){
                    var messages=[];
                    if(data){
                        if(data.response.success){
                            
                                var oldFeature = obj.regFeatures.get(extraFields.id);
                                var copyFeature = $.extend({},obj.regFeatures.get(extraFields.id));
                                //var wkt = data.datos[0].data;
                                var wkt = data.data.buffer.geometry;
                                //var params = {wkt:wkt,store:false,zoom:false,params:format.get('buffer','polygon')};
                                var params = {wkt:wkt,store:false,zoom:false,params:obj.formatFeatures.get('georeference','polygon'),typeFeature:extraFields.type};
                                obj.addFeature(params);
                                //eventFinishedCeationGeo.execute(temporalGeoParams);
                                
                                if(extraFields.replace){
                                        oldFeature.destroy();
                                        var feature = obj.getLastFeature();
                                        delete obj.regFeatures.data[feature.id];
                                        feature.id = copyFeature.id;
                                        feature.custom['db']=copyFeature.custom.db;
                                        obj.regFeatures.data[copyFeature.id]=feature;
                                }else{
                                        //console.log('asociando'+data.datos[0].id);
                                        var feature = obj.getLastFeature();
                                        //feature.custom['db']=data.datos[0].id;
                                        feature.custom['db']=data.data.buffer.id;
                                }
                                obj.options.onAddFeature(obj.getListFeatures());
                        }else{
                            messages.push(data.response.message);
                        }
                    }else{
                        messages.push('Servicio para almacenar georeferencias no disponible');
                    }
                                    
                    if(messages.length>0){
                        for(var x=0;x<messages.length;x++){
                                obj.showNotification({message:messages[x],time:5000});
                        }
                    }
                },
                before:function(a,extraFields){
                    //console.log('lanzando ajax')
                    if(extraFields.notification){
                        extraFields.notification.show();
                    }
                    //console.log("antes");
                },
                error:function(a,b,extraFields){
                    //console.log('error')
                    obj.showNotification({message:'Servicio no disponible',time:5000});
                },
                complete:function(a,b,extraFields){
                    if(extraFields.notification){
                        extraFields.notification.hide();
                    }
                }
            }
        });
    },
    Request : function(){
	//params = {type:'post',formta:'jsonp',callback:'',url:'',params:'',extraFields:'',events:{success:'',before:'',error:'',complete:''}}
        var a = arguments;
        var request = new this.RequestObject(a);
        return request;
    },
    storeFeature : function(i){
        var obj = this;
        var g = this.options.geometry;
        var storer = this.Request({
                    url:g.store.url,
                    type:g.store.type,
                    format:g.store.dataType,
                    params:'',
                    extraFields:'',
                    contentType:g.store.contentType,
                    events:{
                        success:function(data,extra){
                                var messages=[];
                                if(data){
                                    if(data.response.success){
                                        obj.regFeatures.data[extra.id].custom['db']=data.data.id;
                                    }else{
                                        messages.push(data.response.message);
                                    }
                                }else{
                                     messages.push('Servicio para almacenar georeferencias no disponible');
                                }
                                
                                if(messages.length>0){
                                    for(var x=0;x<messages.length;x++){
                                        obj.showNotification({message:messages[x],time:5000});
                                    }
                                }
                            //reg.data[extra.id].custom['db']=data[0];
                        },
                        before:function(){
                            //console.log("antes");
                        },
                        error:function(a,b,c){
                            obj.showNotification({message:'El servicio  para almacenar georeferencias no esta disponible',time:5000});
                        },
                        complete:function(){
                           // console.log("terminado");
                        }
                    }
                });
                
        storer.setParams(JSON.stringify({geometry:i.geometry+''}));
        storer.setExtraFields({id:i.id});
        storer.execute();  
    },
    getLastFeature : function (){
        return this.Features.features[this.Features.features.length-1]; 
    },
    setArguments : function(){
        var a = arguments;
        a[0].attributes = a[1];
        if(a[1].persist){
            //a[0]['custom']=a[1];
            this.addProperties(a[0],a[1]);
        }
       this.Features.redraw();
    },
    getDistance : function(){
        var f = arguments[0];
        var formated = (arguments[1])?arguments[1]:false;
        var system = f.custom.unit;
        var m = f.geometry.getLength();
        if(formated){
            if(system=='metric'){
                var units = "m";
                if(m>=1000){
                    units="k"+units;
                    m = ((m)/1000);
                }
            }else{
                m = m*3.2808399;
                var units = "ft";
                if(m>=5280){
                    units="mi";
                    m = ((m)/5280);
                }
            }
            
            m = m.toFixed(3);
            m = this.getNumberFormated(m)+ " " + units;
        }
        return m;
    },
    ConvertToHtml : function(texto){
		
		var ta=document.createElement("textarea");
		ta.innerHTML=texto.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		return ta.value;
    },
    getArea : function(){
        var f = arguments[0];
        var formated = (arguments[1])?arguments[1]:false;
        var system = f.custom.unit;
        
        var fgeographic = f.clone();
        fgeographic.geometry = fgeographic.geometry.transform('EPSG:900913','EPSG:9102008'); 
        var m = fgeographic.geometry.getGeodesicArea('EPSG:9102008');
        //var m = f.geometry.getGeodesicArea('EPSG:9102008');
        //var m = f.geometry.getArea();
        if(formated){
            if(system=='metric'){
                var units = "m<sup>2</sup>";
                if(m>=1000000){
                    //m=m*0.000001;
                    m = ((m)/1000000);
                    units = "k"+units;
                }
            }else{
                m=m*10.7639104;
                var units = "ft<sup>2</sup>";
                if(m>=27878400){
                    m = ((m)/27878400);
                    units = "mi<sup>2</sup>";
                }
            }
            m = m.toFixed(3);
            m = this.getNumberFormated(m)+ " " + units;
        }
        return m;
    },
    getNumberFormated : function(n){
		n += '';
		x = n.split('.');
		x1 = x[0];
		//alert('antes');
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
    },
    addProperties : function(){
        var c = 'custom';
        var f = 'Events';
        var a = arguments;
        a[0][c];
        a[0][c] = a[1];
        a[0][c]['getArea']=true;
        if(!a[0][f]){
            a[0][f];
            a[0][f]={
                pos:0,
                reg:[],
                store:function(){
                    var obj = this;
                    var a = arguments;
                    obj.pos++;
                    if(obj.reg.length>=3){
                        obj.reg.shift();
                        obj.pos=3;
                    }
                    obj.reg.push(a[0]);
                },
                execute: function(){
                        var obj = this;
                        var a = arguments;
                        var tot = obj.reg.length;
                        var p =obj.pos+0;
                        var valid =true;
                        var factor = -1;
                        if(a[0].action=='redo'){
                            if(p==0){
                                p++;
                            };
                            factor=1;
                        }else{
                            if(p>tot){
                                p--;
                            };
                        }
                        if((p==0)||(p>tot)){
                            valid=false;
                        }
                        if(valid){
                            var r = obj.reg[p-1];
                            var c = $.extend({}, r);
                            if(c.angle){
                                c.angle = (c.angle*factor);
                            }
                            if(c.scale){
                                if(factor!=1){
                                    c.scale = 100/(c.scale/100);
                                }
                            }
                            c['notStore']=true;
                            action(c);
                            if(a[0].action=='redo'){
                                p++;
                            }else{
                                p--
                            }
                            obj.pos=p;
                        }
                }
            }
        }
    },
    addFeature : function(){
        //a[0]={wkt:'',store:true,color:'',zoom:true}
        var a = arguments;
        var store = (a[0].store)?a[0].store:false;
        var zoom = (a[0].zoom)?a[0].zoom:false;
        var data = this.getFeatureFromWKT(a[0].wkt);
        if(data.valid){
            this.Features.addFeatures(data.features);
            if(zoom){
                this.map.zoomToExtent(data.bounds);
            }
            var lastFeature = this.getLastFeature();
            a[0].params['typeFeature']=a[0].typeFeature;
            this.addProperties(lastFeature,a[0].params);
            this.setArguments(lastFeature,a[0].params);
            if(!store){
                //storeDB();
                lastFeature.custom.store=store;
            }
            this.regFeatures.add(lastFeature);
            var tipo = (a[0].params.fColor)?'polygon':'line';
            var Measure = (a[0].params.fColor)?this.getArea(lastFeature,false):this.getDistance(lastFeature,false);
            var params = {id:lastFeature.id,type:a[0].params.type,data:{name:a[0].params.name,type:tipo,measure:Measure,description:a[0].params.description}};
            if(a[0].params.type=='georeference'){
                this.temporalGeoParams = params;
            }
        }else{
            alert("elemento no valido");
        }
    },
    showModalBuffer:function(item){
            this.itemSelected = item;
            this.modalBuffer.show();
    },
    modalBuffer:null,
    itemSelected:null,
    getContentBuffer : function(){
        var cadena ='<div align="left" style="font-size:110%;margin-left:20px;margin-top:10px;margin-bottom:5px">'+
                        'Tama&ntilde;o del &aacute;rea de influencia (metros)'+
                    '</div>'+
                    '<div style="width:300px">'+
                            '<input id="geo_buff" type="text" placeholder="Metros" value="" class="ui-corner-all inputItem " style="font-size:100%">'+    
                    '</div>'+
                    '<div style="padding-top:12px"><button id="geo_btn_add_buff">Calcular</button></div>';
                
        return cadena;
    },
    actionFeature : function(){
        var a = arguments;
        var result=null;
        var f = this.regFeatures.get(a[0].id);
        if((f)||(a[0].items)){
            var param = null;
            if(!a[0].items){
                var g = f.geometry;
                var centroid = g.getCentroid();
            }
            switch(a[0].action){
                case 'rotate':
                    var e = (a[0].angle)?a[0].angle:null;
                    param=(e>360)?360:e;
                    break;
                case 'resize':
                    param = (a[0].scale)?(a[0].scale)/100:null;
                    break;
                case 'drag':
                    param = a[0].lon;
                    centroid:a[0].lat;
                    break;
                case 'delete':
                    this.removeFeature(a[0].id);
                    break;
                case 'set':
                    setData(f,a[0].params);
                    break;
                case 'hide':
                    setVisibility(a[0].items,a[0].type,false);
                    this.Features.redraw();
                    break;
                case 'show':
                    setVisibility(a[0].items,a[0].type,true);
                    this.Features.redraw();
                    break;
                case 'locate':
                    locateAndZoom(f);
                    break;
                case 'get':
                    result = getData(f);
                    break;
            }
            if(param!=null){
                var action =(a[0].action =='drag')?'move': a[0].action+"";
                g[action](param, centroid);
                this.Features.redraw();
            }
            //if(a[0].edition){
            //        contextual.action(a[0].action,f);
            //}
            if(a[0].select){
                this.itemSelectedFeature.define(f,true);
            }else{
                this.itemSelectedFeature.clean();
            }
            //add event made
            if(!a[0].notStore){
                if(!a[0].items){
                    if(f.Events){
                        f.Events.store(a[0]);
                    }
                }
            }
        }
        if(result!=null){
            return result;
        }
    },
    itemSelectedFeature:null,
    defineItemSelectedFeature:function(){
        var obj = this;
        this.itemSelectedFeature = {
            buffer:{
                selected:{
                    fill:'auto',
                    line:'#00FFFF'
                }
            },
            measure:{
                selected:{
                    fill:"#059650",
                    line:'black'
                }
            },
            changeStatusSelected: function(e){
                var item = e.custom;
                var L = obj.Features.styleMap.styles.select.defaultStyle;
                var source = (item.type=='buffer')?this.buffer.selected:this.measure.selected;
                L['fillColor'] = ((source.fill=='auto')?item.fColor:source.fill);
                L['strokeColor'] = ((source.line=='auto')?item.lColor:source.line);
                //L['fillOpacity']="0.2";
            },
            item:null,
            setItem:function(i){
                this.item = i;
            },
            draw:function(){
                if(this.item){
                    var item = this.item.custom;
                    var source = (item.type=='buffer')?this.buffer.selected:this.measure.selected;
                    var params = {
                        fColor:((source.fill=='auto')?item.fColor:source.fill),
                        lSize:3,
                        lColor:((source.line=='auto')?item.lColor:source.line),
                        lType:"line"
                    };
                    obj.setArguments(this.item,params);
                }
            },
            clean:function(){
                if(this.item){
                    obj.setArguments(this.item,this.item.custom);
                }
            },
            define:function(f,draw){
                    this.changeStatusSelected(f);
                    this.clean();
                    this.setItem(f);
                    if(draw){
                        this.draw();
                    }
            }
        }
    },
    
    removeFeature : function(){
        var id = arguments[0];
        var f = this.regFeatures.get(id);
        if(f){
            //controls.Editor.deactivate();
            this.regFeatures.data[id].destroy();
            delete this.regFeatures.data[id];
            delete this.regFeatures.type[f.custom.type][id];
        }
    },
    temporalGeoParams:null,
    removeLastItemGeoreference : function(){
        var feature;
        switch(this.temporalGeoParams.data.type){
            case 'point':
                feature = this.getLastMarker();
                this.actionMarker({action:'delete',items:[{id:feature.id}],type:'georeference'});
                break;
            case 'address':
                feature = this.getLastMarker();
                this.actionMarker({action:'delete',items:[{id:feature.id}],type:'georeferenceAddress'});
                break;
            default:
                feature = this.getLastFeature();
                this.actionFeature({action:'delete',id:feature.id});//pendiente
        }
    },
    defineModalBuffer:function(){
        var obj=this;
        var idParent = obj.element.attr('id');
        obj.modalBuffer = obj.Modal.create({
                        title:'Asignar georreferencia',
                        content:obj.getContentBuffer(),
                        events:{
                            onCancel:function(){
                                obj.modalBuffer.hide();
                                obj.removeLastItemGeoreference();
                                
                            },
                            onCreate:function(){
                                var btn = $("#"+idParent+" #geo_btn_add_buff");
                                var input = $("#"+idParent+" #geo_buff");
                                btn.button({icons:{primary:'ui-icon-circle-check'}}).click(function(){
                                    var id = obj.itemSelected.id;
                                    var size = obj.removeEmptySpaces(input.val());
                                    if(size.length>0){
                                        var tipo = obj.itemSelected.data.type;
                                        obj.addBufferToBuffer(id,size,tipo,true,obj.itemSelected.lonlat);
                                        obj.modalBuffer.hide();
                                    }
                                });
                                ////
                                input.bind("keypress", function(evt) {
                                    var result=true;
                                    var otherresult = 12;
                                    if(window.event != undefined){
                                        otherresult = window.event.keyCode;
                                    }
                                    var charCode = (evt.which) ? evt.which : otherresult;
                                    if (charCode <= 11) { 
                                        return true; 
                                    } 
                                    else {
                                        if(charCode == 13){
                                            btn.click();
                                            return true;
                                        }else{
                                           
                                            var keyChar = String.fromCharCode(charCode);
                                            var keyChar2 = keyChar.toLowerCase();
                                            var re =  /[0-9]/;
                                            var result = re.test(keyChar2);
                                        }
                                    return result; 
                                    } 
                                });
                            },
                            onShow:function(){
                                var input = $("#"+idParent+" #geo_buff");
                                input.val('').focus();
                            }
                        }
        });
    },
    moduleWindow :function(){
        var _window={
            root:'',
            data:{
                id:'',
                title:'',
                content:'',
                events:{
                    onCreate:null,
                    onShow:null,
                    onClose:null,
                    onCancel:null
                },
                width:200,
                btnClose:true,
                modal:false
            },
            created:false,
            declare:function(initParams){
                var obj = _window;
                $.extend(obj.data,initParams);
            },
            assingEvents:function(){
                var obj = _window;
                var id=obj.data.id;
                $("#"+id+"_btnClose").click(function(){
                    obj.hide();
                    if(obj.data.events.onCancel!=null){
                            obj.data.events.onCancel();
                    }
                });
                $("#"+id).draggable();
            },
            getPosition:function(){
                var obj = _window;
                var parent = $("#"+obj.root);
                var window = $("#"+obj.data.id);
                var left = ((parent.width() / 2) - (window.width() / 2));
                var top = (parent.height() / 2) - (window.height() / 2);
                return {left:left,top:top};
            },
            setPosition:function(){
               var obj=_window;
               var pos = obj.getPosition();
               $("#"+obj.data.id).css({left:pos.left+'px',top:pos.top+'px'});
               $("#"+obj.data.id).css({left:pos.left+'px',top:pos.top+'px'});
            },
            getInterface:function(){
                var obj = _window;
                var i = obj.data;
                var contStyle = (obj.data.contentStyle)?obj.data.contentStyle:'';
                var chain = ((obj.data.modal)?'<div id="'+i.id+'_blocker" class="ui-widget-overlay" style="display:none;z-index:3000"></div>':'')+
                            '<div id="'+i.id+'" style="display:none;" class="Modal Modal-window">'+
                                '<div align="center" class="titleOL" style="border-bottom:solid #CCCCCC 2px;">'+
                                    '<div align="left" id="'+i.id+'_title">'+i.title+'</div>'+
                                    ((obj.data.btnClose)?'<span title="cerrar" id="'+i.id+'_btnClose" class="closeLineTime ui-icon ui-icon-circle-close"></span>':'')+
                                '</div>'+
                                '<div id="'+i.id+'_content" style="'+contStyle+'" align="center" class="contOL">'+
                                    i.content+
                                '</div>'+
                            '</div>';
                return chain;
            },
            build:function(){
                var obj = _window;
                $("#"+obj.root).append(obj.getInterface());
                obj.assingEvents();
            },
            show:function(){
                var obj = _window;
                var i=obj.data;
                $("#"+i.id).fadeIn();
                $("#"+i.id+"_blocker").fadeIn();
                obj.setPosition();
                if(obj.data.events.onShow!=null){
                    obj.data.events.onShow();
                }
            },
            hide:function(){
                var obj = _window;
                var id = obj.data.id;
                $("#"+id).fadeOut();
                $("#"+id+"_blocker").fadeOut();
                if(obj.data.events.onClose!=null){
                            obj.data.events.onClose();
                }
            },
            setTitle:function(){
                var obj = _window;
                obj.data.title = arguments[0];
                $("#"+obj.data.id+"_title").html(obj.data.title);
                
            },
            run:function(){
                var obj = _window;
                if(!obj.created){
                    obj.build();
                    if(obj.data.events.onCreate!=null){
                        obj.data.events.onCreate();
                    }
                    obj.created=true;
                }
                obj.show();
            }
        };
        return {
            init:function(){
                _window.data.id=arguments[0].id,
                _window.root = arguments[0].root;
            },
            declare:_window.declare,
            show:_window.run,
            hide:_window.hide,
            setAttr:function(){
                switch(arguments[0]){
                    case 'title':
                            _window.setTitle(arguments[1]);
                        break;
                }
            }
        };
    },
    Modal:null,
    defineModal:function(){
        var Source = this.element.attr('id');
        var parent = this;
        this.Modal = (function(){
            var _modal = {
                root:Source,
                idModal:'Modal',
                counter:0,
                getId:function(){
                    var obj = _modal;
                    obj.counter+=1;  
                    return obj.idModal+obj.counter;  
                },
                getModal:function(){
                    var obj = _modal;
                    var data = {id:obj.getId(),root:obj.root};
                    var newModal = new parent.moduleWindow;
                    //var newModal = jQuery.extend({},moduleWindow);
                    newModal.init(data);
                    return newModal;
                }
            };
            return {
                create:function(settings){
                    settings.id = _modal.getId();
                    var modal = _modal.getModal();
                    modal.declare(settings);
                    return modal;
                }
            }
        }());
    },
    _init: function() {
        
    },
    update:function(){
        
    },
    
    buildStructure: function() {
        this.buildMap();
        this.addButtons();
        this.eventsButtons();
        this.buildFunctions();
    },
    buildFunctions:function(){
        this.defineAddBuffer();
        this.defineRegFeatures();
        this.defineModal();
        this.defineModalBuffer();
        this.defineItemSelectedFeature();
        var id = this.element.attr('id');
        this.rootNotification = id;
        
    },
    /************************/
    enableNotification : false,
    Notification : function(){
        this.id=null;
        this.show=function(){
            //$("#"+this.id).show();
            $("#"+this.id).show( 'slide', {direction:"up"}, 500 );
        };
        this.hide=function(){
            $("#"+this.id).hide( 'slide', {direction:"up"}, 500 );
        },
        this.error=function(){
            chain = '<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">'+
                        '<p>'+
                            '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>'+
                                    '<strong>Servicio no disponible, intente m&aacute;s tarde</strong>'+
                        '</p>'+
                    '</div>';
            $('#'+this.id + ' .contentNotification').html(chain);
            $('#close_'+this.id).hide();
            $('#'+this.id + ' .dinamicPanel-spinner').hide();
        }
    },
    counterNotification:0,
    idNotification:'Notification',
    idBaseNotification : 'BaseNotifications',
    rootNotification:null,
    appendToNotification : function(){
        $("#"+arguments[0]).append(arguments[1])  
    },
    getNewIdNotification : function(){
        this.counterNotification+=1;
        return this.idNotification+this.counterNotification;  
    },
    getIdNotification : function(){
        return this.idNotification+this.counterNotification;  
    },
    isExplorerNotification : function(){
	    var response = false;
    
	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE ");
    
	    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		response=true;
	    }
    
	    return response;
    },
    appendBaseNotification : function(){
        if(!this.enableNotification){
            var ie = this.isExplorerNotification();
            var clase = (ie)?'NotificationsIE':'Notifications';
            var chain = '<div id="'+this.idBaseNotification+'" class="'+clase+'"></div>';
            this.appendToNotification(this.rootNotification,chain);
            this.enableNotification=!this.enableNotification;
        }
    },
    buildNotification : function(params){
        var chain=  '<div id="'+this.getNewIdNotification()+'" style="width:300px;display:none" class="Notification">'+
                        '<div id="close_'+this.getIdNotification()+'" class="dinamicPanel-sprite dinamicPanel-close-short" style="position:absolute;right:10px;top:5px"></div>'+
                        '<div class="dinamicPanel-spinner ajax-loader" style="position:absolute;left:10px;top:5px;'+((params.time)?'display:none':'')+'"></div>'+
                        '<div class="contentNotification">'+params.message+'</div>'+
                    '<div>';
        return chain;
    },
    createNotification : function(){
        this.appendBaseNotification();
        var params = arguments[0];
        var chain = this.buildNotification(params);
        this.appendToNotification(this.idBaseNotification,chain);
        var notification = new this.Notification();
        notification.id = this.getIdNotification();
        $("#close_"+this.getIdNotification()).click(function(){
           notification.hide();
        });
        notification.show();
        if(params.time){
            setTimeout(function(){
                notification.hide();
            },params.time);
            
        }
        return notification;
    },
    destroyNotification : function(){
        $("#"+arguments[0]).remove();
    },
    showNotification:function(){
        return this.createNotification(arguments[0]);
    },
    hideNotification:function(){
        this.destroyNotification(arguments[0]);
    },
    /*************************/
    getLayer:function(name){
        return (this.Layers["'"+name+"'"])?this.Layers["'"+name+"'"]:null;
    },
    equalParams : function(a,b){
        var response=true;
        for(var x in a){
            var param = x.toUpperCase();
            if(b[param]!=a[x]){
                response=false;
                break;
            }
        }
        return response;
    },
    setParamsToLayer : function(p){
        var layer = this.getLayer(p.layer);
        var force = (p.forceRefresh)?p.forceRefresh:true;
        var sameInformation=false;
        if(layer){
            var status = true;
	    if(!force){
            sameInformation = this.equalParams(p.params,layer.params);
	    }
        if(p.params.layers!=''){
                if((!force)&&(!sameInformation)||(force)){
                    p.params['firm'] = ""+ Math.floor(Math.random()*11) + (Math.floor(Math.random()*101));
                    var bandera = true;
                    if(layer.typeService){
                        if(layer.typeService=='TMS'){
                            if(p.params.format){
                                var f = p.params.format.split('/');
                                layer.options.format=p.params.format;
                                layer.options.type=f[1];
                                layer.type=f[1];
                                layer.format=p.params.format;
                                }
                                if(p.params.layers){
                                layer.options.layers=p.params.layers;
                                layer.layers=p.params.layers;
                            }
                        }
                        if(layer.typeService=='WFS'){
                            layer.protocol.setFeatureType(p.params.layers); 
                            layer.refresh({featureType: p.params.layers,force: true});
                        }
                    
                    }
                    if(layer.typeService!='WFS'){
                        layer.mergeNewParams(p.params);
                    }
                }
            }else{
                status=false;
            }
            layer.setVisibility(status);
        }
    },
    // the constructor
    _create: function() {
        this.buildStructure();
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
        //.removeClass( "custom-timeline" )
        //.enableSelection().removeAttr('style').html('').removeAttr('class');
    },

    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply(arguments);
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
    //aquí pegué lo que me dijo many 
    _setOption: function(key, value) {
	var obj=this;
        this.options[key] = value;
        switch (key) {
            case "data":
	
                break;
    
        }
    }
});

//fin de lo que pegué que many me dijo que pegara