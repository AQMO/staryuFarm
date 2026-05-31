package com.staryu.dao;

import com.staryu.entity.Cart;
import org.springframework.stereotype.Repository;

@Repository
public class CartDao extends BaseDao<Cart, Integer> {
    public CartDao() { super(Cart.class); }
}
