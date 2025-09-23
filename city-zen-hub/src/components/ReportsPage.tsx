"use client";

import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseclient.js";
import { motion, AnimatePresence } from "framer-motion";
import { log } from "console";

export default function ReportsPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        console.log("ll");
        
        const cleanedData = data.map((item) => ({
          ...item,
          status: item.status?.trim(), // trim whitespace for badges
        }));
        setIssues(cleanedData);
      }
      setLoading(false);
    };

    fetchMessages();

    // Optional: real-time updates
  
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading issues...</p>;

  return (
    <div className="p-4">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Text</th>
            <th className="p-2 border">Audio</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {issues.map((issue) => (
              <motion.tr
                key={issue.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="p-2 border">
                  {issue.image_url ? (
                    <img
                      src={issue.image_url}
                      alt="issue"
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-2 border">{issue.text || "N/A"}</td>
                <td className="p-2 border">
                  {issue.audio_url ? (
                    <audio controls src={issue.audio_url}></audio>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-2 border">{issue.category || "N/A"}</td>
                <td className="p-2 border">{issue.address || "N/A"}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      issue.status === "Resolved"
                        ? "bg-green-500"
                        : issue.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
