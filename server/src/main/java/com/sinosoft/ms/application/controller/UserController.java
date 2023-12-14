package com.sinosoft.ms.application.controller;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.crypto.symmetric.SymmetricAlgorithm;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sinosoft.ms.application.aop.SystemLogAnnation;
import com.sinosoft.ms.application.controller.domain.ChangePasswordVO;
import com.sinosoft.ms.application.entity.DepartmentEntity;
import com.sinosoft.ms.application.entity.UserEntity;
import com.sinosoft.ms.application.security.SecurityHelper;
import com.sinosoft.ms.application.service.DepartmentService;
import com.sinosoft.ms.application.service.UserService;
import com.sinosoft.ms.application.utils.ResponseData;
import com.sinosoft.ms.application.utils.ResponsePageData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.security.KeyPair;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequestMapping({"/api/user"})
@RestController
public class UserController {

    @Autowired
    UserService service;

    @Autowired
    DepartmentService departmentService;

    @GetMapping("page")
    public ResponseData page(@RequestParam("page") int page, @RequestParam("size") int size, UserEntity entity) {
        if(entity == null) {
            entity = new UserEntity();
        }

        IPage<UserEntity> result = service.selectPage(new Page<>(page, size), entity);
        List<UserEntity> list = result.getRecords().stream().map(r->{
            r.setPassword(null);
            return r;
        }).collect(Collectors.toList());
        return ResponsePageData.success(list, result.getTotal());
    }

    @GetMapping("info")
    public ResponseData info() {
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = service.getById(token.getPrincipal().toString());
        user.setPassword(null);
        if(user == null) {
            return ResponseData.faild(500, "无效的用户");
        }
        if(StringUtils.hasLength(user.getDepartment())) {
            DepartmentEntity department = departmentService.getById(user.getDepartment());
            if(department != null) {
                user.setDepartmentName(department.getName());
            }
        }
        return ResponseData.success(user);
    }

    @PostMapping("save")
    @SystemLogAnnation(description = "保存用户信息")
    public ResponseData save(@RequestBody UserEntity entity) {
        UsernamePasswordAuthenticationToken token = SecurityHelper.getToken();
        try {
            if(StringUtils.hasLength(entity.getPassword())) {
                String password = SecurityHelper.decodeClientPass(entity.getPassword());

                if(!SecurityHelper.checkPassword(password)) {
                    return ResponseData.faild(-1, SecurityHelper.INVALID_PASSWORD_MSG);
                }
                if(password.contains(entity.getJobNum())) {
                    return ResponseData.faild(-1, "密码中不允许包含用户名");
                }
                entity.setPassword(SecurityHelper.encodePassword(password));
            }

            if(entity.getId() == null) {
                entity.setCreater(token.getPrincipal().toString());
                entity.setCreateTime(new Date());
                service.save(entity);
            } else {
                entity.setUpdater(token.getPrincipal().toString());
                entity.setUpdateTime(new Date());
                service.updateById(entity);
            }
        }catch (Exception ex) {
            log.error("保存失败", ex);
            return ResponseData.faild(500, "保存失败");
        }

        return ResponseData.success(null);
    }

    @PostMapping("change_password")
    @SystemLogAnnation(description = "修改密码")
    public ResponseData changePassword(@RequestBody ChangePasswordVO changePassword) {
        String username = SecurityHelper.getUsername();
        UserEntity user = service.getById(username);
        String oldPass = SecurityHelper.decodeClientPass(changePassword.getOldPassword());
        String newPass = SecurityHelper.decodeClientPass(changePassword.getNewPassword());
        if(user == null) {
            return ResponseData.faild(-1, "无效的用户");
        }
        if(!user.getPassword().equals(SecurityHelper.encodePassword(oldPass))) {
            return ResponseData.faild(-1, "原密码错误");
        }
        if("Hbszy@2023".equals(newPass)) {
            return ResponseData.faild(-1, "请不要使用默认密码");
        }
        if(!SecurityHelper.checkPassword(newPass)) {
            return ResponseData.faild(-1, SecurityHelper.INVALID_PASSWORD_MSG);
        }
        if(newPass.contains(user.getJobNum())) {
            return ResponseData.faild(-1, "密码中不允许包含用户名");
        }
        user.setPassword(SecurityHelper.encodePassword(newPass));
        user.setUpdater(username);
        user.setUpdateTime(new Date());
        service.updateById(user);
        return ResponseData.success(null);
    }

    @PostMapping("delete")
    @SystemLogAnnation(description = "删除用户")
    public ResponseData delete(@RequestBody String id) {
        service.removeById(JSON.parse(id).toString());
        return ResponseData.success(null);
    }

    @PostMapping("logout")
    @SystemLogAnnation(description = "退出登录")
    public ResponseData logout(HttpServletRequest request) {
        String token = request.getHeader("authorization").replace("Bearer", "").trim();
        SecurityHelper.removeToken(token);
        return ResponseData.success(null);
    }
}
