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
        value = "SELECT  " +
        "pghd.id as id," +
        "pghd.report_id as reportId," +
        "pghd.report_name as reportName," +
        "pghd.plan_group_history_id as planGroupHistoryId," +
        "pghd.image as image," +
        "pghd.has_evaluation as hasEvaluation," +
        "pghd.status as status," +
        "pghd.updated_at as updatedAt," +
        "pghd.created_by as createdBy," +
        "pghd.fixed as fixed,\n" +
        "    pghd.criterial_name as criterialName,\n" +
        "    pghd.criterial_group_name as criterialGroupName," +
        "pghd.result as result," +
        "pghd.frequency as frequency," +
        "pghd.convert_score as convertScore," +
        "pghd.note as note," +
        "pghd.created_at as createdAt,\n" +
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
        "    ) AS resultRecheck,\n" +
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
        "AND  pghd.criterial_group_name LIKE %:criterialGroupName%",
        nativeQuery = true
    )
    Page<PlanGroupHistoryResponse> getDetailRecheckByReportIdWithFilter(
        @Param("reportId") Long reportId,
        @Param("criterialName") String criterialName,
        @Param("criterialGroupName") String criterialGroupName,
        Pageable pageable
    );

    @Query(
        value = "SELECT  " +
        "pghd.id as id," +
        "pghd.report_id as reportId," +
        "pghd.report_name as reportName," +
        "pghd.plan_group_history_id as planGroupHistoryId," +
        "pghd.image as image," +
        "pghd.has_evaluation as hasEvaluation," +
        "pghd.status as status," +
        "pghd.updated_at as updatedAt," +
        "pghd.created_by as createdBy," +
        "pghd.fixed as fixed,\n" +
        "    pghd.criterial_name as criterialName,\n" +
        "    pghd.criterial_group_name as criterialGroupName," +
        "pghd.result as result," +
        "pghd.frequency as frequency," +
        "pghd.convert_score as convertScore," +
        "pghd.note as note," +
        "pghd.created_at as createdAt,\n" +
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
        "    ) AS resultRecheck,\n" +
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
        "AND pghd.report_id = :reportId\n",
        nativeQuery = true
    )
    List<PlanGroupHistoryResponse> getDetailRecheckByReportId(@Param("reportId") Long reportId);

    @Query(
        value = "SELECT\n" +
        "pghd.id as id," +
        "pghd.report_id as reportId," +
        "pghd.report_name as reportName," +
        "pghd.plan_group_history_id as planGroupHistoryId," +
        "pghd.image as image," +
        "pghd.has_evaluation as hasEvaluation," +
        "pghd.status as status," +
        "pghd.updated_at as updatedAt," +
        "pghd.created_by as createdBy," +
        "pghd.fixed as fixed,\n" +
        "pghd.result as result," +
        "pghd.frequency as frequency," +
        "pghd.convert_score as convertScore," +
        "pghd.note as note," +
        "pghd.created_at as createdAt,\n" +
        "    pghd.criterial_name as criterialName,\n" +
        "    pghd.criterial_group_name as criterialGroupName," +
        "pghd.result as result,\n" +
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
        "    ) AS resultRecheck,\n" +
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
        "FROM iso.plan_group_history_detail pghd " +
        "inner join iso.report as r on r.id = pghd.report_id \n" +
        "WHERE pghd.result NOT IN ('Đạt', 'PASS')\n" +
        "AND r.plan_id = :planId\n" +
        "AND  pghd.criterial_name LIKE %:criterialName%\n" +
        "AND  pghd.criterial_group_name LIKE %:criterialGroupName%",
        nativeQuery = true
    )
    Page<PlanGroupHistoryResponse> getDetailRecheckByPlanIdWithFilter(
        @Param("planId") Long planId,
        @Param("criterialName") String criterialName,
        @Param("criterialGroupName") String criterialGroupName,
        Pageable pageable
    );

    @Query(
        value = "SELECT \n" +
        "    pghd.criterial_name as criterialName,\n" +
        "    pghd.criterial_group_name as criterialGroupName," +
        "pghd.result as errorType,\n" +
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
        "FROM iso.plan_group_history_detail pghd " +
        "inner join iso.report as r on r.id = pghd.report_id \n" +
        "WHERE pghd.result NOT IN ('Đạt', 'PASS')\n" +
        "AND r.plan_id = :planId ;\n",
        nativeQuery = true
    )
    List<PlanGroupHistoryResponse> getDetailRecheckByPlanId(@Param("planId") Long planId);

    @Query(
        value = "SELECT\n" +
        "    pghd.criterial_name as criterialName,\n" +
        "    pghd.criterial_group_name as criterialGroupName," +
        "p.subject_of_assetment_plan as subjectOfAssetmentPlan," +
        "r.group_name as groupName," +
        "pghd.result as errorType,\n" +
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
        "FROM iso.plan_group_history_detail pghd " +
        "inner join iso.report as r on r.id = pghd.report_id " +
        "inner join iso.plan as p on p.id = r.plan_id \n" +
        "WHERE pghd.result NOT IN ('Đạt', 'PASS')\n" +
        "AND p.subject_of_assetment_plan = :subjectOfAssetmentPlan ;\n",
        nativeQuery = true
    )
    List<PlanGroupHistoryResponse> getDetailRecheckByGroup(@Param("subjectOfAssetmentPlan") String subjectOfAssetmentPlan);

    @Query(
        value = "SELECT\n" +
        "    pghd.criterial_name as criterialName,\n" +
        "    pghd.criterial_group_name as criterialGroupName," +
        "p.subject_of_assetment_plan as subjectOfAssetmentPlan," +
        "r.group_name as groupName," +
        "pghd.result as errorType,\n" +
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
        "FROM iso.plan_group_history_detail pghd " +
        "inner join iso.report as r on r.id = pghd.report_id \n" +
        "inner join iso.plan as p on p.id = r.plan_id \n" +
        "WHERE pghd.result NOT IN ('Đạt', 'PASS')\n" +
        "AND p.subject_of_assetment_plan = :subjectOfAssetmentPlan AND r.group_name = :groupName ;\n",
        nativeQuery = true
    )
    List<PlanGroupHistoryResponse> getDetailRecheckByTeam(
        @Param("subjectOfAssetmentPlan") String subjectOfAssetmentPlan,
        @Param("groupName") String groupName
    );
}
