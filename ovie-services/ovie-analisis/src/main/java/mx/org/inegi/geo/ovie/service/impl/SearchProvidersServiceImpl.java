package mx.org.inegi.geo.ovie.service.impl;


import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.model.ProviderInfo;
import mx.org.inegi.geo.ovie.persistence.SearchProvidersMapper;
import mx.org.inegi.geo.ovie.service.SearchProvidersService;

@Service
public class SearchProvidersServiceImpl implements SearchProvidersService {
	@Autowired
	SearchProvidersMapper mapper;

	@Override
	public List<Map<String,Object>> search(ProviderInfo info) {
		if (info.isParent()) {
			List<Integer> idProviders= mapper.catalogProvidersIdCveScian(info.getType());
			info.setIdProviders(idProviders);
		}				
		List<Map<String,Object>> providers= mapper.search(info);
		return providers;	
	}

	@Override
	public int selectCount(ProviderInfo info) {
	return	mapper.selectCount(info);
	
	}

	/* (non-Javadoc)
	 * @see mx.org.inegi.geo.ovie.service.SearchProvidersService#catalogProviders()
	 */
	@Override
	public List<LinkedHashMap<String, Object>> catalogProviders() {
		// TODO Auto-generated method stub
		return mapper.catalogProviders();
	}
	
	@Override
	public List<LinkedHashMap<String, Object>> catalogProvidersId(int id) {
		return mapper.catalogProvidersId(id);
	}

}
