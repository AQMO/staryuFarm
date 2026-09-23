package com.staryu.dao;

import com.staryu.entity.Tabbar;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class TabbarDao extends BaseDao<Tabbar, Integer> {

    public TabbarDao() {
        super(Tabbar.class);
    }

    public List<Tabbar> findAllOrdered() {
        Query<Tabbar> query = getSession().createQuery("from Tabbar order by sortOrder asc", Tabbar.class);
        return query.list();
    }

    public List<Tabbar> findVisible() {
        Query<Tabbar> query = getSession().createQuery("from Tabbar where isVisible = 1 order by sortOrder asc", Tabbar.class);
        return query.list();
    }
}
