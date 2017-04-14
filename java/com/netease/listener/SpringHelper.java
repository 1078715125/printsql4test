package com.netease.listener;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * 获取ApplicationContext的工具类
 * 
 * @author bjguoyaxin
 *
 */
public class SpringHelper implements ApplicationContextAware {

	public static ApplicationContext context;

	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		SpringHelper.context = applicationContext;
		System.out.println("初始化Spring容器，并获取上下文环境。。。");
	}
	
	public synchronized static Object getBean(String name) {
		if (context == null) {
//			 throw new RuntimeException("无法获取当前环境的ApplicationContext，或尝试重启。。。");
			initApplicationContext();
		}
		return context.getBean(name);
	}

	/**
	 *  手动加载spring方法
	 */
	public static void initApplicationContext() {
		if (context == null) {
			context = new ClassPathXmlApplicationContext(
					"classpath*:**//applicationContext*.xml");
		}
	}
}
