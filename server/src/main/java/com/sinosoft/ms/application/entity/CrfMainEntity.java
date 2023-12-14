package com.sinosoft.ms.application.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * @since 2021-09-14 14:27:29
 */
@Data
@TableName("CRF_MAIN")
public class CrfMainEntity extends BasicEntity {
    /**
     * 主键，逻辑id
     */
    @TableId
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    private String name;

    private String schema;


}

