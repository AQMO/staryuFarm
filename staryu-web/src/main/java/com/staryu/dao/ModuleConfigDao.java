package com.staryu.dao;

import com.staryu.entity.ModuleConfig;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ModuleConfigDao extends BaseDao<ModuleConfig, Integer> {
    public ModuleConfigDao() { super(ModuleConfig.class); }

    public List<ModuleConfig> findEnabled() {
        return findByField("isEnabled", true);
    }

    public ModuleConfig findByKey(String key) {
        return findByField("moduleKey", key).stream().findFirst().orElse(null);
    }
}
