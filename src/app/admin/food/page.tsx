'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrudPage from '@/components/admin/CrudPage';

const categoryFields = [
  { key: 'name', label: '分类名称', type: 'text' as const, required: true },
  { key: 'sort', label: '排序', type: 'number' as const, defaultValue: 0 },
  { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '下架', value: 0 }], defaultValue: 1 },
  { key: 'remark', label: '备注', type: 'text' as const },
];

function FoodItemsTab() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/food-category').then(r => r.json()).then(d => setCategories(d.data || [])).catch(() => {});
  }, []);

  const foodFields = [
    { key: 'name', label: '菜品名称', type: 'text' as const, required: true },
    { key: 'category_id', label: '所属分类', type: 'select' as const, required: true, options: categories.map(c => ({ label: c.name, value: c.id })) },
    { key: 'price', label: '单价(元)', type: 'price' as const, required: true },
    { key: 'pic', label: '菜品图片', type: 'image' as const },
    { key: 'stock', label: '库存', type: 'number' as const, required: true },
    { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '下架', value: 0 }], defaultValue: 1 },
    { key: 'description', label: '描述', type: 'textarea' as const, hideInTable: true },
  ];

  return <CrudPage title="菜品列表" apiPath="/api/food" fields={foodFields} />;
}

export default function FoodPage() {
  return (
    <Tabs defaultValue="food" className="space-y-4">
      <TabsList>
        <TabsTrigger value="food">菜品管理</TabsTrigger>
        <TabsTrigger value="category">分类管理</TabsTrigger>
      </TabsList>
      <TabsContent value="food">
        <FoodItemsTab />
      </TabsContent>
      <TabsContent value="category">
        <CrudPage title="菜品分类" apiPath="/api/food-category" fields={categoryFields} />
      </TabsContent>
    </Tabs>
  );
}
