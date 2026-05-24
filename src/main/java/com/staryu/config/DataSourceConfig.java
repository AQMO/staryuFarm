package com.staryu.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * 数据源配置 - 自动检测并支持 MySQL 和 PostgreSQL
 * 
 * 优先级:
 *   1. MYSQL_URL 环境变量 → MySQL
 *   2. PGDATABASE_URL 环境变量 → PostgreSQL
 *   3. 默认 → 本地 MySQL
 */
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String mysqlUrl = System.getenv("MYSQL_URL");
        String pgUrl = System.getenv("PGDATABASE_URL");

        String jdbcUrl;
        String username;
        String password;
        String driverClass;
        String dbType;

        if (mysqlUrl != null && !mysqlUrl.isEmpty()) {
            // MYSQL_URL specified → use MySQL
            dbType = "mysql";
            driverClass = "com.mysql.cj.jdbc.Driver";
            username = "staryu";
            password = "staryu123";

            if (mysqlUrl.startsWith("mysql://")) {
                // Parse: mysql://user:password@host:port/dbname
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
        } else if (pgUrl != null && !pgUrl.isEmpty()) {
            // PGDATABASE_URL specified → use PostgreSQL
            dbType = "postgresql";
            driverClass = "org.postgresql.Driver";

            if (pgUrl.startsWith("postgresql://")) {
                // Parse: postgresql://user:password@host:port/dbname?params
                String rest = pgUrl.replaceFirst("^postgresql://", "");
                int atIdx = rest.indexOf('@');
                username = "postgres";
                password = "";
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
                } else {
                    throw new RuntimeException("Cannot parse PGDATABASE_URL: " + pgUrl);
                }
                jdbcUrl = "jdbc:postgresql://" + rest;
            } else if (pgUrl.startsWith("jdbc:postgresql://")) {
                jdbcUrl = pgUrl;
                username = "postgres";
                password = "";
            } else {
                throw new RuntimeException("Unsupported PGDATABASE_URL format: " + pgUrl);
            }
        } else {
            // Default: local MySQL
            dbType = "mysql";
            driverClass = "com.mysql.cj.jdbc.Driver";
            jdbcUrl = "jdbc:mysql://localhost:3306/staryu_farm?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=UTF-8";
            username = "staryu";
            password = "staryu123";
        }

        System.out.println("========================================");
        System.out.println("  DataSource Config");
        System.out.println("  DB Type: " + dbType);
        System.out.println("  JDBC URL: " + jdbcUrl);
        System.out.println("  Username: " + username);
        System.out.println("========================================");

        DruidDataSource ds = new DruidDataSource();
        ds.setUrl(jdbcUrl);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName(driverClass);
        ds.setInitialSize(2);
        ds.setMinIdle(2);
        ds.setMaxActive(20);
        ds.setMaxWait(60000);
        ds.setTimeBetweenEvictionRunsMillis(60000);
        ds.setMinEvictableIdleTimeMillis(300000);
        ds.setValidationQuery("SELECT 1");
        ds.setTestWhileIdle(true);
        ds.setTestOnBorrow(false);
        ds.setTestOnReturn(false);
        return ds;
    }

    /**
     * Detect current database type for Hibernate dialect selection
     */
    public static String detectDatabaseType() {
        String mysqlUrl = System.getenv("MYSQL_URL");
        String pgUrl = System.getenv("PGDATABASE_URL");
        if (mysqlUrl != null && !mysqlUrl.isEmpty()) {
            return "mysql";
        } else if (pgUrl != null && !pgUrl.isEmpty()) {
            return "postgresql";
        }
        return "mysql"; // default
    }
}
