'use client';

import { useState, useEffect } from 'react';
import { Home, UtensilsCrossed, ShoppingBag, TreePine, Map, ClipboardList, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  counts: {
    rooms: number; food: number; products: number; fruit_trees: number;
    plots: number; orders: number; users: number;
  };
  pendingOrders: number;
  todayRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(data => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { title: '今日营收', value: `¥${stats.todayRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: '待处理订单', value: stats.pendingOrders, icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: '房间数量', value: stats.counts.rooms, icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: '菜品数量', value: stats.counts.food, icon: UtensilsCrossed, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: '农产品数量', value: stats.counts.products, icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
    { title: '果木数量', value: stats.counts.fruit_trees, icon: TreePine, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: '地块数量', value: stats.counts.plots, icon: Map, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: '用户数量', value: stats.counts.users, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">仪表盘</h2>
        <p className="text-gray-500 mt-1">农庄运营数据概览</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            快捷入口
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '房间管理', path: '/admin/rooms', color: 'bg-blue-500' },
              { label: '菜品管理', path: '/admin/food', color: 'bg-purple-500' },
              { label: '农产品管理', path: '/admin/products', color: 'bg-pink-500' },
              { label: '订单管理', path: '/admin/orders', color: 'bg-orange-500' },
            ].map((item, i) => (
              <a
                key={i}
                href={item.path}
                className={`${item.color} text-white rounded-xl p-4 text-center font-medium hover:opacity-90 transition-opacity`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
