package com.sinosoft.ms.application.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sinosoft.ms.application.aop.SystemLogAnnation;
import com.sinosoft.ms.application.controller.domain.WorkExportVO;
import com.sinosoft.ms.application.entity.DepartmentEntity;
import com.sinosoft.ms.application.entity.WorkCheckVO;
import com.sinosoft.ms.application.entity.WorkEntity;
import com.sinosoft.ms.application.entity.WorkStatisticsVO;
import com.sinosoft.ms.application.security.SecurityHelper;
import com.sinosoft.ms.application.service.DepartmentService;
import com.sinosoft.ms.application.service.WorkService;
import com.sinosoft.ms.application.utils.ExcelUtils;
import com.sinosoft.ms.application.utils.ResponseData;
import com.sinosoft.ms.application.utils.ResponsePageData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequestMapping("/api/work")
@RestController
public class WorkController {

    @Autowired
    WorkService service;

    @Autowired
    DepartmentService departmentService;

    @GetMapping("page")
    public ResponseData page(@RequestParam("page") int page, @RequestParam("size") int size,
                             @RequestParam(value = "keyword", required = false) String keyword,
                             @RequestParam(value = "sort", required = false) String sort,
                             @RequestParam(value = "sorttype", required = false) String sortType,
                             @RequestParam(value = "worktype", required = false) String workType,
                             @RequestParam(value = "wdepartment", required = false) String wdepartment,
                             @RequestParam(value = "workyear", required = false) String year,
                             @RequestParam(value = "workmouth", required = false) String mouth,
                             @RequestParam(value = "finishStatus", required = false) Integer finishStatus,
                             @RequestParam(value = "status", required = false) Integer status) {
        QueryWrapper<WorkEntity> query = getQuery(keyword, sort, sortType, workType, wdepartment, year, mouth, finishStatus, status);

        IPage<WorkEntity> result = service.page(new Page<>(page, size), query);
        Date now = new Date();
        return ResponsePageData.success(result.getRecords().stream().map(r -> {
            if(r.getCreateTime() != null && r.getCreateTime().getYear() == now.getYear() &&
                    r.getCreateTime().getMonth() == now.getMonth()) {
                r.setNew(true);
            }
            return r;
        }).collect(Collectors.toList()), result.getTotal());
    }

    @GetMapping("check")
    public ResponseData check() {
        String roleId = SecurityHelper.getRole();
        LocalDate now = LocalDate.now();
        // 未到当前月的最后5天则不提醒
        if(now.getMonth().maxLength() - now.getDayOfMonth() > 10 || "1".equals(roleId)) {
            return ResponseData.success(Arrays.asList());
        }

        return countByDept(now.getYear(), now.getMonthValue());
    }

    @GetMapping("count_dept")
    public ResponseData countByDept(@RequestParam("year") int year,@RequestParam(value = "month", required = false) Integer month) {
        String roleId = SecurityHelper.getRole();
        String department = null;
        LocalDate now = LocalDate.now();

        if("3".equals(roleId)) {
            department = SecurityHelper.getDepartment();
        }

        List<WorkCheckVO> list = service.selectCountByDept(department, year, month, roleId);
        return ResponseData.success(list);
    }

    @PostMapping("save")
    @SystemLogAnnation(description = "保存任务")
    public ResponseData save(@RequestBody WorkEntity entity) {
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        try {
            WorkEntity data = entity.getWid() == null ? null : service.getById(entity.getWid());
            if(data == null) {
                entity.setCreater(token.getPrincipal().toString());
                entity.setCreateTime(new Date());
                service.save(entity);
            } else {
                entity.setUpdater(token.getPrincipal().toString());
                entity.setUpdateTime(new Date());
                service.updateById(entity);
            }
        }catch (Exception ex) {
            log.error("保存失败", ex);
            return ResponseData.faild(500, "保存失败");
        }

        return ResponseData.success(null);
    }

    @PostMapping("delete")
    @SystemLogAnnation(description = "删除任务")
    public ResponseData delete(@RequestBody String id) {
        service.removeById(id);
        return ResponseData.success(null);
    }

    @PostMapping("import")
    @SystemLogAnnation(description = "导入任务")
    public ResponseData importExcel(@RequestParam("file") MultipartFile file) {
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        List<WorkExportVO> works = ExcelUtils.importExcel(file, 0, 1, WorkExportVO.class);
        Date now = new Date();
        List<WorkEntity> collect = works.stream().map(w -> {
            WorkEntity entity = w.toEntity();
            if(StringUtils.hasLength(w.getDepartment())) {
                QueryWrapper query = new QueryWrapper<>().eq("name", w.getDepartment());
                List<DepartmentEntity> departments = departmentService.list(query);
                if(departments.size() > 0) {
                    entity.setWdepartment(departments.get(0).getId());
                }
            }
            entity.setCreater(token.getName());
            entity.setCreateTime(now);
            return entity;
        }).collect(Collectors.toList());
        service.saveOrUpdateBatch(collect);
        return ResponseData.success(collect);
    }

    @GetMapping("statistics")
    public ResponseData statistics(@RequestParam(value = "year", required = false) Integer year,
                                   @RequestParam(value = "mouth", required = false) Integer month,
                                   @RequestParam(value = "department", required = false) Integer department,
                                   @RequestParam(value = "sort", required = false) String sort,
                                   @RequestParam(value = "sorttype", required = false) String sortType) {
        List<WorkStatisticsVO> list = service.statistics(department, year, month, sort, sortType);
        return ResponseData.success(list);
    }

    @GetMapping("static_count")
    public ResponseData staticCountByDept(@RequestParam(value = "year", required = false) Integer year,
                                   @RequestParam(value = "mouth", required = false) Integer month,
                                   @RequestParam(value = "department", required = false) String department,
                                          @RequestParam(value = "sort", required = false) String sort,
                                          @RequestParam(value = "sorttype", required = false) String sortType) {
        List<WorkCheckVO> list = service.staticCountByDept(year, month, department, sort, sortType);
        return ResponseData.success(list);
    }

    @GetMapping("export")
    @SystemLogAnnation(description = "导出任务")
    public void export(HttpServletResponse res,
                       @RequestParam(value = "keyword", required = false) String keyword,
                       @RequestParam(value = "sort", required = false) String sort,
                       @RequestParam(value = "sorttype", required = false) String sortType,
                       @RequestParam(value = "worktype", required = false) String workType,
                       @RequestParam(value = "wdepartment", required = false) String wdepartment,
                       @RequestParam(value = "workyear", required = false) String year,
                       @RequestParam(value = "workmouth", required = false) String mouth,
                       @RequestParam(value = "finishStatus", required = false) Integer finishStatus,
                       @RequestParam(value = "status", required = false) Integer status) {


        QueryWrapper<WorkEntity> query = getQuery(keyword, sort, sortType, workType, wdepartment, year, mouth, finishStatus, status);

        List<WorkExportVO> works = service.list(query).stream().map(w -> {
            DepartmentEntity dept = departmentService.getById(w.getWdepartment());
            if(dept != null) {
                w.setWdepartment(dept.getName());
            }
            return WorkExportVO.fromEntity(w);
        }).collect(Collectors.toList());

        ExcelUtils.exportExcel(works, null, "Sheet1", WorkExportVO.class, "三张清单表", res);
    }

    private QueryWrapper<WorkEntity> getQuery(String keyword,
                                              String sort,
                                              String sortType,
                                              String workType,
                                              String wdepartment,
                                              String year,
                                              String mouth,
                                              Integer finishStatus,
                                              Integer status) {
        String roleId = SecurityHelper.getRole();
        String department = SecurityHelper.getDepartment();
        QueryWrapper<WorkEntity> query = new QueryWrapper();
        if("3".equals(roleId) && StringUtils.hasLength(department)) {
            query.eq("wDepartment", department);
        }


        if(StringUtils.hasLength(keyword)) {
            query.and(wq-> {
                wq.like("workName", keyword)
                        .or().like("subWork", keyword)
                        .or().like("workContent", keyword);
            });
        }

        if(StringUtils.hasLength(sort)) {
            if("DESC".equalsIgnoreCase(sortType)) {
                query.orderByDesc(sort);
            } else {
                query.orderByAsc(sort);
            }
        }

        if(StringUtils.hasLength(workType)) {
            query.like("worktype", workType);
        }

        if(StringUtils.hasLength(wdepartment)) {
            query.eq("wdepartment", wdepartment);
        }

        if(StringUtils.hasLength(year)) {
            query.eq("workYear", year);
        }

        if(StringUtils.hasLength(mouth)) {
            query.eq("workMouth", mouth);
        }

        if(null != finishStatus){
            query.eq("finishStatus", finishStatus);
        }

        if(null != status) {
            if(status == 0){
                query.isNull("status");
            }else {
                query.eq("status", status);
            }
        }

        if ("2".equals(roleId)) {
            query.and(wap -> {
                wap.eq("status", 1).or().eq("wDepartment", department);
            });
        }

        return query;
    }
}
