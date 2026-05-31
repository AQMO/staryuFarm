package com.staryu.dao;

import com.staryu.entity.Plot;
import org.springframework.stereotype.Repository;

@Repository
public class PlotDao extends BaseDao<Plot, Integer> {
    public PlotDao() { super(Plot.class); }
}
