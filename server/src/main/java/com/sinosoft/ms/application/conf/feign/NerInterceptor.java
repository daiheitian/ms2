package com.sinosoft.ms.application.conf.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Configuration;

/**
 * @author StringPeng
 */
@Configuration
public class NerInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        template.header("Content-Type", "application/json;charset=utf-8");
    }
}
