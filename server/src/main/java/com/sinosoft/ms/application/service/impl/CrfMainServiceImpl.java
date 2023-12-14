package com.sinosoft.ms.application.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sinosoft.ms.application.dao.CrfMainMapper;
import com.sinosoft.ms.application.service.CrfMainService;
import com.sinosoft.ms.application.entity.CrfMainEntity;
import org.springframework.stereotype.Service;

/**
 * 会议信息表(CrfMainEntity)表服务实现类
 *
 * @author makejava
 * @since 2021-09-14 14:27:35
 */
@Service
public class CrfMainServiceImpl extends ServiceImpl<CrfMainMapper, CrfMainEntity> implements CrfMainService {
}
