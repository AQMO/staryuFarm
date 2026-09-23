package com.staryu.controller;

import com.staryu.entity.Tabbar;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tabbar")
public class TabbarController {

    @Autowired
    private BusinessService service;

    // 小程序获取可见的tabbar列表
    @GetMapping("/visible")
    public Map<String, Object> getVisible() {
        Map<String, Object> result = new HashMap<>();
        result.put("data", service.getVisibleTabbars());
        return result;
    }

    // 管理后台获取所有tabbar
    @GetMapping("/list")
    public Map<String, Object> list() {
        Map<String, Object> result = new HashMap<>();
        List<Tabbar> list = service.getAllTabbars();
        result.put("data", list);
        result.put("total", list.size());
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Tabbar tabbar) {
        Map<String, Object> result = new HashMap<>();
        try {
            Tabbar saved = service.saveTabbar(tabbar);
            result.put("success", true);
            result.put("data", saved);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Tabbar tabbar) {
        Map<String, Object> result = new HashMap<>();
        try {
            tabbar.setId(id);
            Tabbar saved = service.saveTabbar(tabbar);
            result.put("success", true);
            result.put("data", saved);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            service.deleteTabbar(id);
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }
        return result;
    }
}
