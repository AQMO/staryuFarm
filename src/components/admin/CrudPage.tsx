'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'image' | 'switch' | 'price';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  hideInTable?: boolean;
  hideInForm?: boolean;
  defaultValue?: unknown;
}

interface CrudPageProps {
  title: string;
  apiPath: string;
  fields: FieldDef[];
  statusField?: string;
}

export default function CrudPage({ title, apiPath, fields, statusField = 'status' }: CrudPageProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiPath);
      const json = await res.json();
      setData(json.data || []);
    } catch (e) {
      console.error('Fetch error:', e);
    }
    setLoading(false);
  }, [apiPath]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditItem(null);
    const defaults: Record<string, unknown> = {};
    fields.forEach(f => { if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue; });
    setFormData(defaults);
    setDialogOpen(true);
  };

  const handleEdit = (item: Record<string, unknown>) => {
    setEditItem(item);
    setFormData({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确认删除此条记录？')) return;
    await fetch(`${apiPath}?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleSubmit = async () => {
    const method = editItem ? 'PUT' : 'POST';
    const body = editItem ? { ...formData, id: editItem.id } : formData;
    await fetch(apiPath, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setDialogOpen(false);
    fetchData();
  };

  const handleFieldChange = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = searchTerm
    ? data.filter(item =>
        fields.some(f => {
          const val = item[f.key];
          return val !== null && val !== undefined && String(val).toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : data;

  const renderFieldValue = (item: Record<string, unknown>, field: FieldDef) => {
    const val = item[field.key];
    if (field.key === statusField) {
      return Number(val) === 1 ? (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">正常</Badge>
      ) : (
        <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">下架</Badge>
      );
    }
    if (field.type === 'price') {
      return `¥${Number(val || 0).toFixed(2)}`;
    }
    if (field.type === 'image' && val) {
      return <img src={String(val)} alt="" className="h-10 w-10 rounded object-cover" />;
    }
    if (field.type === 'switch') {
      return val ? '是' : '否';
    }
    const str = String(val ?? '');
    return str.length > 50 ? str.substring(0, 50) + '...' : str;
  };

  const renderFormField = (field: FieldDef) => {
    if (field.hideInForm) return null;
    const val = formData[field.key];

    if (field.type === 'select') {
      return (
        <div key={field.key} className="space-y-2">
          <Label>{field.label}{field.required && ' *'}</Label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={String(val ?? '')}
            onChange={e => handleFieldChange(field.key, field.options?.find(o => String(o.value) === e.target.value)?.value ?? e.target.value)}
          >
            <option value="">请选择</option>
            {field.options?.map(opt => (
              <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-2">
          <Label>{field.label}{field.required && ' *'}</Label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"
            value={String(val ?? '')}
            placeholder={field.placeholder}
            onChange={e => handleFieldChange(field.key, e.target.value)}
          />
        </div>
      );
    }

    if (field.type === 'switch') {
      return (
        <div key={field.key} className="flex items-center gap-3">
          <Switch
            checked={Boolean(val)}
            onCheckedChange={checked => handleFieldChange(field.key, checked)}
          />
          <Label>{field.label}</Label>
        </div>
      );
    }

    if (field.type === 'image') {
      return (
        <div key={field.key} className="space-y-2">
          <Label>{field.label}{field.required && ' *'}</Label>
          <Input
            value={String(val ?? '')}
            placeholder={field.placeholder || '输入图片URL'}
            onChange={e => handleFieldChange(field.key, e.target.value)}
          />
          {val ? <img src={String(val)} alt="" className="h-20 w-20 rounded object-cover mt-2" /> : null}
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        <Label>{field.label}{field.required && ' *'}</Label>
        <Input
          type={field.type === 'number' || field.type === 'price' ? 'number' : 'text'}
          step={field.type === 'price' ? '0.01' : undefined}
          value={String(val ?? '')}
          placeholder={field.placeholder}
          onChange={e => handleFieldChange(field.key, field.type === 'number' || field.type === 'price' ? (e.target.value ? Number(e.target.value) : '') : e.target.value)}
        />
      </div>
    );
  };

  const tableFields = fields.filter(f => !f.hideInTable);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-500 mt-1">管理{title}数据</p>
        </div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" /> 新增
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchData}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                {tableFields.map(f => (
                  <TableHead key={f.key}>{f.label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={tableFields.length + 2} className="text-center py-8 text-gray-400">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tableFields.length + 2} className="text-center py-8 text-gray-400">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map(item => (
                  <TableRow key={String(item.id)}>
                    <TableCell className="font-mono text-sm">{String(item.id)}</TableCell>
                    {tableFields.map(f => (
                      <TableCell key={f.key}>{renderFieldValue(item, f)}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(Number(item.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? '编辑' : '新增'}{title.slice(0, -2)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {fields.map(f => renderFormField(f))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
