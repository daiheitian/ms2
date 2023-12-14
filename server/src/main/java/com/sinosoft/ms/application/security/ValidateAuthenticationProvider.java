package com.sinosoft.ms.application.security;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.sinosoft.ms.application.dao.UserMapper;
import com.sinosoft.ms.application.entity.UserEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Component
@Slf4j
public class ValidateAuthenticationProvider implements AuthenticationProvider {

    @Resource
    UserMapper userMapper;


    // 验证用户
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        //获取输入的用户名
        String username = authentication.getName();
        UserEntity entity = userMapper.selectByJobNum(username);
        LocalDateTime now = LocalDateTime.now();

        if(entity.getErrorCount() > 5) {
            LocalDateTime lastLoginTime = entity.getLastLoginTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            if(lastLoginTime.plusMinutes(10).isAfter(now)) {
                throw new BadCredentialsException("错误次数过多，请稍后再试");
            }
        }

        String password = authentication.getCredentials().toString();

        if(entity == null || !entity.getPassword().equals(SecurityHelper.encodePassword(password))) {
            if(entity != null) {
                entity.setErrorCount(entity.getErrorCount()+1);
                entity.setLastLoginTime(new Date());
                userMapper.updateById(entity);
            }
            throw new BadCredentialsException("无效的用户名或密码");
        }


        //获取角色信息
        List<SimpleGrantedAuthority> authorities = getRoles(entity);
        UsernamePasswordAuthenticationToken authResult =
                new UsernamePasswordAuthenticationToken(entity.getId(),
                        password,authorities);
        return authResult;

    }

    private List<SimpleGrantedAuthority> getRoles(UserEntity entity) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(entity.getRoleId().toString()));
        authorities.add(new SimpleGrantedAuthority(entity.getUsername()));
        String dept = StringUtils.hasLength(entity.getDepartment())? entity.getDepartment() : "";
        authorities.add(new SimpleGrantedAuthority(dept));
        // Hbszy@2023
        String easy = "f9ae146ae2fcd015cd5e4867fe44d69e".equalsIgnoreCase(entity.getPassword()) ? "1" : "0";
        authorities.add(new SimpleGrantedAuthority(easy));
        authorities.add(new SimpleGrantedAuthority(entity.getUsername()));
        return authorities;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        //确保authentication能转成该类
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
