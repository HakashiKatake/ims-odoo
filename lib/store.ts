import { create } from 'zustand';

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  warehouses: number;
  receiptsThisMonth: number;
  deliveriesThisMonth: number;
}

interface StoreState {
  // Dashboard stats
  dashboardStats: DashboardStats | null;
  setDashboardStats: (stats: DashboardStats) => void;
  refreshDashboard: () => Promise<void>;

  // Products count
  productsCount: number;
  setProductsCount: (count: number) => void;
  incrementProductsCount: () => void;
  decrementProductsCount: () => void;

  // Warehouses count
  warehousesCount: number;
  setWarehousesCount: (count: number) => void;
  incrementWarehousesCount: () => void;
  decrementWarehousesCount: () => void;

  // Locations count
  locationsCount: number;
  setLocationsCount: (count: number) => void;
  incrementLocationsCount: () => void;
  decrementLocationsCount: () => void;

  // Stock count
  stockCount: number;
  setStockCount: (count: number) => void;

  // Receipts count
  receiptsCount: number;
  setReceiptsCount: (count: number) => void;
  incrementReceiptsCount: () => void;

  // Deliveries count
  deliveriesCount: number;
  setDeliveriesCount: (count: number) => void;
  incrementDeliveriesCount: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Dashboard stats
  dashboardStats: null,
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  
  refreshDashboard: async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        set({ dashboardStats: data });
      }
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    }
  },

  // Products
  productsCount: 0,
  setProductsCount: (count) => set({ productsCount: count }),
  incrementProductsCount: () => set((state) => ({ productsCount: state.productsCount + 1 })),
  decrementProductsCount: () => set((state) => ({ productsCount: state.productsCount - 1 })),

  // Warehouses
  warehousesCount: 0,
  setWarehousesCount: (count) => set({ warehousesCount: count }),
  incrementWarehousesCount: () => set((state) => ({ warehousesCount: state.warehousesCount + 1 })),
  decrementWarehousesCount: () => set((state) => ({ warehousesCount: state.warehousesCount - 1 })),

  // Locations
  locationsCount: 0,
  setLocationsCount: (count) => set({ locationsCount: count }),
  incrementLocationsCount: () => set((state) => ({ locationsCount: state.locationsCount + 1 })),
  decrementLocationsCount: () => set((state) => ({ locationsCount: state.locationsCount - 1 })),

  // Stock
  stockCount: 0,
  setStockCount: (count) => set({ stockCount: count }),

  // Receipts
  receiptsCount: 0,
  setReceiptsCount: (count) => set({ receiptsCount: count }),
  incrementReceiptsCount: () => set((state) => ({ receiptsCount: state.receiptsCount + 1 })),

  // Deliveries
  deliveriesCount: 0,
  setDeliveriesCount: (count) => set({ deliveriesCount: count }),
  incrementDeliveriesCount: () => set((state) => ({ deliveriesCount: state.deliveriesCount + 1 })),
}));
