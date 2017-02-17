package com.netease.ssm;

import java.util.ArrayList;
import java.util.List;

public class Form {
	private List<String> field = new ArrayList<String>();
	private List<String> function = new ArrayList<String>();

	public Form() {
		super();
	}

	public List<String> getField() {
		return field;
	}

	public void setField(List<String> field) {
		this.field = field;
	}

	public List<String> getFunction() {
		return function;
	}

	public void setFunction(List<String> function) {
		this.function = function;
	}

}
