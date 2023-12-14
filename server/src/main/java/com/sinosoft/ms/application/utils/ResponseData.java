package com.sinosoft.ms.application.utils;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.io.Serializable;

/**
 * http请求回执数据
 * 包含成功标识、错误代码、错误消息、返回数据属性
 * @author xiaoxiong
 *
 */
@Data
public class ResponseData<T> implements Serializable{

	private static final long serialVersionUID = 1L;

	private boolean success;	//	成功标识
	
	private String errorCode;	//	错误代码
	
	private String message;	//	错误消息
	
	private T data;

	public static<T> ResponseData<T> success(T data) {
		return new ResponseData<>(true, data);
	}

	public static<T> ResponseData<T> faild(String message) {
		return faild("-1", message);
	}

	public static<T> ResponseData<T> faild(String errorCode, String message) {
		return new ResponseData<>(false, errorCode, message, null);
	}

	public static<T> ResponseData<T> faild(int errorCode, String message) {
		return new ResponseData<>(false, String.valueOf(errorCode), message, null);
	}

	public static<T> ResponseData<T> faild(HttpStatus errorCode, String message) {
		return new ResponseData<>(false, String.valueOf(errorCode.value()), message, null);
	}
	
	/**
	 * 无分页控制构造函数
	 * 不返回数据总数
	 * @param flag	成功标识
	 * @param data	返回数据
	 */
	public ResponseData(boolean flag, T data) {
		this.data = data;
		this.success = flag;
	}
	
	/**
	 * 构造函数：用于初始化含错误处理的返回数据
	 * 不返回数据总数
	 * @param flag	成功标识
	 * @param errorCode	错误代码
	 * @param message	错误消息
	 * @param data	返回数据
	 */
	public ResponseData(boolean flag, String errorCode, String message, T data) {
		this.success = flag;
		this.errorCode = errorCode;
		this.message = message;
		this.data = data;
	}
}
