package com.staryu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 管理后台页面控制器
 * 重定向到静态HTML页面(使用Element UI + jQuery构建)
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping({"", "/"})
    public String index() {
        return "redirect:/admin/dashboard.html";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/admin/login.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/admin/dashboard.html";
    }

    @GetMapping("/rooms")
    public String rooms() {
        return "redirect:/admin/rooms.html";
    }

    @GetMapping("/food")
    public String food() {
        return "redirect:/admin/food.html";
    }

    @GetMapping("/products")
    public String products() {
        return "redirect:/admin/products.html";
    }

    @GetMapping("/fruit-trees")
    public String fruitTrees() {
        return "redirect:/admin/fruit-trees.html";
    }

    @GetMapping("/plots")
    public String plots() {
        return "redirect:/admin/plots.html";
    }

    @GetMapping("/orders")
    public String orders() {
        return "redirect:/admin/orders.html";
    }

    @GetMapping("/users")
    public String users() {
        return "redirect:/admin/users.html";
    }

    @GetMapping("/config")
    public String config() {
        return "redirect:/admin/config.html";
    }
}
