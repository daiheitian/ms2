package com.sinosoft.ms.application.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.List;

@Data
@TableName("CRF_VALUE")
public class CrfValueEntity extends BasicEntity {
    @TableId
    String id;

    String mainId;

    @TableField(exist = false)
    List<CrfValueItemEntity> items;
}
