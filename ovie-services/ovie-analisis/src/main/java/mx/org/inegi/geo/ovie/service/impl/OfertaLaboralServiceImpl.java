package mx.org.inegi.geo.ovie.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.domain.OfertaLaboral;
import mx.org.inegi.geo.ovie.persistence.OfertaLaboralMapper;
import mx.org.inegi.geo.ovie.service.OfertaLaboralService;

@Service
public class OfertaLaboralServiceImpl implements OfertaLaboralService {
    @Autowired
    OfertaLaboralMapper of;

    public boolean insertLab(@Param("oferta") OfertaLaboral oferta) {
	return of.insertLab(oferta);
    }

    public boolean updateLab(@Param("oferta") OfertaLaboral oferta) {
	return of.updateLab(oferta);
    }

    public List <OfertaLaboral> selectLab(@Param("estaus") Integer estatus) {
	return of.selectLab(estatus);
    }

    public List<OfertaLaboral> selectByID(@Param("id_lab") Integer id_lab){
	return of.selectByID(id_lab);
    }

    public List<Map<String, Object>> selectByTitle(){
	return of.selectByTitle();
    }
}
