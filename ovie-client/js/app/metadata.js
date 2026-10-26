define(function(){
	return{
		pobTot: '<div class="title">Población total</div>'+
                '<span><div>Definición:</div> conjunto de personas que residen dentro de un área delimitada.</span>'+
                '<span><div>Fuente:</div> INEGI. Censo de Población y Vivienda 2020.</span>',
                
        vivTot: '<div class="title">Viviendas totales</div>'+
                '<span><div>Definición:</div> es el número total de viviendas que se ubican dentro de un área delimitada.</span>'+
                '<span><div>Fuente:</div> INEGI. Censo de Población y Vivienda 2020.</span>',
                
        totEco: '<div class="title">Total de unidades económicas</div>'+
                '<span><div>Definición:</div> es el número de establecimientos, empresas, hogares y personas físicas asentados en un lugar de manera permanente y delimitado por construcciones e instalaciones fijas, en donde se llevan a cabo procesos productivos, de comercialización o de servicios, dentro de un área delimitada.</span>'+
                '<span><div>Fuente:</div> INEGI. DENUE 2026.</span>',
				
		totEcoVoc: '<div class="title">Total de unidades económicas</div>'+
                '<span><div>Definición:</div> número de establecimientos, empresas, hogares y personas físicas asentados en un lugar de manera permanente y delimitado por construcciones e instalaciones fijas, en donde se llevan a cabo procesos productivos, de comercialización o de servicios, dentro de un área delimitada.</span>'+
                '<span><div>Fuente:</div> INEGI. DENUE 2026.</span>',		
                
        desSoc: '<div class="title">Índice de desarrollo social</div>'+
                '<span><div>Definición:</div> mide el grado de satisfacción de las necesidades básicas, considerando la medición multidimensional de la pobreza, con base en seis componentes: </span>'+
				'<ul>'+
                    '<li>i) calidad y espacio de la vivienda;</li>'+
                    '<li>ii) acceso a salud y seguridad social</li>'+
                    '<li>iii) rezago educativo </li>'+
                    '<li>iv) bienes durables</li>'+
                    '<li>v) adecuación sanitaria</li>'+
					'<li>vi) adecuación energética</li>'+
                '</ul>'+
				'<span>El indicador toma valores entre cero y uno:  de 0  a .69 se considera muy bajo,  de .7 a .79 es bajo, de .8 a .89  es medio y de .9  a 1 es alto. A medida que el índice se acerca a 1, la zona de análisis presenta mayor nivel de bienestar social. El valor expresado es el promedio de las manzanas dentro de un área delimitada.</span>'+
				'<span><div>Fuente:</div> Este índice corresponde al Consejo de Evaluación del Desarrollo Social de la Ciudad de México (2010) y no está calculado para Nayarit. Por eso no se muestra en los resultados. </span>',
                
        grupos: '<div class="title">Grandes grupos de edad</div>'+
                '<span><div>Definición:</div> es el porcentaje de la población total que reside dentro de un área delimitada, según los siguientes rangos de edades:</span>'+
                '<ul>'+
                    '<li>a) De 0 a 14 años - niños </li>'+
                    '<li>b) De 15 a 24 años - jóvenes</li>'+
                    '<li>c) De 25 a 44 años - adultos jóvenes</li>'+
                    '<li>d) De 45 a 64 años - adultos</li>'+
                    '<li>e) De 65 y más - adultos mayores</li>'+
                '</ul>'+
                '<span>Los datos pueden no sumar cien por ciento debido a que, en algunos casos, las categorías de edad no presentan datos por cuestiones de confidencialidad.</span>'+
                '<span><div>Fuente:</div> INEGI. Censo de Población y Vivienda 2020.</span>',
                
        distSex:'<div class="title">Distribución por sexo</div>'+
                '<span><div>Definición:</div> es el porcentaje de hombres y mujeres que viven dentro de un área delimitada.</span>'+
				'<span>Los datos pueden no sumar cien por ciento debido a que en algunos casos,  las categorías de edad no presentan datos por cuestiones de confidencialidad.</span>'+
                '<span><div>Fuente:</div> INEGI. Censo de Población y Vivienda 2020.</span>',
                
        nivEsc: '<div class="title">Nivel de escolaridad</div>'+
                '<span><div>Definición:</div> se refiere a la distribución de la población de 3 años y  más en un área delimitada, según el último grado o año que aprobó en la escuela al momento de la aplicación del Censo de Población 2020: </span>'+
                '<ul>'+
                    '<li>a) Preescolar</li>'+
                    '<li>b) Primaria</li>'+
                    '<li>c)	Secundaria</li>'+
                    '<li>d)	Bachillerato</li>'+
                    '<li>e)	Profesional</li>'+
					'<li>f)	Posgrado</li>'+
                '</ul>'+
                '<span>Los datos pueden no sumar cien por ciento debido a los casos en los  que no se obtuvo información por cuestiones de confidencialidad, se estimó la sumatoria con un valor de 3.</span>'+
                '<span><div>Fuente:</div> INEGI. Censo de Población y Vivienda 2020.</span>',
        
        sup:    '<div class="title">Superficie</div>'+
                '<span><div>Definición:</div> es la extensión territorial medida en hectáreas.</span>'+
                '<span><div>Fuente:</div> INEGI.</span>',
        
        perOcup:'<div class="title">Total de personal ocupado</div>'+
                '<span><div>Definición:</div> comprende todas la personas que trabajan, dependiendo contractualmente o no de las unidades económicas dentro de un área delimitada. Incluye personal dependiente de la razón social, personal no dependiente de la razón social, propietarios, familiares y personal no remunerado. </span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2024. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',
                
        remProm:'<div class="title">Remuneración promedio por empleado (mensual)</div>'+
                '<span><div>Definición:</div> es la suma del total de sueldos, salarios, prestaciones sociales y utilidades que se pagan a los trabajadores en un mes (30 días), dividido entre el total de empleados remunerados, dentro de un área delimitada. Los valores corresponden a datos de 2013 y se expresan en pesos a precios de junio de 2017. La remuneración promedio excluye a propietarios y familiares sin sueldo que trabajan en negocios familiares y se realiza considerando sólo las manzanas que reportaron alguna remuneración, independientemente del giro al que pertenecen. El dato reportado debe interpretarse como una aproximación del pago promedio por trabajador, basada en el conjunto de las actividades económicas que allí se desarrollan y puede no ser representativo de la actividad económica o giro predominante del área delimitada.</span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2024. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',
                
        prodPro:'<div class="title">Productividad laboral promedio (anual)</div>'+
                '<span><div>Definición:</div> mide el valor monetario de la producción anual entre el total de trabajadores involucrados en el proceso de producción en las unidades económicas dentro de un área delimitada. El indicador muestra la relación entre el valor de la cantidad producida y la cantidad de trabajadores para la producción. Los valores corresponden a datos de 2013 y se expresan en pesos a precios de junio de 2017. El cálculo se realiza sólo considerando las manzanas que reportaron generación de valor como resultado de las actividades económicas durante el año, independientemente del giro de procedencia.  El dato reportado debe interpretarse como una aproximación promedio de la productividad por trabajador, basada en el conjunto de las actividades económicas que allí se desarrollan y puede no ser representativo de la actividad económica predominante o giro en esta área. </span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2024. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',
        
        compEco:'<div class="title">Composición de unidades económicas por sector</div>'+
                '<span><div>Definición:</div> se refiere a la distribución porcentual de las unidades económicas dentro de un área delimitada, por los grandes sectores de actividad económica: comercio, industria y servicios.</span>'+
                //'<span>Los datos pueden no sumar cien debido a que no se considera los casos no especificados.</span>'+
                '<span><div>Fuente:</div> INEGI. DENUE 2026.</span>',
                
        prodBrut:'<div class="title">Producción bruta total</div>'+
                '<span><div>Definición:</div> es la aportación de todos los bienes y servicios producidos o comercializados por las unidades económicas en la zona de análisis. Incluye la variación de existencias de productos en proceso.</span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2024. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',
                
        desEco: '<div class="title">Índice de desarrollo económico</div>'+
                '<span><div>Definición:</div> es un indicador que mide el potencial de generar riqueza para el bienestar económico de la población en el área delimitada, en función de tres componentes: </span>'+
                '<ul>'+
                    '<li>a) la productividad laboral, </li>'+
                    '<li>b) la remuneración promedio y</li>'+
                    '<li>c)	la inversión promedio por empresa.</li>'+
                '</ul>'+
				'<span>Los valores se expresan de 0 a 1,  si el índice se acerca a 0 expresa poco desarrollo económico o que se trata una zona actividad, predominantemente, habitacional, si se acerca a 1 el índice señala alto desarrollo económico.</span>'+
				'<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2024. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',
				
		actCons:'<div class="title">Actividad Consultada</div>'+
                '<span><div>Definición:</div>Se refiere a la sumatoria de todas las unidades económicas dedicadas a este giro registradas dentro del área delimitada. Para ver detalles sobre la clasificación ver la sección de <a href="docs/ayuda.pdf?v=20261026" target="_blank"">ayuda</a></span>'+
                '<span><div>Fuente:</div> INEGI. DENUE 2026</span>',
				
		actPred:'<div class="title">Actividad Predominante</div>'+
                '<span><div>Definición:</div> se refiere al número de unidades económicas de las 3 clases o giros más frecuentes dentro de un área de delimitada.</span>'+
                '<span><div>Fuente:</div> INEGI. DENUE 2026</span>',
				
		espDef:'<div class="title">Especialización Definida</div>'+
                '<span><div>Definición:</div> se refiere a la actividad sectorial (industria, comercio y servicios) más importante dentro de un área delimitada, definida en función de tres variables: número de empleados, el total del valor agregado censal bruto  y el total de unidades económicas. El valor indica el porcentaje que representa la actividad principal para cada una de las variables, respecto al total del área delimitada. </span>'+
                '<span><div>Fuente:</div> SNIEG. INEGI. Censo económico 2024. Cálculos con base en datos procesados por manzana mediante el servicio del Laboratorio de microdatos del INEGI.</span>',
		
		tamPred:'<div class="title">Tamaño predominante</div>'+
                '<span><div>Definición:</div> se refiere al tamaño más frecuente de las unidades económicas dentro de un área delimitada, en función de su número de empleados. El valor indica el porcentaje de unidades económicas del tamaño predominante, respecto al total de unidades económicas del área delimitada.   </span>'+
                '<span><div>Fuente:</div> INEGI. DENUE 2026.</span>',
	}
});