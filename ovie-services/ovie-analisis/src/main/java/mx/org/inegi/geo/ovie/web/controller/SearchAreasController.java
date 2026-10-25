package mx.org.inegi.geo.ovie.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.compression.gzip.GzipResponse;
import mx.org.inegi.geo.ovie.service.SearchAreasService;

@RestController
@RequestMapping("search")
public class SearchAreasController {

	@Autowired
	private SearchAreasService service;

	@GzipResponse
	@RequestMapping(value = "areas", method = { RequestMethod.GET, RequestMethod.POST })
	public Object areas(@RequestParam(value = "q", required = false) String q,
			@RequestParam(value = "fq", required = false) String fq,
			@RequestParam(value = "rows", required = false, defaultValue = "50") int rows) {
		return service.search(q, fq, rows);
	}

}
