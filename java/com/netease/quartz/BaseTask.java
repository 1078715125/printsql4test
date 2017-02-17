package com.netease.quartz;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.quartz.QuartzJobBean;

/**
 * 任务基类
 * 
 * @author bjguoyaxin
 *
 */
public abstract class BaseTask extends QuartzJobBean {

	private boolean running = false;
	private ApplicationContext springIOC;
	
	public static final String APP_KEY = "appKey";

	/**
	 * 任务模板
	 */
	@Override
	protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
		try {
			if (this.isRunning()) {
				return;
			}
			this.setRunning(true);
			this.springIOC = (ApplicationContext)context.getScheduler().getContext().get(APP_KEY);
			doTask();
		} catch (Exception e) {
			doException(e);
		} finally {
			this.setRunning(false);
		}

	}

	/**
	 * 具体任务细节
	 */
	public abstract void doTask();

	/**
	 * 任务异常处理
	 */
	public abstract void doException(Exception e);

	public boolean isRunning() {
		return running;
	}

	public void setRunning(boolean running) {
		this.running = running;
	}

	public ApplicationContext getSpringIOC() {
		return springIOC;
	}

	public void setSpringIOC(ApplicationContext springIOC) {
		this.springIOC = springIOC;
	}

}
