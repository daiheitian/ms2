package com.sinosoft.ms.application.security.model;

import lombok.Data;

@Data
public class LoginUser {

    private String errorCount;
    private String errorStatus;
    private String id;
    private String username;
    private String password;
    private String department;
    private String salt;
    private int status;
    private int finishStatus;
}
