package mx.org.inegi.geo.ovie.config;

import mx.org.inegi.geo.ovie.util.Pagination;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OvieAnalisisConfig {

    @Bean
    public Pagination pagination() {
        return new Pagination();
    }
}
