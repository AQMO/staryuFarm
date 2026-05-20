'use client';

import CrudPage from '@/components/admin/CrudPage';

const fields = [
  { key: 'name', label: '果木名称', type: 'text' as const, required: true, placeholder: '如：苹果树、桃树' },
  { key: 'price', label: '租赁价格(元)', type: 'price' as const, required: true },
  { key: 'pic', label: '果木图片', type: 'image' as const, required: true },
  { key: 'variety', label: '品种', type: 'text' as const },
  { key: 'location', label: '位置', type: 'text' as const },
  { key: 'lease_period', label: '租期(天)', type: 'number' as const, required: true },
  { key: 'stock', label: '库存', type: 'number' as const, required: true },
  { key: 'expected_harvest', label: '预计收获', type: 'text' as const },
  { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '下架', value: 0 }], defaultValue: 1 },
  { key: 'description', label: '描述', type: 'textarea' as const, hideInTable: true },
];

export default function FruitTreesPage() {
  return <CrudPage title="果木管理" apiPath="/api/fruit-trees" fields={fields} />;
}
