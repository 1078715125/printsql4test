package com.netease.utils;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * @author 
 *
 */
public class JsonHelper {

	public final static JsonHelper I = new JsonHelper();

	private JsonHelper() {

	}

	/**
	 * 将从redis中获得的json转换成对应的对象
	 * 
	 * @param key
	 * @param clzz
	 * @return
	 */
	public <T> T formJson(String json, Class<T> clzz) {
		ObjectMapper mapper = getJacksonMapper();
		try {
			return mapper.readValue(json, clzz);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 将对象转换为json
	 * 
	 * @param obj
	 * @return
	 */
	public static String toJson(Object obj) {
		String result = "";
		try {
			ObjectMapper mapper = getJacksonMapper();
			result = mapper.writeValueAsString(obj);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public static <T> List<T> toList(String json, Class<T> clzz) {
		try {
			ObjectMapper mapper = getJacksonMapper();
			JavaType javaType = mapper.getTypeFactory().constructParametricType(List.class, clzz);
			return mapper.readValue(json, javaType);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private static ObjectMapper getJacksonMapper() {
		ObjectMapper mapper = new ObjectMapper();
		// 设置输入时忽略在JSON字符串中存在但Java对象实际没有的属性
		mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		// 字段可以无双引号
		mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
		return mapper;
	}

	/**
	 * JSON串转换为Java泛型对象，可以是各种类型.
	 * 
	 * @param <T>
	 * @param jsonString
	 *            JSON字符串
	 * @param tr
	 *            TypeReference,例如: new TypeReference< List<UserJackJson> >(){}
	 * @return List对象列表
	 */
	public static <T> T toGenericObject(String jsonString, TypeReference<T> tr) {
		if (jsonString == null || "".equals(jsonString)) {
			return null;
		} else {
			try {
				ObjectMapper mapper = getJacksonMapper();
				return (T) mapper.readValue(jsonString, tr);
			} catch (Exception e) {
			}
		}
		return null;
	}

}
