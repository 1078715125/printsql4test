package com.netease.ssm;

import org.springframework.beans.factory.annotation.Autowired;

import com.netease.utils.DateUtils;

@org.springframework.stereotype.Service
public class Service {

	@Autowired
	private Dao dao;

	public void query() {
		Object obj = dao.query();
		System.out.println("1..." + DateUtils.printNow() + obj.toString());

	}

}
