package mx.org.inegi.geo.ovie.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import mx.org.inegi.geo.ovie.domain.OfertaLaboral;

public interface OfertaLaboralService {
    boolean insertLab(@Param("oferta") OfertaLaboral oferta);

    boolean updateLab(@Param("oferta") OfertaLaboral oferta);

    List<OfertaLaboral> selectLab(@Param("estatus") Integer estatus);

    List<OfertaLaboral> selectByID(@Param("id_lab") Integer id_lab);

    List<Map<String, Object>> selectByTitle();
}
