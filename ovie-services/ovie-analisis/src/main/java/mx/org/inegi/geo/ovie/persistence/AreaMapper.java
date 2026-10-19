package mx.org.inegi.geo.ovie.persistence;
/**
 * 
 */

import mx.org.inegi.geo.ovie.domain.Area;
import mx.org.inegi.geo.ovie.domain.Indicators;

/**
 * @author femat
 *
 */
public interface AreaMapper {

	public String findById(Long id);

	public Area findBuffer(Area area);

	public Area simplify(Long id);

	public void add(Area area);

	public void applyBuffer(Area area);

	public Indicators indicadores(Long id);

	public float ueTotal(Long id);

	/**
	 * @param id
	 * @return
	 */
	public float indsoc(Long id);

}
