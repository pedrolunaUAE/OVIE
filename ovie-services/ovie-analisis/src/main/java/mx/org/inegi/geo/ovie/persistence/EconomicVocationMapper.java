package mx.org.inegi.geo.ovie.persistence;

import java.util.Map;

import org.apache.ibatis.annotations.Param;

import mx.org.inegi.geo.ovie.domain.DefinedSpecialization;
import mx.org.inegi.geo.ovie.domain.IndicatorsVocation;

public interface EconomicVocationMapper {

	public IndicatorsVocation indicators(Long id);
	
//	public Specialization specialization(@Param ("id")Long id,@Param("tipo") String tipo);
	
	
	public DefinedSpecialization specializationPerocupado(@Param ("id")Long id);
	
	public DefinedSpecialization specializationProbruta(@Param ("id")Long id); 
	
	public Map<String,Object> actcons (@Param ("id") Long id, @Param ("cve") int cve);

	/**
	 * @param id
	 * @return
	 */
	public Object getCatalogScian(int id);

	/**
	 * @param id
	 * @return
	 */
	public float indeco(Long id);

	/**
	 * @return
	 */
	public float getPonderador();

	/**
	 * @return
	 */
	public float economicCompositionComercio( Long id);

	/**
	 * @return
	 */
	public float economicCompositionServicio(Long id);

	/**
	 * @return
	 */
	public float economicCompositionIndustria( Long id);

}
