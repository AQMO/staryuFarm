'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Home, UtensilsCrossed, ShoppingBag, TreePine, Map,
  ClipboardList, Users, Settings, Menu, X, LogOut, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const navItems = [
  { key: 'dashboard', label: '仪表盘', icon: LayoutDashboard, path: '/admin' },
  { key: 'config', label: '模块配置', icon: Settings, path: '/admin/config' },
  { key: 'rooms', label: '房间管理', icon: Home, path: '/admin/rooms' },
  { key: 'food', label: '菜品管理', icon: UtensilsCrossed, path: '/admin/food' },
  { key: 'products', label: '农产品管理', icon: ShoppingBag, path: '/admin/products' },
  { key: 'fruit-trees', label: '果木管理', icon: TreePine, path: '/admin/fruit-trees' },
  { key: 'plots', label: '地块管理', icon: Map, path: '/admin/plots' },
  { key: 'orders', label: '订单管理', icon: ClipboardList, path: '/admin/orders' },
  { key: 'users', label: '用户管理', icon: Users, path: '/admin/users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('dashboard');

  useEffect(() => {
    const path = window.location.pathname;
    const item = navItems.find(n => path === n.path || (n.path !== '/admin' && path.startsWith(n.path)));
    setActiveKey(item?.key || 'dashboard');
  }, []);

  const handleNav = useCallback((path: string, key: string) => {
    router.push(path);
    setActiveKey(key);
    setSidebarOpen(false);
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-lg font-bold text-green-700">农庄管理系统</h1>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNav(item.path, item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeKey === item.key
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden lg:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-600 text-white text-xs">管</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">管理员</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/')}>
                <LogOut className="h-4 w-4 mr-2" />
                返回前台
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
