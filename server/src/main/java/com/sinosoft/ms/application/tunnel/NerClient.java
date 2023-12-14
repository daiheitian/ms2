package com.sinosoft.ms.application.tunnel;

import com.sinosoft.ms.application.tunnel.model.NerRes;
import feign.Param;
import feign.RequestLine;

public interface NerClient {
    @RequestLine("GET /api/test?text={text}")
    NerRes test(@Param("text") String text);
}

