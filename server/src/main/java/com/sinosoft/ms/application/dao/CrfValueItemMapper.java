package com.sinosoft.ms.application.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.sinosoft.ms.application.entity.CrfValueEntity;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

/**
 *
 */
@Repository
public interface CrfValueItemMapper extends BaseMapper<CrfValueEntity> {

    @Select("select * " +
            "FROM CRF_VALUE_ITEM " +
            "WHERE schemaId = #{schemaId} ")
    CrfValueEntity selectBySchema(@Param("schemaId") String schemaId);
}

