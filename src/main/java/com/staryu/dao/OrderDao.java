package com.staryu.dao;

import com.staryu.entity.Order;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class OrderDao extends BaseDao<Order, Integer> {
    public OrderDao() { super(Order.class); }

    public List<Order> findByUserId(Integer userId) {
        return findByField("userId", userId);
    }

    public List<Order> findByStatus(String status) {
        return findByField("status", status);
    }

    public List<Order> findByUserIdAndStatus(Integer userId, String status) {
        return findByFields(Map.of("userId", userId, "status", status));
    }

    public long countByStatus(String status) {
        return countByField("status", status);
    }
}
