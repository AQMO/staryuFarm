package com.staryu.entity;

import javax.persistence.*;

@Entity
@Table(name = "tabbar_config")
public class Tabbar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(name = "page_path", length = 200, nullable = false)
    private String pagePath;

    @Column(name = "icon_path", length = 500)
    private String iconPath;

    @Column(name = "selected_icon_path", length = 500)
    private String selectedIconPath;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "is_visible")
    private Integer isVisible = 1;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPagePath() { return pagePath; }
    public void setPagePath(String pagePath) { this.pagePath = pagePath; }
    public String getIconPath() { return iconPath; }
    public void setIconPath(String iconPath) { this.iconPath = iconPath; }
    public String getSelectedIconPath() { return selectedIconPath; }
    public void setSelectedIconPath(String selectedIconPath) { this.selectedIconPath = selectedIconPath; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public Integer getIsVisible() { return isVisible; }
    public void setIsVisible(Integer isVisible) { this.isVisible = isVisible; }
}
