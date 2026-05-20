'use client';

import CrudPage from '@/components/admin/CrudPage';

const fields = [
  { key: 'name', label: '地块名称', type: 'text' as const, required: true, placeholder: '如：A区1号地' },
  { key: 'price', label: '租赁价格(元)', type: 'price' as const, required: true },
  { key: 'pic', label: '地块图片', type: 'image' as const, required: true },
  { key: 'area', label: '面积(m²)', type: 'price' as const, required: true },
  { key: 'location', label: '位置', type: 'text' as const },
  { key: 'soil_type', label: '土壤类型', type: 'text' as const },
  { key: 'lease_period', label: '租期(天)', type: 'number' as const, required: true },
  { key: 'stock', label: '库存', type: 'number' as const, required: true },
  { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '下架', value: 0 }], defaultValue: 1 },
  { key: 'description', label: '描述', type: 'textarea' as const, hideInTable: true },
];

export default function PlotsPage() {
  return <CrudPage title="地块管理" apiPath="/api/plots" fields={fields} />;
}
