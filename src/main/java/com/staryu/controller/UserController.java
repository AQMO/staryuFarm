package com.staryu.controller;

import com.staryu.entity.User;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAllUsers());
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        User user = service.getUserById(id);
        if (user != null) {
            result.put("data", user);
        } else {
            result.put("error", "用户不存在");
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody User user) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveUser(user));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody User user) {
        user.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveUser(user));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
