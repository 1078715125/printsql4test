package com.netease.ssm;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CSV {

	private Integer id;
	@JsonProperty("channelName")
	private String channelName;
	private String programaName;
	private String yemian;
	private String positionName;
	private String adTypeName;
	private Integer showTypeId;
	private String showTypeName;
	private Double price;
	private Date startDate;
	private Date endDate;

	public CSV(Integer id, String channelName, String programaName, String yemian, String positionName, String adTypeName,
			Integer showTypeId, String showTypeName, Double price, Date startDate, Date endDate) {
		super();
		this.id = id;
		this.channelName = channelName;
		this.programaName = programaName;
		this.yemian = yemian;
		this.positionName = positionName;
		this.adTypeName = adTypeName;
		this.showTypeId = showTypeId;
		this.showTypeName = showTypeName;
		this.price = price;
		this.startDate = startDate;
		this.endDate = endDate;
	}

	public CSV() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getChannelName() {
		return channelName;
	}

	public void setChannelName(String channelName) {
		this.channelName = channelName;
	}

	public String getProgramaName() {
		return programaName;
	}

	public void setProgramaName(String programaName) {
		this.programaName = programaName;
	}

	public String getYemian() {
		return yemian;
	}

	public void setYemian(String yemian) {
		this.yemian = yemian;
	}

	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}

	public String getAdTypeName() {
		return adTypeName;
	}

	public void setAdTypeName(String adTypeName) {
		this.adTypeName = adTypeName;
	}

	public int getShowTypeId() {
		return showTypeId;
	}

	public void setShowTypeId(Integer showTypeId) {
		this.showTypeId = showTypeId;
	}

	public String getShowTypeName() {
		return showTypeName;
	}

	public void setShowTypeName(String showTypeName) {
		this.showTypeName = showTypeName;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


}
