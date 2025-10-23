package com.mycompany.myapp.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "group_info")
public class GroupInfo {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(name = "U_BranchCode")
    private String branchCode;

    @Column(name = "U_GroupName")
    private String groupName;

    @Column(name = "U_BranchName")
    private String branchName;

    @Column(name = "U_GroupCode")
    private String groupCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }
}
