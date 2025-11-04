package com.mycompany.myapp.service.dto;

public class PlanStatisticalResponseDTO {

    private String subjectOfAssetmentPlan;
    private String timeStart;
    private String reportType;
    private String convertScore;
    private String scoreScale;

    private Integer sumOfScoreScale;
    private Integer sumOfAudit;
    private Integer sumOfReport;
    private Integer sumOfCreateReport;

    private Integer sumOfNc;
    private Integer sumOfLy;
    private Integer sumOfFail;
    private Integer sumOfPass;
    private Integer sumOfDat;
    private Integer total;
    private Integer sumOfUncheck;
    private Integer sumOfCheck;
    private String groupName;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getSumOfUncheck() {
        return sumOfUncheck;
    }

    public void setSumOfUncheck(Integer sumOfUncheck) {
        this.sumOfUncheck = sumOfUncheck;
    }

    public Integer getSumOfCheck() {
        return sumOfCheck;
    }

    public void setSumOfCheck(Integer sumOfCheck) {
        this.sumOfCheck = sumOfCheck;
    }

    // Getters and Setters
    public String getSubjectOfAssetmentPlan() {
        return subjectOfAssetmentPlan;
    }

    public void setSubjectOfAssetmentPlan(String subjectOfAssetmentPlan) {
        this.subjectOfAssetmentPlan = subjectOfAssetmentPlan;
    }

    public String getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(String timeStart) {
        this.timeStart = timeStart;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getConvertScore() {
        return convertScore;
    }

    public void setConvertScore(String convertScore) {
        this.convertScore = convertScore;
    }

    public String getScoreScale() {
        return scoreScale;
    }

    public void setScoreScale(String scoreScale) {
        this.scoreScale = scoreScale;
    }

    public Integer getSumOfScoreScale() {
        return sumOfScoreScale;
    }

    public void setSumOfScoreScale(Integer sumOfScoreScale) {
        this.sumOfScoreScale = sumOfScoreScale;
    }

    public Integer getSumOfAudit() {
        return sumOfAudit;
    }

    public void setSumOfAudit(Integer sumOfAudit) {
        this.sumOfAudit = sumOfAudit;
    }

    public Integer getSumOfReport() {
        return sumOfReport;
    }

    public void setSumOfReport(Integer sumOfReport) {
        this.sumOfReport = sumOfReport;
    }

    public Integer getSumOfCreateReport() {
        return sumOfCreateReport;
    }

    public void setSumOfCreateReport(Integer sumOfCreateReport) {
        this.sumOfCreateReport = sumOfCreateReport;
    }

    public Integer getSumOfNc() {
        return sumOfNc;
    }

    public void setSumOfNc(Integer sumOfNc) {
        this.sumOfNc = sumOfNc;
    }

    public Integer getSumOfLy() {
        return sumOfLy;
    }

    public void setSumOfLy(Integer sumOfLy) {
        this.sumOfLy = sumOfLy;
    }

    public Integer getSumOfFail() {
        return sumOfFail;
    }

    public void setSumOfFail(Integer sumOfFail) {
        this.sumOfFail = sumOfFail;
    }

    public Integer getSumOfPass() {
        return sumOfPass;
    }

    public void setSumOfPass(Integer sumOfPass) {
        this.sumOfPass = sumOfPass;
    }

    public Integer getSumOfDat() {
        return sumOfDat;
    }

    public void setSumOfDat(Integer sumOfDat) {
        this.sumOfDat = sumOfDat;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
