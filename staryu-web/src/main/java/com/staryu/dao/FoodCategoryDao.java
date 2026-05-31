package com.staryu.dao;

import com.staryu.entity.FoodCategory;
import org.springframework.stereotype.Repository;

@Repository
public class FoodCategoryDao extends BaseDao<FoodCategory, Integer> {
    public FoodCategoryDao() { super(FoodCategory.class); }
}
