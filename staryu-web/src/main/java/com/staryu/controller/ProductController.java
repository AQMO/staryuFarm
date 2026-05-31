package com.staryu.controller;

import com.staryu.entity.Product;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) Integer categoryId) {
        Map<String, Object> result = new LinkedHashMap<>();
        if (categoryId != null) {
            result.put("data", service.getProductsByCategory(categoryId));
        } else {
            result.put("data", service.getAllProducts());
        }
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        Product product = service.getProductById(id);
        if (product != null) {
            result.put("data", product);
        } else {
            result.put("error", "产品不存在");
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Product product) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveProduct(product));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Product product) {
        product.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveProduct(product));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteProduct(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
