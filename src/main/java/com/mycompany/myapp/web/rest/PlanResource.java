package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.config.ApplicationProperties;
import com.mycompany.myapp.domain.Plan;
import com.mycompany.myapp.domain.PlanStatisticalResponse;
import com.mycompany.myapp.domain.ReportResponse;
import com.mycompany.myapp.repository.PlanRepository;
import com.mycompany.myapp.repository.ReportRepository;
import com.mycompany.myapp.service.dto.PlanDetailDTO;
import com.mycompany.myapp.service.dto.ReportDTO;
import com.mycompany.myapp.web.filter.PlanFilter;
import com.mycompany.myapp.web.filter.PlanSpecification;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Plan}.
 */
@RestController
@RequestMapping("/api/plans")
@Transactional
public class PlanResource {

    private final Logger log = LoggerFactory.getLogger(PlanResource.class);

    private static final String ENTITY_NAME = "plan";

    //private static final String UPLOAD_DIR = "src/main/webapp/content/images/bbkt/";
    private final String uploadDir;
    private final String videoDir;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlanRepository planRepository;
    private final ReportRepository reportRepository;

    public PlanResource(PlanRepository planRepository, ReportRepository reportRepository, ApplicationProperties applicationProperties) {
        this.planRepository = planRepository;
        this.reportRepository = reportRepository;
        this.uploadDir = applicationProperties.getUploadDir();
        this.videoDir = applicationProperties.getVideoDir();
    }

    /**
     * {@code POST  /plans} : Create a new plan.
     *
     * @param plan the plan to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plan, or with status {@code 400 (Bad Request)} if the plan has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) throws URISyntaxException {
        log.debug("REST request to save Plan : {}", plan);
        if (plan.getId() != null) {
            throw new BadRequestAlertException("A new plan cannot already have an ID", ENTITY_NAME, "idexists");
        }
        plan = planRepository.save(plan);
        return ResponseEntity.created(new URI("/api/plans/" + plan.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, plan.getId().toString()))
            .body(plan);
    }

    /**
     * {@code PUT  /plans/:id} : Updates an existing plan.
     *
     * @param id the id of the plan to save.
     * @param plan the plan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plan,
     * or with status {@code 400 (Bad Request)} if the plan is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plan plan)
        throws URISyntaxException {
        log.debug("REST request to update Plan : {}, {}", id, plan);
        if (plan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!planRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        plan = planRepository.save(plan);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plan.getId().toString()))
            .body(plan);
    }

    /**
     * {@code PATCH  /plans/:id} : Partial updates given fields of an existing plan, field will ignore if it is null
     *
     * @param id the id of the plan to save.
     * @param plan the plan to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plan,
     * or with status {@code 400 (Bad Request)} if the plan is not valid,
     * or with status {@code 404 (Not Found)} if the plan is not found,
     * or with status {@code 500 (Internal Server Error)} if the plan couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Plan> partialUpdatePlan(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plan plan)
        throws URISyntaxException {
        log.debug("REST request to partial update Plan partially : {}, {}", id, plan);
        if (plan.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plan.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!planRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plan> result = planRepository
            .findById(plan.getId())
            .map(existingPlan -> {
                if (plan.getCode() != null) {
                    existingPlan.setCode(plan.getCode());
                }
                if (plan.getName() != null) {
                    existingPlan.setName(plan.getName());
                }
                if (plan.getSubjectOfAssetmentPlan() != null) {
                    existingPlan.setSubjectOfAssetmentPlan(plan.getSubjectOfAssetmentPlan());
                }
                if (plan.getFrequency() != null) {
                    existingPlan.setFrequency(plan.getFrequency());
                }
                if (plan.getTimeStart() != null) {
                    existingPlan.setTimeStart(plan.getTimeStart());
                }
                if (plan.getTimeEnd() != null) {
                    existingPlan.setTimeEnd(plan.getTimeEnd());
                }
                if (plan.getStatusPlan() != null) {
                    existingPlan.setStatusPlan(plan.getStatusPlan());
                }
                if (plan.getTestObject() != null) {
                    existingPlan.setTestObject(plan.getTestObject());
                }
                if (plan.getReportTypeId() != null) {
                    existingPlan.setReportTypeId(plan.getReportTypeId());
                }
                if (plan.getReportTypeName() != null) {
                    existingPlan.setReportTypeName(plan.getReportTypeName());
                }
                if (plan.getNumberOfCheck() != null) {
                    existingPlan.setNumberOfCheck(plan.getNumberOfCheck());
                }
                if (plan.getImplementer() != null) {
                    existingPlan.setImplementer(plan.getImplementer());
                }
                if (plan.getPaticipant() != null) {
                    existingPlan.setPaticipant(plan.getPaticipant());
                }
                if (plan.getCheckerGroup() != null) {
                    existingPlan.setCheckerGroup(plan.getCheckerGroup());
                }
                if (plan.getCheckerName() != null) {
                    existingPlan.setCheckerName(plan.getCheckerName());
                }
                if (plan.getCheckerGroupId() != null) {
                    existingPlan.setCheckerGroupId(plan.getCheckerGroupId());
                }
                if (plan.getCheckerId() != null) {
                    existingPlan.setCheckerId(plan.getCheckerId());
                }
                if (plan.getGross() != null) {
                    existingPlan.setGross(plan.getGross());
                }
                if (plan.getTimeCheck() != null) {
                    existingPlan.setTimeCheck(plan.getTimeCheck());
                }
                if (plan.getNameResult() != null) {
                    existingPlan.setNameResult(plan.getNameResult());
                }
                if (plan.getScriptId() != null) {
                    existingPlan.setScriptId(plan.getScriptId());
                }
                if (plan.getCreateBy() != null) {
                    existingPlan.setCreateBy(plan.getCreateBy());
                }
                if (plan.getStatus() != null) {
                    existingPlan.setStatus(plan.getStatus());
                }
                if (plan.getCreatedAt() != null) {
                    existingPlan.setCreatedAt(plan.getCreatedAt());
                }
                if (plan.getUpdatedAt() != null) {
                    existingPlan.setUpdatedAt(plan.getUpdatedAt());
                }
                if (plan.getUpdateBy() != null) {
                    existingPlan.setUpdateBy(plan.getUpdateBy());
                }

                return existingPlan;
            })
            .map(planRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plan.getId().toString())
        );
    }

    /**
     * {@code GET  /plans} : get all the plans.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plans in body.
     */
    @GetMapping("")
    public List<Plan> getAllPlans() {
        log.debug("REST request to get all Plans");
        List<Plan> plans = planRepository.findAll();
        Collections.reverse(plans);
        return plans;
    }

    /**
     * {@code GET  /plans/:id} : get the "id" plan.
     *
     * @param id the id of the plan to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plan, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlan(@PathVariable("id") Long id) {
        log.debug("REST request to get Plan : {}", id);
        Optional<Plan> plan = planRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(plan);
    }

    /**
     * {@code DELETE  /plans/:id} : delete the "id" plan.
     *
     * @param id the id of the plan to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable("id") Long id) {
        log.debug("REST request to delete Plan : {}", id);
        planRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * Lay du lieu plan di kem thong tin chi tiet
     */
    @GetMapping("/plan-detail-new")
    public Page<PlanDetailDTO> getPlanDetail(PlanFilter filter, Pageable pageable) {
        Page<Plan> plans = planRepository.findAll(PlanSpecification.buildFilter(filter), pageable);

        return plans.map(plan -> {
            PlanDetailDTO dto = new PlanDetailDTO();
            dto.setId(plan.getId());
            dto.setCode(plan.getCode());
            dto.setName(plan.getName());
            dto.setSubjectOfAssetmentPlan(plan.getSubjectOfAssetmentPlan());
            dto.setFrequency(plan.getFrequency());
            dto.setTimeStart(plan.getTimeStart());
            dto.setTimeEnd(plan.getTimeEnd());
            dto.setStatusPlan(plan.getStatusPlan());
            dto.setTestObject(plan.getTestObject());
            dto.setReportTypeId(plan.getReportTypeId());
            dto.setReportTypeName(plan.getReportTypeName());
            dto.setNumberOfCheck(plan.getNumberOfCheck());
            dto.setImplementer(plan.getImplementer());
            dto.setPaticipant(plan.getPaticipant());
            dto.setCheckerGroup(plan.getCheckerGroup());
            dto.setCheckerName(plan.getCheckerName());
            dto.setCheckerGroupId(plan.getCheckerGroupId());
            dto.setCheckerId(plan.getCheckerId());
            dto.setGross(plan.getGross());
            dto.setTimeCheck(plan.getTimeCheck());
            dto.setNameResult(plan.getNameResult());
            dto.setScriptId(plan.getScriptId());
            dto.setCreateBy(plan.getCreateBy());
            dto.setStatus(plan.getStatus());
            dto.setCreatedAt(plan.getCreatedAt());
            dto.setUpdatedAt(plan.getUpdatedAt());
            dto.setUpdateBy(plan.getUpdateBy());
            dto.setPlanDetail(reportRepository.getDetailByPlanId(plan.getId()));
            return dto;
        });
    }

    @GetMapping("plan-detail")
    public List<PlanDetailDTO> getPlanDetail() {
        List<Plan> plans = this.planRepository.findAll();
        List<PlanDetailDTO> planDetailDTOS = new ArrayList<>();
        for (Plan plan : plans) {
            PlanDetailDTO planDetailDTO = new PlanDetailDTO();
            planDetailDTO.setId(plan.getId());
            planDetailDTO.setCode(plan.getCode());
            planDetailDTO.setName(plan.getName());
            planDetailDTO.setSubjectOfAssetmentPlan(plan.getSubjectOfAssetmentPlan());
            planDetailDTO.setFrequency(plan.getFrequency());
            planDetailDTO.setTimeStart(plan.getTimeStart());
            planDetailDTO.setTimeEnd(plan.getTimeEnd());
            planDetailDTO.setStatusPlan(plan.getStatusPlan());
            planDetailDTO.setTestObject(plan.getTestObject());
            planDetailDTO.setReportTypeId(plan.getReportTypeId());
            planDetailDTO.setReportTypeName(plan.getReportTypeName());
            planDetailDTO.setNumberOfCheck(plan.getNumberOfCheck());
            planDetailDTO.setImplementer(plan.getImplementer());
            planDetailDTO.setPaticipant(plan.getPaticipant());
            planDetailDTO.setCheckerGroup(plan.getCheckerGroup());
            planDetailDTO.setCheckerName(plan.getCheckerName());
            planDetailDTO.setCheckerGroupId(plan.getCheckerGroupId());
            planDetailDTO.setCheckerId(plan.getCheckerId());
            planDetailDTO.setGross(plan.getGross());
            planDetailDTO.setTimeCheck(plan.getTimeCheck());
            planDetailDTO.setNameResult(plan.getNameResult());
            planDetailDTO.setScriptId(plan.getScriptId());
            planDetailDTO.setCreateBy(plan.getCreateBy());
            planDetailDTO.setStatus(plan.getStatus());
            planDetailDTO.setCreatedAt(plan.getCreatedAt());
            planDetailDTO.setUpdatedAt(plan.getUpdatedAt());
            planDetailDTO.setUpdateBy(plan.getUpdateBy());
            PlanStatisticalResponse statisticalResponse = this.planRepository.getAllPlanStatisticalByPlan(plan.getId());
            planDetailDTO.setSumOfLy(statisticalResponse.getSumOfLy());
            planDetailDTO.setSumOfFail(statisticalResponse.getSumOfFail());
            planDetailDTO.setSumOfNc(statisticalResponse.getSumOfNc());
            planDetailDTO.setSumOfPass(statisticalResponse.getSumOfPass());
            planDetailDTOS.add(planDetailDTO);
        }
        Collections.reverse(planDetailDTOS);
        return planDetailDTOS;
    }

    //    @PostMapping("/upload")
    //    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
    //        try {
    //            String fileName = file.getOriginalFilename();
    //            Path uploadPath = Paths.get(uploadDir);
    //            if (!Files.exists(uploadPath)) {
    //                Files.createDirectories(uploadPath);
    //                log.info("Created upload directory: {}", uploadDir);
    //            }
    //            Path filePath = Paths.get(uploadDir + fileName);
    //            Files.write(filePath, file.getBytes());
    //            String responseFileName = fileName;
    //            Map<String, String> response = new HashMap<>();
    //            response.put("fileName", responseFileName);
    //            log.info("File uploaded successfully to: {}", filePath.toString());
    //            return ResponseEntity.ok(response);
    //        } catch (IOException e) {
    //            log.error("Failed to upload file: {}. Error: {}", file.getOriginalFilename(), e.getMessage(), e);
    //            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //        }
    //    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            String fileExtension = getFileExtension(fileName).toLowerCase();

            // Danh sách các định dạng ảnh và video được hỗ trợ
            List<String> imageExtensions = Arrays.asList("jpg", "jpeg", "png", "gif");
            List<String> videoExtensions = Arrays.asList("mp4", "avi", "mov", "wmv", "flv");

            Path uploadPath;
            String fileType;

            if (imageExtensions.contains(fileExtension)) {
                uploadPath = Paths.get(uploadDir);
                fileType = "image";
            } else if (videoExtensions.contains(fileExtension)) {
                uploadPath = Paths.get(videoDir);
                fileType = "video";
            } else {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Unsupported file type"));
            }

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory for {}: {}", fileType, uploadPath.toString());
            }

            Path filePath = Paths.get(uploadPath.toString(), fileName);
            Files.write(filePath, file.getBytes());

            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("fileType", fileType);

            log.info("File uploaded successfully to: {}", filePath.toString());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Failed to upload file: {}. Error: {}", file.getOriginalFilename(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex + 1);
        }
        return "";
    }

    @DeleteMapping("/delete-file")
    public ResponseEntity<String> deleteFile(@RequestParam("fileName") String fileName) {
        try {
            Path filePath = Paths.get(uploadDir + fileName);
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }
            Files.delete(filePath);
            return ResponseEntity.ok("File deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file");
        }
    }

    @PostMapping("/statistical/{id}")
    public List<PlanStatisticalResponse> getAllPlanStatistical(@PathVariable Long id) {
        return this.planRepository.getAllPlanStatistical(id);
    }

    @PostMapping("/statistical/plan/{id}/report")
    public List<PlanStatisticalResponse> getAllPlanStatistical(@PathVariable Long id, @RequestBody Long reportId) {
        return this.planRepository.getPlanStatisticalByReportId(id, reportId);
    }

    @GetMapping("plan-detail-summarize/{planId}")
    public List<ReportResponse> getPlanDetailByPlanId(@PathVariable Long planId) {
        return reportRepository.getDetailByPlanId(planId);
    }

    @PostMapping("/statistical")
    public Page<PlanStatisticalResponse> getStatistics(@RequestBody ReportDTO dto, @PageableDefault(size = 10) Pageable pageable) {
        System.out.println(dto.getTimeStart().substring(0, 10) + " 00:00:00.000000");
        System.out.println(dto.getTimeEnd().substring(0, 10) + " 23:59:59.999999");
        List<String> reportType = dto.getReportType() == null ? new ArrayList<>() : dto.getReportType();
        List<String> subjectOfAssetmentPlan = dto.getSubjectOfAssetmentPlan() == null ? new ArrayList<>() : dto.getSubjectOfAssetmentPlan();
        List<String> groupName = dto.getGroupName() == null ? new ArrayList<>() : dto.getGroupName();
        List<String> testOfObject = dto.getTestOfObject() == null ? new ArrayList<>() : dto.getTestOfObject();
        return planRepository.getPlanStatisticalByManyCriteria(
            dto.getTimeStart().substring(0, 10) + " 00:00:00.000000",
            dto.getTimeEnd().substring(0, 10) + " 23:59:59.999999",
            reportType,
            subjectOfAssetmentPlan,
            groupName,
            testOfObject,
            pageable
        );
    }

    @PostMapping("/statistical/by-group")
    public Page<PlanStatisticalResponse> getStatisticsByGroup(@RequestBody ReportDTO dto, @PageableDefault(size = 10) Pageable pageable) {
        System.out.println(dto.getTimeStart().substring(0, 4) + "-" + dto.getTimeStart().substring(5, 7));
        System.out.println(dto.getTimeEnd().substring(0, 4) + "-" + dto.getTimeEnd().substring(5, 7));
        List<String> reportType = dto.getReportType() == null ? new ArrayList<>() : dto.getReportType();
        List<String> subjectOfAssetmentPlan = dto.getSubjectOfAssetmentPlan() == null ? new ArrayList<>() : dto.getSubjectOfAssetmentPlan();
        List<String> groupName = dto.getGroupName() == null ? new ArrayList<>() : dto.getGroupName();
        return planRepository.getPlanStatisticalByManyCriteriaByGroup(
            dto.getTimeStart().substring(0, 4) + "-" + dto.getTimeStart().substring(5, 7),
            dto.getTimeEnd().substring(0, 4) + "-" + dto.getTimeEnd().substring(5, 7),
            reportType,
            subjectOfAssetmentPlan,
            groupName,
            pageable
        );
    }

    @PostMapping("/statistical/by-subject-assetment-plan")
    public Page<PlanStatisticalResponse> getPlanStatisticalByManyCriteriaBySubjectAssetmentPlan(
        @RequestBody ReportDTO dto,
        @PageableDefault(size = 10) Pageable pageable
    ) {
        System.out.println(dto.getTimeStart().substring(0, 4) + "-" + dto.getTimeStart().substring(5, 7));
        System.out.println(dto.getTimeEnd().substring(0, 4) + "-" + dto.getTimeEnd().substring(5, 7));
        List<String> reportType = dto.getReportType() == null ? new ArrayList<>() : dto.getReportType();
        List<String> subjectOfAssetmentPlan = dto.getSubjectOfAssetmentPlan() == null ? new ArrayList<>() : dto.getSubjectOfAssetmentPlan();
        return planRepository.getPlanStatisticalByManyCriteriaBySubjectAssetmentPlan(
            dto.getTimeStart().substring(0, 4) + "-" + dto.getTimeStart().substring(5, 7),
            dto.getTimeEnd().substring(0, 4) + "-" + dto.getTimeEnd().substring(5, 7),
            reportType,
            subjectOfAssetmentPlan,
            pageable
        );
    }
}
