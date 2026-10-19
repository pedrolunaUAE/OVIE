/**
 * 
 */
package mx.org.inegi.geo.ovie.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.persistence.CalculatorMapper;
import mx.org.inegi.geo.ovie.service.CalculatorService;

/**
 * @author JUAN.LEOS
 *
 */
@Service
public class CalculatorServiceImpl  implements CalculatorService{
	@Autowired
	CalculatorMapper mapper;

	/* (non-Javadoc)
	 * @see mx.org.inegi.geo.ovie.service.CalculatorService#getVariable(int)
	 */
	@Override
	public List<Map<String,Object>> getVariable(int sup) {
		// TODO Auto-generated method stub
		return mapper.getVariable(sup);
	}

	/* (non-Javadoc)
	 * @see mx.org.inegi.geo.ovie.service.CalculatorService#getsql(java.lang.String)
	 */
	@Override
	public String getsql(int id) {
		// TODO Auto-generated method stub
		return mapper.getsql(id);
	}

	/* (non-Javadoc)
	 * @see mx.org.inegi.geo.ovie.service.CalculatorService#getValor(int, java.lang.String)
	 */
	@Override
	public Float getValor(int id, String sql) {
		// TODO Auto-generated method stub
		return mapper.getValor(id,sql);
	}

	/* (non-Javadoc)
	 * @see mx.org.inegi.geo.ovie.service.CalculatorService#getValorGiro(int, java.lang.String, java.lang.String)
	 */
	@Override
	public Float getValorGiro(int id, String scian, String sql) {
		// TODO Auto-generated method stub
		return mapper.getValorGiro(id,scian,sql);
	}





}
