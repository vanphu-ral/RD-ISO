package com.mycompany.myapp.domain;

import java.time.ZonedDateTime;

public interface PlanGroupHistoryListDetail {
    Long getId();
    String getCode();
    String getName();
    Long getPlanId();
    String getChecker();
    ZonedDateTime getCheckDate();
    String getType();
    ZonedDateTime getCreatedAt();
    String getCreatedBy();
    String getStatus();
    String getPlanCode();
    String getPlanName();
}
