package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Plan;
import com.mycompany.myapp.domain.PlanAutoUpdateResponse;
import com.mycompany.myapp.domain.PlanStatisticalResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Plan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    @Query(
        value = "" +
        "WITH temp_table AS (\n" +
        "    SELECT \n" +
        " distinct(a.plan_group_history_id)\n" +
        "\t ,a.report_id AS report_id\n" +
        "\t ,c.id  AS plan_id\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1 \n" +
        "),\n" +
        "\ttemp_table_2 AS (\n" +
        " SELECT \n" +
        "\t a.report_id AS report_id\n" +
        "\t ,a.plan_group_history_id\n" +
        "\t ,c.id  AS plan_id\n" +
        "\t ,a.result\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1 \n" +
        ")\n" +
        "SELECT \n" +
        "distinct(pghd.report_id) as reportId\n" +
        ",rp.name as reportName\n" +
        ",rp.code as reportCode\n" +
        ",rp.test_of_object as testOfObject \n" +
        ",(SELECT COUNT(*) FROM temp_table tb WHERE tb.report_id = rp.id) AS sumOfAudit\n" +
        ",rp.convert_score as convertScore\n" +
        ",rp.score_scale as scoreScale\n" +
        ",(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='NC') AS sumOfNc\n" +
        ",(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='LY') AS sumOfLy\n" +
        ",(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='Không đạt') AS sumOfFail\n" +
        "FROM plan_group_history_detail pghd\n" +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id WHERE rp.id = ?2",
        nativeQuery = true
    )
    public List<PlanStatisticalResponse> getPlanStatisticalByReportId(Long planId, Long reportId);

    @Query(
        value = "" +
        "WITH temp_table AS (\n" +
        "    SELECT \n" +
        " distinct(a.plan_group_history_id)\n" +
        "\t ,a.report_id AS report_id\n" +
        "\t ,c.id  AS plan_id\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1 \n" +
        "),\n" +
        "\ttemp_table_2 AS (\n" +
        " SELECT \n" +
        "\t a.report_id AS report_id\n" +
        "\t ,a.plan_group_history_id\n" +
        "\t ,c.id  AS plan_id\n" +
        "\t ,a.result\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id WHERE c.id = ?1 \n" +
        ")\n" +
        "SELECT \n" +
        "distinct(pghd.report_id) as reportId\n" +
        ",rp.name as reportName\n" +
        ",rp.code as reportCode\n" +
        ",rp.test_of_object as testOfObject \n" +
        ",(SELECT COUNT(*) FROM temp_table tb WHERE tb.report_id = rp.id) AS sumOfAudit\n" +
        ",rp.convert_score as convertScore\n" +
        ",rp.score_scale as scoreScale\n" +
        ",(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='NC') AS sumOfNc\n" +
        ",(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='LY') AS sumOfLy\n" +
        ",(SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result ='Không đạt') AS sumOfFail\n" +
        "FROM plan_group_history_detail pghd\n" +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id " +
        "inner join iso.plan p on p.id = rp.plan_id where p.id = ?1 ;",
        nativeQuery = true
    )
    public List<PlanStatisticalResponse> getAllPlanStatistical(Long planId);

    @Query(
        value = " SELECT" +
        " b.id as id, \n" +
        " case when SUM(case when a.status ='Đã hoàn thành' then 0 ELSE 1 END) =0 then 'Đã hoàn thành'ELSE 'Chưa hoàn thành'END  AS status FROM iso.plan_group_history a\n" +
        " INNER JOIN iso.plan_group_history_detail c ON c.plan_group_history_id = a.id\n" +
        " INNER JOIN iso.report b ON b.id = c.report_id WHERE a.plan_id = ?1\n" +
        " GROUP BY b.id\n" +
        " ORDER BY b.id ;",
        nativeQuery = true
    )
    public List<PlanAutoUpdateResponse> getReportStatusByPlanId(Long planId);

    @Query(value = "select * from iso.plan where time_end like ?1 ;", nativeQuery = true)
    public List<Plan> getPlanByTimeEnd(String timeEnd);

    @Query(
        value = "WITH temp_table AS (\n" +
        "    SELECT DISTINCT a.plan_group_history_id, a.report_id, c.id AS plan_id\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id\n" +
        "),\n" +
        "temp_table_2 AS (\n" +
        "    SELECT a.report_id, a.plan_group_history_id, c.id AS plan_id, a.result\n" +
        "    FROM iso.plan_group_history_detail a\n" +
        "    INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id\n" +
        "    INNER JOIN iso.plan c ON c.id = b.plan_id\n" +
        "),\n" +
        "recheck_plan_details AS(\n" +
        "SELECT \n" +
        "c.id,\n" +
        "rps.report_id,\n" +
        "rrpd.result\n" +
        " FROM iso.recheck_remediation_plan_detail AS rrpd\n" +
        "INNER JOIN iso.remediation_plan_detail AS rpd ON rpd.id = rrpd.remediation_plan_detail_id\n" +
        "INNER JOIN iso.remediation_plan AS rps ON rps.id = rpd.remediation_plan_id\n" +
        "INNER JOIN iso.plan AS c ON c.id = rps.plan_id\n" +
        ")\n" +
        "SELECT DISTINCT \n" +
        "\t\tp.name AS planName,\n" +
        "p.time_start AS timeStart," +
        "\t\tp.subject_of_assetment_plan AS subjectOfAssetmentPlan,\n" +
        "\t\trp.report_type AS reportType,\n" +
        "\t\trp.checker AS checker,\n" +
        "\t\trp.test_of_object AS testOfObject,\n" +
        "\t\trp.group_name AS groupName,\n" +
        "\t\tpghd.report_id AS reportId,\n" +
        "       rp.name AS reportName,\n" +
        "       rp.code AS reportCode,\n" +
        "       rp.test_of_object AS testOfObject,\n" +
        "       (SELECT COUNT(*) FROM temp_table tb WHERE tb.report_id = rp.id) AS sumOfAudit,\n" +
        "       rp.convert_score AS convertScore,\n" +
        "       rp.score_scale AS scoreScale,\n" +
        "       (SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result = 'NC') AS sumOfNc,\n" +
        "       (SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result = 'LY') AS sumOfLy,\n" +
        "       (SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND result = 'Không đạt') AS sumOfFail,\n" +
        "       (SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id AND (result = 'Đạt' OR result ='PASS')) AS sumOfPass,\n" +
        "       (SELECT COUNT(result) FROM temp_table_2 tb WHERE tb.report_id = rp.id) AS total,\n" +
        "       (SELECT\tCOUNT(result) FROM recheck_plan_details rpds WHERE rpds.report_id = rp.id AND rpds.result ='Không đạt') AS sumOfUncheck\n" +
        "FROM iso.plan_group_history_detail pghd\n" +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id\n" +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id " +
        "where " +
        " p.time_start between ?1 and ?2 " +
        "and  (?3 is null OR rp.group_name like ?3 )" +
        "and (?4 is null OR rp.test_of_object like ?4 )" +
        "and (?5 is null OR rp.report_type like ?5) " +
        "and (?6 is null OR  p.subject_of_assetment_plan like ?6 );",
        nativeQuery = true
    )
    public Page<PlanStatisticalResponse> getPlanStatisticalByManyCriteria(
        String timeStart,
        String timeEnd,
        String groupName,
        String testOfObject,
        String reportType,
        String subjectOfAssetmentPlan,
        Pageable pageable
    );
}
