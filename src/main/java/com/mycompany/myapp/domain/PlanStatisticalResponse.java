package com.mycompany.myapp.domain;

import jakarta.persistence.criteria.CriteriaBuilder;

public interface PlanStatisticalResponse {
    Integer getPlanGroupHistoryId();
    String getPlanGroupHistoryCode();
    String getPlanGroupHistoryName();
    String getCheckDate();
    Integer getReportId();
    String getReportName();
    String getReportCode();
    String getTestOfObject();
    Integer getSumOfAudit();
    String getConvertScore();
    Integer getScoreScale();
    Integer getSumOfNc();
    Integer getSumOfLy();
    Integer getSumOfFail();
    String getPlanName();
    Integer getPlanId();
    String getSubjectOfAssetmentPlan(); // nganh
    String getReportType(); // loai bien ban
    String getChecker(); // nguoi kiem tra
    String getGroupName(); // ten nganh
    String getTimeStart(); // thoi gian bat dau
    Integer getSumOfPass(); // tong so tieu chi pass
    Integer getTotal();
    Integer getSumOfUncheck(); // tong so loi chua khac phuc
    Integer getSumOfCheck(); // tong so loi da khac phuc
    Integer getSumOfReport(); // tong so bien ban kiem tra
    Integer getSumOfCreateReport(); // tong so bien ban da tao bao cao
}
