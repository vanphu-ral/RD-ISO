package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PlanGroupHistory;
import com.mycompany.myapp.domain.PlanGroupHistoryDetail;
import com.mycompany.myapp.domain.PlanGroupHistoryResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanGroupHistoryDetailRepository extends JpaRepository<PlanGroupHistoryDetail, Long> {
    List<PlanGroupHistoryDetail> findAllByPlanGroupHistoryId(Long id);

    List<PlanGroupHistoryDetail> findAllByReportId(Long reportId);

    List<PlanGroupHistoryDetail> findAllByReportIdIn(List<Long> reportIds);

    List<PlanGroupHistoryDetail> findAllByPlanGroupHistoryIdAndReportId(Long planGroupHistoryId, Long reportId);
    PlanGroupHistoryDetail findByReportIdAndCriterialNameAndCriterialGroupName(
        Long reportId,
        String criterialName,
        String criterialGroupName
    );

    @Query(
        value = "SELECT\n" +
        "    pghd.criterial_name as criterialName,\n" +
        "    pghd.criterial_group_name as groupCriterialName,\n" +
        "    (\n" +
        "        SELECT rrpd.result\n" +
        "        FROM iso.remediation_plan_detail rpd\n" +
        "        INNER JOIN iso.recheck_remediation_plan_detail rrpd \n" +
        "            ON rrpd.remediation_plan_detail_id = rpd.id\n" +
        "        WHERE rpd.criterial_name = pghd.criterial_name \n" +
        "            AND rpd.criterial_group_name = pghd.criterial_group_name \n" +
        "            AND rpd.report_id = pghd.report_id\n" +
        "        ORDER BY rpd.created_at DESC\n" +
        "        LIMIT 1\n" +
        "    ) AS result,\n" +
        "    (\n" +
        "        SELECT rrpd.status\n" +
        "        FROM iso.remediation_plan_detail rpd\n" +
        "        INNER JOIN iso.recheck_remediation_plan_detail rrpd \n" +
        "            ON rrpd.remediation_plan_detail_id = rpd.id\n" +
        "        WHERE rpd.criterial_name = pghd.criterial_name \n" +
        "            AND rpd.criterial_group_name = pghd.criterial_group_name \n" +
        "            AND rpd.report_id = pghd.report_id\n" +
        "        ORDER BY rpd.created_at DESC\n" +
        "        LIMIT 1\n" +
        "    ) AS statusRecheck,\n" +
        "    (\n" +
        "        SELECT COUNT(rpd.id)\n" +
        "        FROM iso.remediation_plan_detail rpd\n" +
        "        INNER JOIN iso.recheck_remediation_plan_detail rrpd \n" +
        "            ON rrpd.remediation_plan_detail_id = rpd.id\n" +
        "        WHERE rpd.criterial_name = pghd.criterial_name \n" +
        "            AND rpd.criterial_group_name = pghd.criterial_group_name \n" +
        "            AND rpd.report_id = pghd.report_id\n" +
        "    ) AS sumOfRecheck\n" +
        "FROM iso.plan_group_history_detail pghd\n" +
        "WHERE pghd.result NOT IN ('Đạt', 'PASS')\n" +
        "AND pghd.report_id = :reportId\n" +
        "AND  pghd.criterial_name LIKE %:criterialName%\n" +
        "AND  pghd.criterial_group_name LIKE %:groupCriterialName%",
        nativeQuery = true
    )
    Page<PlanGroupHistoryResponse> getDetailRecheckByReportIdWithFilter(
        @Param("reportId") Long reportId,
        @Param("criterialName") String criterialName,
        @Param("groupCriterialName") String groupCriterialName,
        Pageable pageable
    );
}
