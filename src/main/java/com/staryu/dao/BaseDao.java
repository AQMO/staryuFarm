package com.staryu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class BaseDao<T, ID extends Serializable> {

    @Autowired
    protected SessionFactory sessionFactory;

    private final Class<T> entityClass;

    protected BaseDao(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    protected Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    public T save(T entity) {
        Object managed = getSession().merge(entity);
        @SuppressWarnings("unchecked")
        T result = (T) managed;
        return result;
    }

    public Optional<T> findById(ID id) {
        return Optional.ofNullable(getSession().get(entityClass, id));
    }

    public List<T> findAll() {
        return getSession().createQuery("FROM " + entityClass.getSimpleName(), entityClass).list();
    }

    public List<T> findByField(String fieldName, Object value) {
        return getSession()
                .createQuery("FROM " + entityClass.getSimpleName() + " WHERE " + fieldName + " = :val", entityClass)
                .setParameter("val", value)
                .list();
    }

    public List<T> findByFields(Map<String, Object> fields) {
        StringBuilder hql = new StringBuilder("FROM " + entityClass.getSimpleName() + " WHERE 1=1");
        fields.forEach((k, v) -> hql.append(" AND ").append(k).append(" = :").append(k.replace(".", "_")));
        Query<T> query = getSession().createQuery(hql.toString(), entityClass);
        fields.forEach((k, v) -> query.setParameter(k.replace(".", "_"), v));
        return query.list();
    }

    public void deleteById(ID id) {
        findById(id).ifPresent(entity -> getSession().delete(entity));
    }

    public void delete(T entity) {
        getSession().delete(entity);
    }

    public long count() {
        return getSession().createQuery("SELECT COUNT(*) FROM " + entityClass.getSimpleName(), Long.class).uniqueResult();
    }

    public long countByField(String fieldName, Object value) {
        return getSession()
                .createQuery("SELECT COUNT(*) FROM " + entityClass.getSimpleName() + " WHERE " + fieldName + " = :val", Long.class)
                .setParameter("val", value)
                .uniqueResult();
    }
}
