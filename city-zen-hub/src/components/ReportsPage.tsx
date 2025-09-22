"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../services/supabaseclient";

interface Issue {
  id: string;
  text: string | null;
  image_url: string | null;
  audio_url: string | null;
  created_at: string;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  user_id: string;
  status: string | null;
}

export default function AdminReportsPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reports
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from<Issue>("messages") // ✅ correct table
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching issues:", error);
      } else {
        setIssues(data || []);
      }
      setLoading(false);
    };

    fetchIssues();

    // 👀 Subscribe to realtime changes on messages
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" }, // ✅ fixed to messages
        () => {
          fetchIssues();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "In Progress":
        return "bg-blue-100 text-blue-600";
      case "Resolved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📋 All User Reports</h1>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : issues.length === 0 ? (
        <p className="text-gray-500">No reports found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {issues.map((issue) => (
              <motion.div
                key={issue.id}
                className="bg-white shadow rounded-xl p-4 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Top row */}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{issue.category || "Uncategorized"}</span>
                  <span>{new Date(issue.created_at).toLocaleString()}</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status || "Pending"}
                  </span>
                </div>

                {/* Image */}
                {issue.image_url ? (
                  <img
                    src={issue.image_url}
                    alt="Report"
                    className="w-full h-40 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center border border-gray-200 rounded-md text-gray-400">
                    No image
                  </div>
                )}

                {/* Text */}
                {issue.text && (
                  <p className="text-sm text-gray-700">{issue.text}</p>
                )}

                {/* Location */}
                <div className="border-t pt-2 text-sm text-gray-600">
                  📍{" "}
                  {issue.address ||
                    (issue.latitude && issue.longitude
                      ? `${issue.latitude}, ${issue.longitude}`
                      : "No location")}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
