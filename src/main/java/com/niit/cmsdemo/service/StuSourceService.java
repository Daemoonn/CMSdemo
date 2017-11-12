package com.niit.cmsdemo.service;

import com.niit.cmsdemo.domain.StuSource;
import com.niit.cmsdemo.vo.StuSourceResponse;

import java.util.List;

public interface StuSourceService {

    void addStuSource(String pre,String back);

    void delStuSource(Integer[] ids);

    //具体问题 具体分析
    List<StuSource> findAll();

    List<StuSourceResponse> getStuSource();

}
