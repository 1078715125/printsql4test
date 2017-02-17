package com.netease.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 日期工具类
 * 
 * @author bjguoyaxin
 *
 */
public class DateUtils {

	public static final String PATTERN = "yyyy-MM-dd HH:mm:ss";
	public static final DateFormat DF = new SimpleDateFormat(PATTERN);
	
	public static String format(Date date, String pattern) {
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(date);
	}
	
	public static String printNow(){
		return DF.format(new Date());
	}
	
	public static Date parseDate(String date,String pattern) throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.parse(date);
	}

}
