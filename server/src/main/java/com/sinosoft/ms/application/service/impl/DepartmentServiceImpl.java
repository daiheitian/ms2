package com.sinosoft.ms.application.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sinosoft.ms.application.dao.DepartmentMapper;
import com.sinosoft.ms.application.entity.DepartmentEntity;
import com.sinosoft.ms.application.service.DepartmentService;
import org.springframework.stereotype.Service;

@Service
public class DepartmentServiceImpl extends ServiceImpl<DepartmentMapper, DepartmentEntity> implements DepartmentService {
}
