package mx.org.inegi.geo.ovie.persistence;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import mx.org.inegi.geo.ovie.domain.OfertaLaboral;

public interface OfertaLaboralMapper {
    boolean insertLab(@Param("oferta") OfertaLaboral oferta);

    boolean updateLab(@Param("oferta") OfertaLaboral oferta);

    List<OfertaLaboral> selectLab(@Param("estatus") Integer estatus);
    
    List<OfertaLaboral> selectByID(@Param("id_lab") Integer id_inm);
    
    public List<Map<String, Object>> selectByTitle();
}
