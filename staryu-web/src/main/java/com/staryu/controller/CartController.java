package com.staryu.controller;

import com.staryu.entity.Cart;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list(@RequestParam Integer userId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getCartByUserId(userId));
        return result;
    }

    @PostMapping
    public Map<String, Object> add(@RequestBody Cart cart) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.addToCart(cart));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateQuantity(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        service.updateCartQuantity(id, body.get("quantity"));
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteCartItem(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }

    @DeleteMapping("/clear")
    public Map<String, Object> clear(@RequestParam Integer userId) {
        service.clearCart(userId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
