'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StockLedgerEntry {
  _id: string;
  product: {
    name: string;
    sku: string;
  };
  location: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  movementType: string;
  quantity: number;
  reference: string;
  sourceDocument: string;
  notes?: string;
  createdAt: string;
}

export default function MoveHistoryPage() {
  const [entries, setEntries] = useState<StockLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [movementTypeFilter, setMovementTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEntries();
  }, [movementTypeFilter]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/stock-ledger');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      }
    } catch (error) {
      console.error('Error fetching stock ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementBadge = (type: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      in: { variant: 'default', label: 'In' },
      out: { variant: 'destructive', label: 'Out' },
      adjustment: { variant: 'outline', label: 'Adjustment' },
      transfer: { variant: 'secondary', label: 'Transfer' },
    };
    const config = variants[type] || variants.adjustment;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredEntries = entries.filter(entry => {
    const matchesType = movementTypeFilter === 'all' || entry.movementType === movementTypeFilter;
    const matchesSearch = searchTerm === '' || 
      entry.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const entryDate = new Date(entry.createdAt);
    const matchesStartDate = !startDate || entryDate >= new Date(startDate);
    const matchesEndDate = !endDate || entryDate <= new Date(endDate);

    return matchesType && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Date', 'Reference', 'Product', 'SKU', 'Location', 'Type', 'Quantity', 'Notes'];
    const rows = filteredEntries.map(entry => [
      format(new Date(entry.createdAt), 'yyyy-MM-dd HH:mm'),
      entry.reference,
      entry.product.name,
      entry.product.sku,
      `${entry.location.warehouse.name}/${entry.location.name}`,
      entry.movementType,
      entry.quantity.toString(),
      entry.notes || '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `move-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Move History</h1>
            <p className="mt-2 text-gray-600">Complete audit trail of all stock movements</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter stock movement history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Product, SKU, Reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="movementType">Movement Type</Label>
                <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
                  <SelectTrigger id="movementType">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="in">In</SelectItem>
                    <SelectItem value="out">Out</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movement History</CardTitle>
            <CardDescription>
              Showing {filteredEntries.length} of {entries.length} movements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading history...</div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">No movements found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell>
                        {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{entry.reference}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.product.name}</p>
                          <p className="text-sm text-gray-500">{entry.product.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.location.warehouse.name} / {entry.location.name}
                      </TableCell>
                      <TableCell>{getMovementBadge(entry.movementType)}</TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.movementType === 'out' ? '-' : '+'}{entry.quantity}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-gray-500">
                        {entry.notes || '-'}
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
