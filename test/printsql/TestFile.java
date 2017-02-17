package printsql;

import java.io.File;
import java.util.HashSet;
import java.util.Set;

import org.junit.Test;

public class TestFile {

	@Test
	public void testRandomFile() {
		String path = "e:\\";
		String[] list = readFileNameToList(new File(path));
		int max = list.length - 1;
		// 可取重复数据
		for (int i = 0; i < 5; i++) {
			int index = (int) (Math.random() * max);
			System.out.println("fileName:" + path + list[index]);
		}
		System.out.println("---------------------------------");
		// 不取重复数据
		Set<Integer> numberSet = new HashSet<Integer>();
		while (numberSet.size() < 5 && max >= 5) {
			numberSet.add((int) (Math.random() * max));
		}
		for (Integer index : numberSet) {
			System.out.println("fileName:" + path + list[index]);
		}
	}

	private String[] readFileNameToList(File file) {
		String[] list = {};
		if (file.isDirectory()) {
			list = file.list();
		}
		return list;
	}

}
