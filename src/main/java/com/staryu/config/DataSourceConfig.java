package com.staryu.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * 数据源配置 - 从环境变量 MYSQL_URL 解析数据库连接信息
 * 兼容格式:
 *   1. MYSQL_URL=mysql://user:password@host:port/dbname
 *   2. MYSQL_URL=jdbc:mysql://host:port/dbname?user=xxx&password=xxx
 *   3. 无环境变量时使用本地默认连接
 */
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String dbUrl = System.getenv("MYSQL_URL");

        String jdbcUrl;
        String username = "staryu";
        String password = "staryu123";

        if (dbUrl != null && !dbUrl.isEmpty()) {
            if (dbUrl.startsWith("mysql://")) {
                // Parse: mysql://user:password@host:port/dbname
                try {
                    String rest = dbUrl.replaceFirst("^mysql://", "");
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
                    // Add MySQL-specific parameters
                    jdbcUrl = "jdbc:mysql://" + rest;
                    if (!jdbcUrl.contains("useSSL")) {
                        jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=UTF-8";
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Failed to parse MYSQL_URL: " + dbUrl, e);
                }
            } else if (dbUrl.startsWith("jdbc:mysql://")) {
                jdbcUrl = dbUrl;
            } else {
                throw new RuntimeException("Unsupported database URL format: " + dbUrl);
            }
        } else {
            // 默认本地 MySQL 连接
            jdbcUrl = "jdbc:mysql://localhost:3306/staryu_farm?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=UTF-8";
        }

        System.out.println("[DataSource] JDBC URL: " + jdbcUrl);
        System.out.println("[DataSource] Username: " + username);

        DruidDataSource ds = new DruidDataSource();
        ds.setUrl(jdbcUrl);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
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
}
