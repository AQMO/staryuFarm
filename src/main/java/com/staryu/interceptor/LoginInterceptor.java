package com.staryu.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 管理后台登录拦截器
 * 未登录用户访问 /admin/** 会重定向到登录页
 * /api/auth/** 和 /api/login 不拦截，供登录接口使用
 */
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 放行 OPTIONS 请求（CORS 预检）
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        HttpSession session = request.getSession(false);
        String uri = request.getRequestURI();

        // 登录页和登录接口不拦截
        if (uri.equals("/admin/login") || uri.equals("/admin/login.html")
                || uri.startsWith("/api/auth/")) {
            return true;
        }

        // 静态资源不拦截
        if (uri.startsWith("/static/") || uri.endsWith(".css") || uri.endsWith(".js")
                || uri.endsWith(".png") || uri.endsWith(".jpg") || uri.endsWith(".ico")) {
            return true;
        }

        // 前端 API 不拦截（小程序端使用）
        if (uri.startsWith("/api/") && !uri.startsWith("/api/auth/")) {
            return true;
        }

        // 管理后台页面和API需要登录
        if (uri.startsWith("/admin/")) {
            if (session != null && session.getAttribute("adminUser") != null) {
                return true;
            }
            // 未登录，重定向到登录页
            response.sendRedirect("/admin/login");
            return false;
        }

        return true;
    }
}
