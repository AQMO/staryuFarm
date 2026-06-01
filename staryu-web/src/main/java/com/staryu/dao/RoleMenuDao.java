package com.staryu.dao;

import com.staryu.entity.RoleMenu;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoleMenuDao extends BaseDao<RoleMenu, Integer> {
    public RoleMenuDao() { super(RoleMenu.class); }

    public List<RoleMenu> findByRole(String role) {
        return findByField("role", role);
    }

    public void deleteByRole(String role) {
        findByRole(role).forEach(this::delete);
    }

    public void deleteByMenuId(Integer menuId) {
        findByField("menuId", menuId).forEach(this::delete);
    }
}
