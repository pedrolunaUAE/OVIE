package mx.org.inegi.geo.ovie.service;

import java.util.Map;

public interface SearchAreasService {

	public Map<String, Object> search(String q, String fq, int rows);
}
