package com.staryu.controller;

import com.staryu.entity.Menu;
import com.staryu.entity.RoleMenu;
import com.staryu.service.BusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private BusinessService businessService;

    // 获取当前用户的菜单（根据角色权限过滤）
    @GetMapping("/user")
    public Map<String, Object> getUserMenus(HttpSession session) {
        String role = (String) session.getAttribute("userRole");
        if (role == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("error", "未登录");
            return result;
        }
        // admin 角色拥有所有启用菜单
        List<Menu> menus = "admin".equals(role)
                ? businessService.getEnabledMenus()
                : businessService.getMenusByRole(role);
        Map<String, Object> result = new HashMap<>();
        result.put("data", menus);
        return result;
    }

    // 获取所有菜单（管理用）
    @GetMapping("/list")
    public Map<String, Object> getAllMenus() {
        Map<String, Object> result = new HashMap<>();
        result.put("data", businessService.getAllMenus());
        return result;
    }

    // 获取单个菜单
    @GetMapping("/{id}")
    public Map<String, Object> getMenu(@PathVariable Integer id) {
        Menu menu = businessService.getMenuById(id);
        Map<String, Object> result = new HashMap<>();
        if (menu != null) {
            result.put("data", menu);
        } else {
            result.put("error", "菜单不存在");
        }
        return result;
    }

    // 新增/编辑菜单
    @PostMapping("/save")
    public Map<String, Object> saveMenu(@RequestBody Menu menu) {
        Map<String, Object> result = new HashMap<>();
        try {
            Menu saved = businessService.saveMenu(menu);
            result.put("data", saved);
            result.put("message", "保存成功");
        } catch (Exception e) {
            result.put("error", "保存失败: " + e.getMessage());
        }
        return result;
    }

    // 删除菜单
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteMenu(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            businessService.deleteMenu(id);
            result.put("message", "删除成功");
        } catch (Exception e) {
            result.put("error", "删除失败: " + e.getMessage());
        }
        return result;
    }

    // 获取角色的菜单权限
    @GetMapping("/role/{role}")
    public Map<String, Object> getRoleMenus(@PathVariable String role) {
        List<RoleMenu> roleMenus = businessService.getRoleMenus(role);
        List<Integer> menuIds = roleMenus.stream()
                .map(RoleMenu::getMenuId)
                .collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("data", menuIds);
        return result;
    }

    // 保存角色的菜单权限
    @PostMapping("/role/{role}")
    public Map<String, Object> saveRoleMenus(@PathVariable String role, @RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            List<Integer> menuIds = (List<Integer>) body.get("menuIds");
            if (menuIds == null) menuIds = new ArrayList<>();
            businessService.saveRoleMenus(role, menuIds);
            result.put("message", "权限保存成功");
        } catch (Exception e) {
            result.put("error", "权限保存失败: " + e.getMessage());
        }
        return result;
    }
}
