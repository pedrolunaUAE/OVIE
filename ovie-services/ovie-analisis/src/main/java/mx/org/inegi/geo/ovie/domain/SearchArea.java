package mx.org.inegi.geo.ovie.domain;

/**
 * Resultado de búsqueda de áreas con los mismos nombres de campo que el
 * índice Solr que consume el cliente (busqueda, tipo, tabla, wkt, ...).
 */
public class SearchArea {

	private Long id;

	private String busqueda;

	private String tipo;

	private String tabla;

	private String geomtype;

	private String wkt;

	private String coord_merc;

	private String locacion;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getBusqueda() {
		return busqueda;
	}

	public void setBusqueda(String busqueda) {
		this.busqueda = busqueda;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public String getTabla() {
		return tabla;
	}

	public void setTabla(String tabla) {
		this.tabla = tabla;
	}

	public String getGeomtype() {
		return geomtype;
	}

	public void setGeomtype(String geomtype) {
		this.geomtype = geomtype;
	}

	public String getWkt() {
		return wkt;
	}

	public void setWkt(String wkt) {
		this.wkt = wkt;
	}

	public String getCoord_merc() {
		return coord_merc;
	}

	public void setCoord_merc(String coord_merc) {
		this.coord_merc = coord_merc;
	}

	public String getLocacion() {
		return locacion;
	}

	public void setLocacion(String locacion) {
		this.locacion = locacion;
	}

}
