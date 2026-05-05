import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  MoreHorizontal,
  MoreVertical,
  MessageSquare,
  Trash2,
  User,
  Mail,
  ChevronDown,
  X,
  FileText,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  type Application,
  getAppCandidateName,
  getAppJobTitle,
  getAppCompanyName,
  getAppCandidateEmail,
} from "../data/mockApplications";
import { applicationsAPI } from "../services/api";
import { GlassCard, Badge } from "../components/ui/Shared";
import { useTranslation } from 'react-i18next';
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { useNotifications } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import { Avatar } from "../components/ui/Avatar";
import ApplicationDetailsModal from "../components/admin/ApplicationDetailsModal";

export default function AdminApplications() {
  const { t } = useTranslation();
  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'reviewing' | 'accepted' | 'rejected'>('all');
  const { addNotification } = useNotifications();

  useEffect(() => {
    async function fetchApps() {
      try {
        const fetched = await applicationsAPI.getAll();
        setApps(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApps();
  }, []);

  const filteredAndSortedApps = useMemo(() => {
    return apps
      .filter(
        (app) =>
          (activeTab === 'all' || app.status === activeTab) &&
          (getAppCandidateName(app).toLowerCase().includes(search.toLowerCase()) ||
          getAppJobTitle(app).toLowerCase().includes(search.toLowerCase()) ||
          getAppCompanyName(app).toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [apps, search, sortOrder, activeTab]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    newStatus: Application["status"],
  ) => {
    setProcessingId(id);
    try {
      await applicationsAPI.updateStatus(id, newStatus);
      const targetApp = apps.find(a => a.id === id);
      
      if (targetApp) {
        await addNotification({
          userId: targetApp.user_id,
          title: t('admin_applications.notifications.status_updated_title'),
          message: t('admin_applications.notifications.status_updated_message', { 
            jobTitle: getAppJobTitle(targetApp), 
            companyName: getAppCompanyName(targetApp),
            status: t(`admin_applications.status.${newStatus}`)
          }),
          type: "status_change",
          meta: { applicationId: id, status: newStatus },
        });

        setApps(prev => prev.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        ));
      }
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm(t('admin_applications.delete_confirm'))) {
      const updatedApps = apps.filter((app) => app.id !== id);
      setApps(updatedApps);
    }
  };

  const handleExportCSV = () => {
    if (apps.length === 0) return;

    const headers = [
      t('admin_applications.table.headers.candidate'),
      t('admin_applications.table.headers.email'),
      t('admin_applications.table.headers.job_title'),
      t('admin_applications.table.headers.company'),
      t('admin_applications.table.headers.status'),
      t('admin_applications.table.headers.applied_date')
    ];
    const rows = filteredAndSortedApps.map(app => [
      getAppCandidateName(app),
      getAppCandidateEmail(app),
      getAppJobTitle(app),
      getAppCompanyName(app),
      t(`admin_applications.status.${app.status}`),
      new Date(app.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('admin_applications.title')}</h1>
          <p className="text-slate-500">{t('admin_applications.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"> <Mail className="w-4 h-4" /> {t('admin_applications.mass_email')}</Button>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}> <Download className="w-4 h-4" /> {t('admin_applications.export_csv')}</Button>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
          {[
            { id: 'all', label: t('admin_applications.tabs.all') },
            { id: 'pending', label: t('admin_applications.tabs.pending') },
            { id: 'accepted', label: t('admin_applications.tabs.accepted') },
            { id: 'rejected', label: t('admin_applications.tabs.rejected') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('admin_applications.search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all w-64"
            />
          </div>
          <Button variant="outline" className="gap-2"> <Filter className="w-4 h-4" /> {t('admin_applications.filters')}</Button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden" hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/10">
                <th className="px-6 py-5">{t('admin_applications.table.candidate')}</th>
                <th className="px-6 py-5">{t('admin_applications.table.job_offer')}</th>
                <th className="px-6 py-5">{t('admin_applications.table.status')}</th>
                <th className="px-6 py-5 cursor-pointer hover:text-indigo-400 transition-colors group" onClick={toggleSort}>
                  <div className="flex items-center gap-2">
                    {t('admin_applications.table.applied_date')}
                    {sortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                  </div>
                </th>
                <th className="px-6 py-5 text-right">{t('admin_applications.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-indigo-500"><Loader2 className="w-10 h-10 animate-spin mx-auto" /></td></tr>
              ) : filteredAndSortedApps.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">{t('admin_applications.no_applications')}</td></tr>
              ) : (
                filteredAndSortedApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={getAppCandidateName(app)} size="sm" />
                        <div>
                          <Link to={`/profile/${app.user_id}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-500">{getAppCandidateName(app)}</Link>
                          <p className="text-[10px] text-slate-500">{getAppCandidateEmail(app)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{getAppJobTitle(app)}</p>
                      <p className="text-[10px] text-slate-500">{getAppCompanyName(app)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status === "accepted" ? "success" : app.status === "pending" ? "warning" : "info"}>{t(`admin_applications.status.${app.status}`)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative group ml-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={processingId === app.id}><MoreVertical className="w-4 h-4" /></Button>
                          <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block z-20">
                            <button onClick={() => setSelectedApp(app)} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                              <Eye className="w-4 h-4 text-indigo-400" /> {t('admin_applications.view')}
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                              <MessageSquare className="w-4 h-4 text-indigo-400" /> {t('admin_applications.message')}
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            <button onClick={() => handleDeleteApplication(app.id)} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm text-rose-500 transition-colors flex items-center gap-2 font-medium">
                              <Trash2 className="w-4 h-4" /> {t('admin_applications.delete_application')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="mt-12 p-8 glass rounded-3xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-primary text-slate-900 dark:text-white flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold">{t('admin_applications.mass_comm.title')}</h4>
            <p className="text-sm text-slate-500">
              {t('admin_applications.mass_comm.subtitle')}
            </p>
          </div>
        </div>
        <Button>{t('admin_applications.mass_comm.button')}</Button>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailsModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
