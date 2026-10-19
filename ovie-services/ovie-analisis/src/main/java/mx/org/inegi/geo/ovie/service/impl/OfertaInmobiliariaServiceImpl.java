package mx.org.inegi.geo.ovie.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mx.org.inegi.geo.ovie.domain.FotosInmobiliaria;
import mx.org.inegi.geo.ovie.domain.OfertaInmobiliaria;
import mx.org.inegi.geo.ovie.persistence.OfertaInmobiliariaMapper;
import mx.org.inegi.geo.ovie.service.OfertaInmobiliariaService;

@Service
public class OfertaInmobiliariaServiceImpl implements OfertaInmobiliariaService {
    @Autowired
    OfertaInmobiliariaMapper of;

    public int insertInm(@Param("oferta") OfertaInmobiliaria oferta) {
	return of.insertInm(oferta);
    }

    public int updateInm(@Param("oferta") OfertaInmobiliaria oferta) {
	return of.updateInm(oferta);
    }

    public boolean insertImg(@Param("fotos") List <FotosInmobiliaria> fotos) {
	return of.insertImg(fotos);
    }

    public List<OfertaInmobiliaria> selectInm(@Param("estatus") Integer estatus) {
	return of.selectInm(estatus);
    }

    public List<FotosInmobiliaria> selectImg(@Param("id_inm") Long id_inm) {
	return of.selectImg(id_inm);
    }
    
    public List<OfertaInmobiliaria> selectByID(@Param("id_inm") Integer id_inm){
	return of.selectByID(id_inm);
    }
        
    public List<Map<String,Object>> selectByTitle(){
	
	return of.selectByTitle();
    }
    
}
