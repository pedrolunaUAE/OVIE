/**
 * 
 */
package mx.org.inegi.geo.ovie.model;

/**
 * @author femat
 *
 */
public enum AreaType {

	Municipio("municipios"), localidad("localidades"), Colonia("colonias"), Sitiodeinterés("hitos_v1"), Calle("e09");

	private AreaType(String table) {
		this.table = table;
	}

	public String getTable() {
		return table;
	}

	private final String table;

}
