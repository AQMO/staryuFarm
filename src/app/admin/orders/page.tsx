'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '已支付', color: 'bg-blue-100 text-blue-700' },
  confirmed: { label: '已确认', color: 'bg-indigo-100 text-indigo-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-500' },
  refunded: { label: '已退款', color: 'bg-red-100 text-red-700' },
};

const typeMap: Record<string, string> = {
  room: '房间预订',
  food: '在线点餐',
  product: '农产品',
  fruit_tree: '果木租赁',
  plot: '地块租赁',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOrder, setDetailOrder] = useState<Record<string, unknown> | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterType !== 'all') params.set('order_type', filterType);
      params.set('pageSize', '50');
      const res = await fetch(`/api/orders?${params}`);
      const json = await res.json();
      setOrders(json.data || []);
    } catch (e) {
      console.error('Fetch error:', e);
    }
    setLoading(false);
  }, [filterStatus, filterType]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id: number, status: string) => {
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">订单管理</h2>
          <p className="text-gray-500 mt-1">查看和管理所有订单</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchOrders}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.entries(statusMap).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="订单类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {Object.entries(typeMap).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>联系信息</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">加载中...</TableCell></TableRow>
              ) : orders.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">暂无订单</TableCell></TableRow>
              ) : (
                orders.map(order => {
                  const s = statusMap[String(order.status)] || { label: String(order.status), color: 'bg-gray-100 text-gray-500' };
                  return (
                    <TableRow key={String(order.id)}>
                      <TableCell className="font-mono text-xs">{String(order.order_no)}</TableCell>
                      <TableCell>{typeMap[String(order.order_type)] || String(order.order_type)}</TableCell>
                      <TableCell className="font-medium">¥{Number(order.total_amount).toFixed(2)}</TableCell>
                      <TableCell><Badge className={s.color}>{s.label}</Badge></TableCell>
                      <TableCell className="text-sm">{String(order.contact_name || '-')} {String(order.contact_phone || '')}</TableCell>
                      <TableCell className="text-sm text-gray-500">{String(order.created_at || '').substring(0, 16).replace('T', ' ')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setDetailOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8" onClick={() => handleStatusChange(Number(order.id), 'confirmed')}>确认</Button>
                          )}
                          {order.status === 'paid' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8" onClick={() => handleStatusChange(Number(order.id), 'completed')}>完成</Button>
                          )}
                          {['pending', 'paid'].includes(String(order.status)) && (
                            <Button size="sm" variant="destructive" className="h-8" onClick={() => handleStatusChange(Number(order.id), 'cancelled')}>取消</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-500">订单号:</span> {String(detailOrder.order_no)}</div>
                <div><span className="text-gray-500">类型:</span> {typeMap[String(detailOrder.order_type)]}</div>
                <div><span className="text-gray-500">金额:</span> ¥{Number(detailOrder.total_amount).toFixed(2)}</div>
                <div><span className="text-gray-500">状态:</span> {statusMap[String(detailOrder.status)]?.label}</div>
                <div><span className="text-gray-500">联系人:</span> {String(detailOrder.contact_name || '-')}</div>
                <div><span className="text-gray-500">联系电话:</span> {String(detailOrder.contact_phone || '-')}</div>
              </div>
              {detailOrder.remark ? <div><span className="text-gray-500">备注:</span> {String(detailOrder.remark)}</div> : null}
              <div>
                <span className="text-gray-500">订单项目:</span>
                <pre className="mt-1 bg-gray-50 rounded p-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(JSON.parse(String(detailOrder.items || '[]')), null, 2)}
                </pre>
              </div>
              {detailOrder.address_info ? (
                <div><span className="text-gray-500">收货地址:</span> {String(detailOrder.address_info)}</div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
