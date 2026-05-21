package com.staryu.controller;

import com.staryu.entity.ProductCategory;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/product-category")
public class ProductCategoryController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAllProductCategories());
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody ProductCategory pc) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveProductCategory(pc));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody ProductCategory pc) {
        pc.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveProductCategory(pc));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteProductCategory(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
