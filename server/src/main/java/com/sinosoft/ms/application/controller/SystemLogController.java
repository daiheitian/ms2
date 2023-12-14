package com.sinosoft.ms.application.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sinosoft.ms.application.entity.OperateLogInfoEntity;
import com.sinosoft.ms.application.service.OperateLogInfoService;
import com.sinosoft.ms.application.utils.ResponseData;
import com.sinosoft.ms.application.utils.ResponsePageData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;


/**
 * 日志对外开放接口
 */
@RestController
@RequestMapping("/api/system_log")
public class SystemLogController {

    @Autowired
    private OperateLogInfoService service;

    @GetMapping("page")
    public ResponseData page(@RequestParam("page") int page, @RequestParam("size") int size,
                             @RequestParam(value = "startTime", required = false) Long startTime,
                             @RequestParam(value = "endTime", required = false) Long endTime) {
        QueryWrapper<OperateLogInfoEntity> query = new QueryWrapper<>();
        if(startTime != null) {
            query.ge("create_time", new Date(startTime));
        }
        if(endTime != null) {
            query.le("create_time", new Date(endTime));
        }
        query.orderByDesc("create_time");
        IPage<OperateLogInfoEntity> result = service.page(new Page<>(page, size), query);
        List<OperateLogInfoEntity> list = result.getRecords();
        return ResponsePageData.success(list, result.getTotal());
    }
}
