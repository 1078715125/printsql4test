package com.netease.utils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * CSV工具类
 * 
 * @author bjguoyaxin
 *
 */
public class CSVUtils {

	/**
	 * UTF-8 BOM文件的标识字符
	 */
	private final static byte[] commonCsvHead = { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF };
	// csv默认分隔符：','
	private final static String DEFAULT_DELIMITER = ",";
	// 换行
	private final static String DEFAULT_END = "\r\n";

	private static final String SPECIAL_CHAR_A = "[^\",\\n ]";

	private static final String SPECIAL_CHAR_B = "[^\",\\n]";

	public static List<String[]> readCsvFileBak(InputStream inputStream) throws Exception {
		List<String[]> list = new ArrayList<String[]>();
		Reader fileReader = null;
		BufferedReader bufferedReader = null;
		try {
			fileReader = new InputStreamReader(inputStream, "UTF-8");
			bufferedReader = new BufferedReader(fileReader);
			String regExp = getRegExp();

			String strLine = "";
			String str = "";
			while ((strLine = bufferedReader.readLine()) != null) {
				Pattern pattern = Pattern.compile(regExp);
				Matcher matcher = pattern.matcher(strLine);
				List<String> listTemp = new ArrayList<String>();
				while (matcher.find()) {
					str = matcher.group();
					str = str.trim(); // 注意这里获取的子字符串是带分隔符的
					if (str.endsWith(",")) {
						str = str.substring(0, str.length() - 1);
						str = str.trim();
					}
					if (str.startsWith("\"") && str.endsWith("\"")) {
						str = str.substring(1, str.length() - 1);
						if (str.indexOf("\"\"") != -1) {
							str = str.replaceAll("\"\"", "\"");
						}
					}
					listTemp.add(str);
				}
				// test
				list.add((String[]) listTemp.toArray(new String[listTemp.size()]));
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (bufferedReader != null) {
					bufferedReader.close();
				}
				if (fileReader != null) {
					fileReader.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return list;
	}

	/**
	 * 读取csv文件，默认utf-8字符集
	 * 
	 * @param inputStream
	 * @return
	 * @throws Exception
	 */
	public static List<List<String>> readCsvFile(InputStream inputStream) throws Exception {
		return readCsvFile(inputStream, "UTF-8");
	}

	/**
	 * 读取csv文件，自定义字符集
	 * 
	 * @param inputStream
	 * @param charset
	 * @return
	 * @throws Exception
	 */
	public static List<List<String>> readCsvFile(InputStream inputStream, String charset) throws Exception {
		List<List<String>> list = new ArrayList<>();
		Reader fileReader = null;
		BufferedReader bufferedReader = null;
		try {
			fileReader = new InputStreamReader(inputStream, charset);
			bufferedReader = new BufferedReader(fileReader);
			String regExp = getRegExp();

			String strLine = "";
			String str = "";
			while ((strLine = bufferedReader.readLine()) != null) {
				Pattern pattern = Pattern.compile(regExp);
				Matcher matcher = pattern.matcher(strLine);
				List<String> listTemp = new ArrayList<String>();
				while (matcher.find()) {
					str = matcher.group();
					str = str.trim(); // 注意这里获取的子字符串是带分隔符的
					if (str.endsWith(",")) {
						str = str.substring(0, str.length() - 1);
						str = str.trim();
					}
					if (str.startsWith("\"") && str.endsWith("\"")) {
						str = str.substring(1, str.length() - 1);
						if (str.indexOf("\"\"") != -1) {
							str = str.replaceAll("\"\"", "\"");
						}
					}
					listTemp.add(str);
				}
				list.add(listTemp);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		// finally { //不确定要不要关闭流
		// try {
		// if (bufferedReader != null) {
		// bufferedReader.close();
		// }
		// if (fileReader != null) {
		// fileReader.close();
		// }
		// } catch (IOException e) {
		// e.printStackTrace();
		// }
		// }
		return list;
	}

	private static String getRegExp() {
		StringBuffer strRegExps = new StringBuffer();
		strRegExps.append("\"((");
		strRegExps.append(SPECIAL_CHAR_A);
		strRegExps.append("*[,\\n 　])*(");
		strRegExps.append(SPECIAL_CHAR_A);
		strRegExps.append("*\"{2})*)*");
		strRegExps.append(SPECIAL_CHAR_A);
		strRegExps.append("*\"[ 　]*,[ 　]*");
		strRegExps.append("|");
		strRegExps.append(SPECIAL_CHAR_B);
		strRegExps.append("*[ 　]*,[ 　]*");
		strRegExps.append("|\"((");
		strRegExps.append(SPECIAL_CHAR_A);
		strRegExps.append("*[,\\n 　])*(");
		strRegExps.append(SPECIAL_CHAR_A);
		strRegExps.append("*\"{2})*)*");
		strRegExps.append(SPECIAL_CHAR_A);
		strRegExps.append("*\"[ 　]*");
		strRegExps.append("|");
		strRegExps.append(SPECIAL_CHAR_B);
		strRegExps.append("*[ 　]*");
		return strRegExps.toString();
	}

	/**
	 * <b>描述:</b>
	 * <p>
	 * 导出csv数据
	 * </p>
	 * 
	 * @param request
	 * @param response
	 * @param dataList
	 * @param title
	 * @param limit
	 * @param type
	 *            0-当日数据；1-非当天数据
	 * @throws Exception
	 * @author bjguoyaxin
	 * @日期 2016/11/15 16:12.
	 */
	public static void doExport(HttpServletRequest request, HttpServletResponse response, List<?> dataList,
			ExtLimit limit, int type) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append(limit.getExp_column_names()).append(DEFAULT_END);
		String[] exp_column_indexs = limit.getExp_column_indexs().split(",");
		DateFormat df = null;
		if (type == 0) {
			df = new SimpleDateFormat("yyyy-MM-dd HH");
		} else {
			df = new SimpleDateFormat("yyyy-MM-dd");
		}

		for (int i = 0; i < dataList.size(); i++) {
			Object dataObj = dataList.get(i);
			for (int j = 0; j < exp_column_indexs.length; j++) {
				Object cellValue = reflectCellValue(dataObj, exp_column_indexs[j]);
				if (cellValue == null) {
					sb.append("");
				} else {
					if (cellValue instanceof java.util.Date) {
						Date date = (Date) cellValue;
						sb.append(df.format(date));
					} else if (cellValue instanceof Double) {
						sb.append((Double) cellValue);
					} else if (cellValue instanceof Integer) {
						sb.append((Integer) cellValue);
					} else if (cellValue instanceof Long) {
						sb.append((Long) cellValue);
					} else if (cellValue instanceof Float) {
						sb.append((Float) cellValue);
					} else {
						sb.append(cellValue.toString());
					}
				}
				sb.append(DEFAULT_DELIMITER);
			}
			sb.append(DEFAULT_END);
		}
		exportWorkbook(response, sb, limit.getExp_name());

	}

	public static void exportWorkbook(HttpServletResponse response, StringBuffer sb, String fileName) throws Exception {
		ServletOutputStream outputStream = null;
		OutputStreamWriter outputStreamWriter = null;
		BufferedWriter writer = null;
		try {
			if (fileName == null) {
				fileName = "数据表";
			}
			response.setHeader("Content-Disposition",
					"attachment;filename=\"" + new String(fileName.getBytes("GBK"), "ISO8859_1") + "\"");
			response.setHeader("Pragma", "public");
			response.setHeader("Cache-Control", "no-cache");
			response.setDateHeader("Expires", 0);
			response.setContentType("application/x-msdownload" + ";charset=UTF-8");
			outputStream = response.getOutputStream();
			// 加上UTF-8文件的标识字符
			outputStream.write(commonCsvHead);
			outputStreamWriter = new OutputStreamWriter(outputStream, "UTF-8");
			writer = new BufferedWriter(outputStreamWriter, 1024);
			writer.write(sb.toString());
			writer.flush();
		} finally {
			// if (writer != null) {
			// writer.close();
			// }
		}
	}

	public static StringBuffer genCSV(List<?> dataList, ExtLimit limit) {
		StringBuffer sb = new StringBuffer();
		sb.append(limit.getExp_column_names()).append(DEFAULT_END);
		String[] exp_column_indexs = limit.getExp_column_indexs().split(",");
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
//		DateFormat dfh = new SimpleDateFormat("yyyy-MM-dd HH");
		for (int i = 0; i < dataList.size(); i++) {
			Object dataObj = dataList.get(i);
			for (int j = 0; j < exp_column_indexs.length; j++) {
				Object cellValue = reflectCellValue(dataObj, exp_column_indexs[j]);
				if (cellValue == null) {
					sb.append("");
				} else {
					if (cellValue instanceof java.util.Date) {
						Date date = (Date) cellValue;
						sb.append(df.format(date));
					} else if (cellValue instanceof Double) {
						sb.append((Double) cellValue);
					} else if (cellValue instanceof Integer) {
						sb.append((Integer) cellValue);
					} else if (cellValue instanceof Long) {
						sb.append((Long) cellValue);
					} else if (cellValue instanceof Float) {
						sb.append((Float) cellValue);
					} else {
						sb.append(cellValue.toString());
					}
				}
				sb.append(DEFAULT_DELIMITER);
			}
			sb.append(DEFAULT_END);
		}
		return sb;
	}

	public static StringBuffer genCSV(List<List<String>> dataList, String header) {
		StringBuffer sb = new StringBuffer();
		sb.append(header).append(DEFAULT_END);
		for (int i = 0; i < dataList.size(); i++) {
			List<String> row = dataList.get(i);
			for (String col : row) {
				sb.append(col).append(DEFAULT_DELIMITER);
			}
			sb.append(DEFAULT_END);
		}
		return sb;
	}

	public static void exportCSV(OutputStream outputStream, List<?> dataList, ExtLimit limit) throws Exception {
		StringBuffer sb = genCSV(dataList, limit);
		// 加上UTF-8文件的标识字符
		outputStream.write(commonCsvHead);
		// OutputStreamWriter outputStreamWriter = new
		// OutputStreamWriter(outputStream);
		// BufferedWriter writer = new BufferedWriter(outputStreamWriter, 1024);

		outputStream.write(sb.toString().getBytes("utf-8"));//防止正文乱码
//		outputStream.write(sb.toString().getBytes());
		outputStream.flush();//must
	}

	private static Object reflectCellValue(Object dataObj, String columnIndex) {
		return EntityReflect.getObjectProperty(dataObj, columnIndex);
	}

}
