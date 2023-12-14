package com.sinosoft.ms.application.security.filter;


import cn.hutool.crypto.SecureUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sinosoft.ms.application.entity.UserEntity;
import com.sinosoft.ms.application.security.SecurityHelper;
import com.sinosoft.ms.application.security.model.UserVO;
import com.sinosoft.ms.application.conf.SystemConfig;
import com.sinosoft.ms.application.utils.ResponseData;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class AuthFilter extends AbstractAuthenticationProcessingFilter {

    public AuthFilter(String defaultFilterProcessesUrl, AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher(defaultFilterProcessesUrl));
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException, IOException, ServletException {
        // 获取输入参数，如 {"username":"user","password":"123456"}
        UserVO user = new ObjectMapper().readValue(req.getInputStream(), UserVO.class);

        if(user == null) {
            throw new UsernameNotFoundException("用户名或密码错误");
        }

        String captcha = SecurityHelper.captchas.get(user.getS());

        if(!user.getCaptcha().equalsIgnoreCase(captcha)) {
            throw new BadCredentialsException("验证码错误");
        }
        SecurityHelper.captchas.remove(user.getS());

        String password = SecurityHelper.decodeClientPass(user.getPassword());
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername(), password);

        // 进行登录校验，如果校验成功，会到 successfulAuthentication 的回调中，否则到 unsuccessfulAuthentication 的回调中
        return getAuthenticationManager().authenticate(token);
    }

    // 登入成功后处理
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse resp, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        // 获取登录用户的角色
        Collection<? extends GrantedAuthority> authorities = authResult.getAuthorities();
        StringBuffer sb = new StringBuffer();
        for (GrantedAuthority authority : authorities) {
            sb.append(authority.getAuthority()).append(",");
        }
        Map<String, Object> map = new HashMap<>();
        if (authorities.size() >0) {
            map.put("roleId", ((GrantedAuthority) authorities.toArray()[0]).getAuthority());
            map.put("nickname", ((GrantedAuthority) authorities.toArray()[1]).getAuthority());
            map.put("department", ((GrantedAuthority) authorities.toArray()[2]).getAuthority());
            map.put("easy", ((GrantedAuthority) authorities.toArray()[3]).getAuthority());
            map.put("name", ((GrantedAuthority) authorities.toArray()[4]).getAuthority());
        }


        String jwt = Jwts.builder()
                .claim("authorities", sb) // 配置用户角色
                .setSubject(authResult.getName()) // 配置主题
                .setExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)) // 配置过期时间
                .signWith(SystemConfig.getSigningKey())
                .compact();
        resp.setContentType("application/json;charset=utf-8");
        map.put("token", jwt);
        SecurityHelper.addToken(jwt);

        PrintWriter out = resp.getWriter();
        out.write(new ObjectMapper().writeValueAsString(ResponseData.success(map)));
        out.flush();
        out.close();
        SecurityContextHolder.getContext().setAuthentication(authResult);
        chain.doFilter(request, resp);
    }

    // 登入失败后处理
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest req, HttpServletResponse resp, AuthenticationException failed) throws IOException {
        resp.setContentType("application/json;charset=utf-8");
        PrintWriter out = resp.getWriter();
        out.write(new ObjectMapper().writeValueAsString(ResponseData.faild(403, failed.getMessage())));
        out.flush();
        out.close();
    }
}
