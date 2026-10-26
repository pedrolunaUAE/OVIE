/**
 * 
 */
package mx.org.inegi.geo.ovie.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.compression.gzip.GzipResponse;
import mx.org.inegi.geo.ovie.domain.Area;
import mx.org.inegi.geo.ovie.domain.Indicators;
import mx.org.inegi.geo.ovie.service.AreaService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory.SuccessfulResponse;

/**
 * @author femat
 *
 */
@RestController
public class AreaController {

	@Autowired
	private AreaService service;

	@GzipResponse
	@RequestMapping(value = "geometry", method = RequestMethod.POST)
	public Object add(@RequestBody Area area) throws Exception {
		Long id = service.add(area);
		SuccessfulResponse r = ResponseFactory.successful("id", id);
		return r;
	}

	@GzipResponse
	@RequestMapping(value = "area", method = RequestMethod.POST)
	public Object applyBuffer(@RequestBody Area area) throws Exception {
		Area a = null;
		if (area.getType() != null && area.getType().length() > 0) {
			Area tmp = service.findBuffer(area);
			if (tmp == null || tmp.getGeometry() == null) {
				return ResponseFactory.unsuccessful("No se puede generar el área con los datos enviados");
			}
			a = service.applyBuffer(tmp);

		} else {
			a = service.applyBuffer(area);
		}
		a.setType(area.getType());
		SuccessfulResponse r = ResponseFactory.successful("area", a);
		return r;
	}
	
	@GzipResponse
	@RequestMapping(value = "buffer", method = RequestMethod.POST)
	public Object Buffer(@RequestBody Area area) throws Exception {
		Area a = null;
			 a = service.applyBuffer(area);		
		a.setType(area.getType());
		SuccessfulResponse r = ResponseFactory.successful("area", a);
		return r;
	}

	@GzipResponse
	@RequestMapping(value = "indicators", method = RequestMethod.POST)
	public Object indices(@RequestBody Area area) throws Exception {
		Indicators indicators = service.indicadores(area.getId());
		if (indicators != null)
			return ResponseFactory.successful("indicators", indicators);
		else
			return ResponseFactory.unsuccessful("No se encontró información para esta área");
	}

}