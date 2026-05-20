'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ModuleItem {
  id: number;
  module_key: string;
  module_name: string;
  is_enabled: boolean;
  sort: number;
  icon: string;
  description: string;
}

const iconMap: Record<string, string> = {
  home: '🏠',
  utensils: '🍽️',
  'shopping-bag': '🛍️',
  'tree-pine': '🌳',
  map: '🗺️',
};

export default function ConfigPage() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config');
      const json = await res.json();
      setModules(json.data || []);
    } catch (e) {
      console.error('Fetch error:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const handleToggle = async (mod: ModuleItem) => {
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: mod.id, is_enabled: !mod.is_enabled }),
    });
    fetchModules();
  };

  const handleSortChange = async (mod: ModuleItem, sort: number) => {
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: mod.id, sort }),
    });
    fetchModules();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">模块配置</h2>
          <p className="text-gray-500 mt-1">控制小程序端各业务模块的开启和关闭</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchModules}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(mod => (
          <Card key={mod.id} className={`transition-all ${mod.is_enabled ? 'border-green-200 bg-green-50/50' : 'border-gray-200 opacity-60'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{iconMap[mod.icon] || '📦'}</span>
                  <div>
                    <CardTitle className="text-lg">{mod.module_name}</CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5">{mod.description}</p>
                  </div>
                </div>
                <Badge className={mod.is_enabled ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                  {mod.is_enabled ? '已开启' : '已关闭'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">排序:</Label>
                  <Input
                    type="number"
                    value={mod.sort}
                    onChange={e => handleSortChange(mod, Number(e.target.value))}
                    className="w-16 h-8 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`switch-${mod.id}`} className="text-sm">{mod.is_enabled ? '开启' : '关闭'}</Label>
                  <Switch
                    id={`switch-${mod.id}`}
                    checked={mod.is_enabled}
                    onCheckedChange={() => handleToggle(mod)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
