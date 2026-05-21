package com.staryu.controller;

import com.staryu.entity.Plot;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/plots")
public class PlotController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.getAllPlots());
        return result;
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Integer id) {
        Map<String, Object> result = new LinkedHashMap<>();
        Plot plot = service.getPlotById(id);
        if (plot != null) {
            result.put("data", plot);
        } else {
            result.put("error", "地块不存在");
        }
        return result;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Plot plot) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.savePlot(plot));
        return result;
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Plot plot) {
        plot.setId(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("data", service.savePlot(plot));
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        service.deletePlot(id);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        return result;
    }
}
