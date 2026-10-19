$.widget("custom.results", {
    options: {
		getData:null,
		indicators:null,
		dataSource:null,
		resultType:'area',
		creaPdf:function(){},
        tooltip:null,
        validator:null
	},
	
	   lawis:null,
       dataforKml:[],
       reportData:null,
       //cont:0,
	   createBoxArea:function(data){
	   //console.log(data);   
		var obj = this;
        var kmlData=[];
		/*
		indsoc: 1534.1942
		p15pri_co: 188596
		p15pri_in: 94949
		p15sec_in: 66902
		p15ym_se: 41260
		p18ym_pb: 555334
		p_15a17: 91137
		p_18a60: 1081927
		p_60ymas: 162398
		perocup: 293748
		pl: 694596.5
		pob0_14: 449793
		pobfem: 932779
		pobmas: 879052
		pobtot: 1813726
		reprom: 204116.97
		uetotal: 79699
		vivtot: 506949
		*/
		
		//Indice de desarrollo social
		var valor=(data.indsoc).toFixed(2);
		var indice=parseFloat(valor);
		var color=obj.indSoc(indice);
        
        
        //Distribución por sexo
		var hom=data.pobmas;
		var fem=data.pobfem;
		var total=hom+fem;
		var menPercent=parseFloat(obj.calculaPorcentaje(hom, total));
        //menPercent=menPercent.toFixed(1);
		var womenPercent=parseFloat(obj.calculaPorcentaje(fem, total));
        //womenPercent=womenPercent.toFixed(1);
        
		//Grandes grupos de edad
		var edad1=data.e_0_14;
		var edad2=data.e_15_24;
		var edad3=data.e_25_44;
		var edad4=data.e_45_64;
        var edad5=data.e_65_mas;
		var edadTot=(edad1+edad2+edad3+edad4+edad5);
		
		var child=obj.calculaPorcentaje(edad1, edadTot);
        var teen=obj.calculaPorcentaje(edad2, edadTot);
        var youngAdult=obj.calculaPorcentaje(edad3, edadTot);
        var adult=obj.calculaPorcentaje(edad4, edadTot);
        var old=obj.calculaPorcentaje(edad5, edadTot);
        
		//Nivel de escolaridad
		var grado1=data.pres;
		var grado2=data.prim;
		var grado3=data.secu;
		var grado4=data.bach;
		var grado5=data.univ;
        var grado6=data.posg;
		var escolarTot= grado1+grado2+grado3+grado4+grado5+grado6;
		
		var pres=obj.calculaPorcentaje(grado1, escolarTot);
        var prim=obj.calculaPorcentaje(grado2, escolarTot);
        var secu=obj.calculaPorcentaje(grado3, escolarTot);
        var bach=obj.calculaPorcentaje(grado4, escolarTot);
        var univ=obj.calculaPorcentaje(grado5, escolarTot);
        var posg=obj.calculaPorcentaje(grado6, escolarTot);
       
        //valoresTotales
        var superficie=obj.options.area;
        var pobTot=obj.formatNumber(data.pobtot);
        var vivtot=obj.formatNumber(data.vivtot);
         var uetotal=obj.formatNumber(data.uetotal);
        
		//objeto para kml {
                        kmlData.push({label:"Indice de desarrollo social",value:indice});
                        kmlData.push({label:"Poblaci&oacute;n masculina",value:menPercent});
                        kmlData.push({label:"Poblaci&oacute;n femenina",value:womenPercent});
                        kmlData.push({label:"Grupo de edad ni&ntilde;os",value:child});
                        kmlData.push({label:"Grupo de edad j&oacute;venes",value:teen});
                        kmlData.push({label:"Grupo de edad adultos j&oacute;venes",value:youngAdult});
                        kmlData.push({label:"Grupo de edad adultos",value:adult});
                        kmlData.push({label:"Grupo de edad adultos mayores",value:old});
                        kmlData.push({label:"Prescolar",value:pres});
                        kmlData.push({label:"Primaria",value:prim});
                        kmlData.push({label:"Secundaria",value:secu});
                        kmlData.push({label:"Bachillerato",value:bach});
                        kmlData.push({label:"Universidad",value:univ});
                        kmlData.push({label:"Posgrado",value:posg});
                        kmlData.push({label:"Superficie",value:superficie});
                        kmlData.push({label:"Poblaci&oacute;n total",value:pobTot});
                        kmlData.push({label:"Viviendas totales",value:vivtot});
                        kmlData.push({label:"Unidades econ&oacute;micas",value:uetotal});
                    // }
                    // obj.cont=obj.cont+1;
                     obj.dataforKml=[];
                     obj.dataforKml=kmlData;
        
        //objeto para reporte
                        this.reportData={
                                        superficie:obj.options.area,
                                        pobtot:pobTot,
                                        vivtot:vivtot,
                                        uetotal:uetotal,
                                        indsoc:parseFloat(indice),
                                        pobfem:parseFloat(womenPercent),
                                        pobmas:parseFloat(menPercent),
                                        e_0_14:parseFloat(child),
                                        e_15_24:parseFloat(teen),
                                        e_25_44:parseFloat(youngAdult),
                                        e_45_64:parseFloat(adult),
                                        e_65_mas:parseFloat(old),
                                        pres:parseFloat(pres),
                                        prim:parseFloat(prim),
                                        secu:parseFloat(secu),
                                        bach:parseFloat(bach),
                                        univ:parseFloat(univ),
                                        posg:parseFloat(posg)
                           }
         
          var showRatio='';
        if (obj.options.radio>0) {
            showRatio='block';
            this.reportData.radio=obj.options.validator.getFormatNumber(obj.options.radio)+' mts';
        }else{showRatio='none'}

        var cdmx=false;
		var showIndice='';
		showIndice=(cdmx)?showIndice='block':showIndice='none';

        //console.log(reportData);
         var cadena= '<div class="row bloques-area">'+
				   		'<div class="col s12 m12 l3 valoresTotales" style="margin-bottom:35px">'+
                            '<div class="toolipSquare radio totales" style="display:'+showRatio+'">'+
								'<div class="ovie-results-icon ovieSprite ovieSprite-radio"></div>'+
                                '<div class="ovie-results-title title">Radio de consulta'+
                                    '<div class="ovie-results-data data">'+obj.options.validator.getFormatNumber(obj.options.radio)+' mts</div>'+
                                '</div>'+    
								
							'</div>'+
                           '<div class="toolipSquare superficie totales">'+
								'<div class="ovie-results-icon ovieSprite ovieSprite-superficie"></div>'+
								'<div class="ovie-results-title title" id="ovie-results-surface">Superficie'+
                                    '<div class="ovie-results-data data">'+obj.options.area+'</div>'+
                                '</div>'+
								
							'</div>'+	
							'<div class="toolipSquare pobTotal totales">'+
								'<div class="ovie-results-icon ovieSprite ovieSprite-pobTot"></div>'+
								'<div class="ovie-results-title title">Población total'+
                                    '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="pobTot"></div>'+
                                    '<div class="ovie-results-data data">'+obj.formatNumber(data.pobtot)+'</div>'+
                                '</div>'+
								
							'</div>'+
							'<div class="toolipSquare vivTot totales">'+
								'<div class="ovie-results-icon ovieSprite ovieSprite-vivTot"></div>'+
								'<div class="ovie-results-title title">Viviendas totales'+
                                    '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="vivTot"></div>'+
                                    '<div class="ovie-results-data data">'+obj.formatNumber(data.vivtot)+'</div>'+
                                '</div>'+
								
							'</div>'+
							'<div class="toolipSquare ueTot totales">'+
								'<div class="ovie-results-icon ovieSprite ovieSprite-ueTot"></div>'+
								'<div class="ovie-results-title title">Total de unidades económicas'+
                                    '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="totEco"></div>'+
                                    '<div class="ovie-results-data data">'+obj.formatNumber(data.uetotal)+'</div>'+
                                '</div>'+
								
							'</div>'+
						'</div>'+
						'<div class="col s12 m5 l4 ovie-socioDemo-bloque2">'+
							'<div class="toolipSquare desarrolloSocial-container marked" style="display:'+showIndice+'">'+
                                    '<div class="ovie-results-title desarrolloSocial-title" style="width:100%; text-align:center">Índice de desarrollo social'+
                                         '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="desSoc"></div>'+
                                    '</div>'+
                                    '<center>'+
                                        '<div class="ovie-results-icon ovieSprite ovieSprite-termometro" style="margin-top:20px"></div>'+
                                        '<div class="desarrolloSocial-indice-cont">'+
                                            '<div class="desarrolloSocial-indice" style="color:'+color+'">'+indice+'</div>'+
                                        '</div>'+
                                        '<div class="gradosTermometro-cont">'+
                                            '<div class="gradosTermometro">'+
                                                '<div class="grado4 ovie-results-title">0.75-1.00</div>'+
                                                '<div class="grado3 ovie-results-title" style="margin-top:5px">0.50-0.75</div>'+
                                                '<div class="grado2 ovie-results-title" style="margin-top:4px">0.25-0.50</div>'+
                                                '<div class="grado1 ovie-results-title" style="margin-top:4px">0.00-0.25</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</center>'+
                            '</div>'+
                            '<div class="toolipSquare DistribucionSexos-container" style="margin-bottom: 45px;position:relative;">'+
								'<div class="ovie-results-title ovie-results-sexosTitle">Distribución por sexo'+
                                     '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="distSex"></div>'+
                                '</div>'+
                                
                                    '<div class="sexos-icon-container">'+
                                        '<center>'+   
                                            '<div class="ovie-results-icon ovieSprite ovieSprite-sexos"></div>'+
                                        '</center>'+
                                    '</div>'+
                                '</center>'+
								'<div class="sexos-percentData">'+
									'<div class="sexos-dataContainer"><div class="percentData" style="color: #07B2AE; position:absolute; right:21px">'+menPercent+'%</div></div>'+
									'<div class="sexos-dataContainer"><div class="percentData" style="color: #E2007A; position:absolute; left:28px">'+womenPercent+'%</div></div>'+
								'</div>'+
							'</div>'+
                        '</div>'+
						'<div class="col s12 m7 l5 ovie-socioDemo-bloque3" style="padding:0px !important;">'+
							'<div class="toolipSquare edades-container marked" style="margin-bottom:35px;position:relative;">'+		
								'<div class="ovie-results-title ovie-results-edadTitle">Grandes grupos de edad'+
                                   '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="grupos"></div>'+ 
                                '</div>'+
                               
                                '<center>'+
                                    '<div class="edades-percentData row" style="width:300px">'+
                                        '<div class="col s2 m2 l2 edades-childrenBar edadesData edades-results-title" style="width:20%">Niños</div>'+
                                        '<div class="col s2 m2 l2 edades-teenagerBar edadesData edades-results-title" style="width:20%">J&oacute;venes</div>'+
                                        '<div class="col s2 m2 l2 edades-adultBar edadesData edades-results-title" style="width:20%">Adultos j&oacute;venes</div>'+
                                        '<div class="col s2 m2 l2 edades-oldpeopleBar edadesData edades-results-title" style="width:20%">Adultos</div>'+
                                        '<div class="col s2 m2 l2 edades-oldpeopleBar edadesData edades-results-title" style="width:20%">Adultos mayores</div>'+
                                    '</div>'+
                                    '<center><div class="ovie-results-icon ovieSprite ovieSprite-edades"></div></center>'+
                                    '<div class="edades-percentBar">'+
                                        '<div class="edades-childrenBar gruposBar" style="background-color: #F2906A; width:'+Math.floor(child)+'%"></div>'+
                                        '<div class="edades-teenagerBar gruposBar" style="background-color: #F6A017; width:'+Math.floor(teen)+'%"></div>'+
                                        '<div class="edades-adultBar gruposBar" style="background-color: #897C7A; width:'+Math.floor(youngAdult)+'%"></div>'+
                                        '<div class="edades-oldpeopleBar gruposBar" style="background-color: #009f9e; width:'+Math.floor(adult)+'%"></div>'+
                                        '<div class="edades-oldpeopleBar gruposBar" style="background-color: #F190A9; width:'+Math.floor(old)+'%"></div>'+
                                    '</div>'+
                                    '<div class="edades-percentData row" style="width:300px">'+
                                        '<div class="col s2 m2 l2 childrenBar-data edadesData" style="width:20%">'+child+'%</div>'+
                                        '<div class="col s2 m2 l2 teenagerBar-data edadesData" style="width:20%">'+teen+'%</div>'+
                                        '<div class="col s2 m2 l2 adultBar-data edadesData" style="width:20%">'+youngAdult+'%</div>'+
                                        '<div class="col s2 m2 l2 oldpeopleBar-data edadesData" style="width:20%">'+adult+'%</div>'+
                                        '<div class="col s2 m2 l2 oldpeopleBar-data edadesData" style="width:20%">'+old+'%</div>'+ 
                                    '</div>'+
                                '</center>' +   
                                
                            '</div>'+		
                            
                            '<div class="toolipSquare escolaridad" style="position:relative;">'+
								'<div class="ovie-results-title" style="width:100%; text-align:center; margin-bottom:20px; font-weight:bold">Nivel de escolaridad'+
                                    '<div class="ovie-results-information ovieSprite ovieSprite-igrey" ref="nivEsc"></div>'+ 
                                '</div>'+
								'<center>'+
                                '<div class="school-levelsContainer">'+
                                    '<div class="ovie-results-icon ovieSprite ovieSprite-escolaridad"></div>'+
                                    '<div class="grade-container row" >'+
                                        '<div class="col s2 m2 l2 percentData school-level-Data">'+pres+'%</div>'+
                                        '<div class="col s2 m2 l2 percentData school-level-Data">'+prim+'%</div>'+
                                        '<div class="col s2 m2 l2 percentData school-level-Data">'+secu+'%</div>'+
                                        '<div class="col s2 m2 l2 percentData school-level-Data">'+bach+'%</div>'+
                                        '<div class="col s2 m2 l2 percentData school-level-Data">'+univ+'%</div>'+
                                        '<div class="col s2 m2 l2 percentData school-level-Data">'+posg+'%</div>'+
                                    '</div>'+
                                '</div>'+
                                '</center>'+
								'<div class="icons"></div>'+
								'<div class="percentData"></div>'+	
							'</div>'+
						'</div>'+
				'</div>'+
				/*'<div class="row exportarPDF">'+
					'<a class="waves-effect waves-light btn exportBtn" style="background-color:#E2007A"><i>'+
						'<img src="js/app/widgets/results/pdf.png" style="margin-top:-5px">'+
					'</i><p style="float:right; margin-top:1px">Exportar</p></a>'+
				'</div>'*/
                
                '<div class="fixed-action-btn" style="bottom: 24px; right: 24px;">'+
					'<a class="btn-floating btn-large " style="background:#E2007A">'+
						'<i class="material-icons">'+
							'<img src="js/app/widgets/results/export.png" style="margin-top: 5px;">'+
						'</i>'+
					'</a>'+
					'<ul>'+
						'<li><a class="btn-floating exportKml" style="background:#E2007A"><i class="material-icons"><img src="js/app/widgets/results/kml.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
						'<li><a class="btn-floating exportBtn" style="background:#E2007A"><i class="material-icons"><img src="js/app/widgets/results/pdf.png" style="margin-top:-4px;margin-left:0px;"></i></a></li>'+
					'</ul>'+
				'</div>';
                /*
                '<div class="fixed-action-btn horizontal" style="bottom: 45px; right: 24px;">'+
					'<a class="class="btn-floating btn-large" style="background-color:#E2007A; float:left; ">'+
						'<i><img src="js/app/widgets/results/export.png" style="margin-top:3px"></i>'+
					'</a>'+
					'<ul>'+
						'<li><a class="btn-floating pink  btn exportBtn"><i class="material-icons"><img src="js/app/widgets/results/pdf.png" style="margin-top:-4px; margin-left:0px"></i></a></li>'+
						'<li><a class="btn-floating pink darken-1 btn exportKml"><i class="material-icons"><img src="js/app/widgets/results/kml.png" style="margin-top:-4px; margin-left:0px"></i></a></li>'+
					'</ul>'+
				'</div>'
                */
          
            if (data==null) {
               var message= '<div class="col s12 addGeo-message"><div class="addGeo-message-container card">No hay informaci&oacute;n relacionada</div></div>'; 
               $("#geoArea_results").append(message);
            }else{
                $('#geoArea_results').html(cadena);
                obj.options.endPage();
            }        
	},
    getReportData:function(){
        return this.reportData;  
    },
	createUI:function(){
		var obj = this;
		var getData = obj.options.getData;
		
		getData(obj.options.dataSource,{},function(data){
			
            if ((data.response.success)&&(data)) {
                    data = data.data.indicators;
                    if(obj.options.resultType == 'area'){
                        obj.createBoxArea(data);
                        obj.lawis=data;
                        obj.eventos();
                    }
            }else{
                if(data.response.message){
                    Materialize.toast(data.response.message, 4000);
                }
            }
            
		},null,function(data){
         var cadena="";
          $('#geoArea_results').html(cadena);
         var message= '<div class="col s12 addGeo-message"><div class="addGeo-message-container card">No hay informaci&oacute;n relacionada</div></div>'; 
          $("#geoArea_results").append(message);
        
        });
		//obj.createBoxArea();
		
	},
    
   // extraer 
	extraerDatos:function(){
		var obj=this;
		var data=obj.lawis;
		return data; 
	},
	
	//
	//Indice social
	indSoc:function(valor){
		var obj=this;
		var color="";
		if ((valor>=0)&&(valor<=0.25)){
			color="#BE1621";
		}
		if ((valor>=0.26)&&(valor<=0.50)){
			color="#E6332A"; 
		}
		if ((valor>=0.51)&&(valor<=0.75)){
			color="#F39200"; 
		}
		if ((valor>=0.76)&&(valor<=1)){
			color="#3AA935"; 
		}
		return color;
	},
	
	//Calcular porcentajes con regla de tres
	calculaPorcentaje:function(value, tot){
		var obj=this;
		var porcentaje=((value*100)/tot).toFixed(1);
		return porcentaje;
	},
	
	eventos:function(){
		var obj=this;
		$(".exportBtn").click(function(){
			obj.options.creaPdf();
		});
        
        $(".exportKml").click(function(){
           //var getKmlData=obj.extraerDatos();
           var seleccionado=$("#geoArea_list").areas('getSelected');
           var id=seleccionado.db;
           var data= obj.dataforKml;
           //var data=[{label:'gordis',value:'is'}];
           $('#geoArea_areaMap').mapping('getKml',{id:id,addMarkers:false,data:data}); 
         });
        
        $('#geoadd-container .ovie-results-information').mouseenter(function(){
           var ref= $(this).attr("ref");
           var positions=$(this).offset();
            obj.options.tooltip.show(ref,positions);
        }).mouseleave(function(){
            obj.options.tooltip.runClock();
        })
	},
	
			
	formatNumber:function(nStr){
		var bandera=(parseFloat(nStr)<0)?'*':null;
		if (bandera==null){
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			//alert('antes');
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
    
	// the constructor
    _create: function() {
		var obj = this;
		obj.id = obj.element.attr('id');
        obj.createUI();
	},
	
	
	
	
    // called when created, and later when changing options
    _refresh: function() {
		var obj = this;
        // trigger a callback/event
         obj.createUI();
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
		
		}
    },
	
iconTranslate:function(id){
			var sprites= {
				indsoc:{
					label:'Índice de desarrollo social',
					path:'indsoc',
					sprite:null,
					type:'bar'
				},
				//Escolaridad
				p18ym_pb:{
					label:'Posbásica',
					path:'inddsoc.ym_pb',
					sprite:'sprite-indicators-purple-s',
					sizes:4
				},
				p15sec_co:{
					label:'Sec. comp.',
					path:'inddsoc.sec_co',
					sprite:'sprite-indicators-green-s',
					sizes:4
				},
				p15sec_in:{
					label:'Sec. incomp.',
					path:'inddsoc.sec_in',
					sprite:'sprite-indicators-greenwhite-s',
					sizes:4
				},
				p15pri_co:{
					label:'Prim. comp.',
					path:'inddsoc.pri_co',
					sprite:'sprite-indicators-blue-s',
					sizes:4
				},
				p15pri_in:{
					label:'Prim. incomp.',
					path:'inddsoc.pri_in',
					sprite:'sprite-indicators-bluewhite-s',
					sizes:4
				},
				p15ym_se:{
					label:'Sin educ.',
					path:'inddsoc.sin_edu',
					sprite:'sprite-indicators-black-s',
					sizes:4
				},
				//Grandes grupos de edad
				pob0_14:{
					label:'Personas de 0 a 14 años',
					path:'ggedad.pob0_14',
					sprite:'sprite-indicators-person-age0',
				},
				p_15a17:{
					label:'Personas de 15 a 17 años',
					path:'ggedad.p_15a17',
					sprite:'sprite-indicators-person-age1',
				},
				p_18a60:{
					label:'Personas de 18 a 60 años',
					path:'ggedad.p_18a60',
					sprite:'sprite-indicators-person-age2',
					sizes:4
				},
				p_60ymas:{
					label:'Personas de 60 y más',
					path:'ggedad.p_60ymas',
					sprite:'sprite-indicators-person-age3',
					sizes:4
				},
				//indices Grales de area
				perocup:{
					label:'Personas de 60 y más',
					path:'ggedad.pob0_14',
					sprite:'sprite-indicators-black-s',
					sizes:4
				},
				pl:{
					label:'Productividad Laboral',
					path:'ggedad.pob0_14',
					sprite:'sprite-indicators-black-s',
					sizes:4
				},
				pobtot:{label:'pobtot'},
				vivtot:{label:'vivtot'},
				uetotal:{label:'uetotal'},
				
				pobfem:{label:'pobfem'},
				pobmas:{label:'pobmas'},
				
				
				reprom:{label:'reprom'},
				actpre:{label:'actividad predominante'},
				compeco:{label:'Composición de unidades económicas por sector'},
				specialization:{label:'Especialización definida'},
				totemple:{label:'Total de empleados'},
				uetotal:{label:'Total de unidades económicas'}
			}
	}
});


/*
private float pobfem; // Poblacion femenina
       
       private float pobmas; // Poblacion Masculina
       
       private float indsoc;      //Indice de Desarrollo social
       
       //Escolaridad
       private float p15ym_se; //Poblacion de 15 años o mas sin educacion 
       
       private float p15pri_in;// poblacion mayor de 15 con primaria incompleta
       
       private float p15pri_co;// poblacion mayor de 15 con primaria completa
       
       private float p15sec_in;// poblacion mayor de 15 secundaria incompleta
       
       private float p18ym_pb;//poblacion  mayor de 18 con posgrado
       
       //Grandes grupos de edad
       private float  pob0_14; // personas de 0 a 14 años
       
       private float p_15a17; // personas de 15 a 17 años
       
       private float p_60ymas; //personas de 60 y mas
       
       private float p_18a60; //persoans de 18 a 60 años
       
       
       private float vivtot; //Viviendas totales
       
       private float uetotal; //Total Unidades Economicas
       
       private float pl; //Productividad Laboral
       
       private float pobtot; //poblacion total
       
       private float perocup;//Personal Ocupado
       
       private float reprom;//Remuneracion promedio
*/
