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
  getAppCandidatePhone,
  getAppCandidateLocation,
} from "../data/mockApplications";
import { applicationsAPI, storageAPI } from "../services/api";
import { GlassCard, Badge, Input } from "../components/ui/Shared";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { useNotifications } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "../components/ui/Avatar";
import ApplicationDetailsModal from "../components/admin/ApplicationDetailsModal";

// Replaced by shared component

export default function AdminApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
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
          getAppCandidateName(app)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          getAppJobTitle(app).toLowerCase().includes(search.toLowerCase()) ||
          getAppCompanyName(app).toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [apps, search, sortOrder]);

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
      // 1. Update the backend
      await applicationsAPI.updateStatus(id, newStatus);
      
      // 2. Find the application to get the candidate ID
      const targetApp = apps.find(a => a.id === id);
      
      if (targetApp) {
        // 3. Notify the candidate (targetApp.user_id is the applicant)
        await addNotification({
          userId: targetApp.user_id,
          title: "Application Status Updated",
          message: `Your application for ${getAppJobTitle(targetApp)} at ${getAppCompanyName(targetApp)} has been updated to ${newStatus.toUpperCase()}.`,
          type: "status_change",
          meta: { applicationId: id, status: newStatus },
        });

        // 4. Update local state
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
    if (window.confirm("Are you sure you want to delete this application?")) {
      const updatedApps = apps.filter((app) => app.id !== id);
      setApps(updatedApps);
      // Optional: actually delete from API applicationsAPI.delete(id)
    }
  };

  const handleExportCSV = () => {
    const appsToExport = filteredAndSortedApps;
    if (appsToExport.length === 0) return;

    const headers = [
      "Candidate Name",
      "Job Title",
      "Company",
      "Status",
      "Applied Date",
    ];
    const rows = appsToExport.map((app) => [
      getAppCandidateName(app),
      getAppJobTitle(app),
      getAppCompanyName(app),
      app.status,
      new Date(app.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `applications_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">All Applications</h1>
          <p className="text-slate-500">
            Review candidate submissions and manage their progress.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            {" "}
            <Download className="w-4 h-4" /> Export All
          </Button>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by candidate name or job title..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          {" "}
          <Filter className="w-4 h-4" /> Filter Status
        </Button>
      </div>

      <GlassCard className="p-0 overflow-hidden" hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Job Offer</th>
                <th className="px-6 py-4">Status</th>
                <th
                  className="px-6 py-4 cursor-pointer hover:text-indigo-400 transition-colors group"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2">
                    Applied Date
                    {sortOrder === "asc" ? (
                      <ArrowUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-indigo-500"
                  >
                    <Loader2 className="w-10 h-10 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredAndSortedApps.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500 italic"
                  >
                    No applications found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                          <Avatar name={getAppCandidateName(app)} size="sm" />
                        </div>
                        <div>
                          <Link 
                            to={`/profile/${app.user_id}`}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-500 transition-colors"
                          >
                            {getAppCandidateName(app)}
                          </Link>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {getAppCandidateEmail(app)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold truncate max-w-[200px]">
                          {getAppJobTitle(app)}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {getAppCompanyName(app)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          app.status === "accepted"
                            ? "success"
                            : app.status === "pending"
                              ? "warning"
                              : "info"
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1.5 font-bold h-8 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                        <Button
                          disabled={
                            app.status === "accepted" || processingId === app.id
                          }
                          onClick={() => handleStatusChange(app.id, "accepted")}
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1.5 font-bold h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                          isLoading={processingId === app.id}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </Button>
                        <Button
                          disabled={
                            app.status === "rejected" || processingId === app.id
                          }
                          onClick={() => handleStatusChange(app.id, "rejected")}
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1.5 font-bold h-8 border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                          isLoading={processingId === app.id}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                        <div className="relative group ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={processingId === app.id}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                          <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block z-20">
                            <button
                              onClick={() =>
                                handleStatusChange(app.id, "reviewing")
                              }
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                            >
                              Mark as Reviewing
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app.id, "pending")
                              }
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                            >
                              Reset to Pending
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm text-rose-500 transition-colors"
                            >
                              Delete Application
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
            <h4 className="font-bold">Mass Communication</h4>
            <p className="text-sm text-slate-500">
              Send personalized emails to multiple candidates simultaneously.
            </p>
          </div>
        </div>
        <Button>Open Bulk Emailer</Button>
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
