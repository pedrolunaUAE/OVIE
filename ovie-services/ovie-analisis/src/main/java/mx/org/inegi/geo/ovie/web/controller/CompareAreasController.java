/**
 * 
 */
package mx.org.inegi.geo.ovie.web.controller;

import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.service.CompareAreasService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

/**
 * @author JUAN.LEOS
 *
 */
@RestController

public class CompareAreasController {
	@Autowired
	CompareAreasService service;
	
	
	@RequestMapping(value= "compare/area/{id}/{scian}", method= RequestMethod.POST)
	public Object compareAre (@PathVariable Integer id, @PathVariable String scian) {
		LinkedHashMap<String, Object>  delegation= service.getDelegation(id);
		String cvegeo= (String) delegation.get("cvegeo");		
		LinkedHashMap<String, Object> datos= new LinkedHashMap<String,Object>(); 
		try {
			datos.put("1",service.dynamicUrban(id));
			datos.put("2",service.averageGrade(id));
			datos.put("3",service.goodsAccess(id));
			datos.put("4",service.employedPersonnel(id));
			datos.put("5",service.indeco(id));
			datos.put("6",service.productivityLaboral(id));
			datos.put("7",service.administrativeSalary(cvegeo,scian));
			datos.put("8",service.administrativeOperating(cvegeo,scian));
			datos.put("9",service.electricityConsumption(cvegeo,scian));
			datos.put("10",service.waterConsumption(cvegeo,scian));
			datos.put("11",service.avergaeSells(cvegeo,scian));
			datos.put("12", service.assetValue(cvegeo,scian));
			datos.put("13",service.urbanEquipment(id));
			datos.put("14",service.publicTransport(id));
			datos.put("15",service.parkinglots(id));
			return	ResponseFactory.successful("indicators",datos);
		}catch(Exception ex) {
			return	ResponseFactory.unsuccessful("El área seleccionada no cuenta con la actividad económica: ");
		}
		 
	}
}
