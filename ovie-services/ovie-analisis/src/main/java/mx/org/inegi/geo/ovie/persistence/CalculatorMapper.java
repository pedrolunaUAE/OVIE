/**
 * 
 */
package mx.org.inegi.geo.ovie.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

/**
 * @author JUAN.LEOS
 *
 */
public interface CalculatorMapper {

	/**
	 * @param sup
	 * @return
	 */
	List<Map<String,Object>> getVariable(@Param("sup") int sup);

	/**
	 * @param alias
	 * @return
	 */
	String getsql(int di);

	/**
	 * @param id
	 * @param sql
	 * @return
	 */
	Float getValor(@Param ("id") int id, @Param("sql")String sql);

	/**
	 * @param id
	 * @param scian
	 * @param sql
	 * @return
	 */
	Float getValorGiro(@Param ("id") int id,@Param ("scian") String scian, @Param("sql") String sql);



}
