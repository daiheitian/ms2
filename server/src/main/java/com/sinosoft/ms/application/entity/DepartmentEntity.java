package com.sinosoft.ms.application.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("department")
public class DepartmentEntity implements Serializable {
    @TableId(value = "id", type = IdType.AUTO)
    String id;
    String name;
    int deptType;
}
