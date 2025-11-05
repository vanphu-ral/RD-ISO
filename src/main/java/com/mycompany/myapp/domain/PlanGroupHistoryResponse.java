package com.mycompany.myapp.domain;

public interface PlanGroupHistoryResponse {
    String getCriterialName();
    String getCriterialGroupName();
    String getResultRecheck(); // Lấy kết quả recheck
    String getStatusRecheck();
    Integer getSumOfRecheck();
    String getErrorType();
    String getFrequency();
    String getConvertScore();
    String getNote();
    String getCreatedAt();
    String getResult(); // Lấy kết quả ban đầu
    String getStatus();
    Integer getId();
    Integer getPlanGroupHistoryId();
    Integer getReportId();
    String getReportName();
    String getImage();
    Integer getHasEvaluation();
    String getUpdatedAt();
    String getCreatedBy();
    Integer getFixed();
    String getGroupName();
    String getSubjectOfAssetmentPlan();
    String getTime();
    String getReportType();
}
