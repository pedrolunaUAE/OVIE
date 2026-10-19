package mx.org.inegi.geo.ovie.persistence;

import java.util.List;
import java.util.Map;

import mx.org.inegi.geo.ovie.model.AppointmentInfo;

public interface AppointmentMapper {

	List<Map<String, Object>> days(AppointmentInfo it);
	
	void add(AppointmentInfo info);

	List<Map<String, Object>> schedules();
}
