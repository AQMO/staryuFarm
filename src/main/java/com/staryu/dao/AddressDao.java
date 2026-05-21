package com.staryu.dao;

import com.staryu.entity.Address;
import org.springframework.stereotype.Repository;

@Repository
public class AddressDao extends BaseDao<Address, Integer> {
    public AddressDao() { super(Address.class); }
}
