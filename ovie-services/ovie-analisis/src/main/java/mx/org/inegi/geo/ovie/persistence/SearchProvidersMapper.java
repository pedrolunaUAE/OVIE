package mx.org.inegi.geo.ovie.persistence;


import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import mx.org.inegi.geo.ovie.model.ProviderInfo;

public interface SearchProvidersMapper {

	List<Map<String,Object>> search(ProviderInfo info);

	int selectCount(ProviderInfo info);

	List<LinkedHashMap<String, Object>> catalogProvidersId(int id);
	
	List<Integer> catalogProvidersIdCveScian(int id);

	/**
	 * @return
	 */
	List<LinkedHashMap<String, Object>> catalogProviders();

}
