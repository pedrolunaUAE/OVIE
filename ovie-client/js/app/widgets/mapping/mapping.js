
$.widget("custom.mapping", {
    clase:'ovie_mapping',
    options: {
            map:null,
            Layers:{},
            Features:null,
            Markers:null,
            extent:null,
            Controls:null,
            Loaded:false,
            RestrictedExtent:null,
            regFeatures:null,
            dataMarker:null,
            buttons:[{type:'polygon',status:false,border:'top'},
                       {type:'point',status:false,border:'middle'},
                       {type:'line',status:false,border:'bottom'}
            ],
            initialExtent:{lon:[-104.98, 21.42], lat:[-104.82, 21.58]},
            restrictedExtent:{lon:[-105.55, 20.95], lat:[-104.15, 22.15]},
            projection: 'EPSG:900913',
            displayProjection: "EPSG:4326",
            resolutions: [/*305.7481130859375,*/152.87405654296876,76.43702827148438,38.21851413574219,19.109257067871095,9.554628533935547,4.777314266967774,2.388657133483887,1.1943285667419434,0.5971642833709717,0.29858214168548586,0.14929107084274293,0.07464553542137146],
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
                        url:'http://10.152.11.6/fcgi-bin/ms62/mapserv.exe?map=/opt/map/mdm60/puntos_ovie.map&',
                        tiled:true,
                        format:'png',
                        layers:{
                            chitosv3:{label:'Hitos',active:true}
                        }
                    }/*,
                    {
                        type:'WMS',
                        label:'Text',
                        url:'http://10.152.11.6/fcgi-bin/ms62/mapserv.exe?map=/opt/map/mdm60/mdm61texto.map&',
                        tiled:false,
                        format:'png',
                        layers:{
                            t111servicios:{label:'Centros de informaci&oacute;n INEGI',active:true}
                        }
                    }*/
                ]
            },
            geometry:{
                    store:{
                        //url:'http://mdm5beta.inegi.org.mx:8181/map/geometry',
                        url:'http://mdm5beta.inegi.org.mx:8181/ovie/geometry',
                        type: 'POST',
                        dataType: "json",
                        contentType : "application/json; charset=utf-8"
                        
                    },
                    addBuffer:{
                        //url:'http://mdm5beta.inegi.org.mx:8181/map/buffer',
                        url:'http://mdm5beta.inegi.org.mx:8181/ovie/area',
                        type:'POST',
                        dataType:'json',
                        contentType:'application/json; charset=utf-8'
                    },
                    restore:{
                        url:'http://mdm5beta.inegi.org.mx:8181/map/wkt/geometries',
                        type: 'GET',
                        dataType: "json",
                        contentType : "application/json; charset=utf-8"
                    },
                    bufferLine:{
                        url:'http://mdm5beta.inegi.org.mx:8181/ovie/buffer',
                        type: 'POST',
                        dataType: "json",
                        contentType : "application/json; charset=utf-8"
                    },
                    Export:{
                            url:'http://gaia.inegi.org.mx/mdmexport/kml/download',
                            type:'POST',
                            dataType:'json',
                            contentType:'application/json'
                    }
            },
            proxy:"http://10.1.30.102:8181/downloadfile/download",
            identify:function(){},
            onAddFeature:function(e){
                
            },
            controls:{
                addFeatures:true,
                zoomBar:false
            },
            title:null,
            change:null,
            features:[]
            
    },
    getListFeatures:function(){
        var features = [];
        for (var x in  this.options.Features.features) {
            var i = this.options.Features.features[x];
            var area = this.getArea(i,true);
            var params = {item:i.custom.item,id:i.id,db:i.custom.db,wkt:i.geometry+'',name:i.custom.name,type:i.custom.typeFeature,area:area};
            if (typeof(i.custom.ratio)!='undefined') {
                params.ratio = i.custom.ratio;
            }
            features.push(params);
        }
        //return features;
        return features[features.length-1];
    },
    addGordis:function(){
        this.options.features.push('nuevo');      
    },
    addButtons:function(){
        var chain=''
        if (this.options.controls.addFeatures) {
            var buttons = this.options.buttons;
            var clase = 'template_ovie_mapping tom_';
            var chainButtons = '';
            for(var x in buttons){
                var i = buttons[x];
                chainButtons+='<div id="Button_'+i.type+'" class="sectionButton Border_'+i.border+'" type="'+i.type+'"><div class="template_ovie_mapping tom_'+i.type+' '+((i.status)?'active':'')+'"></div></div>';
            }
            chain = '<div class="Buttons">'+
                            chainButtons+
                     '</div>';
            
        }
        chain+=this.getButtonsPan();
        this.element.append(chain).addClass(this.clase);
        this.element.addClass('card');
    },
    getButtonsPan:function(){
        var chain = '<div class="ButtonsPan">'+
                            '<div id="Button_zoomin" class="sectionButton Border_top" type="zoomin"><div class="template_ovie_mappingPan tom_zoomin"></div></div>'+
                            '<div id="Button_extent" class="sectionButton Border_middle" type="extent"><div class="template_ovie_mappingPan tom_extent"></div></div>'+
                            '<div id="Button_zoomout" class="sectionButton Border_bottom" type="zoomout"><div class="template_ovie_mappingPan tom_zoomout"></div></div>'+
                     '</div>';
        return chain;
    },
    addTitle:function(){
        if (this.options.title) {
            var parent = this.element.attr('id');
            $("#"+parent+" .Title").remove();
            var chain = '<div class="Title">'+this.options.title+'</div>';
            this.element.append(chain);
             $("#"+parent+" .ButtonsPan").addClass('ButtonsMove');
            
        }
    },
    addTitleChange:function(){
        if (this.options.change) {
            var parent = this.element.attr('id');
            $("#"+parent+" .Change").remove();
            var chain = '<div class="Change">'+this.options.change.title+'</div>';
            this.element.append(chain);
        }
    },
    eventChange:function(){
        var obj = this;
        var parent = this.element.attr('id');
        if ((obj.options.change)&&(obj.options.change.event)) {
           $("#"+parent+" .Change").click(function(){
                $("#"+parent+" .Change").hide();
                 $("#"+parent+" .Title").hide();
                 $("#"+parent+" .ButtonsPan").removeClass('ButtonsMove');
                 obj.options.change.event();
                
            });
        }
    },
    eventsButtons:function(){
        var obj = this;
        var parent = this.element.attr('id');
        $("#"+parent+" .sectionButton").each(function(){
            $(this).click(function(){
                var type = $(this).attr('type');
                var id = $(this).attr('id');
                switch (type) {
                    case 'zoomin':
                        obj.options.map.zoomIn();
                        break;
                    case 'zoomout':
                        obj.options.map.zoomOut();
                        break;
                    case 'extent':
                        obj.goCoords(obj.options.extent);
                        break;
                    default:
                        obj.enableControlSelected(id,type);
                }
                
            });
        });
        obj.eventChange();
        
        
    },
    enableControlSelected:function(id,type){
        var parent = this.element.attr('id');
        var clase = 'sectionButton_active';
        var activeItem = $('#'+parent+' .'+clase).attr('type');
        if ((activeItem)&&(activeItem==type)) {
            $("#"+parent+" #"+id).removeClass(clase);
            this.activeControl({control:'identify',active:true});
        }else{
            $('#'+parent+' .'+clase).removeClass(clase);
            $("#"+parent+" #"+id).addClass(clase);
            this.activeControl({control:type,active:true});
        }
    },
    getControl : function(name){
        return this.options.Controls[name];
    },
    transformToMercator : function(lon,lat){
        var m = this.options;
        var point = new OpenLayers.LonLat(lon,lat).transform(m.displayProjection,m.projection);
        return {lon:point.lon,lat:point.lat};
    },
    getControlsMap:function(){
        var obj = this;
        return [
                new OpenLayers.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    },
                    documentDrag: true
                }),
                new OpenLayers.Control.MousePosition({
                    formatOutput: function(lonLat) {
                        //var mercator = obj.transformToMercator(lonLat.lon,lonLat.lat);
                        //console.log(mercator);
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
    getRender : function(svg){
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
        if (!svg) {
            renderer = ["Canvas","SVG", "VML"];
        }
        
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
                        lColor:'#E72582',
                        lSize:3,
                        lType:'line',//
                        type:'georeference',
                        name:'geo line',
                        item:'feature',
                        unit:'metric'
                    },
                polygon:{
                            fColor:'transparent',
                            lColor:'#E72582',
                            lSize:3,
                            lType:'dash',
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
                f.name = obj.options.regFeatures.label[tipo].get();
                f['store']=true;
                return f;
            }
        }
    },
    addGoemetry:function(wkt,db){
        var obj = this;
        obj.addFeature({
            wkt:wkt,
            zoom:false,
            store:false,
            params:obj.formatFeatures.get('georeference','polygon'),
            typeFeature:'polygon'
        });
        var feature = obj.getLastFeature();
        if (db) {
            feature.custom['db']=db;
        }
        return feature.id;
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
        if (!item || !item.item || !item.item.events) {
            return;
        }
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
        var p = this.options.Features;
        var controls = {
            identify: new (obj.getClickEvent(function(e){
                var lonlat = obj.options.map.getLonLatFromViewPortPx(e.xy);
                obj.actionMarker({action:'delete',items:'all',type:'identify'});
                var params = {lon:lonlat.lon,lat:lonlat.lat,type:'identify',params:{nom:'Identificaci&oacute;n',desc:''}};
                obj.addMarker(params);
                obj.options.identify({lon:lonlat.lon,lat:lonlat.lat});
                },
                
                obj.options.map
            )),
            point: new (this.getClickEvent(function(e){
                obj.actionMarker({action:'delete',items:'all',type:'identify'});//identify
                var lonlat = obj.options.map.getLonLatFromViewPortPx(e.xy);
                var nombre = obj.options.regFeatures.label.point.get();
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
            for(x in this.options.Controls) {
                var control = this.options.Controls[x];
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
    fixMeasure:function(){
        var obj = this;
        var wkt = 'POLYGON((-11054850.302198 2218743.6963949,-11058519.279555 2216909.2077164,-11054544.554085 2215380.467151,-11054850.302198 2218743.6963949))';
        var r = obj.getFeatureFromWKT(wkt);
        r.features[0].custom={unit:'metric'};
        var area = obj.getArea(r.features[0]);
        //console.log(area);
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
        this.options.map.setOptions({restrictedExtent: cloneExtent.transform(m.used,m.base)});
        var newResolution = this.options.map.getResolution();
        this.options.map.setOptions({minResolution:newResolution});
    },
    getResolution : function(){
        var res = this.options.map.getResolution();
        res = res+'';
        var cadena = res.split('.');
        var a = '';
        for(var x in cadena[1]){
            var c = cadena[1][x];
            if(x<=8){
            a+=c;
            }
        }
        return parseFloat(cadena[0]+'.'+a);
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
                   this.options.map.zoomToExtent(t);
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
                        this.options.map.setCenter(lonlat,12);
                    }else{
                        bandera=!bandera;
                        if(geographic){
                           var min = this.transformToMercator(a[0],a[1]);
                           var max = this.transformToMercator(a[2],a[3]);
                           var t=new OpenLayers.Bounds(min.lon,min.lat,max.lon,max.lat);
                        }else{
                            var t=new OpenLayers.Bounds(a[0],a[1],a[2],a[3]);
                        }
                        this.options.map.zoomToExtent(t);
			if((typeof(a[4])=='number')){
			    var centroid = this.options.map.getCenter();
			    this.options.map.setCenter(centroid,(a[4])-1);
			}
                    }
                }
            }
            if(!bandera){
                p=t.clone();
                //Map.map.zoomToExtent(p);
                this.options.map.zoomToExtent(p.transform(m.used,m.base));
            }
	    if(zoomLevel){
		    var centroid = this.options.map.getCenter();
		    this.options.map.setCenter(centroid,zoomLevel-1);
	    }
    },
    buildMap:function(){
        var obj = this;
        if (this.options.layers && this.options.layers.initialExtent) {
            this.options.initialExtent = this.options.layers.initialExtent;
            this.options.restrictedExtent = this.options.layers.restrictedExtent;
        }
        var e = this.options.initialExtent;
        var re = this.options.restrictedExtent;
        this.options.extent = new OpenLayers.Bounds(e.lon[0],e.lon[1], e.lat[0],e.lat[1]);
        this.options.RestrictedExtent = new OpenLayers.Bounds(re.lon[0],re.lon[1], re.lat[0],re.lat[1]);
        var idDiv = this.element.attr('id');
        var o = this.options;
        this.options.map = new OpenLayers.Map({ 
                div: idDiv,
                controls: this.getControlsMap(),
                projection: o.projection,
                displayProjection: o.displayProjection,
                resolutions: o.resolutions,
                eventListeners:this.getListenersMap()
            });
       
        this.addLayers();
        this.addFeatureLayer();
        this.addMarkerLayer();
        this.defineFormatFeatures();
        this.defineTimer();
        this.definePopup();
        this.addCustomControls();
        this.goCoords(this.options.extent);
        var re = this.options.restrictedExtent;
        var restrictedExtent = new OpenLayers.Bounds(re.lon[0],re.lon[1], re.lat[0],re.lat[1]);
        this.setRestrictedExtent(restrictedExtent);
        this.activeControl({control:'identify',active:true});
        this.addEventControls();
        this.addExtra([this.options.Markers]);
        this.addEventsBase();
        this.fixMeasure();
        var obj = this;
        setTimeout(function(){
            obj.goCoords(obj.options.extent);
        },500);
        
    },
    addExtra:function(layers){
        var CtlsFeature = this.Feature_getControls(layers);
        for(x in CtlsFeature){
            if((x != 'Feature')&&(CtlsFeature[x])){
           this.options.map.addControl(CtlsFeature[x]);
            }
        }
        CtlsFeature.Hover.activate();
    },
    Feature_getControls : function(layers){
        var mobile  = false;
        
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            mobile=true;
        }
        var obj = this;
        var k = "key";
        var controls = {
            Editor:null,
            Select:null,
            Hover:null,
            Feature:null
        };
        controls.Select = new OpenLayers.Control.SelectFeature(
                            layers,
                            {
                                clickout: true,
                                toggle: false,
                                multiple: false,
                                hover: false,
                                toggleKey: "ctrl"+k, // add selection
                                multipleKey: "shift"+k, // remove selection
                                box: false,
                                onSelect: function(e){
                                    
                                        if(e.custom.item!='point'){
                                            //itemSelected.changeStatusSelected(e);
                                            //itemSelected.clean();
                                            //itemSelected.setItem(e);
                                            obj.itemSelectedFeature.define(e,false);
                                        }else{
                                            obj.Features_showInfo();
                                            var mark = obj.options.dataMarker.data[e.id].custom;
                                            if(mark.func){
                                               mark.func(mark);
                                            }
                                        }       
                                    
                                },
                                onBeforeSelect: function(feat) {
                                    return false;  
                                },
                                onUnselect:function(){
                                    controls.Editor.deactivate();    
                                }
                            }
                        );
        if (mobile) {
            controls.Hover = new  OpenLayers.Control.SelectFeature(
                            layers,
                            {
                                /*
                                multiple: false,
                                hover: true,
                                toggleKey: "ctrl"+k, // remove selection
                                multipleKey: "shift"+k, // add selection,
                                */
                                clickout: true,
                                toggle: false,
                                multiple: false,//
                                hover: false,
                                toggleKey: "ctrl"+k, // add selection
                                multipleKey: "shift"+k, // remove selection
                                box: false,
                                onSelect: function(e){
                                    //console.log(e);
                                    setTimeout(function(){
                                        
                                            obj.options.regFeatures.setSelected(e.id,e.custom.type,e.custom.item);
                                            
                                            if (e.attributes.item=='point') {
                                                var event = function(){
                                                    obj.Features_showInfo();
                                                }
                                                obj.Popup.defineTimer(event);
                                            }
                                        },0);
                                    //controls.Hover.unselectAll();
                                    //controls.Select.activate();
                                },
                                onUnselect:function(e){
                                    
                                        obj.Features_cleanInfo();
                                        obj.itemSelectedFeature.draw();
                                        obj.options.regFeatures.setSelected(null,null,null,null);
                                }
                            }
                        );
        }else{
            
        
            controls.Hover = new  OpenLayers.Control.SelectFeature(
                            layers,
                            {
                                multiple: false,
                                hover: true,
                                toggleKey: "ctrl"+k, // remove selection
                                multipleKey: "shift"+k, // add selection,
                                onSelect: function(e){
                                    setTimeout(function(){
                                        
                                            obj.options.regFeatures.setSelected(e.id,e.custom.type,e.custom.item);
                                            
                                            if (e.attributes.item=='point') {
                                                var event = function(){
                                                    obj.Features_showInfo();
                                                }
                                                obj.Popup.defineTimer(event);
                                            }
                                        },0);
                                    controls.Hover.unselectAll();
                                    controls.Select.activate();
                                },
                                onUnselect:function(e){
                                    
                                        obj.Features_cleanInfo();
                                        obj.itemSelectedFeature.draw();
                                        obj.options.regFeatures.setSelected(null,null,null,null);
                                }
                            }
                        );
        }
        return controls;
    },
    Features_cleanInfo : function(){
            this.Popup.hide();
    },
    getListenersMap : function(){
        var obj = this;
        obj.onMap = false;
        var listeners = {
                "mouseover":function(){
                    obj.onMap = true;
                },
                "mouseout":function(){
                    obj.onMap=false;
                    obj.Popup.hide();
                },
                
                "mousemove":function(e){
                    var i = obj.options.regFeatures.selected;
                    if(i.id){
                                var valid = (i.item=='point')?true:false;
                                if((obj.onMap)&&(valid)){
                                 
                                        var event = function(){
                                           obj.Features_showInfo();
                                        }
					
                                        obj.Popup.defineTimer(event);
                                }
                    }
		    
                },
                "updatesize":function(){
                    //obj.Popup_resetLimits();
                },
                "move":function(){
                    $("#"+obj.element.attr('id')+"_popup").hide();
                }
            }
        return listeners;
    },
    Features_showInfo : function(){
        var changeCoords =true;
        var type='point';
        switch(this.options.regFeatures.selected.type){
            case 'poi':
            case 'identify':
            case 'search':
            case 'point':
            case 'prov':
            case 'soc':
            case 'eco':
                var f = this.options.dataMarker.reg.data[this.options.regFeatures.selected.id];
                break;
        }
        if(f){
            var b = f.geometry.bounds;
            var position = this.getLastMousePosition();
            var point = (changeCoords)?this.options.map.getPixelFromLonLat(b.getCenterLonLat()):position.px;
            //var point = Map.map.getPixelFromLonLat(b.getCenterLonLat());
            this.Features_buildPopup(f,point,type);
        }
    },
    showPopupFeature : function(id,type,usePoint){
            var f = this.options.dataMarker.reg.data[id];
            //var f = Markers.reg.data[id];
            var b = f.geometry.bounds;
            var position = this.getLastMousePosition();
            if (usePoint) {
                var point = this.options.map.getPixelFromLonLat(b.getCenterLonLat());
            }else{
                var point = (changeCoords)?this.options.map.getPixelFromLonLat(b.getCenterLonLat()):position.px;
            }
            this.Features_buildPopup(f,point,type);
    },
    getLastMousePosition : function(){
        var ctl = this.options.map.controls[1];
        var px = ctl.lastXy;
        var lonlat = this.options.map.getLonLatFromPixel(px);
        return {px:px,lonlat:lonlat};
    },
    Features_buildPopup : function(f,p,t){
        var params = {};
        //console.log(f);
        if(t=='cluster'){
            params['title']=f.custom.claveOri;
            params['prev']=f.custom.nombreCT;
            params['icons'] = [
                {clase:'dinamicPanel-sprite dinamicPanel-gallery-short',label:'Ver galeria',func:function(){
                    amplify.publish('uiGallery',{id:f.custom.claveOri});
                    setTimeout(function(){
                        $(".lightGallery-gallery-title").html(f.custom.nombreCT);
                        $(".lightgallery-shadow").each(function(){
                            $(this).attr('title',f.custom.nombreCT);
                        });
                    },500);
                    }},
                {clase:'dinamicPanel-sprite dinamicPanel-add-short',label:'Ver ficha',func:function(){
                    Escuelas.verFicha();
                    $("#escuela").html(f.custom.nombreCT);
                    $("#escuelaid").html(f.custom.claveOri);
                    }}
                
            ];
        }else{
            if(f.custom.getArea){
                var a = (f.custom.fColor)?getArea(f,true):getDistance(f,true);
                var titleFeature = (f.custom.title)?f.custom.title:f.custom.name;
                var descriptionFeature = (f.custom.description)?f.custom.description:a; 
                params['title']=titleFeature;
                params['prev']=descriptionFeature;
            }else{
                params['title']=f.custom.nom;
                params['element']='point';
                if(typeof(f.custom.desc)!='undefined'){
                    params['prev']=f.custom.desc;
                }
                params['event']=(f.custom.event)?f.custom.event:null;
                
            }
        }
        params['px']=p;
        params['item']=t;
        this.Popup.show(params,f);
    },
    addEventsBase : function(){
        var obj = this;
        var loadStart = function(){
	    
        }
        var loadEnd=function(){
          if(!obj.options.Loaded){
            obj.options.Loaded=true;
            setTimeout(function(){
                obj.update();
            },500)
            //obj.update();
            obj.Popup.defineLimits();
            
          }
	 
        }
        var baseLayer = obj.getLayer('Base');
        if (!baseLayer && obj.options.map) {
            for (var i = 0; i < obj.options.map.layers.length; i++) {
                if (obj.options.map.layers[i].isBaseLayer) {
                    baseLayer = obj.options.map.layers[i];
                    break;
                }
            }
        }
        if (baseLayer) {
            this.addEvents({
                item: baseLayer,
                events:{
                    loadstart: loadStart,
                    loadend: loadEnd
                }
            });
        }
    },
    addFeaturesFromOptions:function(){//modificada gordis
       var obj = this;
       var o = this.options;
       var features = o.features;
       this.options.Features.destroyFeatures();
       for(var x in features){
            var i = features[x];
            var paramsFeature = obj.formatFeatures.get('georeference','polygon');
            paramsFeature.name = i.name;
            this.addFeature({
                            wkt:i.wkt,
                            zoom:false,
                            store:false,
                            params:paramsFeature,
                            typeFeature:'polygon'
            });
            var feature = obj.getLastFeature();
            delete obj.options.regFeatures.data[feature.id];
            feature.id = i.id;
            feature.custom['db']=i.db;
            if (i.ratio) {
                feature.custom['ratio']=i.ratio;
            }
            obj.options.regFeatures.data[i.id]=feature;
       }
    },
    addCustomControls:function(){
        this.options.Controls = this.getCustomControls();
        for (var x in this.options.Controls){
             this.options.map.addControl(this.options.Controls[x]);      
        }
    },
    addFeatureLayer:function(){
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

            this.options.Features = new OpenLayers.Layer.Vector("Features", {
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
            this.options.map.addLayer(this.options.Features);
    },
    addMarkerLayer:function(){
        var obj = this;
        
                var render = this.getRender(true);
                this.options.Markers = new OpenLayers.Layer.Vector("Features", {
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
            this.options.map.addLayer(this.options.Markers);
            
           
            this.MarkersMirror = new OpenLayers.Layer.Vector("Markers2", {
                renderers: this.getRender(),
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
            this.options.map.addLayer(this.MarkersMirror);
           
    },
    getParamsforType : function(){
        var a = arguments;
        var p=a[0];
        var i = this.options.dataMarker.image;
        p['image']=this.options.dataMarker.getImage(a[1]);
        p['gWith']=i.width;
        p['gHeight']=i.height;
        p['type']=a[1];
        if(typeof(a[2])!='undefined'){
             p['group']=a[2];
        }
        if(typeof(p.description)!='undefined'){
            p['description']=p.description;
        }
        if(typeof(p.event)!='undefined'){
            p['event']=p.event;
        }
        if(typeof(p.eventPanning)!='undefined'){
            p['event']=p.eventPanning;
        }
        
        return p;
    },
    defineRegMarkers:function(){
        this.options.dataMarker = {
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
        };
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
            source = this.options.dataMarker.reg.type[a[1]];
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
            this.options.dataMarker.reg.data[item].destroy();
            delete this.options.dataMarker.reg.data[item];
            delete this.options.dataMarker.reg.type[a[1]][item];
        }
    },
    getLastMarker : function (){
        return this.options.Markers.features[this.options.Markers.features.length-1]; 
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
            if (a.params.dataProvider) {
                marker[0].attributes['dataProvider']=a.params.dataProvider;
            }
            this.options.Markers.addFeatures(marker);
            if(zoom){
                this.options.map.setCenter(new OpenLayers.LonLat(lon,lat), zoom);
            }
            this.options.dataMarker.reg.add(marker[0],a.type,a.params);
            //if(store){
                //storeMarker(marker[0]);
            //}
            if(showPopup){
                this.showPopupFeature(marker[0].id,a.type,marker[0]);
            }
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
            if(params.type=='OSM'){
                var osmUrl = params.url || null;
                var newLayer = new OpenLayers.Layer.OSM(params.label, osmUrl, {
                    tileOptions: { crossOriginKeyword: null }
                });
            }else{
                var maxExtent = new OpenLayers.Bounds(
                    -20037508.34, -20037508.34, 20037508.34, 20037508.34
                );
                var wmsOptions = {
                    singleTile: params.singleTile !== undefined ? params.singleTile : params.tiled,
                    maxExtent: maxExtent,
                    displayOutsideMaxExtent: false,
                    tileOrigin: new OpenLayers.LonLat(-20037508.34, -20037508.34)
                };
                var newLayer = new OpenLayers.Layer[params.type](
                                                                params.label,
                                                                params.url,
                                                                {
                                                                    layers: this.getLayers(params.layers),
                                                                    format:'image/'+params.format
                                                                },
                                                                wmsOptions
                );
            }
            newLayer.isBaseLayer = isBase;
            this.options.Layers["'"+params.label+"'"]=newLayer;
            this.options.map.addLayer(newLayer);
        
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
    defineRegFeatures:function(){
        var obj = this;
        obj.options.regFeatures = {
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
        var feature = this.options.regFeatures.get(a[0]);
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
                        typeFeature:'point',
                        ratio:meters
        });
        //eventFinishedCeationGeo.execute(temporalGeoParams);
    },
    addBufferToBuffer : function(id,size,type,replace,LonLat){
        replace = (replace)?replace:false;
        var f;
        if(type=='point'){
            f = this.options.dataMarker.reg.get(id);
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
    
        }else{
            f = this.options.regFeatures.get(id);
            if(f){
                var notification = this.showNotification({message:'Generando &Aacute;rea'});
                
                if (type=='line') {
                    this.addBufferLine({id:f.id,db:f.custom.db,sizeBuffer:size,notification:notification});
                }else{
                    this.addBuffer.setExtraFields({id:f.id,type:type,replace:replace,notification:notification});
                    //addBuffer.setParams({proyName:dataSource.proyName/*'mdm5'*/,gid:f.custom.db,labelReg:f.custom.name,size:size,tabla:'geometrias',where:''});
                    this.addBuffer.setParams(JSON.stringify({id:f.custom.db,sizeBuffer:size,type:type}));
                    this.addBuffer.execute();
                }
            }
        }
    },//2230735
    addBufferToGeometry:function(id,size,type,label){
            var notification = this.showNotification({message:'Generando &Aacute;rea'});
            this.addBuffer.setExtraFields({id:null,type:'polygon',replace:false,notification:notification,size:size,label:label,item:id});
            //addBuffer.setParams({proyName:dataSource.proyName/*'mdm5'*/,gid:f.custom.db,labelReg:f.custom.name,size:size,tabla:'geometrias',where:''});
            this.addBuffer.setParams(JSON.stringify({id:id,sizeBuffer:size,type:type}));
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
                            
                                var oldFeature = obj.options.regFeatures.get(extraFields.id);
                                var copyFeature = $.extend({},obj.options.regFeatures.get(extraFields.id));
                                //var wkt = data.datos[0].data;
                                var wkt = data.data.area.geometry;
                                //var params = {wkt:wkt,store:false,zoom:false,params:format.get('buffer','polygon')};
                                var params = {wkt:wkt,store:false,zoom:false,params:obj.formatFeatures.get('georeference','polygon'),typeFeature:extraFields.type};
                                obj.addFeature(params);
                                //eventFinishedCeationGeo.execute(temporalGeoParams);
                                
                                if(extraFields.replace){
                                        oldFeature.destroy();
                                        var feature = obj.getLastFeature();
                                        delete obj.options.regFeatures.data[feature.id];
                                        feature.id = copyFeature.id;
                                        feature.custom['db']=copyFeature.custom.db;
                                        obj.options.regFeatures.data[copyFeature.id]=feature;
                                }else{
                                        //console.log('asociando'+data.datos[0].id);
                                        var feature = obj.getLastFeature();
                                        //feature.custom['db']=data.datos[0].id;
                                        feature.custom['db']=data.data.area.id;
                                        if (extraFields.label) {
                                            feature.custom['name'] = extraFields.label;
                                        }
                                        if (extraFields.item) {
                                            feature.custom['item'] = extraFields.item;
                                        }
                                        //console.log(data.data.area.id);
                                }
                                if (typeof(extraFields.size!='undefined')) {
                                    feature.custom['ratio']=extraFields.size;
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
                                        obj.options.regFeatures.data[extra.id].custom['db']=data.data.id;
                                        if (extra.type!= "line") {
                                            obj.options.onAddFeature(obj.getListFeatures());
                                        }
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
                        complete:function(i){
                           // console.log("terminado");
                           
                           
                        }
                    }
                });
                
        storer.setParams(JSON.stringify({geometry:i.geometry+''}));
        storer.setExtraFields({id:i.id,type:i.attributes.typeFeature+''});
        storer.execute();  
    },
    addBufferLine : function(info){
        var obj = this;
        var g = this.options.geometry;
        var bufferLine = this.Request({
                    url:g.bufferLine.url,
                    type:g.bufferLine.type,
                    format:g.bufferLine.dataType,
                    params:'',
                    extraFields:'',
                    contentType:g.bufferLine.contentType,
                    events:{
                        success:function(data,extra){
                                if(data){
                                    if(data.response.success){                                      
                                        var line = obj.options.regFeatures.get(extra.id);
                                        line.destroy();
                                        var wkt = data.data.area.geometry;
                                        var params = {wkt:wkt,store:true,zoom:false,params:obj.formatFeatures.get('georeference','polygon'),typeFeature:'polygon'};
                                        if (info.sizeBuffer) {
                                           params.ratio = info.sizeBuffer;
                                        }
                                        obj.addFeature(params);
                                       
                                        /////////////////////////////////////////
                                       
                                    }else{
                                        messages.push(data.response.message);
                                    }
                                }else{
                                     messages.push('Servicio para almacenar georeferencias no disponible');
                                }
    
                            //reg.data[extra.id].custom['db']=data[0];
                                
                        },
                        before:function(){
                            //console.log("antes");
                        },
                        error:function(a,b,c){
                            obj.showNotification({message:'El servicio  para almacenar georeferencias no esta disponible',time:5000});
                        },
                        complete:function(a,b,extra){
                           if(extra.notification){
                                extra.notification.hide();
                            }
                           
                           
                        }
                    }
                });
                
         bufferLine.setParams(JSON.stringify({id:info.db,sizeBuffer:info.sizeBuffer}));
         bufferLine.setExtraFields({id:info.id,notification:info.notification});
         bufferLine.execute();  
    },
    getLastFeature : function (){
        return this.options.Features.features[this.options.Features.features.length-1]; 
    },
    setArguments : function(){
        var a = arguments;
        a[0].attributes = a[1];
        if(a[1].persist){
            //a[0]['custom']=a[1];
            this.addProperties(a[0],a[1]);
        }
       this.options.Features.redraw();
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
        //if(formated){
            if(system=='metric'){
                var units = "m<sup>2</sup>";
                if(m>=1000000){
                    //m=m*0.000001;
                    m = ((m)/1000000);
                    //units = "k"+units;
                    m = ((m)/0.010000);
                    units = "ha";
                    
                }else{
                    m = ((m)/10000);
                    units = "ha"; 
                }
            }else{
                m=m*10.7639104;
                var units = "ft<sup>2</sup>";
                if(m>=27878400){
                    m = ((m)/27878400);
                    //units = "mi<sup>2</sup>";
                }
            }
            m = m.toFixed(2);
            m = this.getNumberFormated(m)+ " " + units;
        //}
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
            this.options.Features.addFeatures(data.features);
            if(zoom){
                this.options.map.zoomToExtent(data.bounds);
            }
            var lastFeature = this.getLastFeature();
            a[0].params['typeFeature']=a[0].typeFeature;
            this.addProperties(lastFeature,a[0].params);
            this.setArguments(lastFeature,a[0].params);
            if(!store){
                //storeDB();
                lastFeature.custom.store=store;
            }
            if (a[0].ratio) {
                lastFeature.custom.ratio=a[0].ratio;
            }
            this.options.regFeatures.add(lastFeature);
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
        var f = this.options.regFeatures.get(a[0].id);
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
                    this.options.Features.redraw();
                    break;
                case 'show':
                    setVisibility(a[0].items,a[0].type,true);
                    this.options.Features.redraw();
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
                this.options.Features.redraw();
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
                var L = obj.options.Features.styleMap.styles.select.defaultStyle;
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
    findByDB:function(param){
        var obj = this;
        var id = null;
        for(var x in obj.options.Features.features){
            var i = obj.options.Features.features[x];
            if(i.attributes.db){
				if(param==i.attributes.db){
                	id=i.id+'';
                	break;
				}
            }
        }
        return id;
    },
    removeFeatureByDB:function(){
        var id = this.findByDB(arguments[0]);
        this.removeFeature(id);
    },
    removeFeature : function(){
        var id = arguments[0];
        var f = this.options.regFeatures.get(id);
        if(f){
            //controls.Editor.deactivate();
            this.options.regFeatures.data[id].destroy();
            delete this.options.regFeatures.data[id];
            delete this.options.regFeatures.type[f.custom.type][id];
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
                idModal:Source+'_Modal',
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
        var obj = this;
        obj.options.map.updateSize();
    },
    getExtent:function(){
        return this.options.map.getExtent();
    },
    calculateBounds:function(){
        return this.options.map.calculateBounds();  
    },
    buildStructure: function() {
        var obj = this;
        this.buildMap();
        this.addButtons();
        this.addTitle();
        this.addTitleChange();
        this.eventsButtons();
        this.buildFunctions();
        this.addFeaturesFromOptions();
        
        setTimeout(function(){
            obj.options.map.updateSize();
        },300);
        
    },
    buildFunctions:function(){
        this.defineAddBuffer();
        this.defineRegFeatures();
        this.defineRegMarkers();
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
        var parent = this.element.attr('id');
        return parent+'_'+this.idNotification+this.counterNotification;  
    },
    getIdNotification : function(){
        var parent = this.element.attr('id');
        return parent+'_'+this.idNotification+this.counterNotification;  
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
        var parent = this.element.attr('id');
        this.appendBaseNotification();
        var params = arguments[0];
        var chain = this.buildNotification(params);
        this.appendToNotification(this.idBaseNotification,chain);
        var notification = new this.Notification();
        notification.id = this.getIdNotification();
        $("#"+parent+" #close_"+this.getIdNotification()).click(function(){
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
        return (this.options.Layers["'"+name+"'"])?this.options.Layers["'"+name+"'"]:null;
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
        var newLayer = this.getLayer(p.layer);
        var force = (p.forceRefresh)?p.forceRefresh:true;
        var sameInformation=false;
        if(newLayer){
            var status = true;
	    if(!force){
            sameInformation = this.equalParams(p.params,newLayer.params);
	    }
        if(p.params.layers!=''){
                if((!force)&&(!sameInformation)||(force)){
                    p.params['firm'] = ""+ Math.floor(Math.random()*11) + (Math.floor(Math.random()*101));
                    var bandera = true;
                    if(newLayer.typeService){
                        if(newLayer.typeService=='TMS'){
                            if(p.params.format){
                                var f = p.params.format.split('/');
                                newLayer.options.format=p.params.format;
                                newLayer.options.type=f[1];
                                newLayer.type=f[1];
                                newLayer.format=p.params.format;
                                }
                                if(p.params.layers){
                                newLayer.options.layers=p.params.layers;
                                newLayer.layers=p.params.layers;
                            }
                        }
                        if(newLayer.typeService=='WFS'){
                            newLayer.protocol.setFeatureType(p.params.layers); 
                            newLayer.refresh({featureType: p.params.layers,force: true});
                        }
                    
                    }
                    if(newLayer.typeService!='WFS'){
                        newLayer.mergeNewParams(p.params);
                    }
                }
            }else{
                status=false;
            }
            newLayer.setVisibility(status);
        }
    },
    /***************************/
    isExplorer:function(){
	    var response = false;
    
	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf("MSIE ");
    
	    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		response=true;
	    }
    
	    return response;
    },
    buildMirrorMarker : function(){
        var obj = this;
        var newFeatures=[];
        for(var x in obj.options.Markers.features){
            var feature = obj.options.Markers.features[x];
            var f = feature.clone();
            newFeatures.push(f);
        }
        obj.MarkersMirror.destroyFeatures();
        obj.MarkersMirror.addFeatures(newFeatures)
        obj.options.Markers.setVisibility(false);
        obj.MarkersMirror.setVisibility(true);
    },
    clearMirrorMarker : function(){
        var obj = this;
        obj.options.Markers.setVisibility(true);
        obj.MarkersMirror.setVisibility(false);
    },
    enableExportMap : true,
    exportNotification:null,
    exportMap : function(format,aditionals){
        var obj = this;
        var id = this.element.attr('id');
        var hideDetailCluster = false;
        if(obj.enableExportMap){
            obj.buildMirrorMarker();
            //mirrorCluster(); 
            obj.enableExportMap=false;
            var element = (aditionals)?$("#"+id+" .olMapViewport"):$('#'+id+' .olMapViewport');
            //element.css({width:element.width()+'px',height:element.height()+'px'});
            var items = $("#"+id+" #mdm6DinamicPanel,#mdm6Layers,#scaleControl,#baseMapMini,#mdmToolBar,.section_share,.more_info,.popup_close,#menu_mapDownload,#mdm6Layers_v_container,#background_nodes,#nodos,#floatingLegend");
            if(obj.exportNotification==null){
            if ((typeof aditionals != 'undefined')&&(aditionals!=null)){
                //obj.exportNotification = obj.showNotification({message: 'Exportando mapa...'});
            }else{
                //obj.exportNotification = obj.showNotification({message: 'Exportando mapa...'});
            }
            
            }else{
                obj.exportNotification.show();
            }
                                
                items.css({display:'none'});
                var ie = obj.isExplorer();
                html2canvas(element, {
                "proxy":obj.options.proxy,
                //allowTaint:true,
                height:element.height(),
                width:element.width(),
                //useCORS:true,
                //"logging": true, //Enable log (use Web Console for get Errors and Warnings)
                onrendered: function (canvas) {
                    if ((typeof aditionals != 'undefined')&&(aditionals!=null)){
                        var imgData = canvas.toDataURL('image/'+format,1.0);
                        //window.open(imgData);
                        aditionals.event(imgData);
                        
                    }else{
                        if(format=='pdf'){
                            var widthMap = parseFloat($("#"+id+" .olMapViewport").width());
                            var heightMap = parseFloat($("#"+id+" .olMapViewport").height());
                            var altoNew = (28*heightMap)/widthMap;
                            
                            var imgData = canvas.toDataURL('image/png',1.0);
                            var doc = new jsPDF('l','cm','letter');
                            doc.addImage(imgData, 'PNG',0,0, 28,altoNew);
                            doc.save('mdm.pdf');
                        }else{
                
                            var img = $('<img>'); //Equivalent: $(document.createElement('img'))
                            img.attr('src', canvas.toDataURL("image/"+format,1.0));
                            
                            var src = img.attr('src');
                            
                            if(!ie){
                                var a = $("<a>")
                                .attr("href", src)
                                .attr("download", "mdm."+format)
                                .appendTo("body");
                                a[0].click();
                                a.remove();
                            }
                        }
                        
                        if((ie)&&(format!='pdf')){
                         modalImage.show();
                        $("#"+id+" #imageDownload").attr('src',"");
                        $("#"+id+" #imageDownload").attr('src',canvas.toDataURL("image/"+format,1.0));
                        }
                    }   
                        //obj.exportNotification.hide();
                        obj.enableExportMap=true;
                        //alert("fin imagen");
                        
                }
                });
                
            items.css({display:''});
            if(hideDetailCluster){
                $("#"+id+" #detailCluster").show();
            }
            obj.clearMirrorMarker();
            //clearMirrorCluster();
        }else{
            obj.showNotification({message:'Actualmente esta generando una descarga espere hasta que finalize',time:3000});	
        }
    },
    getCdata : function(params){
        if (params) {
            var chain = '<![CDATA[';
            for(var x in params){
                var i = params[x];
                var label = i.label.split(' ').join('_');
                var value = i.value;
                chain+=(label+'='+value+'<BR>');
            }
            chain+=']]>';
        }else{
            var chain = '';
        }
        return chain;
    },
    getMarkers : function(a,type){
        var obj = this;
        var source = obj.getSourceMarker('all',type);
        for(x in source){
            var item = (source[x].id)?source[x].id:x;
            var feature = obj.options.dataMarker.reg.data[item];
            var elemento = feature.clone();
            var attributes = elemento.attributes;
            attributes.nom ='';
            //var elemento = $.extend(true,{},Data.reg.data[item]);
            var Name = '';
            var Description='';
            if (attributes.dataProvider) {
                Name = attributes.dataProvider[0].value;
                Name = obj.removeAcute(Name);
            }else{
                Name = 'Proveedor';
            }
            attributes['name']=Name;
            var data = null;
            if (attributes.dataProvider) {
                data= $.extend([], attributes.dataProvider);
                data.shift();
                data.pop();
            }
            attributes['description'] = (attributes.dataProvider)?obj.getCdata(data): Description;
            a.push(elemento);
        }
        return a;
    },
    getFeatures : function(params){
        var obj = this;
        var features = [];
        if (params.addMarkers) {
            features =  obj.getMarkers(features,'identify');
            features =  obj.getMarkers(features,'search');
            //features =  obj.getMarkers(features,'georeference')
        }

        for(var x in this.options.Features.features){
                var feature = this.options.Features.features[x];
                if (params.id==feature.custom.db) {
                    var f = feature.clone();
                    //f.attributes.name = f.attributes.name.replace(/[\u00C1]/gi,'&Aacute;');
                    f.attributes.description = obj.getCdata(params.data);
                    features.push(f);
                    break;
                }
        }
        if (params.additionalFeatures) {
            features = features.concat(params.additionalFeatures);
        }
        return features;
    },
    removeAcute : function(chain){
		
		chain = chain.replace(/&aacute;/gi,'a');
		chain = chain.replace(/&eacute;/gi,'e');
		chain = chain.replace(/&iacute;/gi,'i');
		chain = chain.replace(/&oacute;/gi,'o');
		chain = chain.replace(/&uacute;/gi,'u');
		chain = chain.replace(/&ntilde;/gi,'n');
		
		chain = chain.replace(/&Aacute;/gi,'A');
		chain = chain.replace(/&Eacute;/gi,'E');
		chain = chain.replace(/&Iacute;/gi,'I');
		chain = chain.replace(/&Oacute;/gi,'O');
		chain = chain.replace(/&Uacute;/gi,'U');
		chain = chain.replace(/&Ntilde;/gi,'N');
		
		return chain;
    },
    convertToHtml : function(texto){
		texto = (texto)?texto:'';
		var ta=document.createElement("textarea");
		ta.innerHTML=texto.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		return ta.value;
    },
    getKmlFormat : function(params){
            var obj = this;
            var mapProjection = 'EPSG:900913';
            var displayProjection = 'EPSG:4326';
            var Format = null;
            var Features = obj.getFeatures(params);
            if(Features.length>0){
                
                for(x in Features){
                    var f = Features[x]; 
                    f.geometry = f.geometry.transform(mapProjection,displayProjection);
                    if(f.attributes.type=='search'){f.attributes.desc='';}
                }
                
                var format = new OpenLayers.Format.KML({
                        'foldersName':"OVIE",
                        'foldersDesc':'Georeferencias generadas',
                        'maxDepth':10,
                        'extractAttributes':true
                });
                Format = format.write(Features);
            }
            var response = (obj.convertToHtml(Format));
            return response;
            //return response.replace("&Aacute;","\u00C1");
    },
    getKml : function(params){
        var obj = this;
        var Format = obj.getKmlFormat(params);
        var c = obj.options.geometry.Export;
        var url = c.url;
        if (Format) {
                var id = "kmlDownload";
                var idTa = 'kmlfile';
                var chain = '<form id="'+id+'" action="" method="'+c.type+'" enctype="multipart/form-data" style="display:none">'+
                                '<textarea id="I'+idTa+'" name="file" rows="1" cols="1"></textarea>'+
                                '<input type="submit" value="Submit">'+
                            '</form>';
                $("#"+id).remove();
                $("body").append(chain);
                var textArea = $("#I"+idTa);
                var Form = $("#"+id);
                textArea.val(Format);
                Form.attr('action',url);
                Form.submit();
                Form.attr('action','');
        }else{
            Materialize.toast('No hay georreferencias disponibles', 4000);
        }
    },
    reinsertFeatures:function(features){
        var obj = this;
        while (obj.options.Features.features.length>0) {
            var feature = obj.getLastFeature();
            obj.actionFeature({action:'delete',id:feature.id});
        }
        for(var x in features){
            var f = features[x];
            obj.addGoemetry(f.wkt,f.db);
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
            case "features":
                    obj.reinsertFeatures(value);
                    obj.options.map.updateSize();
                break;
            case 'title':
                    obj.options.title = value;
                    obj.addTitle();
                break;
            case 'change':
                    obj.options.change = value;
                    obj.addTitleChange();
                    obj.eventChange();
                break;
    
        }
    },
    Popup:null,
    definePopup:function(){
        var Obj=this;
        this.Popup = {
            id:'PopupOL',
            root:this.element.attr('id'),
            counter:0,
            created:false,
            visible:false,
            timer:null,
            clock:null,
            viewOrder:['top','bottom','left','right'],
            actualSide:null,
            maxValues:{
                top:120,
                left:50,
                right:50,
                bottom:10
            },
            limits:{},
            deactivateFeatureSelected:null,
            defineTimer:function(event){
                var obj = Obj.Popup;
                if(obj.clock){
                    obj.clock.clear();
                }
                obj.clock=null;
                obj.clock = Obj.newTimer(obj.timer,event,true,true);
                obj.clock.execute();
            },
            defineLimits:function(){
                var obj = Obj.Popup;
                var m = obj.maxValues;
                var e = $("#"+obj.root);
                var w = e.width();
                var h = e.height();
                for(x in m){
                    var max = m[x];
                    obj.limits[x];
                    switch(x){
                        case 'top':
                            obj.limits[x]=max;
                            break;
                        case 'bottom':
                            obj.limits[x]= h-max;
                            break;
                        case 'left':
                            obj.limits[x]= max;
                            break;
                        case 'right':
                            obj.limits[x]=w-max;
                            break;
                    }
                }
            },
            add:function(id,title,text){
                var obj = Obj.Popup;
                obj.counter+=1;
                var idItem ="Popup_dinamic"+obj.counter;
                $("#"+obj.root+" #"+obj.root).append(obj.getChain(idItem));
                if(title){
                    $("#"+obj.root+" #"+idItem+' .titleOL').html(title);
                }
                if(text){
                    $("#"+obj.root+" #"+idItem+' .contOL').html(text);
                }
                $("#"+obj.root+" #"+id).mouseenter(function(){
                    var e = $(this);
                    var top =e.offset().top;
                    top-=40;
                    var left=e.offset().left;
                    obj.hideAllSides(idItem);
                    obj.showPermitedSide({x:left,y:top},idItem);
                    obj.setPosition({x:left,y:top},'point',idItem);
                    $("#"+obj.root+" #"+idItem).fadeIn();
                });
                $("#"+obj.root+" #"+id).mouseleave(function(){
                    $("#"+obj.root+" #"+idItem).fadeOut();
                });
                
            },
            show:function(){
                var obj = Obj.Popup;
                var a = arguments[0];
                var feature = arguments[1];
                if(!a.prev.custom){
                    if(!obj.created){
                        $("#"+obj.root).append(obj.getChain(obj.id));
                        obj.created=true;
                        $("#"+obj.root+" #PopupOL .close").click(function(){
                            obj.deactivateFeatureSelected();
                            obj.effect('hide');
                        });
                    }
                    if(!obj.visible){
                        obj.hideAllSides(obj.id);
                        obj.showPermitedSide(a.px,obj.id);
                    }
                }
                obj.setData(a,obj.id,feature);
                obj.setPosition(a.px,a.item,obj.id);
                 if(!(typeof(a.prev) == 'object')){
                    obj.effect('show');
                }else{
                    if (a.prev.custom) {
                        $("#"+obj.id).hide();
                    }else{
                        if(a.prev.tabla.indexOf('denue')==-1){
                            obj.effect('show');
                        }else{
                            $("#"+obj.root+" #"+obj.id).hide();
                        }
                    }
                    
                }
            },
            hide:function(){//modificado
                
                var obj = Obj.Popup;
                obj.effect('hide');
                if(obj.clock){
                    obj.clock.clear();
                }
            },
            showPermitedSide:function(){
                var obj= Obj.Popup;
                var a = arguments[0];
                var id = arguments[1];
                var side = 'left';
                var order = obj.viewOrder;
                var limit = obj.limits;
                for(x in order){
                    var opc = order[x];
                    var coord = ((opc=='top')||(opc=='bottom'))?a.y:a.x;
                    var inlimits = ((a.x>=limit.left)&&(a.x<=limit.right))?true:false;
                    if(opc=='top'){
                        if((coord>=limit[opc])&&(inlimits)){
                            side='bottom';
                            break;
                        }
                    }
                    if(opc=='bottom'){
                        if((coord<=limit[opc])&&(inlimits)){
                            side='top';
                            break;
                        }
                    }
                    if(opc=='left'){
                        if(coord>=limit[opc]){
                            side='right';
                            break;
                        }
                    }
                }
                $("#"+obj.root+" #"+id).addClass('PopupElement ' + side);
                obj.actualSide=side;
            },
            
            hideAllSides:function(id){
                var obj = this;
                $("#"+obj.root+" #"+id).removeAttr('class');
            },
            setPosition:function(){
                var obj = Obj.Popup;
                var type = arguments[1];
                var p = arguments[0];
                var id = arguments[2];
                //var item = $("#"+obj.id);
                var item = $("#"+obj.root+" #"+id);
                var np = obj.getPopupPosition(p,type);
                item.css({top:np.y+'px',left:np.x+'px'});
            },
            getAditionalPixels:function(type,w,h){
                var a = arguments[0];
                 pixels = {top:{/*w:10,*/h:10},bottom:{/*w:25,*/h:70},left:{w:10,h:20},right:{w:70,h:20}};
                if(a=='point'){
                    var pixels = {top:{/*w:0,*/h:(h>50)?-38:-15},bottom:{/*w:35,*/h:108},left:{w:20,h:(h>50)?15:53},right:{w:80,h:(h>50)?15:53}};
                }
                return pixels;
            },
            getPopupPosition:function(){ 
                var obj = Obj.Popup;
                var type = arguments[1];
                var p = arguments[0];
                var item = $("#"+obj.root+" #"+obj.id);
                var w = item.width();
                var h = item.height();
                var opc = obj.actualSide;
                var px = obj.getAditionalPixels(type,w,h);
                switch(opc){
                        case 'top':
                            //w=w/2;
                            h=h/2;
                            //p.x-=(w+px[opc].w);
                            p.x-=(w-28);
                            p.y+=(h+px[opc].h);
                            break;
                        case 'bottom'://top
                            w=w/2;
                            //p.x-=(w+px[opc].w);
                            p.x-=62;
                            p.y-=(h+px[opc].h);
                            break;
                        case 'left':
                             h=h/2;
                             p.x+=px[opc].w;
                             p.y-=(h+px[opc].h);
                             break;
                        case 'right':
                            h=h/2;
                            p.x-=(w+px[opc].w);
                            p.y-=(h+px[opc].h);
                            break;
                }
                return p;
            },
            getChain:function(id){
                var chain = '<div id="'+id+'" style="position:absolute;z-index:2000;" class="triangle-border">'+
                                        '<div align="center" class="titleOL"></div>'+
                                        '<div align="center" class="contOL"></div>'+
                                        '<span class="close dinamicPanel-sprite dinamicPanel-close-short"></span>'+
                            '</div>';
                return chain;
            },
            getExtent:function(){
                return this.options.map.getExtent();
            },
            setData:function(){
                var obj = this;
                var a = arguments[0];
                var id = arguments[1];
                var feature = arguments[2];
                $("#"+obj.root+" #"+id+" .contOL").html('');
                $("#"+obj.root+" #"+id+" .titleOL").html('').html(a.title);
                //$("#"+this.id+" .contOL").html('');
                //$("#"+this.id+" .titleOL").html('').html(a.title);
                if(typeof(a.prev) == 'object'){
                    if (a.prev.custom) {
                        if (a.event) {
                            var evento = a.event;
                        }else{
                            var evento = function(){};
                        }
                        var eventoPanning = function(lon,lat){
                            var newCenter = new OpenLayers.LonLat(lon,lat);
                            var newBounds = Obj.options.map.calculateBounds(newCenter);
                            var sections = 5;
                            var decrementx =  (((newBounds.left*-1)-(newCenter.lon*-1))/sections);
                            var decrementy = (((newBounds.top-newCenter.lat)/sections));
                            
                            var lonlat = new OpenLayers.LonLat(newBounds.left+decrementx,newBounds.top-decrementy);
                            Obj.options.map.panTo(lonlat);
                        }
                        var eventoGetPx = function(lon,lat){
                            var newCenter = new OpenLayers.LonLat(lon,lat);
                            return Obj.options.map.getPixelFromLonLat(newCenter);
                        }
                        $("#"+obj.root).popup({root:obj.root,xy:a.px,lon:feature.geometry.x,lat:feature.geometry.y,title:a.title,text:a.prev.custom,btnClose:true,showOn:'now',item:a.element,event:evento,eventPanning:eventoPanning,eventGetPxFronLonlat:eventoGetPx});
                     }else{
                        if(a.prev.tabla.indexOf('denue')!=-1){
                               var lonlat = MDM6('getLonLatFromPrixel',a.px);
                               Cluster.showRecordCard({id:a.prev.id,lonlat:lonlat,xy:{x:a.px.x,y:a.px.y}});
                        }else{
                               $("#"+obj.root+" #"+id+" .contOL").html(a.prev.busqueda);
                        }
                     }
                    
                }else{
                    $("#"+obj.root+" #"+id+" .contOL").html(a.prev);
                }
                if(a.icons){
                    var icons = '<div style="height:20px;width:160px">';
                    for(x in a.icons){
                        icons+='<div class="popupIcon"><div style="float:left" class="'+a.icons[x].clase+'"></div><div style="padding-right: 10px;padding-left: 2px;" class="dinamicPanel-searchLink">'+a.icons[x].label+'</div></div>';
                    }
                    icons+= '</div>';
                    $("#"+obj.root+" #"+id+" .contOL").append(icons);
                    
                    $(".popupIcon .dinamicPanel-gallery-short").parent().unbind( "click" );
                    $(".popupIcon .dinamicPanel-gallery-short").parent().click(function(){
                        a.icons[0].func();
                    });
                    $(".popupIcon .dinamicPanel-add-short").parent().unbind( "click" );
                    $(".popupIcon .dinamicPanel-add-short").parent().click(function(){
                        a.icons[1].func();
                    });
                }
            },
            effect:function(){
                var obj = Obj.Popup;
                var a = arguments[0];
                var e = $("#"+obj.root+" #"+obj.id);
                if(e){
                    if(a=='show'){
                        if(!obj.visible){
                            e.fadeIn();
                        }
                        this.visible=true;
                        
                    }else{
                        e.fadeOut();
                        obj.visible=false;
                    }
                }
            }
        };
    },
    /*
   
    return{
        add:Popup.add,
        set:Popup.setData,//{title:'',prev:''}
        show:Popup.show,
        clear:Popup.hide,
        resetLimits:Popup.defineLimits,
        defineTimer:Popup.defineTimer,
        timer:Popup.timer,
        setEvent:function(evento){
            Popup.deactivateFeatureSelected= evento;
        }
    }
    */
    Timer:null,
    defineTimer:function(){
        var obj=this;
        this.Timer=function(){
            var a = arguments[0];
            this.active = ((a[3]==undefined)||(a[3]==null))?true:a[3];
            this.valuation = a[2] || true;        
            this.time = a[0] || 100;
            this.funcion = a[1];
            this.setTime = function(totalTime){
                this.time = totalTime;
            };
            this.clear = function(){
                clearTimeout(this.timer);
            };
            this.activate = function(){
                    this.active = true;
            };
            this.deactivate = function(){
                    this.active = false;
            };
            this.timer = null
            this.execute = function(){
                var obj = this;
                if(obj.active){
                    if(obj.timer!=null){
                        obj.clear();
                    }
                    obj.timer = setTimeout(function(){
                        obj.funcion();
                    },obj.time);
                }
            };
        }
    },
    newTimer:function(){
        return new this.Timer(arguments);
    }
    
});

$.widget( "custom.popup", {
                data : {
                    div:{
                        id:'',//id,
                        height:0,
                        width:0
                    },
                    popup:{
                        id:'',//id+'_popup',
                        width:0,
                        height:0,
                        corner:'',
                        top:0,
                        left:0,
                        created:false
                    },
                    limits:{
                        top:0,
                        left:0,
                        right:0,
                        bottom:0
                    },
                    padding:{
                        top:17,
                        left:17,
                        right:17,
                        bottom:17
                    }
                },
                options:{
                    viewOrder:['top-left','top-right','bottom-left','bottom-right','left-top','left-bottom','right-top','right-bottom'],
                    timer:null,
                    clock:null,
                    showOn:null,
                    title:'Titulo',
                    text:'Sin contenido',
                    type:'cloud',
                    root:'map',
                    lon:null,
                    lat:null,
                    event:$.noop,
                    eventPanning:$.noop,
                    eventGetPxFronLonlat:$.noop,
                    xy:null,
                    btnClose:false,
                    events:{
                        onMouseOver:$.noop,
                        onMouseOut:$.noop
                    },
                    item:null
                },
                setValues : function(){
                    var settings = this.options
                    var popup = this.data.popup;
                    var body = $("#"+settings.root);
                    var div = this.data.div;
                    var limits = this.data.limits;
                    var p =$("#"+this.element.attr('id')+'_popup');
                    var d=this.element;
                    //popup.left = settings.xy.x;
                    //popup.top = settings.xy.y;
                    popup.left = (settings.xy!=null)? settings.xy.x:d.offset().left+(d.width()/2);
                    popup.top =(settings.xy!=null)?settings.xy.y:(d.offset().top)-47;
                    popup.height = p.height();
                    popup.width = p.width();
                    div.height = p.height();
                    div.width=p.width();
                    limits.top = 0;
                    limits.left= 0;
                    limits.right = body.width();
                    limits.bottom= body.height()-26;
                    
                },
                hideAllSides:function(){
                    $("#"+this.element.attr('id')+'_popup').removeAttr('class');
                },
                isInCoordenates:function(b){
                    var a = $.extend({}, b);
                    /*
                    a.left+=40;
                    a.right+=40;
                    a.bottom+=40;
                    a.top+=40;
                    */
                    var limits = this.data.limits;
                    var result = false;
                    if((a.left>=limits.left)&&(a.top>=limits.top)&&(a.right<=limits.right)&&(a.bottom<=limits.bottom)){
                        return true;
                    }
                  return result;
                },
                showPermitedSide:function(reposition){
                    var obj = this;
                    var settings = this.options;
                    var popup = this.data.popup;
                    var side=null;
                    var order = settings.viewOrder;
                    var limit = this.data.limits;
                    var valid = false;
                    var coords={left:0,right:0,top:0,bottom:0};
                    for(var x in order){
                        if (!valid) {
                            switch(order[x]){
                                case 'top-left'://bien
                                    coords={
                                        left:popup.left-60,
                                        right:((popup.left-60)+popup.width)+34,
                                        top:popup.top+20,
                                        bottom:popup.top+popup.height+20
                                    };
                                    $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    
                                    break;
                                case 'top-right'://bien
                                    coords={
                                        left:(popup.left-(popup.width+34))+60,
                                        right:popup.left+60,
                                        top:popup.top+20,
                                        bottom:popup.top+popup.height+20
                                    };
                                    $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    break;
                                case 'bottom-right'://bien
                                    coords={
                                        left:(popup.left-(popup.width+34))+60,
                                        right:popup.left+60,
                                        top:popup.top-((popup.height+50)+20),
                                        bottom:popup.top-20
                                    };
                                    if ((settings.item)&&(settings.item=='point')) {
                                        coords.top-=18;
                                        coords.top-=18;
                                    }
                                    $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    break;
                                case 'bottom-left'://bien
                                    coords={
                                        left:popup.left-60,
                                        right:popup.left+((popup.width+34)-60),
                                        top:popup.top-((popup.height+50)+20),
                                        bottom:popup.top-20
                                    };
                                    if ((settings.item)&&(settings.item=='point')) {
                                        coords.top-=18;
                                        coords.top-=18;
                                    }
                                    $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    break;
                                case 'left-top'://bien
                                    coords={
                                        left:popup.left+15,
                                        right:(popup.left+(popup.width+34))+15,
                                        top:popup.top-35,
                                        bottom:(popup.top-35)+(popup.height+50)
                                    };
                                   $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    break;
                                case 'left-bottom'://bien
                                    coords={
                                        left:popup.left+15,
                                        right:(popup.left+(popup.width+34))+15,
                                        top:(popup.top-(popup.height+50)+35),
                                        bottom:popup.top+35
                                    };
                                   $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    break;
                                case 'right-top'://bien
                                    coords={
                                        left:popup.left-((popup.width+34)+40),
                                        right:popup.left-40,
                                        top:popup.top-35,
                                        bottom:(popup.top-35)+(popup.height+50)
                                    };
                                   $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    break;
                                case 'right-bottom':
                                    coords={
                                        left:popup.left-((popup.width+34)+40),
                                        right:popup.left-40,
                                        top:(popup.top+35)-(popup.height+50),
                                        bottom:popup.top+35
                                    };
                                    $("#area").css({top:coords.top+'px',left:coords.left+'px',height:(popup.height+50)+'px',width:(popup.width+34)+'px',display:'','z-index':50000})
                                    if(this.isInCoordenates(coords)){
                                        valid=true;
                                        side=order[x];
                                    }
                                    break;
                            }
                            
                        }else{
                            break;
                        }
                    }
                    if ((!valid)&&(reposition)) {
                        side=order[order.length-1];
                        valid = true;
                    }
                    if (!valid) {
                        //side=order[order.length-1];
                        settings.eventPanning(settings.lon,settings.lat);
                        setTimeout(function(){
                            obj.options.xy=settings.eventGetPxFronLonlat(settings.lon,settings.lat);
                            obj.updateContent(obj.options.text,true);
                        },2000);
                    }else{
                            $("#"+this.element.attr('id')+'_popup')
                            .addClass('PopupElementItem ' + side)
                            .css({top:coords.top+'px',left:coords.left+'px'});
                            obj.data.popup.corner=side;
                        
                    }
                },
                clearTimer:function(){
                    var settings = this.options;
                    if(settings.clock){
                        clearTimeout(settings.clock);
                    }
                },
                defineTimer:function(){
                   var obj=this; 
                   var settings = this.options;
                   this.clearTimer();
                   settings.clock = null;
                   settings.clock = setTimeout(function(){obj.hide()},4000);
                },
                defineProperties:function(reposition){
                    var settings = this.options;
                    this.setValues();
                    this.hideAllSides();
                    this.showPermitedSide(reposition);
                },
                show:function(){
                    var obj = this;
                    var settings = this.options;
                    var effect ='';
                    var selectedEffect='fade';
                    
                   // var callback = function(){};
                    //$('#'+this.data.popup.id).show( selectedEffect, {}, 0, callback );
                    
                    $("#"+this.element.attr('id')+'_popup').css({display:''});
                    
                    var idItem = this.element.attr('id')+'_popup';
                    if(settings.timer!=null){
                        setTimeout(function(){
                            $('#'+idItem).css({display:'none'});
                        },settings.timer);
                    }
                },
                
                hide : function(){
                    var obj=this;
                    this.clearTimer();
                    var settings = obj.options;
                    $("#"+this.element.attr('id')+'_popup').hide();
                    
                    if(settings.events){
                        if(settings.events.onMouseOut){
                            settings.events.onMouseOut();
                        }
                    }
                },
                buildCloud : function(){
                    var obj = this;
                    var settings = this.options;
                    var id = this.element.attr('id')+'_popup';
                    if($("#"+id).attr('id')){
                    }else{
                        var popup = '<div id="'+id+'" class="'+'triangle-border'+'" style="'+'position:absolute;z-index:4000;'+'">'+
                                        '<div align="center" class="titleOL">'+settings.title+'</div>'+
                                        '<div align="center" class="contOL">'+settings.text+'</div>'+
                                        ((settings.btnClose)?'<div class="popup_close dinamicPanel-sprite dinamicPanel-close-short"></div>':'')+
                                    '</div>';
                        this.data.popup.id=id;
                        $("#"+settings.root).append(popup);
                    }
                },
                
                _init:function(){
                         
                },
                
                updateTitle:function(a){
                    $("#"+this.element.attr('id')+'_popup .titleOL').html(a);
                },
                updateContent:function(a,reposition){
                    //if(!$('#'+this.data.popup.id).is(":visible")){
                        var settings = this.options;
                        //$('#'+this.data.popup.id + ' .contOL').html(a);
                        $("#"+this.element.attr('id')+'_popup .contOL').html(a);
                        this.defineProperties(reposition);
                        this.show();
                        if(settings.event){
                            settings.event();
                        }
                    //}
                    
                    
                },
                
                events:function(){
                    var obj=this;
                    var settings = obj.options;
                    var popup = $("#"+this.element.attr('id')+'_popup');
                     if(settings.showOn){    
                        popup.on({
                            mouseenter:function(){
                                //console.log('entre')
                                //obj.clearTimer();
                            },
                            mouseleave:function(){
                                //console.log('sali')
                                //obj.defineTimer();
                            }
                        });
                    }
                    if(settings.btnClose){
                        var obj = this;
                        $("#"+this.element.attr('id')+'_popup .popup_close').click(function(){
                           obj.hide();
                        });
                    }
                    if(settings.event){
                        settings.event();
                    }
                },
            
                _create: function() {
                    this.buildCloud();
                    this.defineProperties();
                    this.show();
                    this.events();
                },
            
                _refresh: function(){
                  // trigger a callback/event
                  this._trigger( "change" );
                },
               
                _destroy: function() {
                    this.element.remove();
                },
          /*
                _setOptions: function() {
                  this._superApply( arguments );
                  this._refresh();
                },
       */
                _setOption: function(key, value){
                          this.options[key] = value;
                                    switch(key){
                                            case "title":
                                                    
                                                    this.updateTitle(value);
                                                break;
                                            case "text":
                                                    this.updateContent(value);
                                            break;
                                            case "xy":
                                                    this.options.xy = value;
                                                break;
                                                                
                                    }
                          }
                }
    );

//fin de lo que pegué que many me dijo que pegara