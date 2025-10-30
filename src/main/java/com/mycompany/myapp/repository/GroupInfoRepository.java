package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.GroupInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupInfoRepository extends JpaRepository<GroupInfo, Long> {}
