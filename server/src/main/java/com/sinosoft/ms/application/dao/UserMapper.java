package com.sinosoft.ms.application.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.sinosoft.ms.application.entity.UserEntity;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<UserEntity> {
    @Select("select * from user where job_num = #{jobNum} and deleted != 1")
    UserEntity selectByJobNum(@Param("jobNum") String jobNum);

    IPage<UserEntity> selectPage(IPage<?> page, UserEntity entity);
}
