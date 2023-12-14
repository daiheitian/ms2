package com.sinosoft.ms.application.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sinosoft.ms.application.dao.UserMapper;
import com.sinosoft.ms.application.entity.UserEntity;
import com.sinosoft.ms.application.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserEntity> implements UserService  {
    @Override
    public IPage<UserEntity> selectPage(Page<?> page, UserEntity userEntity) {
        return baseMapper.selectPage(page, userEntity);
    }
}
