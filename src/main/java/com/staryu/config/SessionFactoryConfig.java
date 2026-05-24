package com.staryu.config;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * 动态 Hibernate SessionFactory 配置
 * 根据环境变量自动选择 MySQLDialect 或 PostgreSQLDialect
 */
@Configuration
public class SessionFactoryConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public LocalSessionFactoryBean sessionFactory() {
        LocalSessionFactoryBean sessionFactoryBean = new LocalSessionFactoryBean();
        sessionFactoryBean.setDataSource(dataSource);
        sessionFactoryBean.setPackagesToScan("com.staryu.entity");

        Properties hibernateProps = new Properties();
        String dbType = DataSourceConfig.detectDatabaseType();

        if ("postgresql".equals(dbType)) {
            hibernateProps.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        } else {
            hibernateProps.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        }

        hibernateProps.setProperty("hibernate.show_sql", "false");
        hibernateProps.setProperty("hibernate.format_sql", "true");
        hibernateProps.setProperty("hibernate.hbm2ddl.auto", "update");
        hibernateProps.setProperty("hibernate.current_session_context_class", "org.springframework.orm.hibernate5.SpringSessionContext");

        System.out.println("[Hibernate] Dialect: " + hibernateProps.getProperty("hibernate.dialect"));

        sessionFactoryBean.setHibernateProperties(hibernateProps);
        return sessionFactoryBean;
    }

    @Bean
    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) {
        HibernateTransactionManager txManager = new HibernateTransactionManager();
        txManager.setSessionFactory(sessionFactory);
        return txManager;
    }
}
