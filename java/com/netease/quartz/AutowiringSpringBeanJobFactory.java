package com.netease.quartz;

import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

/**
 * @author
 * @description 使job类支持spring的自动注入
 * @date 2017-01-03
 */
public class AutowiringSpringBeanJobFactory extends SpringBeanJobFactory implements ApplicationContextAware {
	private transient AutowireCapableBeanFactory beanFactory;

	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		beanFactory = applicationContext.getAutowireCapableBeanFactory();
	}

	@Override
	protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
		Object job = super.createJobInstance(bundle);
		beanFactory.autowireBean(job);
		return job;
	}
}