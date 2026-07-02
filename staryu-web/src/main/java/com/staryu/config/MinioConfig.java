package com.staryu.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MinIO 对象存储配置
 * 通过环境变量或 jdbc.properties 配置
 */
@Configuration
public class MinioConfig {

    @Value("${minio.endpoint:http://8.141.29.206:19000}")
    private String endpoint;

    @Value("${minio.accessKey:minioadmin}")
    private String accessKey;

    @Value("${minio.secretKey:minioadmin}")
    private String secretKey;

    @Value("${minio.bucket:staryu}")
    private String bucket;

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
