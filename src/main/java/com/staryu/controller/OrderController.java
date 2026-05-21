package com.staryu.controller;

import com.staryu.entity.Order;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) Integer userId,
                                     @RequestParam(required = false) String status) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Order> orders;
        if (userId != null && status != null) {
            orders = service.getOrdersByUserId(userId).stream()
                    .filter(o -> status.equals(o.getStatus())).toList();
        } else if (userId != null) {
            orders = service.getOrdersByUserId(userId);
        } else if (status != null) {
            orders = service.getOrdersByStatus(status);
        } else {
            orders = service.getAllOrders();
        }
        result.put("data", orders);
        result.put("total", orders.size());
        result.put("page", 1);
        result.put("pageSize", 20);
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        Order order = service.getOrderById(id);
        if (order != null) {
            result.put("data", order);
        } else {
            result.put("error", "订单不存在");
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Order order) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.createOrder(order));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        Map<String, Object> result = new LinkedHashMap<>();
        String status = body.get("status");
        Order updated = service.updateOrderStatus(id, status);
        if (updated != null) {
            result.put("data", updated);
        } else {
            result.put("error", "订单不存在");
        }
        return result;
    }
}
