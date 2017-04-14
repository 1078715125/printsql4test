package printsql;

import com.netease.listener.SpringHelper;
import com.netease.ssm.Dao;
import com.netease.ssm.Person;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class TestMutilInsertReturnId {

	@Test
	public void testList() {
		Dao dao = (Dao) SpringHelper.getBean("dao");
		List<Person> param = new ArrayList<>();
		param.add(new Person("wohaha1",1));
		param.add(new Person("wohaha2",2));
		Integer count = dao.batchInsert(param);
//		dao.batchInsert(param);
		for (Person person : param) {
			System.out.println(person);
		}
	}

}
