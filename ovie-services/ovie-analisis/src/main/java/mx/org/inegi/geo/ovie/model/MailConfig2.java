package mx.org.inegi.geo.ovie.model;

import org.springframework.beans.factory.annotation.Value;

public class MailConfig2{
	
	private String mailConfig= "mailConfigDev";
	
	@Value("${protocol}")
	private String protocol;
	
	@Value("${starttls}")
	private String starttls;
	
	@Value("${host}")
	private String host;
	
	@Value("${port}")
	private String port;
	
	@Value("${auth}")
	private String auth;
	
	@Value("${from}")
	private String user;
	
	@Value("${pass}")
	private String pass;

	public String getmailConfig() {
		return mailConfig;
	}

	public void setName(String mailConfig) {
		this.mailConfig = mailConfig;
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getStarttls() {
		return starttls;
	}

	public void setStarttls(String starttls) {
		this.starttls = starttls;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getAuth() {
		return auth;
	}

	public void setAuth(String auth) {
		this.auth = auth;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}
	
	@Override
	public String toString() {
	        return "MailConfig "+protocol+auth+user+pass;
	}
}
