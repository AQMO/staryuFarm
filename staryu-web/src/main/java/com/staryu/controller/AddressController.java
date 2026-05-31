package com.staryu.controller;

import com.staryu.entity.Address;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list(@RequestParam Integer userId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAddressByUserId(userId));
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Address address) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveAddress(address));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Address address) {
        address.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveAddress(address));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteAddress(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
