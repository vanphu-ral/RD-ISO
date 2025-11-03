package com.mycompany.myapp.domain;

public interface PlanGroupHistoryResponse {
    String getCriterialName();
    String getCriterialGroupName();
    String getResult();
    String getStatusRecheck();
    Integer getSumOfRecheck();
    String getErrorType();
    String getFrequency();
    String getConvertScore();
    String getNote();
    String getCreatedAt();
}
