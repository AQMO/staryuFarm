package com.staryu.controller;

import com.staryu.entity.Food;
import com.staryu.entity.FoodCategory;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/food-category")
public class FoodCategoryController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAllFoodCategories());
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody FoodCategory fc) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveFoodCategory(fc));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody FoodCategory fc) {
        fc.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveFoodCategory(fc));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteFoodCategory(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
