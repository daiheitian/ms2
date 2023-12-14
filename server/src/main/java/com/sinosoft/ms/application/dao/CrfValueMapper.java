package com.sinosoft.ms.application.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.sinosoft.ms.application.entity.CrfValueEntity;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 */
@Repository
public interface CrfValueMapper extends BaseMapper<CrfValueEntity> {

    @Results({
            @Result(column = "id", property = "items" ,javaType= List.class,
                    many = @Many(select = "CrfValueItemMapper.selectBySchema"))
    })
    @Select("select * " +
            "FROM CRF_VALUE " +
            "WHERE ${where} ")
    CrfValueEntity selectById (@Param("id") String where);
}

