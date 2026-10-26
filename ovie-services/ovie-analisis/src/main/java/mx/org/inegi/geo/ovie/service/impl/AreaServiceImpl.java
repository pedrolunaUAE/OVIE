/**
 * 
 */
package mx.org.inegi.geo.ovie.service.impl;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

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

	/**
	 * Nombres que el cliente envía como "type" al crear un área de influencia.
	 * Van directo al SQL (ovie_web.${type}), así que solo se aceptan estos.
	 */
	private static final Set<String> BUFFER_TABLES = Collections.unmodifiableSet(new HashSet<String>(
			Arrays.asList("colonias", "localidades_busqueda")));

	private static final int MAX_BUFFER_METERS = 50000;

	@Autowired
	private AreaMapper mapper;

	@Override
	public String findById(Long id) {
		String b = mapper.findById(id);
		return b;
	}

	@Override
	public Area findBuffer(Area area) {
		if (area == null || area.getType() == null || !BUFFER_TABLES.contains(area.getType())) {
			return null;
		}
		Integer size = area.getSizeBuffer();
		if (size == null || size < 0 || size > MAX_BUFFER_METERS) {
			return null;
		}
		return mapper.findBuffer(area);
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
