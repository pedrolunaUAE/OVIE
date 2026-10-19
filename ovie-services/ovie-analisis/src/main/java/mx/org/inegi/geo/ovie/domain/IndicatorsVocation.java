package mx.org.inegi.geo.ovie.domain;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class IndicatorsVocation {

	private int id;

	private float uetotal; // Total Unidades Economicas

	private float totemple;// Personal Ocupado-- TOTAL DE EMPLEADOS

	private float reprom;// Remuneracion promedio

	private float pl; // Productividad Laboral

	private Map<String, Object> actcons; // Actividad Consultada

	private List<Map<String, Object>> actpre;// Actividad predominante

	private EconomicComposition compeco;// Composicion economica

	private List<Map<String, Object>> moda; // moda

	// private Specialization specialization; // Escecializacion
	private Specialization specialization; // Escecializacion

	private float indsoeco; // Indice de Desarrollo Economico
	
	@JsonIgnore
	private float ponderador;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public float getUetotal() {
		return uetotal;
	}

	public void setUetotal(float uetotal) {
		this.uetotal = uetotal;
	}

	public float getTotemple() {
		return totemple;
	}

	public void setTotemple(float totemple) {
		this.totemple = totemple;
	}

	/**
	 * @return the reprom
	 */
	public float getReprom() {
		reprom= (reprom/ponderador)*100;
		return reprom;
	}

	/**
	 * @param reprom
	 *            the reprom to set
	 */
	public void setReprom(float reprom) {		
		this.reprom = reprom;
	}

	/**
	 * @return the pl
	 */
	public float getPl() {
		pl=(pl/ponderador)*100;
		return pl;
	}

	/**
	 * @param pl
	 *            the pl to set
	 */
	public void setPl(float pl) {		
		this.pl = pl;
	}

	/**
	 * @return the actcons
	 */
	public Map<String, Object> getActcons() {
		return actcons;
	}

	/**
	 * @param actcons
	 *            the actcons to set
	 */
	public void setActcons(Map<String, Object> actcons) {
		this.actcons = actcons;
	}

	/**
	 * @return the moda
	 */
	public List<Map<String, Object>> getModa() {
		return moda;
	}

	/**
	 * @param moda
	 *            the moda to set
	 */
	public void setModa(List<Map<String, Object>> moda) {
		this.moda = moda;
	}

	/**
	 * @return the actpre
	 */
	public List<Map<String, Object>> getActpre() {
		return actpre;
	}

	/**
	 * @param actpre
	 *            the actpre to set
	 */
	public void setActpre(List<Map<String, Object>> actpre) {
		this.actpre = actpre;
	}

	public EconomicComposition getCompeco() {
		return compeco;
	}

	public void setCompeco(EconomicComposition compeco) {
		this.compeco = compeco;
	}

	// public Specialization getSpecialization() {
	// return specialization;
	// }
	//
	// public void setSpecialization(Specialization specialization) {
	// this.specialization = specialization;
	// }

	/**
	 * @return the specialization
	 */
	public Specialization getSpecialization() {
		return specialization;
	}

	/**
	 * @param specialization
	 *            the specialization to set
	 */
	public void setSpecialization(Specialization specialization) {
		this.specialization = specialization;
	}

	/**
	 * @param indsoeco
	 *            the indsoeco to set
	 */
	public void setIndsoeco(float indsoeco) {
		this.indsoeco = indsoeco;
	}

	/**
	 * @return the indsoeco
	 */
	public float getIndsoeco() {
		return indsoeco;
	}
	
	/**
	 * @param ponderador the ponderador to set
	 */
	public void setPonderador(float ponderador) {
		this.ponderador = ponderador;
	}
	/**
	 * @return the ponderador
	 */
	public float getPonderador() {
		return ponderador;
	}

}
