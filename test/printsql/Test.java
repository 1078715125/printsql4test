package printsql;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class Test {

	public static void main(String[] args) throws Exception {
		Test.getCreateTime();
	}

	public static void getCreateTime() {
		String filePath = "E:\\1.txt";
//		String filePath = "E:";
		String strTime = null;
		String str = "cmd /C dir " + filePath + "\tc";
		try {
			Process p = Runtime.getRuntime().exec(
					"cmd /C dir " + filePath + " \tc");
			InputStream is = p.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String line;
			while ((line = br.readLine()) != null) {
				if (line.endsWith(".txt")) {
					strTime = line.substring(0, 17);
					break;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println("创建时间    " + strTime);
		// 输出：创建时间 2009-08-17 10:21
	}

}
