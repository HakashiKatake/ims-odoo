'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';

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
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Storage Locations</h1>
            <p className="mt-2 text-gray-600">Manage storage locations within warehouses</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleCloseDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLocation ? 'Edit Location' : 'New Location'}</DialogTitle>
                <DialogDescription>
                  {editingLocation ? 'Update location information' : 'Add a new storage location'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse *</Label>
                  <Select
                    value={formData.warehouse}
                    onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse._id} value={warehouse._id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortCode">Short Code *</Label>
                  <Input
                    id="shortCode"
                    placeholder="e.g., A-1, B-2, SHELF-01"
                    value={formData.shortCode}
                    onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Aisle A-1, Shelf B-2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLocation ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Locations</CardTitle>
            <CardDescription>Manage your storage locations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading locations...</div>
            ) : locations.length === 0 ? (
              <div className="py-12 text-center">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">No locations</h3>
                <p className="mt-2 text-sm text-gray-500">Get started by creating a new location.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location._id}>
                      <TableCell className="font-mono text-xs text-gray-600">{location.shortCode}</TableCell>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.warehouse.name}</TableCell>
                      <TableCell className="text-right">
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
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(location._id)}
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
