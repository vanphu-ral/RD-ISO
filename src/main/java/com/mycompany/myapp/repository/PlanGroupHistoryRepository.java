package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PlanGroupHistory;
import com.mycompany.myapp.domain.PlanGroupHistoryListDetail;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanGroupHistoryRepository extends JpaRepository<PlanGroupHistory, Long> {
    public List<PlanGroupHistory> findAllByPlanId(Long planId);

    @Query(
        "SELECT pgh FROM PlanGroupHistory pgh " +
        "WHERE pgh.id IN (" +
        "   SELECT DISTINCT pghd.planGroupHistoryId " +
        "   FROM PlanGroupHistoryDetail pghd " +
        "   WHERE pghd.reportId = :reportId" +
        ")"
    )
    List<PlanGroupHistory> findAllByReportId(@Param("reportId") Long reportId);

    @Query(
        """
            SELECT
                h.id AS id,
                h.code AS code,
                h.name AS name,
                h.planId AS planId,
                h.checker AS checker,
                h.checkDate AS checkDate,
                h.type AS type,
                h.createdAt AS createdAt,
                h.createdBy AS createdBy,
                h.status AS status,
                p.code AS planCode,
                p.name AS planName
            FROM PlanGroupHistory h
            LEFT JOIN Plan p ON h.planId = p.id
            ORDER BY h.id DESC
        """
    )
    List<PlanGroupHistoryListDetail> findAllWithPlanInfo();

    @Query(
        """
            SELECT
                h.id AS id,
                h.code AS code,
                h.name AS name,
                h.planId AS planId,
                h.checker AS checker,
                h.checkDate AS checkDate,
                h.type AS type,
                h.createdAt AS createdAt,
                h.createdBy AS createdBy,
                h.status AS status,
                p.code AS planCode,
                p.name AS planName
            FROM PlanGroupHistory h
            LEFT JOIN Plan p ON h.planId = p.id
            WHERE h.planId = :planId
            ORDER BY h.id DESC
        """
    )
    List<PlanGroupHistoryListDetail> findAllWithPlanInfoByPlanId(@Param("planId") Long planId);
}
