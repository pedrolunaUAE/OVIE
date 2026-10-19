/**
 * 
 */
package mx.org.inegi.geo.ovie.domain;

/**
 * @author femat
 *
 */
public class Area {

	private Long id;

	private String geometry;

	private String type;

	private Integer sizeBuffer;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getGeometry() {
		return geometry;
	}

	public void setGeometry(String geometry) {
		this.geometry = geometry;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getSizeBuffer() {
		return sizeBuffer;
	}

	public void setSizeBuffer(Integer sizeBuffer) {
		this.sizeBuffer = sizeBuffer;
	}

}
