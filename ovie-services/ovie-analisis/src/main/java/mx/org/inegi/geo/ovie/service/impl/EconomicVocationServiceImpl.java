package mx.org.inegi.geo.ovie.service.impl;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.domain.EconomicComposition;
import mx.org.inegi.geo.ovie.domain.IndicatorsVocation;
import mx.org.inegi.geo.ovie.domain.Specialization;
import mx.org.inegi.geo.ovie.persistence.EconomicVocationMapper;
import mx.org.inegi.geo.ovie.service.EconomicVocationService;

@Service
public class EconomicVocationServiceImpl implements EconomicVocationService {
	@Autowired
	private EconomicVocationMapper mapper;
	private Map<String, Object> actcons;

	@Override
	public IndicatorsVocation indicators(Long id, int cve) {
	
		IndicatorsVocation indicator = mapper.indicators(id);
		if (indicator != null) {
			indicator.setPonderador(mapper.getPonderador());	
			indicator.setIndsoeco(mapper.indeco(id));
			Specialization specialization = new Specialization();
			specialization.setPerocupado(mapper.specializationPerocupado(id));
			specialization.setProbruta(mapper.specializationProbruta(id));
			EconomicComposition economicComposition = new EconomicComposition();
			economicComposition.setComercio(mapper.economicCompositionComercio(id));
			economicComposition.setServicio(mapper.economicCompositionServicio(id));
			economicComposition.setIndustria(mapper.economicCompositionIndustria(id));
			indicator.setSpecialization(specialization);
			indicator.setCompeco(economicComposition);
			actcons = mapper.actcons(id, cve);
			if (actcons == null) {
				actcons = new LinkedHashMap<>();
				actcons.put("count", 0);
				actcons.put("desc_cort", mapper.getCatalogScian(cve));
			} else if (actcons.get("desc_cort") == null) {
				actcons.put("desc_cort", mapper.getCatalogScian(cve));
			}
			indicator.setActcons(actcons);
			return indicator;
		} else
			return null;
		
	}

}
