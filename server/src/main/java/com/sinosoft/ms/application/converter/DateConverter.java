package com.sinosoft.ms.application.converter;

import org.springframework.core.convert.converter.Converter;

import java.util.Date;

public class DateConverter implements Converter<String, Date> {
    @Override
    public Date convert(String s) {
        Long date = Long.valueOf(s);
        return new Date(date);
    }
}
