package com.sinosoft.ms.application.service;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.sinosoft.ms.application.entity.UserEntity;

/**
 * 会议信息表(CrfMainEntity)表服务接口
 *
 * @author makejava
 * @since 2021-09-14 14:27:35
 */
public interface UserService extends IService<UserEntity> {
    IPage<UserEntity> selectPage(Page<?> page, UserEntity userEntity);
}
