package mx.org.inegi.geo.ovie.web.controller;

import java.util.List;
import java.util.Map;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import mx.org.inegi.geo.ovie.domain.OfertaLaboral;
import mx.org.inegi.geo.ovie.service.OfertaLaboralService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

@RestController
public class OfertaLaboralController {
    @Autowired
    OfertaLaboralService lab;

    @RequestMapping(value = "laboral", method = RequestMethod.POST)
    public Object add(@Valid @RequestBody OfertaLaboral info) {
	if (valida(info) && lab.insertLab(info)) {
	    return ResponseFactory.successful("Registro insertado con Exito");
	} else
	    return ResponseFactory.unsuccessful("Error, Verifique consistencia de datos");
    }

    @RequestMapping(value = "laboral", method = RequestMethod.PUT)
    public Object update(@Valid @RequestBody OfertaLaboral info) {
	if ( lab.updateLab(info)) {
	    return ResponseFactory.successful("Registro actualizado con Exito");
	} else
	    return ResponseFactory.unsuccessful("Error, Verifique consistencia de datos");
    }

    @RequestMapping(value = "laboral", method = RequestMethod.GET)
    public Object getData(@RequestParam(value = "estatus", required = false) Integer estatus) {
	return lab.selectLab(estatus);
    }

    @RequestMapping(value = "laboralID", method = RequestMethod.GET)
    public Object getByID(@RequestParam(value = "id_lab", required = false) Integer id_lab) {
	return lab.selectByID(id_lab);
    }

    @RequestMapping(value = "laboralTitle", method = RequestMethod.GET)
    public Object getTitle() {
	List<Map<String, Object>> res = lab.selectByTitle();
	
	return ResponseFactory.successful("id_lab", res);
		
    }

    public boolean valida(OfertaLaboral info) {
	if ((info.getCalle_vacante().equals(null) || info.getCalle_vacante().equals(""))
		|| (info.getColonia().equals(null) || info.getColonia().equals(""))
		|| (info.getCorreo_electronico().equals(null) || info.getCorreo_electronico().equals(""))
		|| (info.getDelegacion().equals(null) || info.getDelegacion().equals(""))
		|| (info.getNombre_contacto().equals(null) || info.getNombre_contacto().equals(""))
		|| (info.getTelefono().equals(null) || info.getTelefono().equals(""))) {
	    return false;
	}
	return true;
    }
}
