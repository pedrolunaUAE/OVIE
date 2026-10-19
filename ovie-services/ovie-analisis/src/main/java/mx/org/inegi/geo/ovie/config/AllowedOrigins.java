package mx.org.inegi.geo.ovie.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "planeacion")
public class AllowedOrigins {
    private List<String> allowedOrigin;

    public List<String> getAllowedOrigins() {
        return allowedOrigin;
    }

    public void setAllowedOrigins(List<String> allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

}
