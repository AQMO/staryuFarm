package com.staryu.controller;

import com.staryu.entity.FruitTree;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/fruit-trees")
public class FruitTreeController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAllFruitTrees());
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        FruitTree ft = service.getFruitTreeById(id);
        if (ft != null) {
            result.put("data", ft);
        } else {
            result.put("error", "果木不存在");
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody FruitTree ft) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveFruitTree(ft));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody FruitTree ft) {
        ft.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveFruitTree(ft));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteFruitTree(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
