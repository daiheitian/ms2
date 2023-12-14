package com.sinosoft.ms.application.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.sinosoft.ms.application.conf.SystemConfig;
import com.sinosoft.ms.application.service.CrfMainService;
import com.sinosoft.ms.application.entity.CrfMainEntity;
import com.sinosoft.ms.application.utils.ResponseData;
import com.sinosoft.ms.application.utils.ResponsePageData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/crf")
public class CrfMainController {
    @Autowired
    SystemConfig constant;

    @Resource
    private CrfMainService crfMainService;

    /**
     * 分页查询
     *
     * @param page 分页对象
     * @return 查询结果
     */
    @GetMapping("/page")
    public ResponsePageData<CrfMainEntity> getByPage(Page<CrfMainEntity> page) {
        Page<CrfMainEntity> result = this.crfMainService.page(page);
        return ResponsePageData.success(result.getRecords(), result.getTotal());
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("/get/{id}")
    public ResponseData<CrfMainEntity> queryById(@PathVariable("id") String id) {
        return ResponseData.success(this.crfMainService.getById(id));
    }

//    @PostMapping("/delete/{id}")
//    public ResponseData<Boolean> deleteById(@PathVariable("id") String id) {
//        return ResponseData.success(this.crfMainService.removeById(id));
//    }

    /**
     * 保存数据
     *
     * @param crfMainEntity 实体
     * @return 新增结果
     */
    @PostMapping("/save")
    public ResponseData<CrfMainEntity> add(@RequestBody CrfMainEntity crfMainEntity) {
        this.crfMainService.saveOrUpdate(crfMainEntity);
        return ResponseData.success(crfMainEntity);
    }

    /**
     * 修改数据
     *
     *
     * @return 修改是否成功
     */
    @PostMapping("/update")
    public ResponseData<Boolean> updateById(@RequestBody CrfMainEntity crfMainEntity) {
        this.crfMainService.saveOrUpdate(crfMainEntity);
        return ResponseData.success(this.crfMainService.updateById(crfMainEntity));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @PostMapping("/delete")
    public ResponseData<Boolean> deleteById(@RequestBody String id) {
        return ResponseData.success(this.crfMainService.removeById(id));
    }


}

