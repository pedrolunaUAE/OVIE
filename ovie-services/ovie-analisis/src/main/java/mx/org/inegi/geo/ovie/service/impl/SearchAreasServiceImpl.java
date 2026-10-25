package mx.org.inegi.geo.ovie.service.impl;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.domain.SearchArea;
import mx.org.inegi.geo.ovie.persistence.SearchAreasMapper;
import mx.org.inegi.geo.ovie.service.SearchAreasService;

@Service
public class SearchAreasServiceImpl implements SearchAreasService {

	private static final int MAX_ROWS = 200;

	private static final int MAX_TOKENS = 8;

	private static final Pattern FQ_TIPO = Pattern.compile("tipo\\s*:\\s*\"([^\"]+)\"");

	@Autowired
	SearchAreasMapper mapper;

	/**
	 * Devuelve la respuesta con la misma estructura que Solr (response.docs,
	 * response.numFound, facet_counts.facet_fields.tipo) para que el widget de
	 * búsqueda del cliente la procese sin cambios.
	 */
	public Map<String, Object> search(String q, String fq, int rows) {
		List<String> tokens = tokenize(q);
		String tipo = parseTipo(fq);
		int limit = Math.max(1, Math.min(rows, MAX_ROWS));

		List<SearchArea> docs = new ArrayList<SearchArea>();
		List<Object> facets = new ArrayList<Object>();
		long numFound = 0;

		if (!tokens.isEmpty()) {
			for (Map<String, Object> row : mapper.countByTipo(tokens, tipo)) {
				long total = ((Number) row.get("total")).longValue();
				facets.add(row.get("tipo"));
				facets.add(total);
				numFound += total;
			}
			if (numFound > 0) {
				docs = mapper.search(tokens, tipo, limit);
			}
		}

		Map<String, Object> response = new LinkedHashMap<String, Object>();
		response.put("numFound", numFound);
		response.put("start", 0);
		response.put("docs", docs);

		Map<String, Object> facetFields = new LinkedHashMap<String, Object>();
		facetFields.put("tipo", facets);
		Map<String, Object> facetCounts = new LinkedHashMap<String, Object>();
		facetCounts.put("facet_fields", facetFields);

		Map<String, Object> result = new LinkedHashMap<String, Object>();
		result.put("response", response);
		result.put("facet_counts", facetCounts);
		return result;
	}

	private List<String> tokenize(String q) {
		List<String> tokens = new ArrayList<String>();
		if (q == null) {
			return tokens;
		}
		String normalized = Normalizer.normalize(q.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
				.replaceAll("\\p{M}", "");
		for (String t : normalized.split("[\\s,]+")) {
			if (t.isEmpty()) {
				continue;
			}
			tokens.add(t.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_"));
			if (tokens.size() == MAX_TOKENS) {
				break;
			}
		}
		return tokens;
	}

	private String parseTipo(String fq) {
		if (fq == null) {
			return null;
		}
		Matcher m = FQ_TIPO.matcher(fq);
		return m.find() ? m.group(1) : null;
	}

}
