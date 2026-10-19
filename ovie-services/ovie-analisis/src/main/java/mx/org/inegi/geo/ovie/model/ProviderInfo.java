package mx.org.inegi.geo.ovie.model;



import java.util.List;

import jakarta.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

public class ProviderInfo {
	/**
	 * 
	 */

	private Long id;

	@NotNull
	private Integer type;

	@NotEmpty
	private String point;

	private boolean parent;
	
	private List<Integer> idProviders;

	// @NotNull
	// @Min(1)
	private int page;

	// @NotNull
	// @Range(min = 5, max = 50)
	private int limit;

	private int offset;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the type
	 */
	public Integer getType() {
		return type;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(Integer type) {
		this.type = type;
	}

	public String getPoint() {
		return point;
	}

	public void setPoint(String point) {
		this.point = point;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public int getOffset() {
		return offset;
	}

	public void setOffset(int offset) {
		this.offset = offset;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getPage() {
		return page;
	}

	/**
	 * @return the parent
	 */
	public boolean isParent() {
		return parent;
	}

	/**
	 * @param parent
	 *            the parent to set
	 */
	public void setParent(boolean parent) {
		this.parent = parent;
	}
	/**
	 * @return the idProviders
	 */
	public List<Integer> getIdProviders() {
		return idProviders;
	}
	/**
	 * @param idProviders the idProviders to set
	 */
	public void setIdProviders(List<Integer> idProviders) {
		this.idProviders = idProviders;
	}

}
