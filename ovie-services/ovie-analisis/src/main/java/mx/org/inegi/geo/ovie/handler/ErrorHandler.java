/**
 * 
 */
package mx.org.inegi.geo.ovie.handler;

import java.sql.SQLException;

import org.apache.ibatis.exceptions.PersistenceException;
import org.mybatis.spring.MyBatisSystemException;
import org.postgresql.util.PSQLException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import mx.org.inegi.geo.ovie.web.response.ResponseFactory;
import mx.org.inegi.geo.ovie.web.response.ResponseFactory.UnsuccessfulResponse;



/**
 * @author femat
 * 
 */
@ControllerAdvice
@EnableWebMvc
public class ErrorHandler {		
	@ExceptionHandler(NumberFormatException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(NumberFormatException ex) {
		UnsuccessfulResponse ur = ResponseFactory.unsuccessful(ex
				.getMessage());
		return ur;
	}

	@ExceptionHandler(InvalidFormatException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(InvalidFormatException ex) {
		UnsuccessfulResponse ur = ResponseFactory.unsuccessful(ex
				.getMessage());
		return ur;
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(HttpMessageNotReadableException ex) {
		UnsuccessfulResponse ur = ResponseFactory.unsuccessful(ex
				.getMessage());
		return ur;
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(MethodArgumentNotValidException ex) {
		BindingResult result = ex.getBindingResult();
		StringBuilder sb = new StringBuilder();
		for (FieldError error : result.getFieldErrors()) {
			StringBuilder se = new StringBuilder();
			se.append("Field [");
			se.append(error.getField());
			se.append("] ");
			se.append(error.getDefaultMessage());
			se.append("\n");
			sb.append(se.toString());
		}
		String errors = sb.toString();
		return ResponseFactory.unsuccessful(errors);
	}

	@ExceptionHandler({ UncategorizedSQLException.class,
			BadSqlGrammarException.class, PSQLException.class,
			SQLException.class,DataIntegrityViolationException.class })
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public UnsuccessfulResponse unsuccessfulSql(Exception ex) {
		ex.printStackTrace();
		StringBuilder sb = new StringBuilder("Database error!");
		sb.append("\nPlease contact your administrator.");
		String message = sb.toString();
		return ResponseFactory.unsuccessful(message);

	}

	@ExceptionHandler(MyBatisSystemException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(MyBatisSystemException ex) {
		StringBuilder sb = new StringBuilder("MB error!");
		sb.append("\nPlease contact your administrator.");
		sb.append("\n "+ex.getMessage());
		String message = sb.toString();
		return ResponseFactory.unsuccessful(message);

	}

	@ExceptionHandler(PersistenceException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(PersistenceException ex) {
		StringBuilder sb = new StringBuilder("Persistence problem!");
		sb.append("\nPlease contact your administrator.");
		sb.append("\n" + ex.getMessage());
		String message = sb.toString();
		return ResponseFactory.unsuccessful(message);

	}

	@ExceptionHandler(CannotGetJdbcConnectionException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(CannotGetJdbcConnectionException ex) {
		StringBuilder sb = new StringBuilder("Could not get connection!");
		sb.append("\nPlease contact your administrator.");
		String message = sb.toString();
		return ResponseFactory.unsuccessful(message);

	}
	
	@ExceptionHandler(NullPointerException.class)
	@ResponseStatus(HttpStatus.OK)
	@ResponseBody
	public UnsuccessfulResponse unsuccessful(NullPointerException ex) {
		StringBuilder sb = new StringBuilder("");	
		String message = sb.toString();
		return ResponseFactory.unsuccessful(message);

	}
	
	
	


	
	



}


