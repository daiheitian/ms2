package com.sinosoft.ms.application.entity;

import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Date;

@Data
public abstract class BasicEntity {
    private Date createTime;

    private String creater;

    private Date updateTime;

    private String updater;

    @TableLogic
    @JsonIgnore
    public Boolean deleted = false;

    public String deleter;
}
