package com.sinosoft.ms.application.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.sinosoft.ms.application.entity.WorkCheckVO;
import com.sinosoft.ms.application.entity.WorkEntity;
import com.sinosoft.ms.application.entity.WorkStatisticsVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkMapper extends BaseMapper<WorkEntity> {
    List<WorkCheckVO> selectCountByDept(@Param("department") String department,
                                        @Param("year") int year,
                                        @Param("month") Integer month,
                                        @Param("roleId") String roleId);

    List<WorkStatisticsVO> statistics(@Param("department") Integer department,
                                      @Param("year") Integer year,
                                      @Param("month") Integer month,
                                      @Param("sort") String sort,
                                      @Param("sorttype") String sortType);

    List<WorkCheckVO> staticCountByDept(@Param("year") Integer year,
                                        @Param("month") Integer month,
                                        @Param("department") String department,
                                        @Param("sort") String sort,
                                        @Param("sortType") String sortType);
}
