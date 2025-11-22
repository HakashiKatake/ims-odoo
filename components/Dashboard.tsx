import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Product, StockOperation } from '../types/dashboard';
import { Globe, ArrowUpRight, ArrowDownRight, Activity, Database, AlertOctagon } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  history: StockOperation[];
}

const MetricCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
    <div className="relative p-6 flex flex-col justify-between h-full z-10">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg bg-slate-800 border border-slate-700 text-${color.split('-')[1]}-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                 <Icon size={24} />
            </div>
            <div className="flex flex-col items-end">
                 <span className={`text-[10px] uppercase tracking-[0.2em] font-bold text-${color.split('-')[1]}-200 mb-1`}>{title}</span>
                 <span className="text-3xl font-bold text-white tracking-tight neon-text">{value}</span>
            </div>
        </div>
        <div className="text-xs text-slate-300 font-medium tracking-wide border-t border-slate-800 pt-3 mt-1 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-${color.split('-')[1]}-400 shadow-[0_0_5px_currentcolor]`}></div>
            {subtext}
        </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ products, history }) => {
  const totalStockValue = products.reduce((acc, p) => acc + (p.quantity * p.price), 0);
  const lowStockCount = products.filter(p => p.quantity <= p.minLevel).length;
  
  const categoryData = products.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.quantity * product.price; 
      existing.count += product.quantity;
    } else {
      acc.push({ name: product.category, value: product.quantity * product.price, count: product.quantity, fullMark: 10000 });
    }
    return acc;
  }, []);

  // Mock trend data
  const trendData = [
    { name: 'Mon', val: 4000, flow: 2400 }, { name: 'Tue', val: 3000, flow: 1398 }, { name: 'Wed', val: 2000, flow: 9800 }, 
    { name: 'Thu', val: 2780, flow: 3908 }, { name: 'Fri', val: 1890, flow: 4800 }, { name: 'Sat', val: 2390, flow: 3800 }, { name: 'Sun', val: 3490, flow: 4300 }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
        <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
        <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">DASH<span className="font-bold text-cyan-400">BOARD</span></h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">Welcome back to your overview.</p>
        </div>
        <div className="text-right mt-4 md:mt-0">
            <div className="inline-flex items-center gap-3 bg-indigo-900/30 px-4 py-2 rounded-full border border-indigo-500/30 backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-bold text-cyan-300 tracking-widest">LIVE</span>
            </div>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
            title="Total Value" 
            value={`$${(totalStockValue/1000).toFixed(1)}k`} 
            subtext="Total Inventory Worth"
            color="from-cyan-500/20 to-blue-600/20"
            icon={Globe}
        />
        <MetricCard 
            title="Total Items" 
            value={products.length} 
            subtext="Distinct Products" 
            color="from-purple-500/20 to-indigo-600/20"
            icon={Database}
        />
        <MetricCard 
            title="Low Stock" 
            value={lowStockCount} 
            subtext="Items Need Attention" 
            color="from-red-500/20 to-orange-600/20"
            icon={AlertOctagon}
        />
        <MetricCard 
            title="Activity" 
            value="Good" 
            subtext="System is running well" 
            color="from-emerald-500/20 to-teal-600/20"
            icon={Activity}
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Sector Scan */}
        <div className="lg:col-span-1 card p-6 relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <Globe size={100} className="text-indigo-500" />
             </div>
            <div className="mb-2 relative z-10">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Categories</h3>
                <p className="text-xs text-cyan-300">Distribution by Value</p>
            </div>
            <div className="h-64 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                        <PolarGrid stroke="#3730a3" strokeDasharray="3 3" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar name="Value" dataKey="value" stroke="#22d3ee" strokeWidth={2} fill="#22d3ee" fillOpacity={0.3} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0f172a', border: '1px solid #3730a3', borderRadius: '8px', color: '#fff'}}
                            itemStyle={{color: '#22d3ee'}}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Main Trend Chart */}
        <div className="lg:col-span-2 card p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Stock Trends</h3>
                    <p className="text-xs text-purple-300">Value vs Volume over time</p>
                </div>
                <div className="flex gap-2">
                     <div className="px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400">Value</div>
                     <div className="px-3 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-xs text-purple-400">Volume</div>
                </div>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #4f46e5', borderRadius: '8px', color: '#fff', boxShadow: '0 0 15px rgba(79, 70, 229, 0.3)'}} 
                        />
                        <Area type="monotone" dataKey="val" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                        <Area type="monotone" dataKey="flow" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="card p-4 flex items-center gap-4 group hover:bg-indigo-900/20 cursor-pointer text-left rounded-xl bg-slate-900 border border-slate-800">
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <ArrowDownRight size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white tracking-wide">Add Stock</h4>
                <p className="text-xs text-slate-300 group-hover:text-emerald-300">Receive new items</p>
            </div>
        </button>
        <button className="card p-4 flex items-center gap-4 group hover:bg-indigo-900/20 cursor-pointer text-left rounded-xl bg-slate-900 border border-slate-800">
            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/30 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                <ArrowUpRight size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white tracking-wide">Remove Stock</h4>
                <p className="text-xs text-slate-300 group-hover:text-orange-300">Dispatch items out</p>
            </div>
        </button>
        <button className="card p-4 flex items-center gap-4 group hover:bg-indigo-900/20 cursor-pointer text-left rounded-xl bg-slate-900 border border-slate-800">
            <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/30 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Database size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white tracking-wide">AI Insight</h4>
                <p className="text-xs text-slate-300 group-hover:text-purple-300">Analyze your data</p>
            </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
