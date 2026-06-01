package com.staryu.controller;

import com.staryu.entity.User;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private BusinessService service;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> params, HttpSession session) {
        Map<String, Object> result = new LinkedHashMap<>();
        String username = params.get("username");
        String password = params.get("password");

        if (username == null || username.trim().isEmpty()) {
            result.put("error", "用户名不能为空");
            return result;
        }
        if (password == null || password.trim().isEmpty()) {
            result.put("error", "密码不能为空");
            return result;
        }

        User user = service.findUserByUsername(username);
        if (user == null || !password.equals(user.getPassword())) {
            result.put("error", "用户名或密码错误");
            return result;
        }

        if (user.getStatus() != null && user.getStatus() != 1) {
            result.put("error", "账号已被禁用");
            return result;
        }

        // 登录成功，存入 session
        session.setAttribute("adminUser", user);
        session.setAttribute("userRole", user.getRole());

        // 返回用户信息和菜单权限（不返回密码）
        Map<String, Object> userInfo = new LinkedHashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("role", user.getRole());
        userInfo.put("avatar", user.getAvatar());
        result.put("data", userInfo);
        result.put("menus", service.getMenusByRole(user.getRole()));
        result.put("message", "登录成功");
        return result;
    }

    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/current")
    public Map<String, Object> current(HttpSession session) {
        Map<String, Object> result = new LinkedHashMap<>();
        User user = (User) session.getAttribute("adminUser");
        if (user == null) {
            result.put("error", "未登录");
            return result;
        }
        Map<String, Object> userInfo = new LinkedHashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("role", user.getRole());
        userInfo.put("avatar", user.getAvatar());
        result.put("data", userInfo);
        result.put("menus", service.getMenusByRole(user.getRole()));
        return result;
    }

    /**
     * 退出登录
     */
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        Map<String, Object> result = new LinkedHashMap<>();
        session.invalidate();
        result.put("message", "退出成功");
        return result;
    }

    /**
     * 修改密码
     */
    @PutMapping("/password")
    public Map<String, Object> changePassword(@RequestBody Map<String, String> params, HttpSession session) {
        Map<String, Object> result = new LinkedHashMap<>();
        User user = (User) session.getAttribute("adminUser");
        if (user == null) {
            result.put("error", "未登录");
            return result;
        }

        String oldPassword = params.get("oldPassword");
        String newPassword = params.get("newPassword");

        if (oldPassword == null || !oldPassword.equals(user.getPassword())) {
            result.put("error", "原密码错误");
            return result;
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            result.put("error", "新密码不能为空");
            return result;
        }

        user.setPassword(newPassword);
        service.saveUser(user);
        session.setAttribute("adminUser", user);
        result.put("message", "密码修改成功");
        return result;
    }
}
