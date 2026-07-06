package com.staryu.config;

import io.minio.MinioClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.Properties;

/**
 * MinIO 对象存储配置
 * 从 jdbc.properties 加载配置
 */
@Configuration
public class MinioConfig {

    private String endpoint;
    private String accessKey;
    private String secretKey;
    private String bucket;

    public MinioConfig() {
        // 直接从 classpath 加载 jdbc.properties
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("jdbc.properties")) {
            Properties props = new Properties();
            props.load(is);
            this.endpoint = props.getProperty("minio.endpoint", "http://8.141.29.206:19000");
            this.accessKey = props.getProperty("minio.accessKey", "minioadmin");
            this.secretKey = props.getProperty("minio.secretKey", "minioadmin");
            this.bucket = props.getProperty("minio.bucket", "staryu");
            System.out.println("MinIO Config loaded: endpoint=" + endpoint + ", bucket=" + bucket + ", accessKey=" + accessKey);
        } catch (Exception e) {
            System.err.println("Failed to load MinIO config: " + e.getMessage());
            this.endpoint = "http://8.141.29.206:19000";
            this.accessKey = "minioadmin";
            this.secretKey = "minioadmin";
            this.bucket = "staryu";
        }
    }

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getBucket() {
        return bucket;
    }

    /**
     * 获取文件的完整访问 URL
     */
    public String getFileUrl(String objectName) {
        return endpoint + "/" + bucket + "/" + objectName;
    }
}
