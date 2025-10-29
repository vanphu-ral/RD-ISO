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
        value = "SELECT DISTINCT rp.id AS reportId, " +
        "p.name AS planName, " +
        "p.id AS planId, " +
        "p.time_start AS timeStart, " +
        "p.subject_of_assetment_plan AS subjectOfAssetmentPlan, " +
        "rp.report_type AS reportType, " +
        "rp.checker AS checker, " +
        "rp.test_of_object AS testOfObject, " +
        "rp.group_name AS groupName, " +
        "rp.name AS reportName, " +
        "rp.code AS reportCode, " +
        "rp.convert_score AS convertScore, " +
        "rp.score_scale AS scoreScale, " +
        // sumOfAudit
        "(SELECT COUNT(DISTINCT a.plan_group_history_id) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " WHERE a.report_id = rp.id) AS sumOfAudit, " +
        // sumOfNc
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " WHERE a.report_id = rp.id AND a.result = 'NC') AS sumOfNc, " +
        // sumOfLy
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " WHERE a.report_id = rp.id AND a.result = 'LY') AS sumOfLy, " +
        // sumOfFail
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " WHERE a.report_id = rp.id AND a.result = 'Không đạt') AS sumOfFail, " +
        // sumOfPass
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " WHERE a.report_id = rp.id AND (a.result = 'Đạt' OR a.result = 'PASS')) AS sumOfPass, " +
        // total
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " WHERE a.report_id = rp.id) AS total, " +
        // sumOfUncheck
        "(SELECT COUNT(*) " +
        " FROM iso.recheck_remediation_plan_detail rrpd " +
        " INNER JOIN iso.remediation_plan_detail rpd ON rpd.id = rrpd.remediation_plan_detail_id " +
        " INNER JOIN iso.remediation_plan rps ON rps.id = rpd.remediation_plan_id " +
        " INNER JOIN iso.plan c ON c.id = rps.plan_id " +
        " WHERE rps.report_id = rp.id AND rrpd.result = 'Không đạt') AS sumOfUncheck " +
        "FROM iso.plan_group_history_detail pghd " +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id " +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id " +
        "WHERE p.time_start BETWEEN ?1 AND ?2 " +
        " and rp.report_type IN ?3  \n" +
        "             and p.subject_of_assetment_plan IN ?4   \n" +
        "             and rp.group_name IN ?5  \n" +
        "             and rp.test_of_object IN ?6 ",
        countQuery = "SELECT COUNT(DISTINCT rp.id) " +
        "FROM iso.plan_group_history_detail pghd " +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id " +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id " +
        "WHERE p.time_start BETWEEN ?1 AND ?2 " +
        " and rp.report_type IN ?3  \n" +
        "             and  p.subject_of_assetment_plan IN ?4   \n" +
        "             and  rp.group_name IN ?5  \n" +
        "             and  rp.test_of_object IN ?6 ",
        nativeQuery = true
    )
    Page<PlanStatisticalResponse> getPlanStatisticalByManyCriteria(
        String timeStart,
        String timeEnd,
        List<String> reportType,
        List<String> subjectOfAssetmentPlan,
        List<String> groupName,
        List<String> testOfObject,
        Pageable pageable
    );

    @Query(
        value = "SELECT DISTINCT " +
        "rp.group_name AS groupName, " +
        "CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) AS timeStart, " +
        "p.subject_of_assetment_plan AS subjectOfAssetmentPlan, " +
        "rp.report_type AS reportType, " +
        "rp.checker AS checker, " +
        "rp.test_of_object AS testOfObject, " +
        "rp.convert_score AS convertScore, " +
        "rp.score_scale AS scoreScale, " +
        // sumOfAudit
        "(SELECT COUNT(DISTINCT a.plan_group_history_id) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE d.group_name = rp.group_name) AS sumOfAudit, " +
        // sumOfNc
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE d.group_name = rp.group_name AND a.result = 'NC') AS sumOfNc, " +
        // sumOfLy
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE d.group_name = rp.group_name  AND a.result = 'LY') AS sumOfLy, " +
        // sumOfFail
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE d.group_name = rp.group_name AND a.result = 'Không đạt') AS sumOfFail, " +
        // sumOfPass
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE d.group_name = rp.group_name AND (a.result = 'Đạt' OR a.result = 'PASS')) AS sumOfPass, " +
        // total
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE d.group_name = rp.group_name ) AS total, " +
        // sumOfUncheck
        "(SELECT COUNT(*) " +
        " FROM iso.recheck_remediation_plan_detail rrpd " +
        " INNER JOIN iso.remediation_plan_detail rpd ON rpd.id = rrpd.remediation_plan_detail_id " +
        " INNER JOIN iso.remediation_plan rps ON rps.id = rpd.remediation_plan_id " +
        " INNER JOIN iso.plan c ON c.id = rps.plan_id " +
        " inner join iso.report d on d.id = rps.report_id" +
        " WHERE d.group_name = rp.group_name AND rrpd.result = 'Không đạt') AS sumOfUncheck " +
        "FROM iso.plan_group_history_detail pghd " +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id " +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id " +
        "WHERE CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) BETWEEN ?1 AND ?2 " +
        " and rp.report_type IN ?3  \n" +
        "             and p.subject_of_assetment_plan IN ?4   \n" +
        "             and rp.group_name IN ?5  \n" +
        "             and rp.test_of_object IN ?6 ",
        countQuery = "SELECT COUNT(DISTINCT rp.id) " +
        "FROM iso.plan_group_history_detail pghd " +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id " +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id " +
        "WHERE CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) BETWEEN ?1 AND ?2" +
        " and rp.report_type IN ?3  \n" +
        "             and  p.subject_of_assetment_plan IN ?4   \n" +
        "             and  rp.group_name IN ?5  \n" +
        "             and  rp.test_of_object IN ?6 ",
        nativeQuery = true
    )
    Page<PlanStatisticalResponse> getPlanStatisticalByManyCriteriaByGroup(
        String timeStart,
        String timeEnd,
        List<String> reportType,
        List<String> subjectOfAssetmentPlan,
        List<String> groupName,
        List<String> testOfObject,
        Pageable pageable
    );

    @Query(
        value = "SELECT DISTINCT " +
        "p.subject_of_assetment_plan AS subjectOfAssetmentPlan, " +
        "CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) AS timeStart, " +
        "rp.report_type AS reportType, " +
        "rp.convert_score AS convertScore, " +
        "rp.score_scale AS scoreScale, " +
        // sumOfAudit
        "(SELECT COUNT(DISTINCT a.plan_group_history_id) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0'))) AS sumOfAudit, " +
        // sumOfReport
        "(SELECT COUNT(DISTINCT (d.id)) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0'))) AS sumOfReport, " +
        // sumOfNc
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type AND a.result = 'NC'" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0'))) AS sumOfNc, " +
        // sumOfLy
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type  AND a.result = 'LY'" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0'))) AS sumOfLy, " +
        // sumOfFail
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type AND a.result = 'Không đạt'" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0'))) AS sumOfFail, " +
        // sumOfPass
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type AND (a.result = 'Đạt' OR a.result = 'PASS')" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0'))) AS sumOfPass, " +
        // total
        "(SELECT COUNT(*) " +
        " FROM iso.plan_group_history_detail a " +
        " INNER JOIN iso.plan_group_history b ON a.plan_group_history_id = b.id " +
        " INNER JOIN iso.plan c ON c.id = b.plan_id " +
        " inner join iso.report d on d.id = a.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) ) AS total, " +
        // sumOfUncheck
        "(SELECT COUNT(*) " +
        " FROM iso.recheck_remediation_plan_detail rrpd " +
        " INNER JOIN iso.remediation_plan_detail rpd ON rpd.id = rrpd.remediation_plan_detail_id " +
        " INNER JOIN iso.remediation_plan rps ON rps.id = rpd.remediation_plan_id " +
        " INNER JOIN iso.plan c ON c.id = rps.plan_id " +
        " inner join iso.report d on d.id = rps.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type AND rrpd.result = 'Không đạt'" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0'))) AS sumOfUncheck ," +
        "(SELECT COUNT(*) " +
        " FROM iso.recheck_remediation_plan_detail rrpd " +
        " INNER JOIN iso.remediation_plan_detail rpd ON rpd.id = rrpd.remediation_plan_detail_id " +
        " INNER JOIN iso.remediation_plan rps ON rps.id = rpd.remediation_plan_id " +
        " INNER JOIN iso.plan c ON c.id = rps.plan_id " +
        " inner join iso.report d on d.id = rps.report_id" +
        " WHERE c.subject_of_assetment_plan = p.subject_of_assetment_plan AND d.report_type = rp.report_type AND rrpd.result = 'Đạt'" +
        " AND CONCAT(YEAR(c.time_start), '-', LPAD(MONTH(c.time_start), 2, '0')) = CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) ) AS sumOfCheck " +
        "FROM iso.plan_group_history_detail pghd " +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id " +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id " +
        "WHERE CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) BETWEEN ?1 AND ?2 " +
        " and rp.report_type IN ?3  \n" +
        "             and p.subject_of_assetment_plan IN ?4   \n",
        countQuery = "SELECT COUNT(DISTINCT rp.id) " +
        "FROM iso.plan_group_history_detail pghd " +
        "INNER JOIN iso.report rp ON rp.id = pghd.report_id " +
        "INNER JOIN iso.plan p ON p.id = rp.plan_id " +
        "WHERE CONCAT(YEAR(p.time_start), '-', LPAD(MONTH(p.time_start), 2, '0')) BETWEEN ?1 AND ?2" +
        " and rp.report_type IN ?3  \n" +
        "             and  p.subject_of_assetment_plan IN ?4   \n",
        nativeQuery = true
    )
    Page<PlanStatisticalResponse> getPlanStatisticalByManyCriteriaBySubjectAssetmentPlan(
        String timeStart,
        String timeEnd,
        List<String> reportType,
        List<String> subjectOfAssetmentPlan,
        Pageable pageable
    );
}
