package com.staryu.dao;

import com.staryu.entity.Food;
import org.springframework.stereotype.Repository;

@Repository
public class FoodDao extends BaseDao<Food, Integer> {
    public FoodDao() { super(Food.class); }
}
