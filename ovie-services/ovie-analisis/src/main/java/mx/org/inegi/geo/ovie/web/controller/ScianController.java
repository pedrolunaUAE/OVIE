package mx.org.inegi.geo.ovie.web.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.util.Pagination;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;
import mx.org.inegi.geo.ovie.domain.OvieScian;
import mx.org.inegi.geo.ovie.service.ScianService;



@RestController
@RequestMapping("scian")
public class ScianController {

	@Autowired
	ScianService service;
	
	
	@RequestMapping(value="info",method = RequestMethod.GET )
	public Object tracking(@RequestParam("page") int page, @RequestParam("limit") int limit) {
		int recordCount = service.findIdleCount();
		int pages = Pagination.getNumberOfPages(recordCount, limit);
		page = Pagination.validatePage(page, pages);
		int offset = Pagination.getOffset(page, limit);
		//-----------
		List<OvieScian> ovie=service.findIdle(limit, offset);
		return ResponseFactory.successful("Total Elementos", recordCount )
				.addField("Total Paginas", pages)
				.addField( "Pagina", offset+1)
				.addField("Elementos", ovie);
	//return null;
	}
}
