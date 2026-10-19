package mx.org.inegi.geo.ovie.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import mx.org.inegi.geo.ovie.domain.FotosInmobiliaria;
import mx.org.inegi.geo.ovie.domain.OfertaInmobiliaria;
import mx.org.inegi.geo.ovie.service.OfertaInmobiliariaService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

@RestController
// @RequestMapping("inmobiliaria")
public class OfertaInmobiliariaController {
    @Autowired
    OfertaInmobiliariaService inm;

    @RequestMapping(value = "inmobiliaria", method = RequestMethod.POST)
    public Object add(@Valid @RequestBody OfertaInmobiliaria datos) {
	int idInsert = inm.insertInm(datos);
	if (idInsert > 0)
	    return ResponseFactory.successful("Registro insertado con Exito").addField("id_inm", idInsert);
	else
	    return ResponseFactory.unsuccessful("Error, Verifique consistencia de datos");
    }

    @RequestMapping(value = "fotosinmobiliaria", method = RequestMethod.POST)
    public Object addFotos(@RequestParam("id") int id,
	    @RequestParam(value = "file1", required = false) MultipartFile file1,
	    @RequestParam(value = "file2", required = false) MultipartFile file2,
	    @RequestParam(value = "file3", required = false) MultipartFile file3,
	    @RequestParam(value = "file4", required = false) MultipartFile file4) throws IOException {
	List<FotosInmobiliaria> files= new ArrayList<FotosInmobiliaria>();
	
	if (file1 != null)
	    files.add(new FotosInmobiliaria(id,file1.getBytes()));
	if (file2 != null)
	    files.add(new FotosInmobiliaria(id,file2.getBytes()));
	if (file3 != null)
	    files.add(new FotosInmobiliaria(id,file3.getBytes()));
	if (file4 != null)
	    files.add(new FotosInmobiliaria(id,file4.getBytes()));
	return inm.insertImg(files);
    }
    @RequestMapping(value = "fotosinmobiliaria", method = RequestMethod.GET)
    public Object getfotos(@RequestParam(value = "id_inm", required = true) Long id_inm) {
  	List<FotosInmobiliaria> of = inm.selectImg(id_inm);
  	return of; //
      }
    @RequestMapping(value = "inmobiliaria", method = RequestMethod.GET)
    public Object getData(@RequestParam(value = "estatus", required = false) Integer estatus) {
	List<OfertaInmobiliaria> of = inm.selectInm(estatus);
	return of; //
    }

    @RequestMapping(value = "inmobiliariaID", method = RequestMethod.GET)
    public Object getByID(@RequestParam(value = "id_inm", required = false) Integer id_inm) {
	List<OfertaInmobiliaria> of = inm.selectByID(id_inm);
	return of; //
    }

    @RequestMapping(value = "inmobiliariaTitle", method = RequestMethod.GET)
    public Object getTitle() {
	List<Map<String, Object>> res = inm.selectByTitle();
	 return ResponseFactory.successful("registros", res);
    }

    public boolean valida(OfertaInmobiliaria info) {
	if ((info.getCalle_inmueble().equals(null) || info.getCalle_inmueble().equals(""))
		|| (info.getColonia().equals(null) || info.getColonia().equals(""))
		|| (info.getCorreo_electronico().equals(null) || info.getCorreo_electronico().equals(""))
		|| (info.getDelegacion().equals(null) || info.getDelegacion().equals(""))
		|| (info.getNombre().equals(null) || info.getNombre().equals(""))
		|| (info.getTelefono().equals(null) || info.getTelefono().equals(""))
		|| (info.getTelefono().equals(null) || info.getTelefono().equals(""))
		|| (info.getTitulo_oferta().equals(null) || info.getTitulo_oferta().equals("")))
	    return false;
	else
	    return true;
    }
}
