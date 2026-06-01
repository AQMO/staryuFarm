/**
 * 管理后台公共脚本 - 动态侧边栏菜单 + 登录检查
 * 在每个管理页面中引入即可
 */
function initAdminPage(vueApp) {
    // 优先从 localStorage 获取菜单（登录时已存储）
    var cachedMenus = localStorage.getItem('adminMenus');
    var cachedUser = localStorage.getItem('adminUser');
    
    if (cachedMenus && cachedUser) {
        try {
            var menus = JSON.parse(cachedMenus);
            var user = JSON.parse(cachedUser);
            if (vueApp && vueApp.$data) {
                vueApp.$data.sidebarMenus = menus;
                vueApp.$data.adminName = user.nickname || user.username || '管理员';
            }
        } catch(e) {}
    }

    // 异步验证登录状态并刷新菜单
    $.getJSON('/api/auth/current', function(d) {
        if (d.error) {
            // session 过期，清除缓存并跳转登录
            localStorage.removeItem('adminMenus');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
            return;
        }
        if (d.data) {
            var user = d.data;
            var adminName = user.nickname || user.username || '管理员';
            if (vueApp && vueApp.$data) {
                vueApp.$data.adminName = adminName;
            }
            // 使用 current 接口返回的 menus
            if (d.menus && d.menus.length > 0) {
                if (vueApp && vueApp.$data) {
                    vueApp.$data.sidebarMenus = d.menus;
                }
                localStorage.setItem('adminMenus', JSON.stringify(d.menus));
                localStorage.setItem('adminUser', JSON.stringify(user));
            } else if (d.data.role) {
                // current 接口没返回 menus，单独请求
                $.getJSON('/api/menus/role/' + d.data.role, function(menuIds) {
                    $.getJSON('/api/menus/list', function(allMenus) {
                        var all = allMenus.data || [];
                        var ids = menuIds.data || [];
                        var menus = all.filter(function(m) {
                            return m.isVisible === 1 && ids.indexOf(m.id) >= 0;
                        });
                        menus.sort(function(a, b) { return a.sortOrder - b.sortOrder; });
                        if (vueApp && vueApp.$data) {
                            vueApp.$data.sidebarMenus = menus;
                        }
                        localStorage.setItem('adminMenus', JSON.stringify(menus));
                        localStorage.setItem('adminUser', JSON.stringify(user));
                    });
                });
            }
        }
    }).fail(function() {
        // 请求失败，如果无缓存则跳转登录
        if (!cachedMenus) {
            window.location.href = '/admin/login';
        }
    });
}

function adminLogout() {
    localStorage.removeItem('adminMenus');
    localStorage.removeItem('adminUser');
    $.post('/api/auth/logout', function() {
        window.location.href = '/admin/login';
    }).fail(function() {
        window.location.href = '/admin/login';
    });
}
