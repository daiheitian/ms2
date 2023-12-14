package com.sinosoft.ms.application.controller;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;
import cn.hutool.captcha.ShearCaptcha;
import cn.hutool.core.codec.Base64;
import cn.hutool.crypto.SecureUtil;
import com.sinosoft.ms.application.aop.SystemLogAnnation;
import com.sinosoft.ms.application.security.SecurityHelper;
import com.sinosoft.ms.application.service.OperateLogInfoService;
import com.sinosoft.ms.application.utils.ResponseData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.KeyPair;

@RestController
@Slf4j
public class HomeController {
    @PostMapping("login")
    @SystemLogAnnation(description = "用户登录")
    public void login() {
        log.info("login");
    }

    @GetMapping("captcha")
    public void captcha(HttpServletResponse res, @RequestParam("s") String s) {
        //定义图形验证码的长、宽、验证码字符数、干扰线宽度
        LineCaptcha captcha = CaptchaUtil.createLineCaptcha(120, 30, 4, 0);
        //ShearCaptcha captcha = new ShearCaptcha(200, 100, 4, 4);
//图形验证码写出，可以写出到文件，也可以写出到流
        try {
            SecurityHelper.captchas.put(s, captcha.getCode());
            captcha.write(res.getOutputStream());
            res.getOutputStream().close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @GetMapping("re")
    public ResponseData refresh() {
//        List<UserEntity> list = service.list();
//        list.forEach(entity -> {
//            entity.setPassword(SecurityHelper.encodePassword("Hbszy@2023"));
//        });
//        service.updateBatchById(list);

        KeyPair pair = SecureUtil.generateKeyPair("RSA");
        System.out.println("private:"+ Base64.encode(pair.getPrivate().getEncoded()));
        System.out.println("private:"+ Base64.encode(pair.getPublic().getEncoded()));
        return ResponseData.success(null);
    }
}
