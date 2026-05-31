package com.staryu.dao;

import com.staryu.entity.Room;
import org.springframework.stereotype.Repository;

@Repository
public class RoomDao extends BaseDao<Room, Integer> {
    public RoomDao() { super(Room.class); }
}
