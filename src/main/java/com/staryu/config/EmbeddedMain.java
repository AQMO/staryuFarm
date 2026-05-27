package com.staryu.config;

import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;
import org.apache.tomcat.util.scan.StandardJarScanner;

import java.io.File;

/**
 * Embedded Tomcat launcher for development/standalone running.
 * 
 * Usage (from extracted WAR directory):
 *   java -cp 'WEB-INF/lib/*:WEB-INF/classes' -Dcatalina.base=. com.staryu.config.EmbeddedMain
 * 
 * For external Tomcat deployment, just deploy the WAR file to webapps/ directory.
 */
public class EmbeddedMain {

    public static void main(String[] args) throws Exception {
        String catalinaBase = System.getProperty("catalina.base", ".");
        String portStr = System.getProperty("server.port", "5000");
        int port = Integer.parseInt(portStr);

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.setBaseDir(catalinaBase);

        // Set connector
        tomcat.getConnector(); // triggers connector creation

        // Find the WAR directory (current dir should be the extracted WAR)
        File webappDir = new File(catalinaBase);
        if (!new File(webappDir, "WEB-INF").exists()) {
            // Try looking for staryu-web.war or target/staryu-web.war
            File warFile = new File("staryu-web.war");
            if (!warFile.exists()) {
                warFile = new File("target/staryu-web.war");
            }
            if (warFile.exists()) {
                webappDir = warFile.getParentFile();
            }
        }

        String contextPath = "";
        String docBase = webappDir.getAbsolutePath();

        System.out.println("========================================");
        System.out.println("  Staryu Farm - Embedded Tomcat");
        System.out.println("  Port: " + port);
        System.out.println("  Context: " + contextPath);
        System.out.println("  DocBase: " + docBase);
        System.out.println("========================================");

        Context ctx = tomcat.addWebapp(contextPath, docBase);

        // Fix: 跳过 JAXB 等 Multi-Release JAR 的扫描，避免 Tomcat9 + JDK17 报错
        // "Failed to scan jaxb-api-2.3.1.jar from classloader hierarchy"
        StandardJarScanner scanner = new StandardJarScanner();
        scanner.setScanBootstrapClassPath(false);
        scanner.setScanClassPath(false);
        scanner.setScanManifest(false);
        ctx.setJarScanner(scanner);

        tomcat.start();
        System.out.println("Server started at http://localhost:" + port);
        System.out.println("Admin dashboard: http://localhost:" + port + "/admin/dashboard");
        tomcat.getServer().await();
    }
}
