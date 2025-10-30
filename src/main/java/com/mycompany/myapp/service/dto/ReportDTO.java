package com.mycompany.myapp.service.dto;

import java.util.List;

public class ReportDTO {

    private String timeStart;
    private String timeEnd;
    private String planName;
    private List<String> groupName;
    private List<String> testOfObject;
    private List<String> reportType;
    private List<String> subjectOfAssetmentPlan;

    public ReportDTO() {}

    public String getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(String timeStart) {
        this.timeStart = timeStart;
    }

    public String getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(String timeEnd) {
        this.timeEnd = timeEnd;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public List<String> getGroupName() {
        return groupName;
    }

    public void setGroupName(List<String> groupName) {
        this.groupName = groupName;
    }

    public List<String> getTestOfObject() {
        return testOfObject;
    }

    public void setTestOfObject(List<String> testOfObject) {
        this.testOfObject = testOfObject;
    }

    public List<String> getReportType() {
        return reportType;
    }

    public void setReportType(List<String> reportType) {
        this.reportType = reportType;
    }

    public List<String> getSubjectOfAssetmentPlan() {
        return subjectOfAssetmentPlan;
    }

    public void setSubjectOfAssetmentPlan(List<String> subjectOfAssetmentPlan) {
        this.subjectOfAssetmentPlan = subjectOfAssetmentPlan;
    }
}
