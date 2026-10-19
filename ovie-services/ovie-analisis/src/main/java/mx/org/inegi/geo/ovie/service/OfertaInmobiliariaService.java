package mx.org.inegi.geo.ovie.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import mx.org.inegi.geo.ovie.domain.FotosInmobiliaria;
import mx.org.inegi.geo.ovie.domain.OfertaInmobiliaria;

public interface OfertaInmobiliariaService {
    int insertInm(@Param("oferta") OfertaInmobiliaria oferta);

    int updateInm(@Param("oferta") OfertaInmobiliaria oferta);

    boolean insertImg(@Param("fotos") List <FotosInmobiliaria> fotos);

    List<OfertaInmobiliaria> selectInm(@Param("estatus") Integer estatus);

    List<FotosInmobiliaria> selectImg(@Param("id_inm") Long id_inm);

    List<OfertaInmobiliaria> selectByID(@Param("id_inm") Integer id_inm);

    public List<Map<String,Object>> selectByTitle();
}
