package com.sinosoft.ms.application.utils;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Collection;

/**
 * http请求回执数据
 * 包含成功标识、错误代码、错误消息、返回数据属性
 * @author xiaoxiong
 *
 */
@Getter
public class ResponsePageData<T> extends ResponseData<Collection<T>>{

	private static final long serialVersionUID = 1L;

	private Long total;

	public ResponsePageData(boolean flag, Collection<T> data, long totalSize) {
		super(flag, data);
		this.total = totalSize;
	}

	public ResponsePageData(boolean flag, String errorCode, String message) {
		super(flag, errorCode, message,new ArrayList<>());
		this.total = 0L;
	}

	public static<T> ResponsePageData<T> success(Collection<T> data, long totalSize) {
		return new ResponsePageData<T>(true, data, totalSize);
	}

	public static ResponsePageData faild(String message) {
		return faild("-1", message);
	}

	public static ResponsePageData faild(String errorCode, String message) {
		return new ResponsePageData<>(false, errorCode, message);
	}
}
