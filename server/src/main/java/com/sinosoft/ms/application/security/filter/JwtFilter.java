package com.sinosoft.ms.application.security.filter;

import com.alibaba.fastjson.JSONObject;
import com.sinosoft.ms.application.conf.SystemConfig;
import com.sinosoft.ms.application.security.SecurityHelper;
import com.sinosoft.ms.application.utils.ResponseData;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StringUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Slf4j
public class JwtFilter extends AbstractAuthenticationProcessingFilter {

    public JwtFilter(String defaultFilterProcessesUrl, AuthenticationManager authenticationManager) {
        super(new AntPathRequestMatcher(defaultFilterProcessesUrl));
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse res = (HttpServletResponse) servletResponse;
        // 判断该filter是否能处理该次请求，即请求的路径和该filter配置要处理的url是否match
        if (!requiresAuthentication(req, res)) {
            filterChain.doFilter(req, res);
            return;
        }

        // 获取 token ，注意获取方式要跟前台传的方式保持一致
        // 这里请求时注意认证方式选择 Bearer Token，会用 header 传递
        String jwtToken = req.getHeader("authorization");
        if(!StringUtils.hasLength(jwtToken)) {
            this.unAuth(servletResponse);
            return;
        }
        jwtToken = jwtToken.replace("Bearer", "").trim();

        // token如果不列表中则表示用户已退出
        if(!SecurityHelper.checkToken(jwtToken)) {
            this.unAuth(servletResponse);
            return;
        }

        // 注意 "abc@123" 要与生成 token 时的保持一致
        Claims claims = null;
        try {
            Jws<Claims> jws = Jwts.parserBuilder().setSigningKey(SystemConfig.getSigningKey()).build()
                    .parseClaimsJws(jwtToken);
            claims = jws.getBody();
        } catch (JwtException ex) {
            if(ex.getClass().equals(ExpiredJwtException.class)) {
                log.info("Token过期:"+jwtToken);
                SecurityHelper.removeToken(jwtToken);
            }
            this.unAuth(servletResponse);
            return;
        }
        // 获取用户名
        String username = claims.getSubject();
        // 获取用户角色，注意 "authorities" 要与生成 token 时的保持一致
        List<GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList((String) claims.get("authorities"));
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(token);
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws AuthenticationException, IOException, ServletException {
        return null;
    }

    private void unAuth(ServletResponse servletResponse) throws IOException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.getWriter().write(JSONObject.toJSONString(ResponseData.faild(401, "无效的授权")));
    }
}
