package mx.org.inegi.geo.ovie.service;

import mx.org.inegi.geo.ovie.model.AppointmentInfo;

public interface EmailService {
	boolean requestUser(AppointmentInfo info);

	boolean requestAdmin(
			AppointmentInfo info,
			String admin);
}
