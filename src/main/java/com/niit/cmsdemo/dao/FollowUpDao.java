package com.niit.cmsdemo.dao;

import com.niit.cmsdemo.domain.FollowUp;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FollowUpDao {

    Integer insertOne(FollowUp followUp);

    Integer deleteOne(Long id);

    Integer updateOne(FollowUp followUp);

    List<FollowUp> selectAll();

    List<FollowUp> selectConditions(Map<String,Object> map);
}