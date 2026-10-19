package mx.org.inegi.geo.ovie.model;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

@SuppressWarnings("serial")
public class MyDateDeSerializer extends StdDeserializer<Date> {

    protected MyDateDeSerializer() {
	super(String.class);
    }

    @Override
    public Date deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
	JsonNode node = p.getCodec().readTree(p);
	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	Date result = null;
	try {
	    result = dateFormat.parse(node.asText());
	} catch (ParseException e) {
	    throw new RuntimeException("Expected yyyy-MM-dd");
	}
	return result;
    }

}
