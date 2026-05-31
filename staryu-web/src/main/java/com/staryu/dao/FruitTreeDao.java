package com.staryu.dao;

import com.staryu.entity.FruitTree;
import org.springframework.stereotype.Repository;

@Repository
public class FruitTreeDao extends BaseDao<FruitTree, Integer> {
    public FruitTreeDao() { super(FruitTree.class); }
}
