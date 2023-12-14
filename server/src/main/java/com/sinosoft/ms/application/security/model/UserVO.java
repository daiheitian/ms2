package com.sinosoft.ms.application.security.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Data
@NoArgsConstructor
public class UserVO {
    String id;
    String username;
    String name;
    Map<String, String> roles;
    boolean status;
    Date createTime;
    String areaCode;
    String areaName;
    String password;
    String oldPassword;
    String uid;
    String pid;
    Date t;
    String s;
    String captcha;

//    public UserVO(UserEntity user) {
//        id = user.getId();
//        username = user.getUsername();
//        name = user.getName();
//        status = Integer.valueOf(user.getState()) == 1;
//        createTime = user.getCreatetime();
//        areaCode = user.getAreaCode();
//        areaName = user.getAreaName();
//    }
//
//    public UserEntity toEntity(){
//        UserEntity entity = new UserEntity();
//        entity.setId(id);
//        entity.setOid("10001");
//        entity.setUsername(username);
//        entity.setName(name);
//        entity.setState(status ? "1" : "0");
//        entity.setCreatetime(createTime);
//        entity.setAreaCode(areaCode);
//        entity.setAreaName(areaName);
//        entity.setPassword(password);
//
//        return entity;
//    }
}
