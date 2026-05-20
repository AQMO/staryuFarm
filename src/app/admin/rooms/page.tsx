'use client';

import CrudPage from '@/components/admin/CrudPage';

const fields = [
  { key: 'name', label: '房型名称', type: 'text' as const, required: true, placeholder: '如：大床房、双人房' },
  { key: 'price', label: '单价(元/晚)', type: 'price' as const, required: true },
  { key: 'pic', label: '房型图片', type: 'image' as const, required: true },
  { key: 'capacity', label: '可容纳人数', type: 'number' as const, required: true },
  { key: 'facility', label: '房间设施', type: 'text' as const, placeholder: '如：空调、热水器、WiFi' },
  { key: 'stock', label: '库存数量', type: 'number' as const, required: true },
  { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '下架', value: 0 }], defaultValue: 1 },
  { key: 'description', label: '描述', type: 'textarea' as const, hideInTable: true },
];

export default function RoomsPage() {
  return <CrudPage title="房间管理" apiPath="/api/rooms" fields={fields} />;
}
