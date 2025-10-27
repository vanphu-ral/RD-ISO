package com.mycompany.myapp.service.dto;

public class ReportDTO {

    private String timeStart;
    private String timeEnd;
    private String planName;
    private String groupName;
    private String testOfObject;
    private String reportType;
    private String subjectOfAssetmentPlan;

    public ReportDTO(
        String timeStart,
        String timeEnd,
        String planName,
        String groupName,
        String testOfObject,
        String reportType,
        String subjectOfAssetmentPlan
    ) {
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.planName = planName;
        this.groupName = groupName;
        this.testOfObject = testOfObject;
        this.reportType = reportType;
        this.subjectOfAssetmentPlan = subjectOfAssetmentPlan;
    }

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

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getTestOfObject() {
        return testOfObject;
    }

    public void setTestOfObject(String testOfObject) {
        this.testOfObject = testOfObject;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getSubjectOfAssetmentPlan() {
        return subjectOfAssetmentPlan;
    }

    public void setSubjectOfAssetmentPlan(String subjectOfAssetmentPlan) {
        this.subjectOfAssetmentPlan = subjectOfAssetmentPlan;
    }
}
