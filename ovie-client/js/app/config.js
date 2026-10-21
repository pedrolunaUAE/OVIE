define(function(){
	return{
		// Territorio de despliegue (extensión del mapa en grados: oeste, sur, este, norte)
		territory:{
			name:'Tepic, Nayarit',
			initialExtent:{lon:[-104.98, 21.42], lat:[-104.82, 21.58]},
			restrictedExtent:{lon:[-105.55, 20.95], lat:[-104.15, 22.15]}
		},
		menu:[
			  {
				id: 'mnu_home',
				label: 'Inicio',
				title: 'Inicio',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-home',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-home-off',
				enabled: true,
				
			}, {
				id: 'mnu_addGeo',
				label: 'Análisis sociodemográfico',
				title: 'Análisis sociodemográfico por área',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-analysis',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-analysis-off',
				enabled: true,
				modal:{
					paragraphs:['Esta herramienta te permitirá conocer mejor el mercado potencial de cualquier territorio de Tepic y Nayarit, a partir de la consulta y descarga de los indicadores más importantes de población, nivel de escolaridad, edad y nivel de desarrollo social.'],
					title:'Análisis sociodemográfico',
					text:'La radiografía social',
					icon:'soc'
				}
			},
			/*
			{
				id: 'mnu_addGeo',
				label: 'Agregar area',
				title: 'Agregar una nueva área',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-addGeo',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-addGeo-off',
				enabled: true
			},*/
			{
				id: 'mnu_vocacion',
				label: 'Análisis económico',
				title: 'Análisis económico',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-market',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-market-off',
				enabled: true,
				modal:{
					paragraphs:['Esta herramienta te permitirá conocer la dinámica económica de cualquier territorio de Tepic y Nayarit, a partir de la consulta y la descarga de indicadores relevantes económicos como: trabajadores, sueldos y salarios, nivel de desarrollo económico y especialización.','También podrás identificar y visualizar en el mapa los negocios dedicados a un giro de interés, para conocer el número y la ubicación de tus competidores potenciales.'],
					title:'Análisis económico',
					text:'La radiografía económica',
					icon:'eco'
				}
			}, {
				id: 'mnu_proveedor',
				label: 'Buscar proveedores',
				title: 'Buscar proveedores para la actividad económica',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-group',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-group-off',
				enabled: true,
				modal:{
					paragraphs:['Esta herramienta te permitirá ubicar los proveedores más cercanos, con tan solo definir la actividad de su negocio, localización y tipo de proveedor que buscas.'],
					title:'Búsqueda de proveedores',
					text:'Proveedores para tu negocio',
					icon:'prov'
				}
			}, {
				id: 'mnu_compare',
				label: 'Comparar &aacute;reas',
				title: 'Comparar áreas previamente creadas',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-swap',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-swap-off',
				enabled: true,
				modal:{
					paragraphs:['Con esta herramienta podrás comparar dos zonas a partir de indicadores sociodemográficos, económicos, información por giro y de contexto urbano, a fin de conocer las ventajas y desventajas que ofrecen los territorios de tu interés en la Ciudad.'],
					title:'Comparador de zona de interés',
					text:'Identifica oportunidades de negocios',
					icon:'com'
				}
			}, {
				id: 'mnu_analisis',
				label: 'Análisis estadístico',
				title: 'Efectuar un análisis estadístico',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-graph',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-graph-off',
				enabled: true
			}, {
				id: 'mnu_share',
				label: 'Compartir',
				title: 'Compartir la información',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-share',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-share-off',
				enabled: true
			},
			{
				id: 'mnu_calculator',
				label: 'Calculadora territorial',
				title: 'Calculadora territorial',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-calculator',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-calculator-off',
				enabled: true,
				modal:{
					paragraphs:['Con esta herramienta podrás descargar datos absolutos, realizar cálculos y crear tus propios indicadores, a partir de variables sociodemográficas, económicas, información por giro y de contexto urbano para cualquier polígono de la ciudad.'],
					title:'Calculadora territorial',
					text:'Un análisis a la medida',
					icon:'cal'
				}
			},
			{
				id: 'mnu_agendar',
				label: 'Agendar cita',
				title: 'Agendar cita',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-agendar',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-agendar-off',
				enabled: true,
				modal:{
					paragraphs:['Con esta herramienta podrás agendar una cita en nuestras oficinas, donde un(a) asesor(a) te dará orientación personalizada sobre la información que requieres según las necesidades planteadas, los indicadores disponibles y la interpretación de esta información para cualquier área o giro de tu interés en la Ciudad.'],
					title:'Agendar',
					text:'Agenda una cita',
					icon:'agen'
				}
			},
		    {
				id: 'mnu_inmobiliaria',
				label: 'Oferta inmobiliaria',
				title: 'Oferta inmobiliaria',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-inmobiliaria',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-inmobiliaria-off',
				enabled: true,
				childs:['buscar','registrar','modificar'],
				modal:{
					paragraphs:['En esta sección podrás subir y consultar ofertas inmnobiliarias disponibles para emprender tus negocios'],
					title:'Oferta inmobiliaria',
					text:'Encuentra un inmueble para tu negocio',
					icon:'inmob'
				}
			},
			{
				id: 'mnu_laboral',
				label: 'Oferta laboral',
				title: 'Oferta laboral',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-laboral',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-laboral-off',
				enabled: true,
				modal:{
					paragraphs:['En esta sección podrás subir y consultar ofertas de trabajo en un área de interés específica en Tepic, Nayarit'],
					title:'Oferta laboral',
					text:'Encuentra ofertas de trabajo',
					icon:'lab'
				}
			},
			{
				id: 'mnu_help',
				label: 'Ayuda',
				title: 'Ayuda',
				sprite: 'ovie-sprite-tools ovie-sprite-tools-help',
				inactiveSprite: 'ovie-sprite-tools ovie-sprite-tools-help-off',
				enabled: true
			},
			{
				id:'mnu_quickStart',
				label: 'Guía rápida de uso',
				title: 'Guía rápida de uso',
				sprite: 'img/icons/inicioRapidoGrey.png',
				inactiveSprite: 'img/icons/inicioRapidoBlack.png',
				enabled: true
			}
			
			
		],
		
		var_indic:{
			indsoc:{label:'Indicador Social'},
			p15pri_co:{label:'Principales comercios'}, 
			p15pri_in:{label:'Principales Industrias'},
			p15sec_in:{label:'Secundario Industria'},
			p15ym_se:{label:'p15ym_se'},
			p18ym_pb:{label:'p18ym_pb'},
			p_15a17:{label:'p_15a17'},
			p_18a60:{label:'p_18a60'},
			p_60ymas:{label:'p_60ymas'},
			perocup:{label:'perocup'},
			pl:{label:'pl'},
			pob0_14:{label:'pob0_14'},
			pobfem:{label:'pobfem'},
			pobmas:{label:'pobmas'},
			pobtot:{label:'pobtot'},
			reprom:{label:'reprom'},
			uetotal:{label:'uetotal'},
			vivtot:{label:'vivtot'},
			actpre:{label:'actividad predominante'},
			compeco:{label:'Composición de unidades económicas por sector'},
			specialization:{label:'Especialización definida'},
			totemple:{label:'Total de empleados'},
			uetotal:{label:'Total de unidades económicas'}
			
			
		},
		
		var_estab:[
			{"id": "722513","label":"Antojitos"},
			{"id": "561432","label":"Café internet"},
			{"id": "722515","label":"Cafetería y fuente de soda"},
			{"id": "461121","label":"Carnicería"},
			{"id": "722517","label":"Comida rápida para llevar"},
			{"id": "621211","label":"Consultorio dental "},
			{"id": "621113","label":"Consultorio médico de especialidades"},
			{"id": "812110","label":"Estética"},
			{"id": "464111","label":"Farmacia"},
			{"id": "467111","label":"Ferretería y Tlapalería"},
			{"id": "466312","label":"Florería"},
			{"id": "812210","label":"Lavandería y tintorería"},
			{"id": "461160","label":"Materias primas"},
			{"id": "465311","label":"Papelería"},
			{"id": "461122","label":"Pollería"},
			{"id": "468211","label":"Refaccionaria"},
			{"id": "811499","label":"Reparación de artículos del hogar y personales"},
			{"id": "722511","label":"Restaurantes a la carta y de comida corrida"},
			{"id": "722518","label":"Restaurantes de comida para llevar"},
			{"id": "323119","label":"Servicio de impresión"},
			{"id": "811111","label":"Taller mecánico"},
			{"id": "722514","label":"Taquerías, tortería y similares"},
			{"id": "461110","label":"Tienda de abarrotes"},
			{"id": "467115","label":"Tienda de artículos de limpieza"},
			{"id": "465912","label":"Tienda de regalos"},
			{"id": "463211","label":"Tienda de ropa"},
			{"id": "461130","label":"Tienda de verduras y frutas"},
			{"id": "311830","label":"Tortillería"},
			{"id": "461190","label":"Venta de café, pan, pasteles, botanas, gelatinas y similares"},
			{"id": "463310","label":"Zapatería"},
		],	
		comparation:[
			{
				section: 'Indicadores sociodemográficos',
				indicators: [{
					label: 'Dinámica urbana (empleados por cada 100 habitantes)',
					unit: 'Empleados por cada 100 habitantes',
					id:'dinUrb'
				}, {
					label: 'Grado promedio de escolaridad de la población total',
					unit: 'Años',
					id:'promEsc'
				}, {
					label: 'Indicador de acceso a bienes por hogar (automóvil, computadora e Internet)',
					unit: 'Índice de 0 a 1',
					id:'bienHog'
				}]
			},
			{
				section: 'Indicadores económicos',
				indicators: [{
						label: 'Relación personal administrativo / personal ocupado total',
						unit: 'Porcentaje',
						symbol:'%',
						symbolPosition:'right',
						id:'relPer'
					}, {
						label: 'Índice de desarrollo económico',
						unit: 'Índice de 0 a 1',
						id:'desEco'
					}, {
						label: 'Productividad laboral promedio',
						unit: 'Pesos anuales',
						symbol:'$',
						symbolPosition:'left',
						id:'prodLab'
					}
		
				]
			},
			{
				section: 'Indicadores específicos por giro ',
				indicators: [{
						label: 'Sueldos promedio del personal administrativo del giro',
						unit: 'Pesos mensuales',
						symbol:'$',
						symbolPosition:'left',
						id:'suelAdmvo'
					}, {
						label: 'Sueldos promedio del personal operativo del giro',
						unit: 'Pesos mensuales',
						symbol:'$',
						symbolPosition:'left',
						id:'suelOpe'
					}, {
						label: 'Consumo de energía eléctrica promedio del giro',
						unit: 'Pesos mensuales',
						symbol:'$',
						symbolPosition:'left',
						id:'enerEle'
					}, {
						label: 'Consumo de agua promedio del giro',
						unit: 'Pesos mensuales',
						symbol:'$',
						symbolPosition:'left',
						id:'conAgu'
					}, {
						label: 'Ventas promedio del giro ',
						unit: 'Pesos mensuales',
						symbol:'$',
						symbolPosition:'left',
						id:'venProm'
					}, {
						label: 'Valor de los activos fijos promedio',
						unit: 'Pesos anuales',
						symbol:'$',
						symbolPosition:'left',
						id:'actFijos'
					}
		
				]
			},
			{
				section: 'Indicadores de contexto urbano',
				indicators: [{
						label: 'Número de equipamiento urbano y amenidades',
						unit: 'Unidades económicas',
						id:'equiUrb'
					}, {
						label: 'Número de estaciones de transporte público',
						unit: 'Estaciones',
						id:'tranPub'
					}, {
						label: 'Número de estacionamientos',//'Número de estacionamientos en un radio de 500 metros',
						unit: 'Unidades económicas',
						id:'numEst'
					}
		
				]
			}
		],
		questionnaire:{
			labor:[
					{type:'text',label:'Título de oferta',value:'',format:'alphanumeric',required:true,field:'titulo_oferta'},
					{type:'text',label:'Nombre del contacto',value:'',format:'alphanumeric',required:true,field:'nombre_contacto'},
					{type:'text',label:'Teléfono',value:'',format:'phone',required:true,field:'telefono'},
					{type:'text',label:'Correo eléctronico',value:'',format:'email',required:true,field:'correo_electronico'},
					{type:'title',label:'Dirección de la vacante'},
					{type:'text',label:'Calle',value:'',format:'alphanumeric',field:'calle_vacante'},
					{type:'text',label:'No. Exterior',value:'',format:'numeric',field:'no_ext'},
					{type:'text',label:'No. Interior',value:'',format:'alphanumeric',field:'no_int'},
					{type:'text',label:'Colonia',value:'',format:'alphanumeric',field:'colonia'},
					{type:'text',label:'Delegación',value:'',format:'alphanumeric',field:'delegacion'},
					{type:'text',label:'Código postal',value:'',format:'numeric',field:'cp'},
					{type:'select',label:'Categoría',value:'',field:'categoria',items:[{label:'Profesional',value:1},{label:'Técnico',value:2},{label:'Administrativo',value:3},{label:'Ventas',value:4},{label:'Oficios',value:5},{label:'Servicios',value:6},{label:'Industria',value:7}]},
					{type:'text',label:'Vacante',value:'',format:'alphanumeric',field:'vacante'},
					{type:'text',label:'Total de vacantes',value:'',format:'numeric',field:'total_vacantes'},
					{type:'select',label:'Sueldo',value:'',field:'sueldo',items:[{label:'hasta $5,000',value:1},{label:'Hasta $10,000',value:2},{label:'hasta $15,000',value:3},{label:'Hasta $20,000',value:4},{label:'Más de $20,000',value:5},{label:'Otro',value:6}]},
					{type:'textarea',label:'Descripción de actividades',field:'description_actividades',value:'',format:'alphanumeric'},
					{type:'textarea',label:'Perfil esperado del postulante',value:'',format:'alphanumeric',field:'perfil_postulante'},
					{type:'select',label:'Modalidad de contratación',value:'',field:'modalidad',items:[{label:'Tiempo completo',value:1},{label:'Medio tiempo',value:2},{label:'Abierto',value:3},{label:'Otro',value:4}]},
					{type:'text',label:'Tiempo de contratación',value:'',format:'alphanumeric',field:'tiempo_contratacion'},
					{type:'textarea',label:'Requisitos para la entrega',value:'',format:'alphanumeric',field:'requisitos_entrega'},
					{type:'textarea',label:'Contacto',value:'',format:'alphanumeric',field:'contacto'}
			],
			realState:[
					{type:'text',label:'Título de oferta',value:'',format:'alphanumeric',required:true,field:'titulo_oferta'},
					{type:'text',label:'Nombre',value:'',format:'alphanumeric',required:true,field:'nombre'},
					{type:'text',label:'Teléfono',value:'',format:'phone',required:true,field:'telefono'},
					{type:'text',label:'Correo eléctronico',value:'',format:'email',required:true,field:'correo_electronico'},
					{type:'title',label:'Dirección del inmueble'},
					{type:'text',label:'Calle',value:'',format:'alphanumeric',field:'calle_inmueble'},
					{type:'text',label:'No. Exterior',value:'',format:'numeric',field:'no_ext'},
					{type:'text',label:'No. Interior',value:'',format:'alphanumeric',field:'no_int'},
					{type:'text',label:'Colonia',value:'',format:'alphanumeric',field:'colonia'},
					{type:'text',label:'Delegación',value:'',format:'alphanumeric',field:'delegacion'},
					{type:'text',label:'Código postal',value:'',format:'numeric',field:'cp',sendFormat:'numeric'},
					{type:'file',label:'Subir fotos',value:'',field:'rutas',items:[
						{label:'Foto1',value:''},{label:'Foto2',value:''},{label:'Foto3',value:''},{label:'Foto4',value:''},{label:'Foto5',value:''}]
					},
					{type:'radio',label:'Tipo de inmueble',value:'',field:'tipo_inmueble',sendFormat:'numeric',items:[
						{label:'Local',value:1},{label:'Bodega',value:2},{label:'Oficina',value:3},{label:'Edificio',value:4},{label:'Casa con uso de suelo que permita actividad economica',value:5}]
					},
					{type:'text',label:'Superficie',value:'',format:'numeric',field:'superficie_metros2',sendFormat:'numeric'},
					{type:'checkbox',label:'Servicios con los que cuenta',value:'',field:'servicios',required:true,items:[
						{label:'Luz Electrica',value:1},{label:'Gas Natural',value:2},{label:'Seguridad/Vigilancia',value:3},{label:'Aire Acondicionado',value:4},{label:'Estacionamiento',value:5},{label:'Baños',value:6},{label:'Agua potable',value:7},{label:'Internet',value:8},{label:'Telefono',value:9},{label:'Recepcion',value:10},{label:'Ascensor',value:11}]
					},
					{type:'radio',label:'Modalidad de oferta',value:'',field:'modalidad_oferta',sendFormat:'numeric',items:[
						{label:'Renta',value:1},{label:'Venta',value:2}]
					},
					{type:'title',label:'Valor'},
					{type:'text',label:'',value:'',format:'real',field:'valor', sendFormat:'real'},
					{type:'radio',label:'',value:'', sendFormat:'numeric',field:'tipo_valor',items:[
						{label:'Total',value:1},{label:'M<sup>2</sup>',value:2}]
					},
					{type:'textarea',label:'Observaciones',value:'',format:'alphanumeric',field:'observaciones'}
			],
			registrar:[
						{type:'text',label:'Nombre de usuario',value:'',format:'alphanumeric',required:true,field:'alias'},
						{type:'text',label:'Password',value:'',format:'alphanumeric',required:true,field:'password'},
						{type:'text',label:'Nombre',value:'',format:'alphanumeric',required:true,field:'nombre'},
						{type:'text',label:'Apellido',value:'',format:'alphanumeric',required:true,field:'apellido'},
						{type:'text',label:'Correo electrónico',value:'',format:'email',required:true,field:'correo_electronico'},
						{type:'text',label:'Teléfono',value:'',format:'phone',required:true,field:'telefono'},
						{type:'text',label:'Calle',value:'',format:'alphanumeric',required:true,field:'calle'},
						{type:'text',label:'Número',value:'',format:'numeric',required:true,field:'numero'},
						{type:'text',label:'Colonia',value:'',format:'alphanumeric',required:true,field:'colonia'},
						{type:'text',label:'C.P.',value:'',format:'numeric',required:true,field:'cp'},
						{type:'text',label:'Delegación',value:'',format:'alphanumeric',required:true,field:'delegacion'}
		    ]
			
		},
		dataSource:{
			server:'/ovie/',
			// Índice Solr de INEGI orientado a CDMX; hasta tener shard Nayarit, la búsqueda por nombre puede no cubrir Tepic.
			searchAreas:{
							url:'https://gaia.inegi.org.mx/mdmSearchEngine/busq-oviemun/shardovie',
							type: 'POST',
							dataType: "jsonp",
							jsonp:'json.wrf',
							stringify:false,
							params:{ //Params----------------------
								q:'',
								wt:'json',
								indent:true,
								field:'busqueda',
								facet:true,
								'facet.field':'tipo',
								rows:50
							}
			},
			searchAct:{
							url:'http://gaiamapas.inegi.org.mx/mdmSearchEngine/busq-oviescian/select?',
							//url:'http://10.1.30.101:9090/solr/busq-oviescian/select?',
							type: 'POST',
							dataType: "jsonp",
							jsonp:'json.wrf',
							stringify:false,
							params:{ //Params----------------------
								q:'',
								wt:'json',
								indent:true,
								field:'nombre'
							}
			},
			indicators:{
                    url:'indicators',
					contentType : "application/json; charset=utf-8",
                    type: 'POST',
                    dataType: "json",
					stringify:true
			},
			vocIndicators:{
                    url:'economic/vocation/indicators',
					contentType : "application/json; charset=utf-8",
                    type: 'POST',
                    dataType: "json",
					stringify:true
			},
			listActEco:{
                    url:'scian/info',
					contentType : "application/json; charset=utf-8",
                    type: 'GET',
                    dataType: "json",
					stringify:true
			},
			
			//se crea para los servicios de agenda karlita
			appointment:{
					type: 'POST',
                    url:'appointment',
					contentType : "application/json;charset=UTF-8",
                    dataType: "json",
					cache: false, 
					stringify:true
			},
			providers:{
					catalog:{
						url:'providers/catalog',
						contentType : "application/json; charset=utf-8",
						type: 'POST',
						dataType: "json",
						stringify:true
					},
					search:{
						url:'providers/search',
						contentType : "application/json; charset=utf-8",
						type: 'POST',
						dataType: "json",
						stringify:true
					}
			},
			comparation:{
					url:'compare/area/',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json"
			},
			calculator:{
					url:'calculator/',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
			},
			questionnaire:{
				labor:{
					save:{
						url:'/ovie/laboral',
						contentType : "application/json; charset=utf-8",
						type: 'POST',
						dataType: "json",
						stringify:true
					},
					get:{
						url:'/ovie/laboral',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:false
					}
				},
				realState:{
					save:{
						url:'/ovie/inmobiliaria',
						contentType : "application/json; charset=utf-8",
						type: 'POST',
						dataType: "json",
						stringify:true
					},
					get:{
						url:'/ovie/inmobiliaria',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:false
					},
					upload:{
						url:'/ovie/fotosinmobiliaria',
						contentType : "application/json; charset=utf-8",
						type: 'POST',
						dataType: "json",
						stringify:true
					},
					remove:{
								url:'/ovie/delfotosinmobiliaria',
								contentType : "application/json; charset=utf-8",
								type: 'GET',
								dataType: "json",
								stringify:false
					},
				}
			}
			
			
		},
		inmobiliaria:{
			 modifyList:{
						url:'/ovie/inmobiliariaTitle',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:true
			 },
			 modifyItem:{
						url:'/ovie/inmobiliariaID?',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:true
			 },
			downloadFotos:{
					    url:'/ovie/fotosinmobiliaria?',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:true
			},
			downloadFotosConsulta:{
						url:'/ovie/fotosinmobiliariafree?',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:true
			},
			filter:[
						{label:'Todos', value:'all'},
						{label:'Local', value:'clocal'},
						{label:'Bodega', value:'cbodega'},
						{label:'Oficina', value:'coficina'},
						{label:'Edificio', value:'cedificio'},
						{label:'Casa con uso de suelo que permita actividad econ&oacute;mica', value:'ccasa'}
					],
			identify:{
					    url:'/ovie/getOfertainmobiliaria?',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:false
			},
			ficha:{
					mainContent:[
									{label:'Tipo de oferta', field:'modalidad_oferta',items:[
										{label:'renta',value:1},{label:'venta',value:2}]},
									{label:'Superficie', field:'superficie_metros2'},
									{label:'Uso permitido', field:'tipo_inmueble',items:[
										{label:'Local',value:1},{label:'Bodega',value:2},{label:'Oficina',value:3},{label:'Edificio',value:4},{label:'Casa con uso de suelo que permita actividad economica',value:5}]},
									{label:'Oferta', field:'valor'},
								],
					
					secondaryContent:[
										//{label:'Id', field:'id_inm'},
										{label:'Título de oferta', field:'titulo_oferta'},
										{label:'Nombre', field:'nombre'},
										{label:'Teléfono', field:'telefono'},
										{label:'Correo electrónico', field:'correo_electronico'},
										{label:'Calle', field:'calle_inmueble'},
										{label:'No Exterior', field:'no_ext'},
										{label:'No Interior', field:'no_int'},
										{label:'Colonia', field:'colonia'},
										{label:'Delegación', field:'delegación'},
										{label:'Código postal', field:'CP'},
										{label:'Servicios', field:'servicios',items:[
											{label:'Luz Electrica',value:1},{label:'Gas Natural',value:2},{label:'Seguridad/Vigilancia',value:3},{label:'Aire Acondicionado',value:4},{label:'Estacionamiento',value:5},{label:'Baños',value:6},{label:'Agua potable',value:7},{label:'Internet',value:8},{label:'Telefono',value:9},{label:'Recepcion',value:10},{label:'Ascensor',value:11}]},
										{label:'Observaciones', field:'observaciones'},
									 ]		
			}
		},
		
		laboral:{
			 modifyList:{
						url:'/ovie/laboralTitle',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:true
			 },
			 modifyItem:{
						url:'/ovie/laboralID?',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:true
			 },
			 upload:{
					    url:'/ovie/fotoslaboral',
						contentType : "application/json; charset=utf-8",
						type: 'POST',
						dataType: "json",
						stringify:true
			},
			downloadFotos:{
						//ovie/fotosinmobiliaria?id_inm=188 
					    url:'/ovie/fotoslaboral?',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:true
			},
			filter:{
					perfil:[
							 {label:'Todos', value:'all'},
							 {label:'Profesional', value:'cprofesional'},
							 {label:'Técnico', value:'ctecnico'},
							 {label:'Administrativo', value:'cadministrativo'},
							 {label:'Ventas', value:'cventas'},
							 {label:'Oficios', value:'coficios'},
							 {label:'Servicios', value:'cservicios'},
							 {label:'Otros', value:'cotros'}
							],
					salario:[
							 {label:'Cualquiera', value:'all'},
							 {label:'Hasta 5,000', value:'ccinco'},
							 {label:'Hasta 10,000', value:'cdiez'},
							 {label:'Hasta 15,000', value:'cquince'},
							 {label:'Hasta 20,000', value:'cveinte'},
							 {label:'Más', value:'cmore'}
							]	
			},
			identify:{
					    url:'/ovie/getOfertalaboral?',
						contentType : "application/json; charset=utf-8",
						type: 'GET',
						dataType: "json",
						stringify:false
			},
			ficha:{
					mainContent:[
									{label:'Empresa', field:'empresa'},
									{label:'Vacante', field:'vacante'},
									{label:'Sueldo', field:'sueldo', items:[
										{label:'hasta $5,000',value:1},{label:'hasta $10,000',value:2},{label:'hasta $15,000',value:3},{label:'hasta $20,000',value:4},{label:'más de $20,000',value:5}]},
									{label:'Modalidad de contratación', field:'modalidad', items:[
										{label:'Tiempo completo',value:1},{label:'Medio tiempo',value:2},{label:'Abierto',value:3},{label:'Otro',value:4}]},
								],
					
					secondaryContent:[
										{label:'Id', field:'id_lab'},
										{label:'Nombre del contacto', field:'nombre_contacto'},
										{label:'Teléfono', field:'telefono'},
										{label:'Correo electrónico', field:'correo_electronico'},
										{label:'Calle', field:'calle_vacante'},
										{label:'No exterior', field:'no_ext'},
										{label:'No interior', field:'no_int'},
										{label:'Colonia', field:'colonia'},
										{label:'Delegación', field:'delegacion'},
										{label:'Categoría', field:'categoria', items:[
											{label:'Profesional',value:1},{label:'Técnico',value:2},{label:'Administrativo',value:3},{label:'Ventas',value:4},{label:'Oficios',value:5},{label:'Servicios',value:6},{label:'Industria',value:7}]},
									    {label:'Total de vacantes', field:'total_vacantes'},
										{label:'Sueldo', field:'sueldo'},
										/*{label:'Descripción de actividades', field:''},*/
										{label:'Perfil esperado del postulante', field:'perfil_postulante'},
										{label:'Tiempo de contratación', field:'tiempo_contratacion'},
										/*{label:'Requisitos para la entrega', field:''},*/
										{label:'Contacto', field:'contacto'},
								     ]		
			}
			
		},
		
		login:{
			status:false,
			
			ingresar:{
					  url:'/ovie/api/login',
					  contentType : "application/json; charset=utf-8",
					  type: 'POST',
					  dataType: "json",
					  stringify:true
			},
			registrar:{
					   save:{	
								url:'/ovie/user',
								contentType : "application/json; charset=utf-8",
								type: 'POST',
								dataType: "json",
								stringify:true
					   }	
			},
			logOut:{
					url:'/ovie/api/logout',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
			}
			
		},
		
		mapping:{
                initialExtent:{lon:[-104.98, 21.42], lat:[-104.82, 21.58]},
                restrictedExtent:{lon:[-105.55, 20.95], lat:[-104.15, 22.15]},
                bases:[
                    {
                        type:'WMS',
                        label:'Base',
                        url:['https://gaiamapas1.inegi.org.mx/mdmCache/service/wms?','https://gaiamapas3.inegi.org.mx/mdmCache/service/wms?','https://gaiamapas2.inegi.org.mx/mdmCache/service/wms?'],
                        tiled:false,
                        format:'jpeg',
                        layers:{
                            MapaBaseTopograficov61_sinsombreado:{label:'Base'}
                        }
                    }
                ],
                overlays:[]
            },
		geometry:{
                    store:{ 
                        url:'/ovie/geometry',
                        type: 'POST',
                        dataType: "json",
                        contentType : "application/json; charset=utf-8"
                        
                    },
                    addBuffer:{
						url:'/ovie/area',
                        type:'POST',
                        dataType:'json',
                        contentType:'application/json; charset=utf-8'
                    },
                    bufferLine:{
						url:'/ovie/buffer',
                        type: 'POST',
                        dataType: "json",
                        contentType : "application/json; charset=utf-8"
                    },
                    Export:{
                            //url:'http://mdm5beta.inegi.org.mx:8181/ovie/kml/download',
							url:'http://gaia.inegi.org.mx/mdmexport/kml/download',
                            type:'POST',
                            dataType:'json',
                            contentType:'application/json'
                    }
            },
		//proxyImage:"http://<server_url>/downloadfile/download",	
		proxyImage:"https://gaia.inegi.org.mx/mdm_downloadfile/download",
		//dinamic data
		session:'',
		logged:false
	};	
});