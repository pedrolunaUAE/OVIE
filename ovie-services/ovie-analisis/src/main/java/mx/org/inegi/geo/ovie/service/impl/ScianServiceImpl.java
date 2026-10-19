package mx.org.inegi.geo.ovie.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.persistence.ScianMapper;
import mx.org.inegi.geo.ovie.domain.OvieScian;
import mx.org.inegi.geo.ovie.service.ScianService;

@Service
public class ScianServiceImpl implements ScianService{
	@Autowired
	ScianMapper mapper;
	public int findIdleCount(){
		return mapper.findIdleCount();
	}
	public List <OvieScian> findIdle(int limit, int offset){
		return mapper.findIdle(limit, offset);
	}
	
}
