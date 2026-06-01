/**
 * 管理后台公共脚本 - 动态侧边栏菜单 + 登录检查
 * 在每个管理页面中引入即可
 */
function initAdminPage(vueApp) {
    $.getJSON('/api/auth/current', function(d) {
        if (d.error) {
            window.location.href = '/admin/login';
            return;
        }
        if (d.data) {
            var role = d.data.role || 'user';
            var adminName = d.data.nickname || d.data.username || '管理员';
            if (vueApp && vueApp.$data) {
                vueApp.$data.adminName = adminName;
            }
            // 根据角色加载菜单
            $.getJSON('/api/menus/role/' + role, function(menuIds) {
                if (!menuIds.data || menuIds.data.length === 0) {
                    // 无权限菜单，加载所有可见菜单作为兜底
                    $.getJSON('/api/menus/list', function(allMenus) {
                        if (vueApp && vueApp.$data) {
                            vueApp.$data.sidebarMenus = allMenus.data || [];
                        }
                    });
                    return;
                }
                // 获取所有菜单，然后过滤出有权限的
                $.getJSON('/api/menus/list', function(allMenus) {
                    var menus = (allMenus.data || []).filter(function(m) {
                        return menuIds.data.indexOf(m.id) >= 0;
                    });
                    if (vueApp && vueApp.$data) {
                        vueApp.$data.sidebarMenus = menus;
                    }
                });
            });
        }
    }).fail(function() {
        window.location.href = '/admin/login';
    });
}
