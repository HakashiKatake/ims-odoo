'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Warehouse as WarehouseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';

interface Warehouse {
  _id: string;
  name: string;
  shortCode: string;
  address: string;
  locationCount?: number;
}

export default function WarehousesPage() {
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState({ name: '', shortCode: '', address: '' });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.warehouses);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingWarehouse ? `/api/warehouses/${editingWarehouse._id}` : '/api/warehouses';
      const method = editingWarehouse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setDialogOpen(false);
        setFormData({ name: '', address: '' });
        setEditingWarehouse(null);
        fetchWarehouses();
        refreshDashboard();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save warehouse');
      }
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert('Failed to save warehouse');
    }
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({ name: warehouse.name, shortCode: warehouse.shortCode, address: warehouse.address });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) return;

    try {
      const response = await fetch(`/api/warehouses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchWarehouses();
        refreshDashboard();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete warehouse');
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      alert('Failed to delete warehouse');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingWarehouse(null);
    setFormData({ name: '', shortCode: '', address: '' });
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
            <p className="mt-2 text-gray-600">Manage warehouse locations</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleCloseDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingWarehouse ? 'Edit Warehouse' : 'New Warehouse'}</DialogTitle>
                <DialogDescription>
                  {editingWarehouse ? 'Update warehouse information' : 'Add a new warehouse location'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortCode">Short Code *</Label>
                  <Input
                    id="shortCode"
                    placeholder="e.g., WH01, MAIN"
                    value={formData.shortCode}
                    onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingWarehouse ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Warehouses</CardTitle>
            <CardDescription>Manage your warehouse locations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading warehouses...</div>
            ) : warehouses.length === 0 ? (
              <div className="py-12 text-center">
                <WarehouseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">No warehouses</h3>
                <p className="mt-2 text-sm text-gray-500">Get started by creating a new warehouse.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse._id}>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell>{warehouse.address}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(warehouse)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(warehouse._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
