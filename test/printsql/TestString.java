package printsql;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

public class TestString {

	@Test
	public void test3() {
		List<String> l1 = new ArrayList<String>();
		l1.addAll(null);
		
	}

	@Test
	public void test2() {
		String str = "2016/10/21";
		String str1 = str.replaceAll("/", "-");
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
