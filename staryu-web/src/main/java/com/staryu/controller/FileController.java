package com.staryu.controller;

import com.staryu.service.MinioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * 文件上传下载控制器
 */
@Controller
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private MinioService minioService;

    /**
     * 上传文件
     * POST /api/file/upload?directory=rooms
     */
    @PostMapping("/upload")
    @ResponseBody
    public Map<String, Object> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "directory", defaultValue = "common") String directory) {

        Map<String, Object> result = new HashMap<>();
        try {
            if (file.isEmpty()) {
                result.put("error", "文件不能为空");
                return result;
            }

            // 限制文件大小 (10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                result.put("error", "文件大小不能超过10MB");
                return result;
            }

            // 限制文件类型
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
                result.put("error", "只支持图片和视频文件");
                return result;
            }

            String fileUrl = minioService.uploadFile(file, directory);
            result.put("success", true);
            result.put("url", fileUrl);
            result.put("name", file.getOriginalFilename());
            result.put("size", file.getSize());

        } catch (Exception e) {
            result.put("error", "上传失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 删除文件
     * DELETE /api/file/delete?url=xxx
     */
    @DeleteMapping("/delete")
    @ResponseBody
    public Map<String, Object> delete(@RequestParam("url") String url) {
        Map<String, Object> result = new HashMap<>();
        try {
            String objectName = minioService.extractObjectName(url);
            if (objectName != null) {
                minioService.deleteFile(objectName);
                result.put("success", true);
            } else {
                result.put("error", "无效的文件URL");
            }
        } catch (Exception e) {
            result.put("error", "删除失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 下载/代理文件
     * GET /api/file/download?objectName=xxx
     */
    @GetMapping("/download")
    public void download(
            @RequestParam("objectName") String objectName,
            HttpServletResponse response) {
        try {
            InputStream inputStream = minioService.downloadFile(objectName);

            // 设置响应头
            String contentType = guessContentType(objectName);
            response.setContentType(contentType);
            response.setHeader("Content-Disposition", "inline; filename=\"" + objectName.substring(objectName.lastIndexOf("/") + 1) + "\"");

            // 输出文件流
            OutputStream out = response.getOutputStream();
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            inputStream.close();
            out.flush();

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 根据文件扩展名猜测 Content-Type
     */
    private String guessContentType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".mp4")) return "video/mp4";
        if (lower.endsWith(".webm")) return "video/webm";
        if (lower.endsWith(".pdf")) return "application/pdf";
        return "application/octet-stream";
    }
}
