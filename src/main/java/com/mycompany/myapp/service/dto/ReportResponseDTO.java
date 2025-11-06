package com.mycompany.myapp.service.dto;

import java.time.LocalDateTime;

public class ReportResponseDTO {

    private Long id;
    private String name;
    private String code;
    private Long sampleReportId;
    private String testOfObject;
    private String checker;
    private String groupName;
    private String status;
    private String frequency;
    private String reportType;
    private Long reportTypeId;
    private Integer groupReport;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime checkTime;
    private String scoreScale;
    private String convertScore;
    private String updateBy;
    private Long planId;
    private String user;
    private String detail;
    private Long sumOfAudit;
    private Long sumOfNc;
    private Long sumOfLy;
    private Long sumOfFail;
    private Long sumOfSelectAgain;
    private Integer sumOfCheck;
    private Integer sumOfUncheck;
    private Integer sumOfPass;
    private Integer sumOfDat;

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

    public ReportResponseDTO() {}

    public Integer getSumOfCheck() {
        return sumOfCheck;
    }

    public void setSumOfCheck(Integer sumOfCheck) {
        this.sumOfCheck = sumOfCheck;
    }

    public Integer getSumOfUncheck() {
        return sumOfUncheck;
    }

    public void setSumOfUncheck(Integer sumOfUncheck) {
        this.sumOfUncheck = sumOfUncheck;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getSampleReportId() {
        return sampleReportId;
    }

    public void setSampleReportId(Long sampleReportId) {
        this.sampleReportId = sampleReportId;
    }

    public String getTestOfObject() {
        return testOfObject;
    }

    public void setTestOfObject(String testOfObject) {
        this.testOfObject = testOfObject;
    }

    public String getChecker() {
        return checker;
    }

    public void setChecker(String checker) {
        this.checker = checker;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Long getReportTypeId() {
        return reportTypeId;
    }

    public void setReportTypeId(Long reportTypeId) {
        this.reportTypeId = reportTypeId;
    }

    public Integer getGroupReport() {
        return groupReport;
    }

    public void setGroupReport(Integer groupReport) {
        this.groupReport = groupReport;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(LocalDateTime checkTime) {
        this.checkTime = checkTime;
    }

    public String getScoreScale() {
        return scoreScale;
    }

    public void setScoreScale(String scoreScale) {
        this.scoreScale = scoreScale;
    }

    public String getConvertScore() {
        return convertScore;
    }

    public void setConvertScore(String convertScore) {
        this.convertScore = convertScore;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public Long getSumOfAudit() {
        return sumOfAudit;
    }

    public void setSumOfAudit(Long sumOfAudit) {
        this.sumOfAudit = sumOfAudit;
    }

    public Long getSumOfNc() {
        return sumOfNc;
    }

    public void setSumOfNc(Long sumOfNc) {
        this.sumOfNc = sumOfNc;
    }

    public Long getSumOfLy() {
        return sumOfLy;
    }

    public void setSumOfLy(Long sumOfLy) {
        this.sumOfLy = sumOfLy;
    }

    public Long getSumOfFail() {
        return sumOfFail;
    }

    public void setSumOfFail(Long sumOfFail) {
        this.sumOfFail = sumOfFail;
    }

    public Long getSumOfSelectAgain() {
        return sumOfSelectAgain;
    }

    public void setSumOfSelectAgain(Long sumOfSelectAgain) {
        this.sumOfSelectAgain = sumOfSelectAgain;
    }
}
