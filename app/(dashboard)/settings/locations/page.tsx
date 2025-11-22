'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import Link from 'next/link';

interface Location {
  _id: string;
  name: string;
  shortCode: string;
  warehouse: {
    _id: string;
    name: string;
  };
}

interface Warehouse {
  _id: string;
  name: string;
}

export default function LocationsPage() {
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [locations, setLocations] = useState<Location[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({ name: '', shortCode: '', warehouse: '' });

  useEffect(() => {
    fetchLocations();
    fetchWarehouses();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.warehouses);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingLocation ? `/api/locations/${editingLocation._id}` : '/api/locations';
      const method = editingLocation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingLocation ? 'Location updated successfully' : 'Location created successfully');
        setDialogOpen(false);
        setFormData({ name: '', shortCode: '', warehouse: '' });
        setEditingLocation(null);
        fetchLocations();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({ name: location.name, shortCode: location.shortCode, warehouse: location.warehouse._id });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const response = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Location deleted successfully');
        fetchLocations();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingLocation(null);
    setFormData({ name: '', shortCode: '', warehouse: '' });
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
                STORAGE <span className="font-bold text-cyan-400">LOCATIONS</span>
              </h1>
              <p className="text-sm text-indigo-200 tracking-wider uppercase">
                Manage storage locations within warehouses
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleCloseDialog()}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingLocation ? 'Edit Location' : 'New Location'}</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    {editingLocation ? 'Update location information' : 'Add a new storage location'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="warehouse" className="text-slate-300">Warehouse *</Label>
                    <Select
                      value={formData.warehouse}
                      onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse._id} value={warehouse._id} className="text-white">
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortCode" className="text-slate-300">Short Code *</Label>
                    <Input
                      id="shortCode"
                      placeholder="e.g., A-1, B-2, SHELF-01"
                      value={formData.shortCode}
                      onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Location Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Aisle A-1, Shelf B-2"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      {editingLocation ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Locations Table */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <MapPin className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">All Locations</h3>
              <p className="text-xs text-slate-400">Manage your storage locations</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading locations...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-sm font-medium text-white">No locations</h3>
              <p className="mt-2 text-sm text-slate-400">Get started by creating a new location.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Warehouse</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-cyan-400">{location.shortCode}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-white">{location.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-purple-400">{location.warehouse.name}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <QRCodeDisplay
                            value={`LOCATION:${location.shortCode}`}
                            title={`Location: ${location.name}`}
                            description={`Code: ${location.shortCode} | Warehouse: ${location.warehouse.name}`}
                            variant="icon"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(location)}
                            className="bg-slate-800 border-slate-700 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(location._id)}
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
