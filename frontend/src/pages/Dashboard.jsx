import React, { useState, useEffect } from 'react';
import { Users, FileWarning, TrendingUp, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText, Download, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState({ stats: {}, topInaccessible: [], allReports: [] });
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'places'
  const [editingPlace, setEditingPlace] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        console.error('Error fetching dashboard data:', json);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/places', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json)) {
        setPlaces(json);
      } else {
        console.error('Error fetching places:', json);
        setPlaces([]);
      }
    } catch (err) {
      console.error(err);
      setPlaces([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardData(), fetchPlaces()]);
      setLoading(false);
    };
    init();
  }, []);

  const downloadCSV = () => {
    const headers = ['ID', 'Place', 'Rating', 'Status', 'Date', 'Ramp', 'Elevator', 'Toilet', 'Handrails', 'Description'];
    const rows = allReports.map(r => [
      r.id, 
      `"${r.place_name}"`, 
      r.user_rating, 
      r.status, 
      new Date(r.created_at).toLocaleDateString(),
      r.ramp ? 'Yes' : 'No',
      r.elevator ? 'Yes' : 'No',
      r.accessible_toilet ? 'Yes' : 'No',
      r.handrails ? 'Yes' : 'No',
      `"${(r.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AccessMap_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reports/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboardData();
        alert(`Status updated to ${status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleReportFeature = (reportId, key) => {
    setData(prev => ({
      ...prev,
      allReports: prev.allReports.map(r => 
        r.id === reportId ? { ...r, [key]: !r[key] } : r
      )
    }));
  };

  const handleUpdatePlace = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/places/${editingPlace.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingPlace)
      });
      if (res.ok) {
        setEditingPlace(null);
        fetchPlaces();
        fetchDashboardData();
        alert('Place updated successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Dashboard Data...</p>
      </div>
    </div>
  );

  const { stats = {}, topInaccessible = [], allReports = [] } = data || {};

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Government Oversight</h1>
            <p className="text-muted mt-1 font-medium">Real-time monitoring of accessibility compliance & civic reports.</p>
          </div>
          <button onClick={downloadCSV} className="btn-secondary flex items-center shadow-lg bg-white border-transparent hover:bg-white/80">
            <Download className="w-4 h-4 mr-2" />
            Export Audit Trail (CSV)
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Verified Places', val: stats.totalPlaces, icon: <Users />, color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Active Reports', val: stats.reportsToday, icon: <TrendingUp />, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Avg Compliance', val: stats.avgScore, icon: <CheckCircle2 />, color: 'bg-blue-50 text-blue-600' },
            { label: 'Urgent Action', val: stats.pendingComplaints, icon: <AlertTriangle />, color: 'bg-rose-50 text-rose-600' }
          ].map((stat, i) => (
            <div key={i} className="card p-6 border-white/60 bg-white/70 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {i+1}
                </div>
              </div>
              <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.val}</h3>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex space-x-1 mb-10 bg-slate-200/50 p-1.5 rounded-2xl w-fit backdrop-blur-sm border border-white/50">
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-premium' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Review Reports
          </button>
          <button 
            onClick={() => setActiveTab('places')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'places' ? 'bg-white text-slate-900 shadow-premium' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Place Directory
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* Sidebar Area: Top Inaccessible or Stats */}
          <div className="card lg:col-span-1 p-6 h-fit">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-danger mr-2" />
              Critical Attention Areas
            </h3>
            <ul className="divide-y divide-gray-100">
              {topInaccessible.map((place, i) => (
                <li key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{place.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{place.reports} reports</p>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                    {place.score.toFixed(1)} / 5
                  </span>
                </li>
              ))}
              {topInaccessible.length === 0 && <li className="py-3 text-sm text-gray-500 text-center italic">No critical areas found.</li>}
            </ul>
          </div>

          {/* Main Content Area */}
          <div className="card lg:col-span-2 overflow-hidden flex flex-col">
            {activeTab === 'reports' ? (
              <>
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Accessibility Reports</h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 uppercase tracking-widest">{allReports.length} TOTAL</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Place</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest px-10">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {allReports.map((report) => (
                        <React.Fragment key={report.id}>
                          <tr 
                            className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${expandedId === report.id ? 'bg-blue-50/50' : ''}`} 
                            onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {expandedId === report.id ? <ChevronUp className="w-4 h-4 mr-2 text-primary" /> : <ChevronDown className="w-4 h-4 mr-2 text-gray-400" />}
                                <div>
                                  <div className="text-sm font-bold text-gray-900">{report.place_name}</div>
                                  <div className="text-[10px] font-medium text-gray-500 uppercase">Rating: {report.user_rating}/5</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium font-mono">
                              {new Date(report.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-[9px] font-bold rounded uppercase tracking-wider border
                                ${report.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-100' : 
                                  report.status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  report.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                                  'bg-red-50 text-red-700 border-red-100'}`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end space-x-2">
                                <select 
                                  value={report.status} 
                                  onChange={(e) => updateStatus(report.id, e.target.value)}
                                  className="bg-white border border-gray-200 text-[10px] font-bold rounded px-2 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase"
                                  disabled={report.status === 'Approved'}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Resolved">Resolved</option>
                                  <option value="Approved">Approved</option>
                                </select>
                                {report.status !== 'Approved' && (
                                  <button 
                                    onClick={async () => {
                                      try {
                                        const token = localStorage.getItem('token');
                                        // Send the current feature state from the frontend report object
                                        const { place_id, place_name, created_at, status, ...features } = report;
                                        await fetch(`/api/reports/${report.id}/approve`, { 
                                          method: 'POST',
                                          headers: { 
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}` 
                                          },
                                          body: JSON.stringify(features)
                                        });
                                        fetchDashboardData();
                                        fetchPlaces();
                                      } catch (e) {
                                        console.error(e);
                                      }
                                    }}
                                    className="bg-primary text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-sm"
                                  >
                                    Approve
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {expandedId === report.id && (
                            <tr className="bg-white">
                              <td colSpan="4" className="px-6 py-0 overflow-hidden border-none cursor-default" onClick={(e) => e.stopPropagation()}>
                                <div className="p-6 bg-gray-50/50 rounded-xl m-2 border border-blue-100 animate-slideDown">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2">
                                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Report Details & Features</h4>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {[
                                          { key: 'ramp', label: 'Ramp' },
                                          { key: 'elevator', label: 'Elevator' },
                                          { key: 'accessible_toilet', label: 'Toilet' },
                                          { key: 'handrails', label: 'Handrails' },
                                          { key: 'resting_area', label: 'Seating' },
                                          { key: 'accessible_parking', label: 'Parking' },
                                          { key: 'automatic_doors', label: 'Auto Doors' },
                                          { key: 'wide_entrance', label: 'Wide Entry' },
                                          { key: 'emergency_alarm', label: 'Alarm' },
                                          { key: 'non_slip_floor', label: 'Non-slip' },
                                          { key: 'lowered_counter', label: 'Low Counter' },
                                          { key: 'visual_assistance', label: 'Visual assist' }
                                        ].map((feat) => (
                                          <label 
                                            key={feat.key} 
                                            className={`flex items-center space-x-2 bg-white p-2.5 rounded-lg border shadow-sm cursor-pointer transition-all ${report[feat.key] ? 'border-accent/30' : 'border-gray-100'}`}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input 
                                              type="checkbox"
                                              checked={!!report[feat.key]}
                                              disabled={report.status === 'Approved'}
                                              onChange={() => handleToggleReportFeature(report.id, feat.key)}
                                              className="w-3.5 h-3.5 text-accent rounded"
                                            />
                                            <span className={`text-[10px] font-bold uppercase tracking-tight ${report[feat.key] ? 'text-gray-700' : 'text-gray-300'}`}>{feat.label}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-6">
                                      <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">User Observations</h4>
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed shadow-sm min-h-[80px]">
                                          {report.description || 'N/A'}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 uppercase tracking-widest flex items-center">
                                          Priority: 
                                          {report.violation_flag ? 
                                            <span className="ml-2 text-danger animate-pulse">● HIGH</span> : 
                                            <span className="ml-2 text-accent">● STANDARD</span>
                                          }
                                        </span>
                                      </div>
                                      {report.photo_url && (
                                        <div className="pt-2">
                                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-bold">Evidence</h4>
                                          <a 
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${report.photo_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center space-x-2 bg-white border-2 border-primary/20 text-primary p-3 rounded-xl hover:bg-primary hover:text-white transition-all group shadow-sm"
                                          >
                                            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Verify Evidence</span>
                                          </a>
                                        </div>
                                      )}
                                      {report.status === 'Approved' && (
                                        <button 
                                          onClick={async () => {
                                            if (!confirm('Revoke approval? This will unverify the location and reset report status to Pending.')) return;
                                            try {
                                              const token = localStorage.getItem('token');
                                              const res = await fetch(`/api/reports/${report.id}/revoke`, { 
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${token}` }
                                              });
                                              if (res.ok) {
                                                alert('Approval revoked successfully.');
                                                fetchDashboardData();
                                                fetchPlaces();
                                              }
                                            } catch (e) {
                                              console.error(e);
                                            }
                                          }}
                                          className="w-full bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                        >
                                          Revoke Verified Status
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Verified Places Management</h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 uppercase tracking-widest">{places.length} PLACES</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Place Name</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</th>
                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified</th>
                        <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-10">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {places.map((place) => (
                        <tr key={place.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{place.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold uppercase text-gray-500">{place.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${place.score >= 4 ? 'bg-green-50 text-green-700 border-green-100' : place.score >= 2.5 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                              {place.score.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {place.is_verified ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right pr-6">
                            <button 
                              onClick={() => setEditingPlace({...place})}
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                            >
                              Edit Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {editingPlace && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingPlace(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
              >
                <form onSubmit={handleUpdatePlace}>
                  <div className="px-8 py-6 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 leading-none">Administrative Edit</h3>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mt-2">Adjusting compliance metrics for POI</p>
                    </div>
                    <button type="button" onClick={() => setEditingPlace(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-rose-500 transition-all shadow-sm">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2 ml-1 text-slate-400">Place Name</label>
                        <input 
                          type="text" 
                          value={editingPlace.name} 
                          onChange={e => setEditingPlace({...editingPlace, name: e.target.value})}
                          className="input-field font-bold bg-slate-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2 ml-1 text-slate-400">Compliance Score (Out of 5)</label>
                        <input 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          max="5"
                          value={editingPlace.score} 
                          onChange={e => setEditingPlace({...editingPlace, score: parseFloat(e.target.value)})}
                          className="input-field font-bold bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px bg-slate-100 flex-1" />
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Critical Features</h4>
                      <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { key: 'ramp', label: 'Ramp Access' },
                        { key: 'elevator', label: 'Elevator' },
                        { key: 'accessible_toilet', label: 'Toilet' },
                        { key: 'handrails', label: 'Handrails' },
                        { key: 'resting_area', label: 'Seating Area' },
                        { key: 'accessible_parking', label: 'Parking' },
                        { key: 'automatic_doors', label: 'Auto Doors' },
                        { key: 'wide_entrance', label: 'Wide Entrance' },
                        { key: 'emergency_alarm', label: 'Panic Alarm' },
                        { key: 'non_slip_floor', label: 'Non-slip' },
                        { key: 'lowered_counter', label: 'Counter' },
                        { key: 'visual_assistance', label: 'Braille/Visual' }
                      ].map((feat, i) => (
                        <label key={feat.key} className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all select-none cursor-pointer hover:shadow-md ${editingPlace[feat.key] ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100 shadow-none'}`}>
                          <input 
                            type="checkbox" 
                            checked={!!editingPlace[feat.key]}
                            onChange={e => setEditingPlace({...editingPlace, [feat.key]: e.target.checked})}
                            className="w-4 h-4 rounded text-accent focus:ring-accent"
                          />
                          <span className={`text-[10px] font-black tracking-tight uppercase ${editingPlace[feat.key] ? 'text-emerald-700' : 'text-slate-400'}`}>{feat.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100">
                      <label className={`flex items-center space-x-4 p-5 rounded-2xl border transition-all cursor-pointer ${editingPlace.is_verified ? 'bg-primary/5 border-primary/20 shadow-lg' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                        <div className={`p-4 rounded-xl ${editingPlace.is_verified ? 'bg-primary text-white' : 'bg-slate-300 text-white'}`}>
                          {editingPlace.is_verified ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="checkbox" 
                            checked={!!editingPlace.is_verified}
                            onChange={e => setEditingPlace({...editingPlace, is_verified: e.target.checked})}
                            className="hidden"
                          />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest block">Public Verification Status</span>
                          <span className="text-[10px] text-slate-500 font-bold">Show this location as a "Verified" POI on the public map</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-6">
                    <button 
                      type="button" 
                      onClick={() => setEditingPlace(null)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Discard Changes
                    </button>
                    <button 
                      type="submit"
                      className="btn-primary py-3.5 px-10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95"
                    >
                      Commit Database Updates
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard;
