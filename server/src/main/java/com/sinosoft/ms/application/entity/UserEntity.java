package com.sinosoft.ms.application.entity;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 
 * </p>
 *
 * @author zkh
 * @since 2023-04-20
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("user")
public class UserEntity extends BasicEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId
    private String id;

    private String jobNum;

    private String username;

    private String password;

    private String salt;

    private Integer age;

    private Integer sex;

    private Integer roleId;

    private String department;

    @TableField(exist = false)
    private String departmentName;

    private Date lastLoginTime;

    private Integer errorCount;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

}
