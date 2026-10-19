define(function(){
	return{
		dinUrb: '<div class="title">Dinámica urbana (empleados por cada 100 habitantes)</div>'+
                '<span><div>Definición:</div>es el número de empleados por cada cien habitantes que convive en el área delimitada.</span>'+
                '<span><div>Fuente:</div> Base SEDECO 2016.</span>',
                       
		promEsc: '<div class="title">Grado promedio de escolaridad de la población total</div>'+
                '<span><div>Definición:</div>es el promedio de años de escolaridad que ha cursado la población total que se encuentra en el área seleccionada.</span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo de Población y Vivienda 2010. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio en micro datos del INEGI.</span>',

		bienHog: '<div class="title">Indicador de acceso a  bienes por hogar (automóvil, computadora e Internet)</div>'+
                '<span><div>Definición:</div>es el índice que mide el acceso a bienes de los hogares que se encuentren dentro del área delimitada, tales como automóvil, computadora e internet. Si el índice se acerca a 0, en la zona habrá poca accesibilidad a dichos bienes, si éste se acerca a 1, entonces la mayoría de los hogares tiene acceso.</span>'+
                '<span><div>Fuente:</div> SEDECO. Cálculos con base en datos del Censo de Población y Vivienda 2010 procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',

		relPer: '<div class="title">Relación personal administrativo/personal ocupado total</div>'+
                '<span><div>Definición:</div>es el número de personas que dependen contractualmente de la unidad económica, sujetos a su dirección y control, a cambio de una remuneración fija y periódica por desempeñar labores generales de oficina, en relación con el número de personas ocupadas de la correspondiente unidad económica, dentro del área delimitada.</span>'+
				'<span><div>Fuente:</div>SNIEG. INEGI. Censo económico 2014. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',
				
		desEco: '<div class="title"> Índice de desarrollo económico  </div>'+
                '<span><div>Definición:</div>es un indicador que mide el potencial de generar riqueza para el bienestar económico de la población en el área delimitada, en función de tres componentes: (1)  la productividad laboral, (2) la remuneración promedio y (3) la inversión promedio por empresa.  Los valores se expresan de 0 a 1,  si el índice se acerca a 0 expresa poco desarrollo económico o con actividad, predominantemente, habitacional; si se acerca a 1, el índice señala alto desarrollo económico.</span>'+
                '<span><div>Fuente:</div> SEDECO. Cálculos con base en datos del Censo Económico 2014 procesados mediante el servicio del Laboratorio de micro datos del INEGI. SNIEG. INEGI. Censo Económico 2014.</span>',
			
		prodLab: '<div class="title">Productividad laboral promedio</div>'+
                '<span><div>Definición:</div>mide el valor monetario de la producción bruta total anual entre el total de trabajadores involucrados en el proceso de producción en las unidades económicas dentro de un área delimitada. El indicador muestra la relación entre el valor de la cantidad producida y la cantidad de trabajadores para la producción. Los valores corresponden a datos de 2013 y se expresan en pesos a precios de junio de 2016.</span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2014. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de micro datos del INEGI.</span>',

		suelAdmvo: '<div class="title">Sueldo promedio del personal administrativo del giro</div>'+
                '<span><div>Definición:</div>es el sueldo promedio mensual de un empleado administrativo que labora en el giro seleccionado, dentro de la delegación del área definida. Los valores corresponden a datos de 2013 y están expresados en pesos a precios de junio de 2017.</span>'+
                '<span><div>Fuente:</div>SNIEG. INEGI. Censo económico 2014. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',

		suelOpe: '<div class="title">Sueldo promedio del personal operativo del giro</div>'+
                '<span><div>Definición:</div>es el salario promedio mensual de un empleado operativo que labora en el giro seleccionado, dentro de la delegación del área definida. Los valores corresponden a datos de 2013 y están expresados en pesos a precios de junio de 2017.</span>'+
                '<span><div>Fuente:</div>SNIEG. INEGI. Censo económico 2014. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',

		enerEle: '<div class="title">Consumo de energía eléctrica promedio del giro</div>'+
                '<span><div>Definición:</div>es el costo promedio anual que pagan los establecimientos del giro seleccionado, por la utilización de energía eléctrica dentro del área delimitada.</span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2014.</span>',

		conAgu: '<div class="title">Consumo de agua promedio del giro</div>'+
                '<span><div>Definición:</div>es el costo promedio mensual que pagan las unidades económicas del giro seleccionado, por el uso de agua, dentro de la delegación del área definida. Los valores corresponden a datos de 2013 y están expresados en pesos a precios de junio de 2017.</span>'+
                '<span><div>Fuente:</div>SNIEG. INEGI. Censo económico 2014. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',

		venProm: '<div class="title">Ventas promedio del giro</div>'+
                '<span><div>Definición:</div>es el valor de las ventas promedio mensuales por unidad económica del giro seleccionado, dentro de la delegación del área definida. Los valores corresponden a datos de 2013 y están expresados en pesos a precios de junio de 2017.</span>'+
                '<span><div>Fuente:</div>SNIEG. INEGI. Censo económico 2014. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI. </span>',

		actFijos: '<div class="title">Valor de los activos fijos promedio</div>'+
                '<span><div>Definición:</div>es valor anual promedio de los bienes (maquinaria y equipo de producción, bienes inmuebles, equipo de transporte, equipo de transporte, equipo de cómputo y el mobiliario y equipo de oficina) adquiridos por las unidades económicas del giro seleccionado para la generación de bienes, dentro  la delegación del área definida. Los valores corresponden a datos de 2013 y están expresados en pesos a precios de junio de 2017. El valor ya refleja la depreciación de los bienes.</span>'+
                '<span><div>Fuente:</div>SNIEG. INEGI. Censo económico 2014. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI</span>',
	
		equiUrb: '<div class="title">Número de equipamiento urbano y amenidades</div>'+
                '<span><div>Definición:</div>es la suma de las unidades económicas que forman parte del equipamiento urbano, así como de la infraestructura social y económica, dentro del área delimitada. Incluye: bancos, bares y cantinas, centros comunitarios y de trabajo social; centros de espectáculos y teatros; centros deportivos y de acondicionamiento físico; cines; clínicas y consultorios médicos; comunicaciones y transportes; escuelas de todos niveles; estacionamientos; guarderías; hospitales, guarderías; hospitales, restaurantes y tiendas de autoservicio. Para ver detalles sobre la clasificación ver la sección de ayuda</span>'+
                '<span><div>Fuente:</div>INEGI. DENUE 2017.</span>',
				
		tranPub: '<div class="title">Número de estaciones de transporte público</div>'+
				'<span><div>Definición:</div>es la suma de todas las estaciones de metro, metrobus, RTP y transportes eléctricos públicos, dentro del área delimitada.</span>'+ 
				'<span><div>Fuente:</div>  Base SEDECO. 2016.</span>',
				
        numEst: '<div class="title">Número de estacionamientos</div>'+
                '<span><div>Definición:</div>es la suma de unidades económicas dedicadas a proporcionar servicios de estacionamiento dentro del área delimitada.</span>'+
                '<span><div>Fuente:</div> INEGI. DENUE 2017.</span>',
                
	}
});