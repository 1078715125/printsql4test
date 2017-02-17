package com.netease.quartz;

import org.apache.log4j.Logger;

import com.netease.utils.DateUtils;

/**
 * 简单任务类-2
 * 
 * @author bjguoyaxin
 *
 */
public class TwoTask extends BaseTask {

	private Logger log = Logger.getLogger(TwoTask.class);

	@Override
	public void doTask() {
		String name = this.getClass().getName();
		log.info(name + "任务开始。。。");
		System.out.println("2..." + DateUtils.printNow() + "喔哈哈，我是任务2！！！");
		log.info(name + "任务结束。。。");
	}

	@Override
	public void doException(Exception e) {
		log.error(this.getClass().getName() + "任务出现异常。。。", e);
	}

}
