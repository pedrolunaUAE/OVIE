package mx.org.inegi.geo.ovie.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import mx.org.inegi.geo.ovie.model.ProviderInfo;

public interface SearchProvidersService {

	List<Map<String, Object>> search(ProviderInfo info);

	int selectCount(ProviderInfo info);
	
	List<LinkedHashMap<String, Object>> catalogProviders();

	List<LinkedHashMap<String, Object>> catalogProvidersId(int id);

}
