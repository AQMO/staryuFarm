package com.staryu.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;

import java.util.Properties;

/**
 * 数据库环境变量覆盖配置
 * 
 * 加载 jdbc.properties 并解析 MYSQL_URL / PGDATABASE_URL 环境变量覆盖默认值。
 * 所有数据库连接参数最终通过 applicationContext.xml 中的 ${} 占位符引用。
 */
public class DataSourceConfig extends PropertyPlaceholderConfigurer {

    private static final String ENV_MYSQL = "MYSQL_URL";
    private static final String ENV_PG = "PGDATABASE_URL";

    public DataSourceConfig() {
        setLocation(new ClassPathResource("jdbc.properties"));
        setIgnoreUnresolvablePlaceholders(true);
        setOrder(1);
    }

    @Override
    protected String resolvePlaceholder(String placeholder, Properties props, int systemPropertiesMode) {
        // 先让父类解析（jdbc.properties + 系统属性）
        String value = super.resolvePlaceholder(placeholder, props, systemPropertiesMode);
        
        // 环境变量覆盖逻辑
        if (value != null) {
            return value;
        }
        
        // 如果父类没找到，返回 null
        return null;
    }

    @Override
    protected void convertProperties(Properties props) {
        super.convertProperties(props);
        
        // 解析环境变量，覆盖 jdbc.properties 中的属性
        String mysqlUrl = System.getenv(ENV_MYSQL);
        String pgUrl = System.getenv(ENV_PG);

        if (mysqlUrl != null && !mysqlUrl.isEmpty()) {
            applyMysql(props, mysqlUrl);
        } else if (pgUrl != null && !pgUrl.isEmpty()) {
            applyPostgresql(props, pgUrl);
        }

        System.out.println("========================================");
        System.out.println("  DataSource Config (applicationContext.xml)");
        System.out.println("  DB Driver: " + props.getProperty("db.driver"));
        System.out.println("  JDBC URL:  " + props.getProperty("db.url"));
        System.out.println("  Username:  " + props.getProperty("db.username"));
        System.out.println("  Dialect:   " + props.getProperty("hibernate.dialect"));
        System.out.println("========================================");
    }

    private void applyMysql(Properties props, String mysqlUrl) {
        props.setProperty("db.driver", "com.mysql.cj.jdbc.Driver");
        props.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");

        String username = "staryu";
        String password = "staryu123";
        String jdbcUrl;

        if (mysqlUrl.startsWith("mysql://")) {
            String rest = mysqlUrl.replaceFirst("^mysql://", "");
            int atIdx = rest.indexOf('@');
            if (atIdx > 0) {
                String userPart = rest.substring(0, atIdx);
                rest = rest.substring(atIdx + 1);
                int colonIdx = userPart.indexOf(':');
                if (colonIdx > 0) {
                    username = userPart.substring(0, colonIdx);
                    password = userPart.substring(colonIdx + 1);
                } else {
                    username = userPart;
                }
            }
            jdbcUrl = "jdbc:mysql://" + rest;
            if (!jdbcUrl.contains("useSSL")) {
                jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=UTF-8";
            }
        } else if (mysqlUrl.startsWith("jdbc:mysql://")) {
            jdbcUrl = mysqlUrl;
        } else {
            throw new RuntimeException("Unsupported MYSQL_URL format: " + mysqlUrl);
        }

        props.setProperty("db.url", jdbcUrl);
        props.setProperty("db.username", username);
        props.setProperty("db.password", password);
    }

    private void applyPostgresql(Properties props, String pgUrl) {
        props.setProperty("db.driver", "org.postgresql.Driver");
        props.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");

        String username = "postgres";
        String password = "";
        String jdbcUrl;

        if (pgUrl.startsWith("postgresql://")) {
            String rest = pgUrl.replaceFirst("^postgresql://", "");
            int atIdx = rest.indexOf('@');
            if (atIdx > 0) {
                String userPart = rest.substring(0, atIdx);
                rest = rest.substring(atIdx + 1);
                int colonIdx = userPart.indexOf(':');
                if (colonIdx > 0) {
                    username = userPart.substring(0, colonIdx);
                    password = userPart.substring(colonIdx + 1);
                } else {
                    username = userPart;
                }
            }
            jdbcUrl = "jdbc:postgresql://" + rest;
        } else if (pgUrl.startsWith("jdbc:postgresql://")) {
            jdbcUrl = pgUrl;
        } else {
            throw new RuntimeException("Unsupported PGDATABASE_URL format: " + pgUrl);
        }

        props.setProperty("db.url", jdbcUrl);
        props.setProperty("db.username", username);
        props.setProperty("db.password", password);
    }

    /**
     * 检测当前数据库类型
     */
    public static String detectDatabaseType() {
        String mysqlUrl = System.getenv(ENV_MYSQL);
        String pgUrl = System.getenv(ENV_PG);
        if (mysqlUrl != null && !mysqlUrl.isEmpty()) {
            return "mysql";
        } else if (pgUrl != null && !pgUrl.isEmpty()) {
            return "postgresql";
        }
        return "mysql";
    }
}
