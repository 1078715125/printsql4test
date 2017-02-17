package com.netease.quartz;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.netease.ssm.Service;

/**
 * 简单任务类
 * 
 * @author bjguoyaxin
 *
 */
public class QueryTask extends BaseTask {

//	private ApplicationContext IOC;
	private Logger log = Logger.getLogger(QueryTask.class);
	@Autowired
	private Service service;

	@Override
	public void doTask() {
		String name = this.getClass().getName();
		log.info(name + "任务开始。。。");
//		IOC = getSpringIOC();
//		Service service = (Service) IOC.getBean("service");
		// Service service = (Service) getSpringIOC().getBean("service");
		// Service service = (Service) SpringHelper.getBean("service");
		service.query();
//		Object o = SpringHelper.getBean("scheduler");
		log.info(name + "任务结束。。。");
	}

	@Override
	public void doException(Exception e) {
		log.error(this.getClass().getName() + "任务出现异常。。。", e);
	}

}
