package com.staryu.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * 数据源配置 - 从环境变量 PGDATABASE_URL 解析数据库连接信息
 */
@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        String dbUrl = System.getenv("PGDATABASE_URL");
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = "jdbc:postgresql://localhost:5432/postgres?user=postgres&password=postgres";
        }

        // Parse the URL format: postgres://user:password@host:port/dbname
        String jdbcUrl;
        String username = "";
        String password = "";

        if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
            try {
                // Remove protocol prefix
                String rest = dbUrl.replaceFirst("^postgres(?:ql)?://", "");
                // Extract user:password
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
                // Extract host:port/dbname
                // Handle IPv6 addresses in brackets
                String hostPortDb;
                if (rest.startsWith("[")) {
                    int bracketEnd = rest.indexOf(']');
                    hostPortDb = rest.substring(bracketEnd + 1);
                } else {
                    hostPortDb = rest;
                }
                jdbcUrl = "jdbc:postgresql://" + hostPortDb;
                // Add SSL mode for remote connections
                if (!jdbcUrl.contains("sslmode")) {
                    jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "sslmode=require";
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse PGDATABASE_URL: " + dbUrl, e);
            }
        } else if (dbUrl.startsWith("jdbc:postgresql://")) {
            jdbcUrl = dbUrl;
        } else {
            throw new RuntimeException("Unsupported database URL format: " + dbUrl);
        }

        System.out.println("[DataSource] JDBC URL: " + jdbcUrl);
        System.out.println("[DataSource] Username: " + username);

        DruidDataSource ds = new DruidDataSource();
        ds.setUrl(jdbcUrl);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName("org.postgresql.Driver");
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
