package com.sinosoft.ms.application.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface SystemLogAnnation{
	/**
	 * 记录用户登录，查看的一些信息
	 * @return
	 */
	String description() default "";
}
