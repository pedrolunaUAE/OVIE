package mx.org.inegi.geo.ovie.service.impl;

import java.text.SimpleDateFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import mx.org.inegi.geo.ovie.config.MailConfig;
import mx.org.inegi.geo.ovie.model.AppointmentInfo;
import mx.org.inegi.geo.ovie.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	private static final Logger logger =
			LoggerFactory.getLogger(EmailServiceImpl.class);

	private final JavaMailSender mailSender;
	private final MailConfig mailConfig;

	public EmailServiceImpl(
			JavaMailSender mailSender,
			MailConfig mailConfig) {

		this.mailSender = mailSender;
		this.mailConfig = mailConfig;
	}

	@Override
	public boolean requestUser(AppointmentInfo info) {

		try {

			SimpleDateFormat formatter =
					new SimpleDateFormat("dd-MM-yyyy");

			String fecha =
					formatter.format(info.getRequest());

			SimpleMailMessage message =
					new SimpleMailMessage();

			message.setFrom(mailConfig.getFrom());
			message.setTo(info.getMail());
			message.setSubject("Cita Agendada");

			String body = """
                    Su cita ha sido agendada correctamente.

                    Fecha: %s
                    """.formatted(fecha);

			message.setText(body);

			mailSender.send(message);

			logger.info(
					"Correo enviado a usuario {}",
					info.getMail());

			return true;

		} catch (Exception e) {

			logger.error(
					"Error enviando correo al usuario",
					e);

			return false;
		}
	}

	@Override
	public boolean requestAdmin(
			AppointmentInfo info,
			String admin) {

		try {

			SimpleDateFormat formatter =
					new SimpleDateFormat("dd-MM-yyyy");

			String fecha =
					formatter.format(info.getRequest());

			String hora = getHorario(info.getSchedule());

			SimpleMailMessage message =
					new SimpleMailMessage();

			message.setFrom(mailConfig.getFrom());
			message.setTo(admin);
			message.setSubject("Solicitud de Agenda");

			String body = """
                    Nueva solicitud de cita.

                    Solicitante: %s
                    Correo: %s
                    Fecha: %s
                    Horario: %s
                    """
					.formatted(
							info.getName(),
							info.getMail(),
							fecha,
							hora);

			message.setText(body);

			mailSender.send(message);

			logger.info(
					"Correo enviado a administrador {}",
					admin);

			return true;

		} catch (Exception e) {

			logger.error(
					"Error enviando correo al administrador",
					e);

			return false;
		}
	}

	private String getHorario(int schedule) {

		return switch (schedule) {
			case 1 -> "10:00 - 11:00";
			case 2 -> "11:00 - 12:00";
			case 3 -> "12:00 - 13:00";
			case 4 -> "13:00 - 14:00";
			default -> "Horario no definido";
		};
	}
}