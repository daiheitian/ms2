package com.sinosoft.ms.application.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.sinosoft.ms.application.dao.WorkMapper;
import com.sinosoft.ms.application.entity.WorkCheckVO;
import com.sinosoft.ms.application.entity.WorkEntity;
import com.sinosoft.ms.application.entity.WorkStatisticsVO;
import com.sinosoft.ms.application.service.WorkService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkServiceImpl extends ServiceImpl<WorkMapper, WorkEntity> implements WorkService {
    @Override
    public List<WorkCheckVO> selectCountByDept(String department, int year, Integer month, String roleId) {
        return baseMapper.selectCountByDept(department, year, month, roleId);
    }

    @Override
    public List<WorkStatisticsVO> statistics(Integer department, Integer year, Integer month, String sort, String sortType) {
        return baseMapper.statistics(department, year, month, sort, sortType);
    }

    @Override
    public List<WorkCheckVO> staticCountByDept(Integer year, Integer month, String department,String sort, String sortType) {
        return baseMapper.staticCountByDept(year, month, department, sort, sortType);
    }
}
