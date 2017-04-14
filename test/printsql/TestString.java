package printsql;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TestString {

	@Test
	public void test6List() {
		List<String> arrayList = new ArrayList<>();
		arrayList.add("1");
		arrayList.add("2");
		arrayList.add("3");
		System.out.println(arrayList.size());
		arrayList.remove(0);
		System.out.println(arrayList.size());
		
	}
	@Test
	public void test5() {
		String regex = "(.xls|.xlsx)$";
		Pattern regexp = Pattern.compile(regex);
		
		String input = "123.xls";
		Matcher matcher = regexp.matcher(input);
		System.out.println(matcher.matches());

	}

	@Test
	public void test4() {
		String str = "喔哈哈.csV";
		boolean flag = str.toLowerCase().endsWith("csv");
		System.out.println(flag);
	}

	@Test
	public void test3() {
		List<String> l1 = new ArrayList<String>();
		l1.addAll(null);

	}

	@Test
	public void test2() {
		String str = "2016/10/21";
		String str1 = str.replaceAll("/", "-"); //正则表达式
		String str2 = str.replace("/", "-");
		System.out.println(str1);
		System.out.println(str2);
	}

	@Test
	public void test1() {
		// device.getFriendlyName().replace("Renderer",
		// "Server").replace("media", "sd966");
		String str = "Renderer--Renderer--media";
		String demo = str.contains("Renderer") ? str.replaceFirst("Renderer", "Server") : str.replace("media", "sd966");
		// if (str.contains("Renderer")) {
		// demo = str.replace("Renderer", "Server");
		// } else {
		// demo = str.replace("media", "sd966");
		// }

		System.out.println(demo);
	}

}
