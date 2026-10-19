package mx.org.inegi.geo.ovie.web.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

public class ResponseFactory {
	public ResponseFactory() {
	}

	public static SuccessfulResponse successful() {
		SuccessfulResponse r = new SuccessfulResponse();
		return r;
	}

	public static SuccessfulResponse successful(String message) {
		SuccessfulResponse r = new SuccessfulResponse(message);
		return r;
	}

	public static SuccessfulResponse successful(Map<String, Object> map) {
		SuccessfulResponse r = new SuccessfulResponse();

		for(Map.Entry<String, Object> e : map.entrySet()) {
			r.addField((String)e.getKey(), e.getValue());
		}

		return r;
	}

	public static SuccessfulResponse successful(String key, Object value) {
		SuccessfulResponse r = new SuccessfulResponse(key, value);
		return r;
	}

	public static SuccessfulResponse successful(String key, Object value, String message) {
		SuccessfulResponse r = new SuccessfulResponse(key, value, message);
		return r;
	}

	public static UnsuccessfulResponse unsuccessful() {
		UnsuccessfulResponse r = new UnsuccessfulResponse();
		return r;
	}

	public static UnsuccessfulResponse unsuccessful(String message) {
		UnsuccessfulResponse r = new UnsuccessfulResponse(message);
		return r;
	}

	public static UnsuccessfulResponse unsuccessful(Map<String, Object> map) {
		UnsuccessfulResponse r = new UnsuccessfulResponse();

		for(Map.Entry<String, Object> e : map.entrySet()) {
			r.addField((String)e.getKey(), e.getValue());
		}

		return r;
	}

	public static UnsuccessfulResponse unsuccessful(String key, Object value) {
		UnsuccessfulResponse r = new UnsuccessfulResponse(key, value);
		return r;
	}

	public static UnsuccessfulResponse unsuccessful(String key, Object value, String message) {
		UnsuccessfulResponse r = new UnsuccessfulResponse(key, value, message);
		return r;
	}

	public static class SuccessfulResponse implements Serializable {
		@JsonProperty
		private final ResponseStatus response = new ResponseStatus();
		@JsonProperty
		private Map<String, Object> data = new LinkedHashMap();
		private final boolean success = true;
		private final String message = "OK";

		public SuccessfulResponse() {
			this.response.setSuccess(true);
			this.response.setMessage("OK");
		}

		public SuccessfulResponse(String message) {
			this.response.setSuccess(true);
			this.response.setMessage(message);
		}

		public SuccessfulResponse(String key, Object value) {
			this.response.setSuccess(true);
			this.response.setMessage("OK");
			this.data.put(key, value);
		}

		public SuccessfulResponse(String key, Object value, String message) {
			this.response.setSuccess(true);
			this.response.setMessage(message);
			this.data.put(key, value);
		}

		public SuccessfulResponse addField(String key, Object value) {
			this.data.put(key, value);
			return this;
		}

		public String toString() {
			return "SuccessfulResponse [response=" + this.response + ", data=" + this.data.toString() + "]";
		}
	}

	public static class UnsuccessfulResponse implements Serializable {
		@JsonProperty
		private final ResponseStatus response = new ResponseStatus();
		@JsonProperty
		private Map<String, Object> data = new LinkedHashMap();
		private final boolean success = false;
		private final String message = "NOT OK";

		public UnsuccessfulResponse() {
			this.response.setSuccess(false);
			this.response.setMessage("NOT OK");
		}

		public UnsuccessfulResponse(String message) {
			this.response.setSuccess(false);
			this.response.setMessage(message);
		}

		public UnsuccessfulResponse(String key, Object value) {
			this.response.setSuccess(false);
			this.response.setMessage("NOT OK");
			this.data.put(key, value);
		}

		public UnsuccessfulResponse(String key, Object value, String message) {
			this.response.setSuccess(false);
			this.response.setMessage(message);
			this.data.put(key, value);
		}

		public UnsuccessfulResponse addField(String key, Object value) {
			this.data.put(key, value);
			return this;
		}

		public String toString() {
			return "SuccessfulResponse [response=" + this.response + ", data=" + this.data.toString() + "]";
		}
	}
}
