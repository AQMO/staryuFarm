package com.staryu.dao;

import com.staryu.entity.Menu;
import org.springframework.stereotype.Repository;

@Repository
public class MenuDao extends BaseDao<Menu, Integer> {
    public MenuDao() { super(Menu.class); }
}
