/**
 * 
 */
package mx.org.inegi.geo.ovie.web.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.service.CalculatorService;
import mx.org.inegi.geo.ovie.service.CompareAreasService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

/**
 * @author JUAN.LEOS
 *
 */
@RestController
@RequestMapping("calculator")
public class CalculatorController {

	@Autowired
	CalculatorService service;

	@Autowired
	CompareAreasService compareAreaService;

	@RequestMapping(value = "variable/{sup}", method = RequestMethod.POST)
	public Object getVariable(@PathVariable() int sup) {
		List<Map<String, Object>> variable = service.getVariable(sup);
		return ResponseFactory.successful("variable", variable);

	}

	@RequestMapping(value = "{id_area}/{id}", method = RequestMethod.POST)
	public Object getValor(@PathVariable() int id_area, @PathVariable int id) {
		String sql = service.getsql(id);
		Float valor = service.getValor(id_area, sql);
		return ResponseFactory.successful("valor", valor);

	}

	@RequestMapping(value = "{id_area}/{scian}/{id}", method = RequestMethod.POST)
	public Object getValorGiro(@PathVariable() int id_area, @PathVariable String scian, @PathVariable int id) {		
		String sql = service.getsql(id);
		Float valor = service.getValorGiro(id_area,scian, sql);
		return ResponseFactory.successful("valor", valor);

	}

}
