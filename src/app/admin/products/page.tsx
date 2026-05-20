'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrudPage from '@/components/admin/CrudPage';

const categoryFields = [
  { key: 'name', label: '分类名称', type: 'text' as const, required: true },
  { key: 'sort', label: '排序', type: 'number' as const, defaultValue: 0 },
  { key: 'pic', label: '分类图片', type: 'image' as const },
  { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '下架', value: 0 }], defaultValue: 1 },
];

function ProductItemsTab() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/product-category').then(r => r.json()).then(d => setCategories(d.data || [])).catch(() => {});
  }, []);

  const productFields = [
    { key: 'name', label: '商品名称', type: 'text' as const, required: true },
    { key: 'category_id', label: '所属分类', type: 'select' as const, required: true, options: categories.map(c => ({ label: c.name, value: c.id })) },
    { key: 'price', label: '售价(元)', type: 'price' as const, required: true },
    { key: 'original_price', label: '原价(元)', type: 'price' as const },
    { key: 'pic', label: '商品图片', type: 'image' as const },
    { key: 'stock', label: '库存', type: 'number' as const, required: true },
    { key: 'unit', label: '单位', type: 'text' as const, defaultValue: '份' },
    { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '下架', value: 0 }], defaultValue: 1 },
    { key: 'description', label: '描述', type: 'textarea' as const, hideInTable: true },
  ];

  return <CrudPage title="农产品列表" apiPath="/api/products" fields={productFields} />;
}

export default function ProductsPage() {
  return (
    <Tabs defaultValue="products" className="space-y-4">
      <TabsList>
        <TabsTrigger value="products">商品管理</TabsTrigger>
        <TabsTrigger value="category">分类管理</TabsTrigger>
      </TabsList>
      <TabsContent value="products">
        <ProductItemsTab />
      </TabsContent>
      <TabsContent value="category">
        <CrudPage title="农产品分类" apiPath="/api/product-category" fields={categoryFields} />
      </TabsContent>
    </Tabs>
  );
}
