package com.sinosoft.ms.application.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.sinosoft.ms.application.entity.WorkCheckVO;
import com.sinosoft.ms.application.entity.WorkEntity;
import com.sinosoft.ms.application.entity.WorkStatisticsVO;

import java.util.List;

/**
 * 会议信息表(CrfMainEntity)表服务接口
 *
 * @author makejava
 * @since 2021-09-14 14:27:35
 */
public interface WorkService extends IService<WorkEntity> {
    List<WorkCheckVO> selectCountByDept(String department, int year, Integer month, String roleId);

    List<WorkStatisticsVO> statistics(Integer department, Integer year, Integer month, String sort, String sortType);

    List<WorkCheckVO> staticCountByDept(Integer year, Integer month, String department,String sort, String sortType);
}
