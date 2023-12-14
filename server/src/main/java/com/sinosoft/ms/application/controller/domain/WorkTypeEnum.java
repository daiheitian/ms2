package com.sinosoft.ms.application.controller.domain;

public enum WorkTypeEnum {
    NOMAL("常规工作", 1),
    IMPORTENT("重点工作", 2),
    NEW("创新工作", 1);

    String name;
    int value;

    WorkTypeEnum(String name, int value) {
        this.name = name;
        this.value = value;
    }
}
