package com.staryu.controller;

import com.staryu.entity.ModuleConfig;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAllModules());
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody ModuleConfig config) {
        Map<String, Object> result = new LinkedHashMap<>();
        ModuleConfig updated = service.updateModuleConfig(id, config);
        if (updated != null) {
            result.put("data", updated);
        } else {
            result.put("error", "模块配置不存在");
        }
        return result;
    }
}
