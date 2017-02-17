package com.netease.utils;

public class JsonResultSuccess<T> implements JsonResult {
	public T data;
	
	public JsonResultSuccess(T bean) {
		this.data = bean;
	}
	public JsonResultSuccess() {
	}
	public String getResult() {
		return "success";
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	public boolean isSuccess() {
		return true;
	}
}
