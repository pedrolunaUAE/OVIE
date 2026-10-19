package mx.org.inegi.geo.ovie.service;

import java.util.List;
import java.util.Map;

import mx.org.inegi.geo.ovie.model.AppointmentInfo;

public interface AppointmentService {
	
	List<Map<String, Object>> days(AppointmentInfo it);
	
	void add(AppointmentInfo info);

	List<Map<String, Object>> schedules();

}
