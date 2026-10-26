/**
 * 
 */
package mx.org.inegi.geo.ovie.service.impl;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

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
	private static final Pattern SCIAN = Pattern.compile("\\d{2,6}");

	private static final Pattern FORBIDDEN_SQL = Pattern.compile(
			"(?i)(;|--|/\\*|\\*/|\\b(insert|update|delete|drop|alter|truncate|copy|grant|revoke|create|execute|call|union)\\b)");

	/**
	 * El texto sale de cat_variable_cal y se ejecuta con ${sql}. Solo se acepta
	 * un SELECT del catálogo, con los parámetros #{id} y #{scian}.
	 */
	public static boolean isCatalogSelect(String sql) {
		if (sql == null) {
			return false;
		}
		String text = sql.trim();
		if (text.length() < 6 || !text.regionMatches(true, 0, "select", 0, 6)) {
			return false;
		}
		if (FORBIDDEN_SQL.matcher(text).find()) {
			return false;
		}
		String withoutParams = text.replace("#{id}", "").replace("#{scian}", "");
		return withoutParams.indexOf("${") < 0 && withoutParams.indexOf("#{") < 0;
	}

	public static boolean isScian(String scian) {
		return scian != null && SCIAN.matcher(scian).matches();
	}

	@Override
	public Float getValor(int id, String sql) {
		if (!isCatalogSelect(sql)) {
			return null;
		}
		return mapper.getValor(id,sql);
	}

	/* (non-Javadoc)
	 * @see mx.org.inegi.geo.ovie.service.CalculatorService#getValorGiro(int, java.lang.String, java.lang.String)
	 */
	@Override
	public Float getValorGiro(int id, String scian, String sql) {
		if (!isScian(scian) || !isCatalogSelect(sql) || sql.indexOf("#{scian}") < 0) {
			return null;
		}
		return mapper.getValorGiro(id,scian,sql);
	}





}
