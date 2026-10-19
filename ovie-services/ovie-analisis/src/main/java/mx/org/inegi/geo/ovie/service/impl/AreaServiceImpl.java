/**
 * 
 */
package mx.org.inegi.geo.ovie.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mx.org.inegi.geo.ovie.domain.Area;
import mx.org.inegi.geo.ovie.domain.Indicators;
import mx.org.inegi.geo.ovie.persistence.AreaMapper;
import mx.org.inegi.geo.ovie.service.AreaService;

/**
 * @author femat
 *
 */
@Service
public class AreaServiceImpl implements AreaService {

	@Autowired
	private AreaMapper mapper;

	@Override
	public String findById(Long id) {
		String b = mapper.findById(id);
		return b;
	}

	@Override
	public Area findBuffer(Area area) {
		Area a = mapper.findBuffer(area);
		return a;
	}

	@Override
	@Transactional
	public Long add(Area area) {
		mapper.add(area);
		Long id = area.getId();
		return id;
	}

	@Override
	@Transactional
	public Area applyBuffer(Area area) {
		mapper.applyBuffer(area);
		Long id = area.getId();
		Area a = mapper.simplify(id);
		return a;

	}

	@Override
	public Indicators indicadores(Long id) {
		Indicators indicadores = new Indicators();
		indicadores = mapper.indicadores(id);
		if (indicadores != null) {
			indicadores.setUetotal(mapper.ueTotal(id));
			indicadores.setIndsoc(mapper.indsoc(id));
		}
		return indicadores;
	}

}
