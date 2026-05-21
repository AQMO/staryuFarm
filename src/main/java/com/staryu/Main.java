package com.staryu;

import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.DispatcherServlet;

import java.io.File;

/**
 * 嵌入式Tomcat启动类
 * 管理后台使用纯HTML+AJAX，不依赖JSP编译
 */
public class Main {

    public static void main(String[] args) throws Exception {
        int port = 5000;
        for (int i = 0; i < args.length; i++) {
            if ("--server.port".equals(args[i]) && i + 1 < args.length) {
                port = Integer.parseInt(args[i + 1]);
            }
        }

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.getConnector();

        // Webapp directory for static resources
        String webappDirLocation = "src/main/webapp/";
        File webappDir = new File(webappDirLocation);
        if (!webappDir.exists()) {
            webappDirLocation = "webapp";
            webappDir = new File(webappDirLocation);
        }

        // Create context programmatically (no JSP needed)
        StandardContext ctx = (StandardContext) tomcat.addContext("/", webappDir.getAbsolutePath());

        // Add compiled classes to resource root
        String classesDir = "target/classes";
        File classesFile = new File(classesDir);
        WebResourceRoot resources = new StandardRoot(ctx);
        if (classesFile.exists()) {
            resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes",
                    classesFile.getAbsolutePath(), "/"));
        }
        ctx.setResources(resources);

        // Spring root context
        ctx.addParameter("contextConfigLocation", "classpath:applicationContext.xml");
        ctx.addApplicationListener(ContextLoaderListener.class.getName());

        // DispatcherServlet
        DispatcherServlet dispatcherServlet = new DispatcherServlet();
        dispatcherServlet.setContextConfigLocation("classpath:spring-mvc.xml");
        Tomcat.addServlet(ctx, "springmvc", dispatcherServlet);
        ctx.addServletMappingDecoded("/", "springmvc");

        // Character encoding filter
        CharacterEncodingFilter encodingFilter = new CharacterEncodingFilter();
        encodingFilter.setEncoding("UTF-8");
        encodingFilter.setForceEncoding(true);

        org.apache.tomcat.util.descriptor.web.FilterDef filterDef = new org.apache.tomcat.util.descriptor.web.FilterDef();
        filterDef.setFilterName("encodingFilter");
        filterDef.setFilter(encodingFilter);
        ctx.addFilterDef(filterDef);

        org.apache.tomcat.util.descriptor.web.FilterMap filterMap = new org.apache.tomcat.util.descriptor.web.FilterMap();
        filterMap.setFilterName("encodingFilter");
        filterMap.addURLPattern("/*");
        ctx.addFilterMap(filterMap);

        System.out.println("========================================");
        System.out.println("星语农庄管理后台启动中...");
        System.out.println("http://localhost:" + port + "/admin/dashboard");
        System.out.println("API: http://localhost:" + port + "/api/config");
        System.out.println("========================================");

        tomcat.start();
        tomcat.getServer().await();
    }
}
