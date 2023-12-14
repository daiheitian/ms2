package com.sinosoft.ms.application.security.model;

import java.util.List;

public class UserRoleResource {

    private List<AppsRoleRef> appsRoleRef;

    private LoginUser user;



    public LoginUser getUser() {
        return user;
    }

    public void setUser(LoginUser user) {
        this.user = user;
    }

    public List<AppsRoleRef> getAppsRoleRef() {
        return appsRoleRef;
    }

    public void setAppsRoleRef(List<AppsRoleRef> appsRoleRef) {
        this.appsRoleRef = appsRoleRef;
    }

}
