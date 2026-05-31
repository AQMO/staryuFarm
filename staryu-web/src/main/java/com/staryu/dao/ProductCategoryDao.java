package com.staryu.dao;

import com.staryu.entity.ProductCategory;
import org.springframework.stereotype.Repository;

@Repository
public class ProductCategoryDao extends BaseDao<ProductCategory, Integer> {
    public ProductCategoryDao() { super(ProductCategory.class); }
}
