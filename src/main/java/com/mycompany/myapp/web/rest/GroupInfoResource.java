package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.GroupInfo;
import com.mycompany.myapp.repository.GroupInfoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GroupInfoResource {

    @Autowired
    GroupInfoRepository groupInfoRepository;

    @GetMapping("/api/group-info")
    public List<GroupInfo> getAllGroupInfo() {
        return groupInfoRepository.findAll();
    }
}
