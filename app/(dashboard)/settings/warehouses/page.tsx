'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Warehouse as WarehouseIcon, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import Link from 'next/link';

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
        toast.success(editingWarehouse ? 'Warehouse updated successfully' : 'Warehouse created successfully');
        setDialogOpen(false);
        setFormData({ name: '', shortCode: '', address: '' });
        setEditingWarehouse(null);
        fetchWarehouses();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save warehouse');
      }
    } catch (error) {
      console.error('Error saving warehouse:', error);
      toast.error('Failed to save warehouse');
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
        toast.success('Warehouse deleted successfully');
        fetchWarehouses();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete warehouse');
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      toast.error('Failed to delete warehouse');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingWarehouse(null);
    setFormData({ name: '', shortCode: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <Link href="/settings" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Settings</span>
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-light text-white tracking-tight mb-1">
                WARE<span className="font-bold text-cyan-400">HOUSES</span>
              </h1>
              <p className="text-sm text-indigo-200 tracking-wider uppercase">
                Manage warehouse locations
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleCloseDialog()}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Warehouse
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingWarehouse ? 'Edit Warehouse' : 'New Warehouse'}</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    {editingWarehouse ? 'Update warehouse information' : 'Add a new warehouse location'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortCode" className="text-slate-300">Short Code *</Label>
                    <Input
                      id="shortCode"
                      placeholder="e.g., WH01, MAIN"
                      value={formData.shortCode}
                      onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-300">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCloseDialog}
                      className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50"
                    >
                      {editingWarehouse ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Warehouses Table */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <WarehouseIcon className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">All Warehouses</h3>
              <p className="text-xs text-slate-400">Manage your warehouse locations</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading warehouses...</p>
            </div>
          ) : warehouses.length === 0 ? (
            <div className="py-12 text-center">
              <WarehouseIcon className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-sm font-medium text-white">No warehouses</h3>
              <p className="mt-2 text-sm text-slate-400">Get started by creating a new warehouse.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Address</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-white">{warehouse.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-cyan-400">{warehouse.shortCode}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">{warehouse.address}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(warehouse)}
                            className="bg-slate-800 border-slate-700 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(warehouse._id)}
                            className="bg-slate-800 border-slate-700 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
