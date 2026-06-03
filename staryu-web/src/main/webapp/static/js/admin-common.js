/**
 * 管理后台公共脚本 - 统一侧边栏菜单 + 登录检查 + 用户信息
 *
 * 使用方式：在各管理页面的 Vue created() 中调用 initAdminPage(this, '当前菜单key')
 * 示例：initAdminPage(this, 'rooms')
 *
 * 依赖：jQuery (需在引入本脚本前加载)
 *
 * 数据约定：
 * - 调用 /api/auth/current 统一获取用户信息和菜单列表
 * - 登录时 /api/auth/login 返回 { data: userInfo, menus: menuList }
 * - 菜单列表存入 localStorage 实现 SPA 内跨页共享
 */

function initAdminPage(vueApp, currentMenuKey) {
    if (!vueApp || !vueApp.$data) return;

    // 设置当前高亮菜单标识
    if (currentMenuKey) {
        vueApp.$data.currentMenu = currentMenuKey;
    }

    // ========== 第一阶段：从 localStorage 快速渲染（无网络延迟） ==========
    var cachedMenus = localStorage.getItem('adminMenus');
    var cachedUser = localStorage.getItem('adminUser');

    if (cachedMenus) {
        try {
            vueApp.$data.sidebarMenus = JSON.parse(cachedMenus);
        } catch (e) {
            localStorage.removeItem('adminMenus');
        }
    }
    if (cachedUser) {
        try {
            var user = JSON.parse(cachedUser);
            vueApp.$data.adminName = user.nickname || user.username || '管理员';
        } catch (e) {
            localStorage.removeItem('adminUser');
        }
    }

    // ========== 第二阶段：异步请求 /api/auth/current 刷新数据 ==========
    $.getJSON('/api/auth/current', function (d) {
        if (d.error) {
            // session 已过期，清除缓存并跳转登录页
            localStorage.removeItem('adminMenus');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
            return;
        }

        // 更新用户信息
        if (d.data) {
            var user = d.data;
            var adminName = user.nickname || user.username || '管理员';
            vueApp.$data.adminName = adminName;
            localStorage.setItem('adminUser', JSON.stringify(user));
        }

        // 更新菜单列表（d.menus 在顶层，不在 d.data 内）
        if (d.menus && d.menus.length > 0) {
            vueApp.$data.sidebarMenus = d.menus;
            localStorage.setItem('adminMenus', JSON.stringify(d.menus));
        }
    }).fail(function () {
        // 请求失败时，若无缓存则跳转登录
        if (!cachedMenus) {
            window.location.href = '/admin/login';
        }
    });
}

/**
 * 退出登录
 * 清除 localStorage + 调用后端 logout API + 跳转登录页
 */
function adminLogout() {
    localStorage.removeItem('adminMenus');
    localStorage.removeItem('adminUser');
    $.post('/api/auth/logout', function () {
        window.location.href = '/admin/login';
    }).fail(function () {
        window.location.href = '/admin/login';
    });
}
