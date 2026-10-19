package mx.org.inegi.geo.ovie.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.model.AppointmentInfo;
import mx.org.inegi.geo.ovie.persistence.AppointmentMapper;
import mx.org.inegi.geo.ovie.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService{
	@Autowired
	AppointmentMapper mapper;
	
	@Override
	public void add(AppointmentInfo info) {
		mapper.add(info);
	}

	@Override
	public List<Map<String, Object>> schedules() {
		return mapper.schedules();
		
	}
	
	@Override
	public List<Map<String, Object>> days(AppointmentInfo it) {
		return mapper.days(it);
	}

}
