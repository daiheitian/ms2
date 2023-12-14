package com.sinosoft.ms.application.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sinosoft.ms.application.aop.SystemLogAnnation;
import com.sinosoft.ms.application.entity.DepartmentEntity;
import com.sinosoft.ms.application.entity.WorkEntity;
import com.sinosoft.ms.application.security.SecurityHelper;
import com.sinosoft.ms.application.service.DepartmentService;
import com.sinosoft.ms.application.service.WorkService;
import com.sinosoft.ms.application.utils.ResponseData;
import com.sinosoft.ms.application.utils.ResponsePageData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Slf4j
@RequestMapping("/api/department")
@RestController
public class DepartmentController {

    @Autowired
    DepartmentService service;

    @GetMapping("page")
    public ResponseData page(@RequestParam("page") int page, @RequestParam("size") int size,
                             @RequestParam(value = "keyword", required = false) String keyword) {
        QueryWrapper<DepartmentEntity> query = new QueryWrapper();
        if(StringUtils.hasLength(keyword)) {
            query.like("name", keyword);
        }

        IPage<DepartmentEntity> result = service.page(new Page<>(page, size), query);
        return ResponsePageData.success(result.getRecords(), result.getTotal());
    }

    @GetMapping("list")
    public ResponseData list(@RequestParam(value = "keyword", required = false) String keyword) {
        QueryWrapper<DepartmentEntity> query = new QueryWrapper();
        if(StringUtils.hasLength(keyword)) {
            query.like("name", keyword);
        }

        List<DepartmentEntity> result = service.list(query);
        return ResponseData.success(result);
    }

    @PostMapping("save")
    @SystemLogAnnation(description = "保存部门信息")
    public ResponseData save(@RequestBody DepartmentEntity entity) {
        try {
            DepartmentEntity data = service.getById(entity.getId());
            // 数据如果不为空则添加、否则修改
            if(data == null) {
                service.save(entity);
            } else {
                service.updateById(entity);
            }
        }catch (Exception ex) {
            log.error("保存失败", ex);
            return ResponseData.faild(500, "保存失败");
        }

        return ResponseData.success(null);
    }

    @PostMapping("delete")
    @SystemLogAnnation(description = "删除部门信息")
    public ResponseData delete(@RequestBody String id) {
        service.removeById(id);
        return ResponseData.success(null);
    }
}
