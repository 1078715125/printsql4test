package com.netease.listener;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * 
 * @author bjguoyaxin
 *
 */

public class MyListener implements ServletContextListener {

	public void contextInitialized(ServletContextEvent sce) {
		long beginTime = System.currentTimeMillis();

		ServletContext context = sce.getServletContext();
		context.log("[系统初始化]开始启动系统...");

		String version = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		context.setAttribute("SysVersion", version);

		long endTime = System.currentTimeMillis();
		context.log("[系统初始化]系统启动完成..." + (endTime - beginTime) + "ms");
	}

	public void contextDestroyed(ServletContextEvent sce) {
		ServletContext context = sce.getServletContext();
		context.log("[系统销毁]开始关闭系统...");

	}

}
