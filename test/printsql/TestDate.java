package printsql;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.junit.Test;

public class TestDate {
	
	private DateFormat df = new SimpleDateFormat("yyyyMMdd");
	private DateFormat dfh = new SimpleDateFormat("yyyyMMddHH");
	private DateFormat h = new SimpleDateFormat("HH");
	
	@Test
	public void testLastHour() throws ParseException{
		Date now = new Date();
//		Date now = new SimpleDateFormat("yyyyMMddHHmmss").parse("20161125000005");
		
		Date end = dfh.parse(dfh.format(now));
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(end);
		cal.add(Calendar.HOUR_OF_DAY,-1);
		
		Date start = cal.getTime();
		
		String dateStr = df.format(start);
		String hourStr = h.format(start);
		System.out.println(dateStr+":"+hourStr);
		
		
	}

}
