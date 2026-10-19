/**
 * 
 */
package mx.org.inegi.geo.ovie.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.service.TestService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

/**
 * @author JUAN.LEOS
 *
 */

@RestController
@RequestMapping("test")
public class TestDatabaseController {
	
	@Autowired
	TestService service;
	
	
	@RequestMapping(value = "database", method = RequestMethod.GET)
	public Object catalog() {
		Integer id = service.dataBaseOk();
		if (id >=1)
			return ResponseFactory.successful("Data Base Ok");
		else
			return ResponseFactory.unsuccessful();

	}

}
