package com.staryu.controller;

import com.staryu.entity.Room;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAllRooms());
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        Room room = service.getRoomById(id);
        if (room != null) {
            result.put("data", room);
        } else {
            result.put("error", "房间不存在");
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Room room) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveRoom(room));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Room room) {
        room.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.saveRoom(room));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deleteRoom(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
