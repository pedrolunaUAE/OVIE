package mx.org.inegi.geo.ovie.service;


import java.util.List;

import mx.org.inegi.geo.ovie.domain.OvieScian;

public interface ScianService {
	public int findIdleCount();
	public List <OvieScian> findIdle(int limit, int offset);
}
