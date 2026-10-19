package mx.org.inegi.geo.ovie.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.compression.gzip.GzipResponse;
import mx.org.inegi.geo.ovie.domain.Area;
import mx.org.inegi.geo.ovie.domain.IndicatorsVocation;
import mx.org.inegi.geo.ovie.service.EconomicVocationService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

@RestController
@RequestMapping("economic/vocation")
public class EconomicVocationController {
	@Autowired
	EconomicVocationService service;
	
	
	@GzipResponse
	@RequestMapping(value = "indicators/{cve}", method = RequestMethod.POST)
	public Object indices(@PathVariable  int cve, @RequestBody Area area) throws Exception {
		IndicatorsVocation indicators = service.indicators(area.getId(),cve);
		if (indicators != null)
			return ResponseFactory.successful("indicators", indicators);
		else
			return ResponseFactory.unsuccessful("No se encontró información para esta área");
	}

}
