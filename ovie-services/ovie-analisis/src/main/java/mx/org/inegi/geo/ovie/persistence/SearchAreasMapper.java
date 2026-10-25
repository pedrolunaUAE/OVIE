package mx.org.inegi.geo.ovie.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import mx.org.inegi.geo.ovie.domain.SearchArea;

public interface SearchAreasMapper {

	public List<SearchArea> search(@Param("tokens") List<String> tokens, @Param("tipo") String tipo,
			@Param("rows") int rows);

	public List<Map<String, Object>> countByTipo(@Param("tokens") List<String> tokens, @Param("tipo") String tipo);
}
