package com.netease.ssm;

import com.netease.listener.SpringHelper;
import com.netease.utils.*;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedOutputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@org.springframework.stereotype.Controller
@RequestMapping
public class Controller {

	@Autowired
	private Service service;

	public static String[] INDEXS = { "id", "channelName", "programaName", "yemian", "positionName", "adTypeName",
			"showTypeId", "showTypeName", "price", "startDate", "endDate" };
	public static String HRADER = "营销平台ID,频道,栏目,页面位置,广告位置,广告形式,展现形式ID,展现形式,刊例单价（元/CPM）,生效开始时间,生效结束时间,错误记录";

	@RequestMapping("/check")
	@ResponseBody
	public String check(Form form) {
		System.out.println(form);
		return "success";
	}

	@RequestMapping("/download")
	public void downLoad(@RequestParam("num") int num, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		try {
			response.addHeader("content-disposition",
					"attachment;filename=" + URLEncoder.encode("打包文件", "UTF-8") + ".zip");
			response.setContentType("application/x-zip-compressed");

			ServletOutputStream sos = response.getOutputStream();
			ZipOutputStream zipOut = new ZipOutputStream(new BufferedOutputStream(sos));
			for (int i = 1; i <= num; i++) {
				ZipEntry entry = new ZipEntry(i + ".csv");
				zipOut.putNextEntry(entry);
				Workbook wb = new HSSFWorkbook();
				Sheet sheet = wb.createSheet("测试");
				for (int j = 0; j < 5; j++) {
					Row row = sheet.createRow(j);
					for (int k = 0; k < 3; k++) {
						if (j == 0) {
							Cell cell = row.createCell(k);
							cell.setCellValue("测试" + k);
						} else {
							Cell cell = row.createCell(k);
							cell.setCellValue(j + "" + k);
						}

					}
				}
				wb.write(zipOut);
//				List<CSV> dataList = new ArrayList<CSV>();
//				for (int j = 0; j < 100; j++) {
//					dataList.add(new CSV(j + 1, "新闻客户端", "头条", "首页", "第四条", "信息流", j + 1, "图文", 0.12 + j, new Date(),
//							new Date()));
//					dataList.add(new CSV(j + 2, "新闻客户端", "头条", "首页", "第四条", "信息流", j + 2, "多图", 0.28 + j, new Date(),
//							new Date()));
//				}
//				ExtLimit limit = new ExtLimit();
//				limit.setExp_column_names("营销平台ID,频道,栏目,页面位置,广告位置,广告形式,展现形式ID,展现形式,刊例单价（元/CPM）,生效开始时间,生效结束时间");
//				limit.setExp_column_indexs(
//						"id,channelName,programaName,yemian,positionName,adTypeName,showTypeId,showTypeName,price,startDate,endDate");
//				CSVUtils.exportCSV(zipOut, dataList, limit);
				// zipOut.write("喔哈哈".getBytes());
			}
			zipOut.flush();//must
			zipOut.close();//must
//			response.setHeader("title", "导入文件中共xxxx条数据，成功导入xxxx条，失败xx条，请保存包含错误记录标识的csv文档");
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	@RequestMapping("/upload")
	@ResponseBody
	public JsonResult uploadXLS(HttpServletRequest request) throws Exception {
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		String time = multipartRequest.getParameter("time");
		System.out.println(time);
		MultipartFile multipartFile = multipartRequest.getFile("file");
		InputStream inputStream = multipartFile.getInputStream();
		// Workbook workBook = WorkbookFactory.create(inputStream);
		// Sheet sheet = workBook.getSheetAt(0);
		// if (sheet != null) {
		// for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
		// Row row = sheet.getRow(i);
		// for (int j = 0; j < row.getPhysicalNumberOfCells(); j++) {
		// Cell cell = row.getCell(j);
		// String cellStr = cell.toString();
		// System.out.print("【" + cellStr + "】 ");
		// }
		// System.out.println();
		// }
		//
		// }
		List<List<String>> readCsvFile = CSVUtils.readCsvFile(inputStream);
		List<List<String>> errorList = new ArrayList<>();
		List<CSV> dataList = new ArrayList<>();
		for (List<String> csvLine : readCsvFile) {
			if (csvLine == null) {
				continue;
			}
			CSV csvTemp = new CSV();
			int csvColNum = csvLine.size();
			if (csvColNum < INDEXS.length) {
				csvLine.add(INDEXS.length, "数据不全。。。");
				errorList.add(csvLine);
				continue;
			}
			// 装配csv数据到类对象
			boolean isError = false;
			for (int i = 0; i < INDEXS.length; i++) {
				String str = csvLine.get(i);
				System.out.print(str + "\t");
				String index = INDEXS[i];
				if (str == null || "".equals(str)) {
					csvLine.add(INDEXS.length, index + "为空。。。");
					isError = true;
					break;
				}
				Object val = str;

				if ("id".equals(index) || "showTypeId".equals(index)) {
					try {
						val = Integer.parseInt(str);
					} catch (Exception e) {
						csvLine.add(INDEXS.length, index + "非数字。。。");
						isError = true;
						e.printStackTrace();
						break;
					}
				} else if ("price".equals(index)) {
					try {
						val = Double.parseDouble(str);
					} catch (Exception e) {
						csvLine.add(INDEXS.length, index + "非金额。。。");
						isError = true;
						e.printStackTrace();
						break;
					}
				} else if ("startDate".equals(index) || "endDate".equals(index)) {
					try {
						val = DateUtils.parseDate(str, "yyyy/MM/dd");
					} catch (Exception e) {
						csvLine.add(INDEXS.length, index + "日期格式不正确。。。");
						isError = true;
						e.printStackTrace();
						break;
					}
				}
				EntityReflect.invokeSetValue(csvTemp, index, val);
			}
			System.out.println();
			if (isError) {
				errorList.add(csvLine);
			} else {
				dataList.add(csvTemp);
			}
		}
		if (errorList.size() > 0) {
			StringRedisTemplate stringRedisTemplate = (StringRedisTemplate) SpringHelper.getBean("stringRedisTemplate");
			// stringRedisTemplate.opsForValue().set("error",
			// JsonHelper.toJson(errorList), 2, TimeUnit.HOURS);
			String header = new String("营销平台ID,频道,栏目,页面位置,广告位置,广告形式,展现形式ID,展现形式,刊例单价（元/CPM）,生效开始时间,生效结束时间,错误原因");
			String data = CSVUtils.genCSV(errorList, header).toString();
			stringRedisTemplate.opsForValue().set("error", data, 2, TimeUnit.HOURS);
			return JsonResultFactory.error("success:" + dataList.size() + "个，error:" + errorList.size() + "个");
		}
		return JsonResultFactory.success();
	}

	@RequestMapping("/downloadError")
	public void downloadErrorXLS(HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringRedisTemplate stringRedisTemplate = (StringRedisTemplate) SpringHelper.getBean("stringRedisTemplate");
		String csvFileStr = stringRedisTemplate.opsForValue().get("error");
		StringBuffer sb = new StringBuffer(csvFileStr);
//		StringBuffer sb = new StringBuffer("aaaa,aaa,aaa,aaa");
		CSVUtils.exportWorkbook(response, sb, "error.csv");
	}

	@RequestMapping("/query")
	@ResponseBody
	public String testParam(@RequestParam("str") String str) {
		System.out.println(str);
		return "success";
	}

	@RequestMapping("/test-search")
	public String query() {
		service.query();
		return "index";
	}

	@RequestMapping("/")
	public String index() {
		return "index";
	}

}
