package com.staryu.dao;

import com.staryu.entity.User;
import org.springframework.stereotype.Repository;

@Repository
public class UserDao extends BaseDao<User, Integer> {
    public UserDao() { super(User.class); }

    public User findByOpenid(String openid) {
        return findByField("openid", openid).stream().findFirst().orElse(null);
    }
}
