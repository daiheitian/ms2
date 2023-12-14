package com.sinosoft.ms.application.conf.feign;

import com.sinosoft.ms.application.tunnel.NerClient;
import feign.Feign;
import feign.Logger;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.slf4j.Slf4jLogger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author StringPeng
 */
@Configuration
public class FeignClientConfig {

    @Value("${ner.url}")
    private String URL;
	
	/**
	 * im通讯的feign配置
	 * @param
	 * @return
	 */
    @Bean
    public NerClient nerClient(NerInterceptor nerInterceptor) {
        NerClient client = Feign.builder()
                .logLevel(Logger.Level.FULL)
                .logger(new Slf4jLogger(NerClient.class))
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .requestInterceptor(nerInterceptor)
                .target(NerClient.class, URL);
        return client;
    }
}
