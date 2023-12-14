package com.sinosoft.ms.application.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serializable;

/**
 * <p>
 * 
 * </p>
 *
 * @author zkh
 * @since 2023-04-22
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("work")
@ToString
public class WorkEntity extends BasicEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "wId", type = IdType.AUTO)
    private Integer wid;

    @TableField("workName")
    private String workname;

    @TableField("subWork")
    private String subwork;

    @TableField("workType")
    private Integer worktype;

    @TableField("wDepartment")
    private String wdepartment;

    @TableField("workContent")
    private String workcontent;

    @TableField("workMouth")
    private String workmouth;

    @TableField("workYear")
    private String workyear;

    @TableField("status")
    private int status;

    @TableField("finishStatus")
    private int finishStatus;

    @TableField("note")
    private String note;

    @TableField(exist = false)
    private boolean isNew;
}
