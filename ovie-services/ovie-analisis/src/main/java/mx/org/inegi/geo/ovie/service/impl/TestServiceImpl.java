/**
 * 
 */
package mx.org.inegi.geo.ovie.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.persistence.TestMapper;
import mx.org.inegi.geo.ovie.service.TestService;

/**
 * @author JUAN.LEOS
 *
 */
@Service
public class TestServiceImpl implements TestService {

	/* (non-Javadoc)
	 * @see mx.org.inegi.geo.ovie.service.TestService#dataBaseOk()
	 */
	@Autowired
	TestMapper mapper;
	
	@Override
	public Integer dataBaseOk() {
		
		return mapper.dataBaseOk();
	}

}
