define([], function(){
    var buildFooter=function(){
        var chain='<div class="col s12 FooterSection" style="margin-top: 25px;">'+
										'<div style="position: relative;">'+
                                            '<img id="circle-footer" src="js/app/css/img/footer-circle.png">'+
											'<div class="ovie-footer-line"></div>'+
										'</div>'+
										'<p class="ovie-footer-txt">'+
											
											'Este programa es de carácter público, no es patrocinado ni promovido por partido político alguno y  sus recursos provienen de los impuestos que pagan todos los contribuyentes.'+
											'Está prohibido el uso de este programa con fines políticos, electorales, de lucro y de otros distintos a los establecidos. Quien haga uso indebido de los recursos de este programa, '+
											'deberá ser denunciado y sancionado con la Ley aplicable y ante la autoridad competente.  Los datos y la información que se proporcionan son de carácter informativo para fines'+
											' de asesoría y orientación a los ciudadanos. El usuario consultante es responsable del uso, aplicación o difusión de la información contenida en este reporte.'+
											'La información contenida proviene de fuentes oficiales y se actualiza periódicamente. Para consultar el año en que los datos fueron recabados se sugiere revisar el apartado de metadatos.'+
											
										'</p>'+
					'</div>';
    return chain;
    }
    return {
	    get: buildFooter
    }
    
});