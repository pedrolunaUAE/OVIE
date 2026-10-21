define([], function(){
    var removeEmptySpaces=function(a){
    a = a+'';
	return a.replace(/\s+/, "");
    }
    var isEmpty=function(a){
	var response = true;
	var text = removeEmptySpaces(a);
	if (text.length>0) {
	    response = false;
	}
	return response;
    }
    var isDate = function(p){
	var re = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/;
	return re.test(p);
    }
	var isCellPhone=function(p){
	var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{2}[-\s\.]{0,1}[0-9]{8}$/;
	return re.test(p);
    }
    var isPhone=function(p){
	var re = /^[[0-9]{3}[-\s\.]{0,1}[0-9]{5}$/;
	return re.test(p);
    }
    var isEmail = function(email){
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
    }
    
    this.removeAcent = function(a){
		var chain = a;
		chain = chain.replace(/[\u00E1]/gi,'a');
		chain = chain.replace(/[\u00E9]/gi,'e');
		chain = chain.replace(/[\u00ED]/gi,'i');
		chain = chain.replace(/[\u00F3]/gi,'o');
		chain = chain.replace(/[\u00FA]/gi,'u');
		chain = chain.replace(/[\u00F1]/gi,'n');
		
		chain = chain.replace(/[\u00C1]/gi,'A');
		chain = chain.replace(/[\u00C9]/gi,'E');
		chain = chain.replace(/[\u00CD]/gi,'I');
		chain = chain.replace(/[\u00D3]/gi,'O');
		chain = chain.replace(/[\u00DA]/gi,'U');
		chain = chain.replace(/[\u00D1]/gi,'N');
		
		return chain;
	}
    var getFormatHtml = function(chain){
		
		chain = chain.replace(/[\u00E1]/gi,'a');
		chain = chain.replace(/[\u00E9]/gi,'e');
		chain = chain.replace(/[\u00ED]/gi,'i');
		chain = chain.replace(/[\u00F3]/gi,'o');
		chain = chain.replace(/[\u00FA]/gi,'u');
		chain = chain.replace(/[\u00F1]/gi,'n');
		
		chain = chain.replace(/[\u00C1]/gi,'A');
		chain = chain.replace(/[\u00C9]/gi,'E');
		chain = chain.replace(/[\u00CD]/gi,'I');
		chain = chain.replace(/[\u00D3]/gi,'O');
		chain = chain.replace(/[\u00DA]/gi,'U');
		chain = chain.replace(/[\u00D1]/gi,'N');
		
		return chain;
    }
    var getFormatHtml2 = function(chain){
		
		chain = chain.replace(/[\u00E1]/gi,'&aacute;');
		chain = chain.replace(/[\u00E9]/gi,'&eacute;');
		chain = chain.replace(/[\u00ED]/gi,'&iacute;');
		chain = chain.replace(/[\u00F3]/gi,'&oacute;');
		chain = chain.replace(/[\u00FA]/gi,'&uacute;');
		chain = chain.replace(/[\u00F1]/gi,'&ntilde;');
		
		chain = chain.replace(/[\u00C1]/gi,'&Aacute;');
		chain = chain.replace(/[\u00C9]/gi,'&Eacute;');
		chain = chain.replace(/[\u00CD]/gi,'&Iacute;');
		chain = chain.replace(/[\u00D3]/gi,'&Oacute;');
		chain = chain.replace(/[\u00DA]/gi,'&Uacute;');
		chain = chain.replace(/[\u00D1]/gi,'&Ntilde;');
		
		return chain;
    }
  
    var getFormatNumber = function(nStr){
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
	}
    var convertToHtml = function(texto){
		
		var ta=document.createElement("textarea");
		ta.innerHTML=texto.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		return ta.value;
    }
     var endPage=function(){
        var altura=$('#main').height();
        $('#main').scrollTop(altura);
    }
    var isGeneric = function(cve){
        var result = false;
        var items = [
                        "311830",
						"323119",
						"461110",
						"461121",
						"461122",
						"461130",
						"461160",
						"461190",
						"463211",
						"463310",
						"464111",
						"465311",
						"465912",
						"466312",
						"467111",
						"467115",
						"468211",
						"561432",
						"621113",
						"621211",
						"722511",
						"722513",
						"722514",
						"722515",
						"722518",
						"72257",
						"811111",
						"811499",
						"812110"
                    ];
        if (items.indexOf(cve)!=-1) {
            result = true;
        }
        return result;
    }
    var getIcon = function(clv,additional){
        additional = (additional)?additional:'';
        if (clv === null || clv === undefined || clv === '') {
            return additional + 'comercio';
        }
        var icon = String(clv);
        if (icon.length < 2) {
            return additional + 'comercio';
        }
        var segment = icon.substr(0,2);
        var resultado=getNewIcon(icon);
        if (!resultado.exist) {
          
            switch (segment) {
                case '11':
                    icon='311830';
                    break;
                case '43':
                case '46':
                    icon=additional+'comercio';
                    break;
                case '21':
                case '22':    
                case '23':
                case '31':
                case '32':
                case '33':            
                case '34':
                    icon=additional+'industria';
                    break;
                case '48':
                case '49':
                case '51':
                case '52':
                case '53':
                case '54':
                case '55':
                case '56':
                case '61':
                case '62':
                case '71':
                case '72':
                case '81':
                case '93':    
                    icon=additional+'servicio'
                    break;
            }
        }else{
            icon=resultado.icon;
        }
       return icon;
    }
    
    var getNewIcon=function(icon){
        var exist=false;
        switch (icon) {
            case '624222':
            case '624111':
            case '624112':
            case '624121':
            case '624122':
            case '624191':
            case '624198':
            case '624199':
            case '624211':
            case '624212':
            case '624221':
            case '624231':
            case '624232':icon='900001';exist=true; break;
            case '711311':
            case '711112':
            case '711111':
            case '531115':
            case '711312':icon='900002';exist=true;break;
            case '713910':
            case '611622':
            case '611621':
            case '713944':
            case '713943':
            case '713942':
            case '713941':icon='900003';exist=true;break;
            case '611112':
            case '611151':
            case '611142':
            case '611141':
            case '611132':
            case '611131':
            case '611122':
            case '611121':
            case '611111':
            case '611312':
            case '611311':
            case '611212':
            case '611211':
            case '611182':
            case '611181':
            case '611172':
            case '611171':
            case '611162':
            case '611161':
            case '611152':icon='900004';exist=true;break;
            case '624411':
            case '624412':icon='900005';exist=true;break;
            case '622211':
            case '622112':
            case '622311':
            case '622312':
            case '622111':
            case '622212':icon='900006';exist=true;break;
            case '721210':
            case '721113':
            case '721120':
            case '721312':
            case '721311':
            case '721190':
            case '721111':
            case '721112':icon='900007';exist=true;break;
            case '541830':
            case '541810':
            case '511132':
            case '511141':
            case '511191':
            case '511192':
            case '511210':
            case '541920':
            case '541890':
            case '541870':
            case '541850':
            case '541840':
            case '541820':
            case '541510':
            case '541490':
            case '541430':
            case '541420':
            case '541410':
            case '541340':
            case '541320':
            case '541310':
            case '511121':
            case '519190':
            case '519130':
            case '511112':
            case '519122':
            case '519121':
            case '519110':
            case '511122':
            case '511131':
            case '511142':
            case '323111':
            case '512111':
            case '541860':
            case '512112':
            case '511111':
            case '512120':
            case '515210':
            case '515120':
            case '515110':
            case '512290':
            case '512240':
            case '512230':
            case '512220':
            case '512210':
            case '512190':
            case '512130':
            case '512113':
            case '561422':
            case '512112':
            case '511210':
            case '541510':
            case '512113':icon='900008';exist=true;break;
            case '512190':
            case '518210':
            case '512111':icon='900009';exist=true;break;
            case '462111':
            case '462112':
            case '462210':icon='900010';exist=true;break;


        }
        return {icon:icon, exist:exist};
    }
    
    var getChains = function(text,max){
					var response=[];
					var t = text.split(" ");
					var array = [];
					for(var i =0; i < t.length; i++){
						array.push(t[i]);
						if(i != t.length-1){
							//array.push(" ");
						}
					}
					var position = 0;
					var chain = '';
					if (array.length>1) {
						for(var x in array){
							if (array[x].length>max) {
                                response.push(array[x]);
								position+=1;
                            }else{
								for(var y=position;y<array.length;y++){
									var i = array[y];
									var l = i.length+chain.length;
									if (l<=max) {
										chain = (chain.length==0)?i:chain+" "+i;
										if (y==(array.length-1)) {
											response.push(chain);
											position=y+1;
										}
										
									}else{
										response.push(chain);
										chain='';
										position=y;
										break;
									}
								}
							}
						}
					}else{
						var c = '@';
						response = text.split(c);
						if (text.indexOf(c)!=-1) {
                            var newChain = response[0].split( /(?=(?:...............)*$)/ );
							if (response[1]) {
                                response[1]=c+response[1];
                                newChain.push(response[1]);
                            }
                            response = newChain;
                            
                        }
						
					}
					
					return response;
	}
    return {
	    removeSpaces:removeEmptySpaces,
	    isEmpty:isEmpty,
	    isPhone:isPhone,
	    isEmail:isEmail,
		isCellPhone:isCellPhone,
	    getFormatHtml:getFormatHtml,
	    removeAcent:removeAcent,
	    getFormatNumber:getFormatNumber,
	    convertToHtml:convertToHtml,
	    getFormatHtml2:getFormatHtml2,
        endPage:endPage,
        getIcon:getIcon,
        isGeneric:isGeneric,
        getChains:getChains
    }
    
});