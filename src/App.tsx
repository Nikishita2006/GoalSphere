import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { api } from './lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Plus, 
  CheckCircle2,
  CheckCircle,
  Clock, 
  AlertCircle, 
  Send, 
  RotateCcw,
  Sparkles,
  Download,
  Unlock,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  Target,
  Users,
  ChevronRight,
  MessageSquare,
  LayoutDashboard,
  ShieldCheck,
  ShieldPlus,
  History,
  Zap,
  Calendar,
  Database,
  Info,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENTS ---

const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; subtitle?: string }> = ({ children, className, title, subtitle }) => (
  <div className={cn("bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm transition-all premium-shadow-hover", className)}>
    {title && (
      <div className="mb-6">
        <h3 className="text-lg font-display font-bold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

const Badge: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
  const styles: Record<string, string> = {
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'On Track': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Not Started': 'bg-slate-50 text-slate-500 border-slate-100',
    'High': 'bg-red-50 text-red-700 border-red-100',
    'Medium': 'bg-amber-50 text-amber-700 border-amber-100',
    'Low': 'bg-blue-50 text-blue-700 border-blue-100',
    'default': 'bg-slate-50 text-slate-500 border-slate-100'
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", styles[type] || styles.default)}>
      {children}
    </span>
  );
};

// --- PAGES ---

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) api.getAnalytics(user.id).then(setStats);
  }, [user]);

  if (!stats) return (
    <div className="grid grid-cols-12 gap-6 animate-pulse">
      <div className="col-span-12 lg:col-span-8 h-80 bg-slate-200 rounded-[2.5rem]"></div>
      <div className="col-span-12 lg:col-span-4 h-80 bg-slate-200 rounded-[2.5rem]"></div>
      <div className="col-span-4 h-40 bg-slate-200 rounded-[2.5rem]"></div>
      <div className="col-span-4 h-40 bg-slate-200 rounded-[2.5rem]"></div>
      <div className="col-span-4 h-40 bg-slate-200 rounded-[2.5rem]"></div>
    </div>
  );

  const data = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'On Track', value: stats.onTrack, color: '#4f46e5' },
    { name: 'Not Started', value: stats.notStarted, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 italic uppercase">OPERATIONAL OVERVIEW.</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold opacity-60">Cycle: Q2 Fiscal Year 2026 • Real-time Sync</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Healthy</span>
          </div>
          <button className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200 hover:scale-105 transition-transform group">
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* KPI Scorecard */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 premium-shadow p-10 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div>
                <Badge type="On Track">Institutional Performance</Badge>
                <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight mt-4">Corporate Alignment Index</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-md">Aggregate delta of individual performance against high-level organizational objectives.</p>
              </div>
              <div className="text-right">
                <div className="text-7xl font-display font-black text-indigo-600 tracking-tighter">
                  {Math.round(stats.overallSuccess)}<span className="text-2xl text-slate-300 ml-1">%</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                   <TrendingUp className="w-3 h-3" /> 
                   <span>+4.2% Internal</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-10">
              <div className="grid grid-cols-3 gap-8">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-indigo-50 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Fulfilled</p>
                    <p className="text-2xl font-display font-black text-slate-900">{stats.completed}</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-emerald-50 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pending</p>
                    <p className="text-2xl font-display font-black text-slate-900">{stats.onTrack}</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-slate-200 transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Staged</p>
                    <p className="text-2xl font-display font-black text-slate-900">{stats.notStarted}</p>
                 </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        {/* Status Radar */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10">
            <Badge type="Completed">Strategic Lock</Badge>
            <h3 className="text-2xl font-display font-black tracking-tight mt-6 leading-tight uppercase italic opacity-90">Secure Governance Framework Activated.</h3>
            <p className="text-slate-400 text-xs mt-4 leading-relaxed">All performance metrics are currently locked and audited by the HR protocol for cycle Q2.</p>
          </div>
          
          <div className="relative z-10 flex flex-col gap-3">
             <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                   <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compliance Status</p>
                   <p className="text-sm font-bold text-white uppercase italic tracking-tighter">Verified (Level 4)</p>
                </div>
             </div>
          </div>
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600 rounded-full -mr-24 -mt-24 blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </div>

        {/* Analytics Distribution */}
        <Card className="col-span-12 lg:col-span-7" title="Trajectory Distribution" subtitle="Normalized distribution of goal achievement states across active nodes.">
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data} barGap={12}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip 
                       cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '20px' }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                       {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Quick Insights List */}
        <Card className="col-span-12 lg:col-span-5" title="Protocol Alerts" subtitle="Recent systemic events requiring stakeholder attention.">
           <div className="space-y-6">
              {[
                { title: 'Goal Reflection Window', date: '2h ago', type: 'info', desc: 'Manager feedback session initiated for Project X goals.' },
                { title: 'Weightage Inconsistency', date: '5h ago', type: 'warning', desc: 'Node ID 4829 reports total weightage delta of -15%.' },
                { title: 'System Migration Complete', date: '1d ago', type: 'success', desc: 'Legacy performance metrics successfully ported to Sphere v4.' }
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-3xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-default group">
                   <div className={cn("w-2 h-10 rounded-full shrink-0 mt-1", alert.type === 'info' ? 'bg-indigo-300' : alert.type === 'warning' ? 'bg-amber-300' : 'bg-emerald-300')}></div>
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{alert.title}</h4>
                         <span className="text-[9px] font-bold text-slate-300 uppercase">{alert.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{alert.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
};

const MyGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [newGoal, setNewGoal] = useState({
    title: '', description: '', thrustArea: '', uom: 'min', target: 0, weightage: 0
  });

  const loadGoals = () => {
    if (user) api.getGoals(user.id).then(setGoals);
  };

  useEffect(loadGoals, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createGoal({ ...newGoal, userId: user?.id });
      setIsAdding(false);
      setNewGoal({ title: '', description: '', thrustArea: '', uom: 'min', target: 0, weightage: 0 });
      loadGoals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const submitSheet = async () => {
    if (!confirm('Proceed with cryptographic signature and final submission? Changes will be immutable post-submission.')) return;
    try {
      await api.submitGoals(user!.id);
      loadGoals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalWeightage = goals.reduce((acc, g) => acc + g.weightage, 0);
  const isLocked = goals.some(g => g.isLocked);

  const filteredGoals = goals.filter(g => activeFilter === 'All' || g.status === activeFilter);

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 italic uppercase">PERFORMANCE OBJECTIVES.</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className={cn("px-4 py-1.5 rounded-xl border flex items-center gap-2", totalWeightage === 100 ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700")}>
              <span className="text-[9px] font-black uppercase tracking-widest">Weight Distribution</span>
              <span className="text-xs font-bold">{totalWeightage}% / 100%</span>
            </div>
            {isLocked && <Badge type="On Track">System Locked</Badge>}
          </div>
        </div>
        {!isLocked && (
          <div className="flex gap-3">
             <button 
              onClick={() => setIsAdding(true)}
              disabled={goals.length >= 8}
              className="group flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-[1.2rem] font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-500/20 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Initialize Objective
            </button>
            <button 
              onClick={submitSheet}
              disabled={totalWeightage !== 100}
              className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-[1.2rem] font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Commit Sheet
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
         {['All', 'Not Started', 'On Track', 'Completed'].map(f => (
           <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", activeFilter === f ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700")}
           >
            {f}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-indigo-200 bg-indigo-50/10 backdrop-blur-sm" title="NEW OBJECTIVE PARAMETERS">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Objective Title</label>
                        <input required placeholder="e.g. System Scalability Optimization" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Legacy Division (Thrust)</label>
                        <input required placeholder="e.g. Infrastructure" value={newGoal.thrustArea} onChange={e => setNewGoal({...newGoal, thrustArea: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-inner" />
                      </div>
                      <div className="space-y-2 lg:col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Evaluation Methodology</label>
                        <div className="flex gap-2">
                          {['min', 'max', 'timeline', 'zero'].map(u => (
                            <button 
                              key={u}
                              type="button" 
                              onClick={() => setNewGoal({...newGoal, uom: u})}
                              className={cn("flex-1 py-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all", newGoal.uom === u ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300")}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Target Aggregate</label>
                        <div className="relative">
                          <input type="number" required value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-inner" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs">VAL</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">System Weightage (%)</label>
                        <div className="relative">
                          <input type="number" min="5" max="100" required value={newGoal.weightage} onChange={e => setNewGoal({...newGoal, weightage: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-inner" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs">%</div>
                        </div>
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-indigo-100/50">
                      <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600">Cancel Protocol</button>
                      <button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">Submit to Sheet</button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {filteredGoals.map(goal => (
            <motion.div 
              layout
              key={goal.id} 
              className={cn(
                "group relative bg-white border rounded-[3rem] p-10 transition-all hover:shadow-2xl hover:shadow-slate-300/30 flex flex-col lg:flex-row gap-10 items-start overflow-hidden",
                goal.isReturned ? "border-red-200" : "border-slate-200/60 shadow-sm"
              )}
            >
              {goal.isReturned && <div className="absolute inset-y-0 left-0 w-2 bg-red-500"></div>}
              
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge type={goal.status}>{goal.status}</Badge>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] ml-1">{goal.thrustArea}</span>
                  </div>
                  <h3 className="text-3xl font-display font-black text-slate-900 tracking-tighter leading-tight italic uppercase opacity-90">{goal.title}</h3>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl font-medium">Defined strategic benchmark to monitor institutional deliverables within the current reporting cycle.</p>
                
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocol</span>
                        <span className="text-xs font-bold text-slate-700 capitalize">{goal.uom} Implementation</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Allocation</span>
                        <span className="text-xs font-bold text-indigo-600">{goal.weightage}% weight</span>
                    </div>
                </div>
              </div>

              <div className="w-full lg:w-64 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-start gap-8">
                 <div className="w-full">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Benchmark</p>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-display font-black text-slate-900 leading-none">{goal.target}</span>
                      <span className="text-xs font-black text-slate-400 uppercase mb-1">units</span>
                    </div>
                 </div>
                 {goal.isApproved && (
                   <div className="w-full pt-8 border-t border-slate-200">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-3">Verified Actual</p>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-display font-black text-emerald-600 leading-none">{goal.actualAchievement}</span>
                        <div className={cn("ml-auto px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-tighter", goal.actualAchievement >= goal.target ? "bg-emerald-500" : "bg-red-500")}>
                          {goal.actualAchievement >= goal.target ? 'Surplus' : 'Deficit'}
                        </div>
                      </div>
                   </div>
                 )}
              </div>
              
              {!isLocked && (
                <button className="absolute top-10 right-10 p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}
          
          {filteredGoals.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 border border-white rotate-3">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-black text-slate-900 uppercase italic">Empty Objective Stack.</h3>
              <p className="text-slate-400 font-medium text-sm mt-2 max-w-sm mx-auto uppercase tracking-tighter opacity-50">No operational parameters detected. Initialize your performance sheet to begin the alignment process.</p>
              {!isLocked && (
                <button onClick={() => setIsAdding(true)} className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:translate-y-[-2px] transition-all active:scale-95">
                  Begin Initialization
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages([...messages, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.aiSuggest(userMsg, {});
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Protocol error during linguistic processing.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, rotate: 2 }}
            className="w-[400px] h-[600px] mb-6 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-slate-200 flex flex-col overflow-hidden premium-shadow"
          >
            <div className="p-8 sidebar-gradient text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-display font-black uppercase tracking-widest text-xs">SPHERE-AI</span>
                  <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mt-0.5">Core Intelligent Unit</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 hover:bg-white/10 p-2 rounded-xl transition-colors">
                <ChevronDown className="w-6 h-6" />
              </button>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {messages.length === 0 && (
                <div className="text-center py-10">
                   <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mx-auto mb-6">
                      <Zap className="w-8 h-8" />
                   </div>
                   <h4 className="text-lg font-display font-black text-slate-900 tracking-tight uppercase italic mb-2">Neural Link Ready.</h4>
                   <p className="text-slate-400 text-xs font-medium max-w-[200px] mx-auto uppercase tracking-tighter">Ask system-level queries about your performance architecture or goal alignment.</p>
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div 
                   initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   key={i} 
                   className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}
                >
                  <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", m.role === 'user' ? "text-slate-400" : "text-indigo-400")}>
                    {m.role === 'user' ? 'Stakeholder' : 'Core AI'}
                  </p>
                  <div className={cn("max-w-[85%] p-5 text-sm leading-relaxed", m.role === 'user' ? "bg-slate-900 text-white rounded-3xl rounded-tr-sm" : "bg-indigo-50 text-indigo-900 rounded-3xl rounded-tl-sm")}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && <div className="flex gap-1 p-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.3s]"></div><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.5s]"></div></div>}
            </div>

            <form onSubmit={sendMessage} className="p-6 bg-slate-50 border-t border-slate-100">
               <div className="relative">
                  <input 
                    placeholder="Enter systemic directive..." 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4 pr-16 focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm transition-all shadow-inner"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-slate-900 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(true)}
        className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-400 hover:scale-110 active:scale-95 transition-all group"
      >
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, register, loading: authLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('Engineering');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
      />
      <div className="font-display font-black text-2xl tracking-tighter uppercase italic animate-pulse">Initializing GoalSphere Core...</div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Security Handshake in Progress</div>
    </div>
  );
  
  if (user) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await register(name, email, role, department, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      if (err.message.toLowerCase().includes('not found') && !isRegistering) {
        setError('Identity not recognized in the system.');
      } else {
        setError(err.message.toUpperCase());
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* Left Pane - Branding & Visuals */}
      <div className="hidden lg:flex w-1/2 sidebar-gradient items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-px bg-white rotate-45"></div>
        </div>
        
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-6 group-hover:rotate-0 transition-transform">
              <ShieldCheck className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-display font-black tracking-tighter text-white uppercase italic">GOALSPHERE.</h1>
              <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs">Performance Architecture</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold text-white leading-tight">Elevate Institutional Excellence through Aligned Performance.</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light">The industry-standard portal for strategic goal-setting, workforce analytics, and transparent governance.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-display font-black text-white">99.8%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Audit Compliance</p>
            </div>
            <div>
              <p className="text-3xl font-display font-black text-white">12.4k</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Strategic Objectives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-sm space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">{isRegistering ? 'INITIALIZE IDENTITY' : 'ACCESS PORTAL'}</h2>
            <p className="text-slate-500 mt-2 text-sm">Enter your credentials to continue to the dashboard.</p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsRegistering(false)}
                  className={cn("flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", !isRegistering ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-400")}
                > Sign In </button>
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsRegistering(true)}
                  className={cn("flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", isRegistering ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-400")}
                > Register </button>
              </div>

              <div className="space-y-4">
                {isRegistering && (
                  <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Legacy Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Jane Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Node Identifier (Email)</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="email@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Access Passkey</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                {isRegistering && (
                  <AnimatePresence>
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Division</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Finance, Product"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Entity Role</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm appearance-none cursor-pointer"
                          value={role}
                          onChange={e => setRole(e.target.value)}
                        >
                          <option value="employee">Individual Contributor</option>
                          <option value="manager">Manager / Lead</option>
                          <option value="admin">Administrator (HR)</option>
                        </select>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-red-800 text-[10px] font-bold uppercase tracking-widest leading-none">Security Flag</p>
                    <p className="text-red-600 text-xs mt-1 font-medium italic">{error}</p>
                  </div>
                </div>
              )}

              <button 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-display font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <RotateCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isRegistering ? 'Initialize Identity' : 'Verify & Continue'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="flex items-center justify-between opacity-30 pt-4">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">FIPS 140-2 Compliant</span>
             </div>
             <span className="text-[9px] font-bold uppercase tracking-[0.2em]">© 2026 GS PROTOCOL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainLayout = ({ children, activeTab, setActiveTab }: any) => {
  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto pb-20">
          {children}
        </div>
      </main>
      <AIAssistant />
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AuthProvider>
      <AuthGate>
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'my-goals' && <MyGoals />}
          {activeTab === 'team' && <ManagerView />}
          {activeTab === 'admin' && <AdminView />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </MainLayout>
      </AuthGate>
    </AuthProvider>
  );
}

// --- Placeholder for Manager/Admin Views to keep file clean but functional ---

const ManagerView = () => {
    const { user } = useAuth();
    const [team, setTeam] = useState<any[]>([]);
    
    useEffect(() => {
        if (user) api.getTeam(user.id).then(setTeam);
    }, [user]);

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200">
                <div>
                  <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 italic uppercase">TEAM PULSE HUB.</h1>
                  <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold opacity-60">Manager Dashboard • Workforce Optimization Nodes</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map(member => (
                    <Card key={member.id} className="relative group overflow-hidden">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="relative">
                              <div className="w-16 h-16 bg-slate-50 border-2 border-white shadow-xl text-indigo-600 rounded-[1.5rem] flex items-center justify-center font-display font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                                {member.name[0]}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">{member.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Division</span>
                                 <span className="text-[10px] font-bold text-slate-700 truncate">{member.department}</span>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</span>
                                 <Badge type="On Track">92% Index</Badge>
                              </div>
                           </div>
                           
                           <div className="flex gap-2">
                             <button className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-display font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">Inspect Objective</button>
                             <button className="p-4 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                <TrendingUp className="w-4 h-4" />
                             </button>
                           </div>
                        </div>
                        
                        <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </Card>
                ))}
            </div>
            
            {team.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                   <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                   <h3 className="text-xl font-display font-black text-slate-900 uppercase italic tracking-tighter">No Linked Human Resources.</h3>
                   <p className="text-slate-400 text-sm font-medium mt-1">Direct reports not detected in current organizational cluster.</p>
                </div>
            )}
        </div>
    )
}

const AdminView = () => {
    const [logs, setLogs] = useState<any[]>([]);
    useEffect(() => { api.getLogs().then(setLogs); }, []);

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200">
                <div>
                  <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 italic uppercase">HR GOVERNANCE.</h1>
                  <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold opacity-60">Administrative Protocol • System Integrity Logs</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-5 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col justify-center relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <Badge type="On Track">Cycle Q2 ACTIVE</Badge>
                            <Calendar className="text-slate-200 w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase italic">Objective Lock</p>
                            <p className="text-sm text-slate-500 font-medium mt-2">The current performance cycle is scheduled for archival in 12 days. Bulk operations permitted.</p>
                        </div>
                        <button className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-display font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">Advance Protocol Stage</button>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                </div>

                <div className="col-span-12 md:col-span-7 bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Master Control Unit</h3>
                            <p className="text-2xl font-display font-black tracking-tight leading-tight uppercase italic opacity-90">Global Access Management activated for root users.</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                           <ShieldPlus className="w-6 h-6 text-indigo-300" />
                        </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-2 gap-4 mt-10">
                       <button className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all font-display font-black text-[9px] uppercase tracking-[0.2em]">
                           <Unlock className="w-4 h-4" /> Bulk Hierarchy Unlock
                       </button>
                       <button className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all font-display font-black text-[9px] uppercase tracking-[0.2em]">
                           <Database className="w-4 h-4" /> Data Scrub protocol
                       </button>
                    </div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/30 rounded-full blur-[100px] group-hover:scale-110 transition-transform"></div>
                </div>
                
                <Card className="col-span-12" title="Systemic Audit Trail" subtitle="Verified immutable logs of all stakeholder transmissions within the current cycle.">
                    <div className="mt-4 -mx-8">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-slate-400 font-display font-black uppercase text-[8px] tracking-[0.2em]">
                                    <th className="py-6 px-10">Subject Node</th>
                                    <th className="py-6 px-10">Protocol Action</th>
                                    <th className="py-6 px-10">Transmission Payload</th>
                                    <th className="py-6 px-10 text-right">Synchronization Epoch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-indigo-50/20 transition-all group">
                                        <td className="py-6 px-10">
                                           <div className="flex items-center gap-4">
                                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-display font-black text-xs text-slate-500 border border-white shadow-sm group-hover:bg-white transition-colors capitalize">
                                                 {log.userName[0]}
                                              </div>
                                              <div>
                                                 <span className="font-display font-bold text-slate-900 text-sm">{log.userName}</span>
                                                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5 italic">Verified Entity</p>
                                              </div>
                                           </div>
                                        </td>
                                        <td className="py-6 px-10">
                                            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">
                                               {log.action}
                                            </span>
                                        </td>
                                        <td className="py-6 px-10">
                                           <p className="text-slate-500 font-medium text-xs max-w-sm truncate group-hover:text-slate-900 transition-colors">
                                              {log.details}
                                           </p>
                                        </td>
                                        <td className="py-6 px-10 text-right">
                                           <div className="flex flex-col items-end">
                                              <span className="text-[10px] font-mono font-bold text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                                              <span className="text-[9px] font-mono text-slate-300">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                           </div>
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                  <tr><td colSpan={4} className="py-20 text-center text-slate-300 font-display font-black uppercase tracking-widest italic opacity-50">No Transmissions Logged.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}

const AnalyticsView = () => {
     const deptData = [
         { name: 'Engineering', score: 85, color: '#4f46e5' },
         { name: 'Marketing', score: 72, color: '#f43f5e' },
         { name: 'Sales', score: 94, color: '#10b981' },
         { name: 'HR', score: 68, color: '#fbbf24' },
         { name: 'Operations', score: 81, color: '#8b5cf6' },
     ];

     return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200">
                <div>
                  <h1 className="text-4xl font-display font-black tracking-tighter text-slate-900 italic uppercase">STRATEGIC ANALYTICS.</h1>
                  <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold opacity-60">Organizational Heatmaps • Efficiency Vectors</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-display font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200">
                    <Download className="w-5 h-5" /> Export Data Protocol
                </button>
            </header>
            
            <div className="grid grid-cols-12 gap-8">
                 <Card className="col-span-12 lg:col-span-8" title="Departmental Efficiency Index" subtitle="Aggregated performance clusters normalized across institutional nodes.">
                      <div className="h-[360px] w-full mt-6">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData} layout="vertical" barGap={20} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} width={100} />
                                <Tooltip 
                                   cursor={{fill: 'rgba(241, 245, 249, 0.4)'}} 
                                   contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '20px' }} 
                                />
                                <Bar dataKey="score" radius={[0, 16, 16, 0]} barSize={26}>
                                    {deptData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                 </Card>

                 <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col items-center justify-between relative overflow-hidden group premium-shadow">
                      <div className="w-full">
                        <Badge type="High">Manager effectiveness</Badge>
                        <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight mt-6 leading-tight uppercase italic mb-2">Leadership Delta Matrix.</h3>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter opacity-60">Systemic evaluation of leadership guidance impact cycles.</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 w-full mt-8 relative z-10">
                           {[9.2, 8.4, 7.1, 9.8, 6.5, 8.9, 9.5, 7.8, 10.0].map((v, i) => (
                               <motion.div 
                                   initial={{ opacity: 0, scale: 0.5 }}
                                   whileInView={{ opacity: 1, scale: 1 }}
                                   transition={{ delay: i * 0.05 }}
                                   key={i} 
                                   className={cn(
                                      "aspect-square rounded-2xl flex items-center justify-center text-white font-display font-black text-xs shadow-xl transition-all hover:rotate-12", 
                                      v >= 9 ? "bg-emerald-500 shadow-emerald-100" : v >= 7 ? "bg-indigo-500 shadow-indigo-100" : "bg-rose-500 shadow-rose-100"
                                   )}
                               >
                                   {v.toFixed(1)}
                               </motion.div>
                           ))}
                      </div>
                      
                      <div className="mt-10 self-start flex items-center gap-2 text-slate-300">
                         <Info className="w-3 h-3" />
                         <span className="text-[10px] font-black uppercase tracking-widest italic">Neural variance: Q2 verified</span>
                      </div>
                      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-1000 opacity-50"></div>
                 </div>

                 <Card className="col-span-12" title="Organizational Cycle Distribution" subtitle="Normalized progression of active objectives relative to systemic deadlines.">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
                       {[
                         { label: 'Initialization Stage', count: 42, color: 'bg-slate-100', icon: Target },
                         { label: 'Active Progress', count: 156, color: 'bg-indigo-50', icon: TrendingUp },
                         { label: 'Refinement Period', count: 28, color: 'bg-amber-50', icon: RotateCcw },
                         { label: 'Completed Nodes', count: 89, color: 'bg-emerald-50', icon: CheckCircle }
                       ].map((step, i) => (
                         <div key={i} className={cn("p-8 rounded-[2.5rem] border border-slate-50 flex flex-col gap-4", step.color)}>
                            <step.icon className="w-8 h-8 text-slate-400 opacity-20" />
                            <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{step.label}</p>
                               <span className="text-4xl font-display font-black text-slate-900 tracking-tighter">{step.count}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </Card>
            </div>
        </div>
    )
}
