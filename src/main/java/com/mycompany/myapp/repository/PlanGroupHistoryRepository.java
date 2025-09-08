package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PlanGroupHistory;
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
            SELECT new com.mycompany.myapp.dto.PlanGroupHistoryDTO(
                h.id, h.code, h.name, h.planId, h.checker, h.checkDate, h.type,
                h.createdAt, h.createdBy, h.status,
                p.code, p.name
            )
            FROM PlanGroupHistory h
            LEFT JOIN Plan p ON h.planId = p.id
            ORDER BY h.id DESC
        """
    )
    List<com.mycompany.myapp.dto.PlanGroupHistoryDTO> findAllWithPlanInfo();

    @Query(
        """
            SELECT new com.mycompany.myapp.service.dto.PlanGroupHistoryDTO(
                h.id, h.code, h.name, h.planId, h.checker, h.checkDate, h.type,
                h.createdAt, h.createdBy, h.status,
                p.code, p.name
            )
            FROM PlanGroupHistory h
            LEFT JOIN Plan p ON h.planId = p.id
            WHERE h.planId = :planId
            ORDER BY h.id DESC
        """
    )
    List<com.mycompany.myapp.dto.PlanGroupHistoryDTO> findAllWithPlanInfoByPlanId(@Param("planId") Long planId);
}
