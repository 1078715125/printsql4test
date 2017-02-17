package com.netease.utils;

public class JsonResultFactory {
	public static <T> JsonResult success(T bean) {
		return new JsonResultSuccess<T>(bean);
	}

	public static <T> JsonResult success() {
		return new JsonResultSuccess<T>();
	}
	
	public static<T> JsonResult error(String info) {
		return new JsonResultError(info);
	}

}
