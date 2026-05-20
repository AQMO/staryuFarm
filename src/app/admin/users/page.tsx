'use client';

import CrudPage from '@/components/admin/CrudPage';

const fields = [
  { key: 'nickname', label: '昵称', type: 'text' as const },
  { key: 'phone', label: '手机号', type: 'text' as const },
  { key: 'role', label: '角色', type: 'select' as const, options: [{ label: '用户', value: 'user' }, { label: '管理员', value: 'admin' }] },
  { key: 'status', label: '状态', type: 'select' as const, options: [{ label: '正常', value: 1 }, { label: '禁用', value: 0 }] },
  { key: 'openid', label: 'OpenID', type: 'text' as const, hideInForm: true },
  { key: 'created_at', label: '注册时间', type: 'text' as const, hideInForm: true },
];

export default function UsersPage() {
  return <CrudPage title="用户管理" apiPath="/api/users" fields={fields} />;
}
