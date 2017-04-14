package com.netease.ssm;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Dao {

	Object query();
	
	/**
	 * 批量插入（并为对象带回id）
	 * @param list
	 * @return 影响行数
	 */
	Integer batchInsert(List<? extends Person> list);
	
	
}
