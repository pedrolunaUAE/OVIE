define(['metadata','code/compararMetadata'],function(metadata,compararMetadata){
	var clock = null;
	var time = 1200;
	var clearClock = function(){
		if (clock) {
            clearTimeout(clock);
        }
	}
	var defineClock = function(){
		clearClock();
		clock = setTimeout(function(){
			ocultaTooltip();
		},time);
	}
	var evento = function(){
		$(".tooltipMetadata").mouseenter(function(){
			clearClock();
		}).mouseleave(function(){
			clearClock();
			ocultaTooltip();
		});
	}
	var pintaTooltip=function(ref, positions,timer,compare){
		if(positions){
		if (timer) {
            time=timer;
        }
		$(".tooltipMetadata").remove();
		$('body').append('<div class="tooltipMetadata card"></div>');
		var info = (compare)?compararMetadata[ref]:metadata[ref];
		$(".tooltipMetadata").html(info);
		cuadrante(positions);
		$(".tooltipMetadata").show();
		evento();
		}
	}
	var ocultaTooltip=function(){
		$(".tooltipMetadata").hide();
	}
	
	var cuadrante=function(positions){
		var sectores=["topLeft","topRight","bottomLeft","bottomRight"];
		var sector="topRight";
		for (var x in sectores){
			var result=dameSector(sectores[x], positions);
			if (result.valid) {
				posiciona(result);
                break;
            }
		}
		
	}
	var posiciona=function(result){
		$(".tooltipMetadata").css({top:result.top+"px", left:result.left+"px"}).show();
	}
	var margen=30;
	var	dameSector=function(sector, positions){
		var wWindow = $(window).width();
		var hWindow = $(window).height();
		var wToolTip=$(".tooltipMetadata").width();
		var hToolTip=$(".tooltipMetadata").height();
		var valid=false;
		
		switch(sector){
			case "topLeft":
				var ancho=positions.left-(wToolTip+margen);
				var alto=positions.top-(hToolTip+margen);
				if ((ancho>=0)&&(ancho<=wWindow)) {
                    if ((alto>=0)&&(alto<=hWindow)) {
						valid = true;
					}
				}
				
			break;
			case "topRight":
				var ancho=positions.left+(wToolTip+margen);
				var alto=positions.top-(hToolTip+margen);
				if ((ancho>=0)&&(ancho<=wWindow)) {
                    if ((alto>=0)&&(alto<=hWindow)) {
						valid = true;
					}
				}
				ancho=ancho-wToolTip;
			break;
			case "bottomLeft":
				var ancho=positions.left-(wToolTip+margen);
				var alto=positions.top+(hToolTip+margen);
				if ((ancho>=0)&&(ancho<=wWindow)) {
                    if ((alto>=0)&&(alto<=hWindow)) {
						valid = true;
					}
					
			}
			alto=alto-hToolTip;
			break;
			case "bottomRight":
				var ancho=positions.left+(wToolTip+margen);
				var alto=positions.top+(hToolTip+margen);
				if ((ancho>=0)&&(ancho<=wWindow)) {
                    if ((alto>=0)&&(alto<=hWindow)) {
						valid = true;
					}
        }
			ancho=positions.left+margen;
			alto=positions.top+margen;
			break;	
		}
		
		return {valid:valid,sector:sector,left:ancho, top:alto};
	} 	
	return{
		show:pintaTooltip,
		hide:pintaTooltip,
		runClock:defineClock,
		clearClock:clearClock

	}
});