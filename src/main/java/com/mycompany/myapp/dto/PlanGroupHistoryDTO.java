package com.mycompany.myapp.dto;

import java.time.ZonedDateTime;

public class PlanGroupHistoryDTO {

    private Long id;
    private String code;
    private String name;
    private Long planId;
    private String checker;
    private ZonedDateTime checkDate; // Sửa kiểu dữ liệu
    private String type;
    private ZonedDateTime createdAt; // Sửa kiểu dữ liệu
    private String createdBy;
    private String status;

    // Các trường chỉ lấy từ Plan
    private String planCode;
    private String planName;

    // Quan trọng: Constructor này phải khớp với thứ tự các trường
    // trong câu lệnh SELECT NEW của JPQL
    public PlanGroupHistoryDTO(
        Long id,
        String code,
        String name,
        Long planId,
        String checker,
        ZonedDateTime checkDate,
        String type,
        ZonedDateTime createdAt,
        String createdBy,
        String status,
        String planCode,
        String planName
    ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.planId = planId;
        this.checker = checker;
        this.checkDate = checkDate;
        this.type = type;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.status = status;
        this.planCode = planCode;
        this.planName = planName;
    }

    // --- Generate Getters and Setters cho tất cả các trường ---
    // (Bắt buộc phải có để Jackson có thể serialize thành JSON)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getChecker() {
        return checker;
    }

    public void setChecker(String checker) {
        this.checker = checker;
    }

    public ZonedDateTime getCheckDate() {
        return checkDate;
    }

    public void setCheckDate(ZonedDateTime checkDate) {
        this.checkDate = checkDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPlanCode() {
        return planCode;
    }

    public void setPlanCode(String planCode) {
        this.planCode = planCode;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }
}
