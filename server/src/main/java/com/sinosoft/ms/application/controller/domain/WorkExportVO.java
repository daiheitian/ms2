package com.sinosoft.ms.application.controller.domain;


import cn.afterturn.easypoi.excel.annotation.Excel;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.sinosoft.ms.application.entity.DepartmentEntity;
import com.sinosoft.ms.application.entity.WorkEntity;
import com.sinosoft.ms.application.service.DepartmentService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.io.Serializable;
import java.util.List;

@Data
public class WorkExportVO implements Serializable {
    @Excel(name="编号", isImportField = "true")
    private Integer wid;

    @Excel(name="科室", isImportField = "true")
    private String department;

    @Excel(name="项目名称", isImportField = "true")
    private String workname;

    @Excel(name="子项目", isImportField = "true")
    private String subwork;

    @Excel(name="年份", isImportField = "true")
    private String workyear;

    @Excel(name="月份", isImportField = "true")
    private String workmouth;

    @Excel(name="项目类型", isImportField = "true")
    private String jobType;

    @Excel(name="事务", isImportField = "true")
    private String workcontent;

    @Excel(name="完成状态")
    private String finishStatus;

    public WorkEntity toEntity() {
        WorkEntity entity = new WorkEntity();
        entity.setWid(wid);
        entity.setWdepartment(department);
        entity.setWorkname(workname);
        entity.setSubwork(subwork);
        entity.setWorkyear(workyear);
        entity.setWorkmouth(workmouth);
        entity.setWorkcontent(workcontent);
//        entity.setWorktype(Integer.valueOf(jobType));
        if(StringUtils.hasLength(jobType)) {
            switch (jobType) {
                case "常规工作":
                    entity.setWorktype(1);
                    break;
                case "重点工作":
                    entity.setWorktype(2);
                    break;
                case "创新工作":
                    entity.setWorktype(3);
                    break;
            }
        }
        return entity;
    }

    public static WorkExportVO fromEntity(WorkEntity entity) {
        WorkExportVO vo = new WorkExportVO();
        vo.setWid(entity.getWid());
        vo.setWorkname(entity.getWorkname());
        vo.setDepartment(entity.getWdepartment());
        if(entity.getWorktype() != null) {
            switch (entity.getWorktype()) {
                case 1:
                    vo.setJobType("常规工作");
                    break;
                case 2:
                    vo.setJobType("重点工作");
                    break;
                case 3:
                    vo.setJobType("创新工作");
                    break;
            }
        }
        switch (entity.getFinishStatus()) {
            case 1:
                vo.setFinishStatus("进行中");
                break;
            case 2:
                vo.setFinishStatus("已完成");
                break;
            case 3:
                vo.setFinishStatus("未完成");
                break;
        }
        vo.setSubwork(entity.getSubwork());
        vo.setWorkyear(entity.getWorkyear());
        vo.setWorkmouth(entity.getWorkmouth());
        vo.setWorkcontent(entity.getWorkcontent());
        return vo;
    }
}
