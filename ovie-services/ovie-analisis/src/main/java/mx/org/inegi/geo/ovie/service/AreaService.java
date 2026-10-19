/**
 * 
 */
package mx.org.inegi.geo.ovie.service;

import mx.org.inegi.geo.ovie.domain.Area;
import mx.org.inegi.geo.ovie.domain.Indicators;

/**
 * @author femat
 *
 */
public interface AreaService {

	public String findById(Long id);

	public Area findBuffer(Area area);

	public Long add(Area area);

	public Area applyBuffer(Area area);

	public Indicators indicadores(Long id);

}
