package com.staryu.controller;

import com.staryu.entity.Food;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) Integer categoryId) {
        Map<String, Object> result = new LinkedHashMap<>();
        if (categoryId != null) {
            result.put("data", service.getFoodByCategory(categoryId));
        } else {
            result.put("data", service.getAllFood());
        }
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        Food food = service.getFoodById(id);
        if (food != null) {
            result.put("data", food);
        } else {
            result.put("error", "菜品不存在");
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Food food) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveFood(food));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Food food) {
        food.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveFood(food));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteFood(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
