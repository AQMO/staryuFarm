package com.staryu.service;

import com.staryu.config.MinioConfig;
import io.minio.*;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * MinIO 文件存储服务
 */
@Service
public class MinioService {

    private static final Logger logger = LoggerFactory.getLogger(MinioService.class);

    @Autowired
    private MinioClient minioClient;

    @Autowired
    private MinioConfig minioConfig;

    @PostConstruct
    public void init() {
        try {
            // 检查 bucket 是否存在，不存在则创建
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .build()
            );
            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(minioConfig.getBucket())
                                .build()
                );
                logger.info("MinIO bucket '{}' created", minioConfig.getBucket());
            } else {
                logger.info("MinIO bucket '{}' already exists", minioConfig.getBucket());
            }

            // 设置 bucket 策略为公开读取
            String policy = String.format(
                    "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetObject\"],\"Resource\":[\"arn:aws:s3:::%s/*\"]}]}",
                    minioConfig.getBucket()
            );
            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .config(policy)
                            .build()
            );
            logger.info("MinIO bucket '{}' policy set to public read", minioConfig.getBucket());
        } catch (Exception e) {
            logger.error("MinIO init error: {}", e.getMessage(), e);
        }
    }

    /**
     * 上传文件
     * @param file 上传的文件
     * @param directory 存储目录（如 rooms, food, products）
     * @return 文件访问 URL
     */
    public String uploadFile(MultipartFile file, String directory) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 生成唯一文件名: 日期目录/UUID.扩展名
            String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String fileName = datePath + "/" + directory + "/" + UUID.randomUUID().toString() + extension;

            // 上传文件
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            String fileUrl = minioConfig.getFileUrl(fileName);
            logger.info("File uploaded: {} -> {}", originalFilename, fileUrl);
            return fileUrl;

        } catch (Exception e) {
            logger.error("File upload error: {}", e.getMessage(), e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 上传文件（InputStream 方式）
     */
    public String uploadFile(InputStream inputStream, String fileName, String contentType) {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .object(fileName)
                            .stream(inputStream, -1, 10485760) // 10MB part size
                            .contentType(contentType)
                            .build()
            );
            return minioConfig.getFileUrl(fileName);
        } catch (Exception e) {
            logger.error("File upload error: {}", e.getMessage(), e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 下载文件
     */
    public InputStream downloadFile(String objectName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            logger.error("File download error: {}", e.getMessage(), e);
            throw new RuntimeException("文件下载失败: " + e.getMessage());
        }
    }

    /**
     * 删除文件
     */
    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .object(objectName)
                            .build()
            );
            logger.info("File deleted: {}", objectName);
        } catch (Exception e) {
            logger.error("File delete error: {}", e.getMessage(), e);
        }
    }

    /**
     * 获取文件的预签名 URL（临时访问链接）
     */
    public String getPresignedUrl(String objectName, int expiryMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(minioConfig.getBucket())
                            .object(objectName)
                            .expiry(expiryMinutes, TimeUnit.MINUTES)
                            .build()
            );
        } catch (Exception e) {
            logger.error("Get presigned URL error: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 从 URL 中提取 objectName
     */
    public String extractObjectName(String fileUrl) {
        if (fileUrl == null) return null;
        String prefix = minioConfig.getEndpoint() + "/" + minioConfig.getBucket() + "/";
        if (fileUrl.startsWith(prefix)) {
            return fileUrl.substring(prefix.length());
        }
        return null;
    }
}
