/**
 * 
 */
package mx.org.inegi.geo.ovie.service;

import java.util.List;
import java.util.Map;

/**
 * @author JUAN.LEOS
 *
 */
public interface CalculatorService {

	/**
	 * @param sup
	 * @return
	 */
	List<Map<String,Object>> getVariable(int sup);

	/**
	 * @param alias
	 * @return
	 */
	String getsql(int id);

	/**
	 * @param id
	 * @param sql
	 * @return
	 */
	Float getValor(int id, String sql);

	/**
	 * @param id
	 * @param scian
	 * @param sql
	 * @return
	 */
	Float getValorGiro(int id, String scian, String sql);




}
