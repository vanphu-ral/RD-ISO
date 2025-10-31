package com.mycompany.myapp.web.filter;

import com.mycompany.myapp.domain.Plan;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class PlanSpecification {

    public static Specification<Plan> buildFilter(PlanFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getCode() != null) {
                predicates.add(cb.like(cb.lower(root.get("code")), "%" + filter.getCode().toLowerCase() + "%"));
            }
            if (filter.getName() != null) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.getName().toLowerCase() + "%"));
            }
            if (filter.getSubjectOfAssetmentPlan() != null) {
                predicates.add(
                    cb.like(cb.lower(root.get("subjectOfAssetmentPlan")), "%" + filter.getSubjectOfAssetmentPlan().toLowerCase() + "%")
                );
            }
            if (filter.getFrequency() != null) {
                predicates.add(cb.equal(root.get("frequency"), filter.getFrequency()));
            }
            //            if (filter.getTimeStartFrom() != null) {
            //                predicates.add(cb.greaterThanOrEqualTo(root.get("timeStart"), filter.getTimeStartFrom()));
            //            }
            //            if (filter.getTimeStartTo() != null) {
            //                predicates.add(cb.lessThanOrEqualTo(root.get("timeStart"), filter.getTimeStartTo()));
            //            }
            //            if (filter.getTimeEndFrom() != null) {
            //                predicates.add(cb.greaterThanOrEqualTo(root.get("timeEnd"), filter.getTimeEndFrom()));
            //            }
            //            if (filter.getTimeEndTo() != null) {
            //                predicates.add(cb.lessThanOrEqualTo(root.get("timeEnd"), filter.getTimeEndTo()));
            //            }
            if (filter.getStatusPlan() != null) {
                predicates.add(cb.equal(root.get("statusPlan"), filter.getStatusPlan()));
            }
            if (filter.getTestObject() != null) {
                predicates.add(cb.like(cb.lower(root.get("testObject")), "%" + filter.getTestObject().toLowerCase() + "%"));
            }
            if (filter.getReportTypeId() != null) {
                predicates.add(cb.equal(root.get("reportTypeId"), filter.getReportTypeId()));
            }
            if (filter.getReportTypeName() != null) {
                predicates.add(cb.like(cb.lower(root.get("reportTypeName")), "%" + filter.getReportTypeName().toLowerCase() + "%"));
            }
            if (filter.getNumberOfCheck() != null) {
                predicates.add(cb.equal(root.get("numberOfCheck"), filter.getNumberOfCheck()));
            }
            if (filter.getImplementer() != null) {
                predicates.add(cb.like(cb.lower(root.get("implementer")), "%" + filter.getImplementer().toLowerCase() + "%"));
            }
            if (filter.getPaticipant() != null) {
                predicates.add(cb.like(cb.lower(root.get("paticipant")), "%" + filter.getPaticipant().toLowerCase() + "%"));
            }
            if (filter.getCheckerGroup() != null) {
                predicates.add(cb.like(cb.lower(root.get("checkerGroup")), "%" + filter.getCheckerGroup().toLowerCase() + "%"));
            }
            if (filter.getCheckerName() != null) {
                predicates.add(cb.like(cb.lower(root.get("checkerName")), "%" + filter.getCheckerName().toLowerCase() + "%"));
            }
            if (filter.getCheckerGroupId() != null) {
                predicates.add(cb.equal(root.get("checkerGroupId"), filter.getCheckerGroupId()));
            }
            if (filter.getCheckerId() != null) {
                predicates.add(cb.equal(root.get("checkerId"), filter.getCheckerId()));
            }
            if (filter.getGross() != null) {
                predicates.add(cb.like(cb.lower(root.get("gross")), "%" + filter.getGross().toLowerCase() + "%"));
            }
            if (filter.getTimeCheck() != null) {
                predicates.add(cb.equal(root.get("timeCheck"), filter.getTimeCheck()));
            }
            if (filter.getNameResult() != null) {
                predicates.add(cb.like(cb.lower(root.get("nameResult")), "%" + filter.getNameResult().toLowerCase() + "%"));
            }
            if (filter.getScriptId() != null) {
                predicates.add(cb.equal(root.get("scriptId"), filter.getScriptId()));
            }
            if (filter.getCreateBy() != null) {
                predicates.add(cb.like(cb.lower(root.get("createBy")), "%" + filter.getCreateBy().toLowerCase() + "%"));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            //            if (filter.getCreatedAtFrom() != null) {
            //                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filter.getCreatedAtFrom()));
            //            }
            //            if (filter.getCreatedAtTo() != null) {
            //                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filter.getCreatedAtTo()));
            //            }
            //            if (filter.getUpdatedAtFrom() != null) {
            //                predicates.add(cb.greaterThanOrEqualTo(root.get("updatedAt"), filter.getUpdatedAtFrom()));
            //            }
            //            if (filter.getUpdatedAtTo() != null) {
            //                predicates.add(cb.lessThanOrEqualTo(root.get("updatedAt"), filter.getUpdatedAtTo()));
            //            }
            if (filter.getUpdateBy() != null) {
                predicates.add(cb.like(cb.lower(root.get("updateBy")), "%" + filter.getUpdateBy().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
