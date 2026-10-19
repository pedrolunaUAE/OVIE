package mx.org.inegi.geo.ovie.web.controller;

import java.util.List;
import java.util.Map;

import mx.org.inegi.geo.ovie.config.MailConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mx.org.inegi.geo.ovie.model.AppointmentInfo;
import mx.org.inegi.geo.ovie.service.AppointmentService;
import mx.org.inegi.geo.ovie.service.EmailService;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory;

@RestController
@RequestMapping("appointment")
public class AppointmentController {

	@Autowired
	AppointmentService service;
	@Autowired
	MailConfig mailConfig;
	@Autowired
	EmailService emailService;

	@RequestMapping(value = "add", method = RequestMethod.POST)
	public Object add(@RequestBody AppointmentInfo info) throws Exception {

		service.add(info);

		boolean responseUser =
				emailService.requestUser(info);

		if (!responseUser) {
			return ResponseFactory.unsuccessful(
					"Error al agendar la cita");
		}

		boolean responseAdmin =
				emailService.requestAdmin(
						info,
						mailConfig.getFrom());

		if (!responseAdmin) {
			return ResponseFactory.unsuccessful(
					"Error al enviar la solicitud de agenda");
		}

		return ResponseFactory.successful(
				"Cita Agendada");
	}

	@RequestMapping(value = "schedules", method = RequestMethod.POST)
	public Object schedules() throws Exception {
		List<Map<String, Object>> schedules = service.schedules();
		return ResponseFactory.successful("Horarios", schedules);
	}

	@RequestMapping(value = "days", method = RequestMethod.POST)
	public Object days(@RequestBody AppointmentInfo it) throws Exception {
		List<Map<String, Object>> days = service.days(it);
		System.out.println(days);
		return ResponseFactory.successful("Agenda", days);
	}

}
