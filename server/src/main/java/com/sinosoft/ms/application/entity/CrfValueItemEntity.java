package com.sinosoft.ms.application.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class CrfValueItemEntity {
    @TableId
    String id;

    /**
     * 自定义表单
     */
    String mainId;

    /**
     * 自定义字段
     */
    String schemaId;

    /**
     * 映射字段
     */
    String targetId;

    String value;
}
