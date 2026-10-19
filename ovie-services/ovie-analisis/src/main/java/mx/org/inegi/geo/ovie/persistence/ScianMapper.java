package mx.org.inegi.geo.ovie.persistence;

import java.util.List;

import mx.org.inegi.geo.ovie.domain.OvieScian;

public interface ScianMapper {

	
	public int findIdleCount();
	
	public List <OvieScian> findIdle(int limit, int offset);
}

