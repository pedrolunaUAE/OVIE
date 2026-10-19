/**
 * 
 */
package mx.org.inegi.geo.ovie.web.response;

/**
 * @author femat
 *
 */
public class ResponseStatus {

	private boolean success;

	private String message;

	public ResponseStatus() {

	}

	public ResponseStatus(boolean status, String message) {
		this.success = status;
		this.message = message;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
