package com.sinosoft.ms.application.entity;

import lombok.Data;

@Data
public class WorkCheckVO {
    String department;
    int count;
    int unFinish;
    int finished;
    int progress;
    int unknown;
}
