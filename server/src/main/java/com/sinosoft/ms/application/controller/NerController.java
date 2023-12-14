package com.sinosoft.ms.application.controller;

import com.sinosoft.ms.application.tunnel.NerClient;
import com.sinosoft.ms.application.tunnel.model.NerRes;
import com.sinosoft.ms.application.utils.ResponseData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@Slf4j
@RestController
@RequestMapping("ner")
public class NerController {

    @Resource
    NerClient nerClient;

    @GetMapping("es")
    public ResponseData estimate(@RequestParam("text") String text) {
        try {
            NerRes res = nerClient.test(text);
            return ResponseData.success(res);
        }
        catch (Exception ex) {
            log.error("执行失败", ex);
            return ResponseData.faild(500, "执行失败");
        }
    }
}
