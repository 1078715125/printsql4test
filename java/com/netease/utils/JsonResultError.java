package com.netease.utils;

public class JsonResultError implements JsonResult {
	public String info = "";

	public JsonResultError() {
	}

	public JsonResultError(String info) {
		this.info = info;
	}

	public boolean isSuccess() {
		return true;
	}

	public String getResult() {
		return "error";
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}
}
