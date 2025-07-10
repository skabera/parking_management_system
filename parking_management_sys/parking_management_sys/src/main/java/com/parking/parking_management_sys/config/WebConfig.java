package com.parking.parking_management_sys.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // frontend (Vite)
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
