package com.staryu.dao;

import com.staryu.entity.Product;
import org.springframework.stereotype.Repository;

@Repository
public class ProductDao extends BaseDao<Product, Integer> {
    public ProductDao() { super(Product.class); }
}
