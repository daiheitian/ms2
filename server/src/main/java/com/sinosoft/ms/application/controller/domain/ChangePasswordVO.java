package com.sinosoft.ms.application.controller.domain;

import lombok.Data;

@Data
public class ChangePasswordVO {
    String oldPassword;
    String newPassword;
}
