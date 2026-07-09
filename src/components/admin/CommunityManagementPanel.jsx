"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../services/api";
import { useToast } from "../../context/toastContext";
import CreateCommunityForm from "./CreateCommunityForm";
import SegmentedTabs from "../common/SegmentedTabs";

const SUB_TABS = [
  { key: "communities", label: "Communities" },
  { key: "communityMembers", label: "Join requests" },
  { key: "communityPosts", label: "Post moderation" }
];

function rowSummary(row, tab) {
  if (tab === "communities") return `${row.name} · ${row.city} · ${row.category || "General"}`;
  if (tab === "communityMembers") return `${row.business || row.owner} · ${row.community}`;
  return `${row.author} · ${row.community}`;
}

export default function CommunityManagementPanel({ onUpdated }) {
  const { success, error: toastError } = useToast();
  const [data, setData] = useState(null);
  const [subTab, setSubTab] = useState("communities");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await api.adminDashboard();
      setData(res);
    } catch (err) {
      toastError(err.message);
    }
  }, [toastError]);

  useEffect(() => {
    load();
  }, [load]);

  const patchRow = async (table, id, body, successMsg) => {
    setBusyId(id);
    try {
      await api.adminPatch(table, id, body);
      success(successMsg || "Updated successfully.");
      await load();
      await onUpdated?.();
    } catch (err) {
      toastError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const deleteRow = async (table, id, label) => {
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      await api.adminDelete(table, id);
      success("Deleted successfully.");
      await load();
      await onUpdated?.();
    } catch (err) {
      toastError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (!data) {
    return <div className="text-body py-8 text-center text-muted">Loading community data...</div>;
  }

  const rows = (data[subTab] || []).filter((row) => {
    if (subTab === "communityMembers") return row.status !== "Approved";
    if (subTab === "communityPosts") return row.status !== "Published";
    return true;
  });

  const pendingMembers = data.communityMembers?.filter((m) => m.status === "Pending").length || 0;
  const reviewPosts = data.communityPosts?.filter((p) => p.status === "Review").length || 0;

  const renderActions = (row) => {
    const disabled = busyId === row.id;

    if (subTab === "communities") {
      return (
        <>
          {row.status === "Active" ? (
            <button
              type="button"
              className="btn-ghost btn-inline text-xs"
              disabled={disabled}
              onClick={() => patchRow("communities", row.id, { status: "Paused" }, "Community paused.")}
            >
              Pause
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary btn-inline text-xs"
              disabled={disabled}
              onClick={() => patchRow("communities", row.id, { status: "Active" }, "Community activated.")}
            >
              Activate
            </button>
          )}
          <Link href={`/community/${row.id}`} className="btn-ghost btn-inline text-xs" target="_blank" rel="noreferrer">
            View
          </Link>
          <button
            type="button"
            className="btn-ghost btn-inline text-xs text-rose"
            disabled={disabled}
            onClick={() => deleteRow("communities", row.id, "community")}
          >
            Delete
          </button>
        </>
      );
    }

    if (subTab === "communityMembers") {
      if (row.status === "Pending") {
        return (
          <>
            <button
              type="button"
              className="btn-primary btn-inline text-xs"
              disabled={disabled}
              onClick={() => patchRow("communityMembers", row.id, { status: "Approved" }, "Member approved.")}
            >
              Approve
            </button>
            <button
              type="button"
              className="btn-ghost btn-inline text-xs"
              disabled={disabled}
              onClick={() => patchRow("communityMembers", row.id, { status: "Rejected" }, "Join request rejected.")}
            >
              Reject
            </button>
          </>
        );
      }
      return (
        <button
          type="button"
          className="btn-ghost btn-inline text-xs text-rose"
          disabled={disabled}
          onClick={() => deleteRow("communityMembers", row.id, "member record")}
        >
          Remove
        </button>
      );
    }

    if (subTab === "communityPosts") {
      if (row.status === "Review") {
        return (
          <>
            <button
              type="button"
              className="btn-primary btn-inline text-xs"
              disabled={disabled}
              onClick={() => patchRow("communityPosts", row.id, { status: "Published" }, "Post published.")}
            >
              Publish
            </button>
            <button
              type="button"
              className="btn-ghost btn-inline text-xs"
              disabled={disabled}
              onClick={() => patchRow("communityPosts", row.id, { status: "Rejected" }, "Post rejected.")}
            >
              Reject
            </button>
          </>
        );
      }
      return (
        <button
          type="button"
          className="btn-ghost btn-inline text-xs text-rose"
          disabled={disabled}
          onClick={() => deleteRow("communityPosts", row.id, "post")}
        >
          Delete
        </button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <CreateCommunityForm onCreated={() => { load(); onUpdated?.(); }} />

      <div className="grid grid-cols-3 gap-3">
        <div className="card">
          <p className="text-caption text-muted">Communities</p>
          <p className="text-stat">{data.communities?.length || 0}</p>
        </div>
        <div className="card">
          <p className="text-caption text-muted">Pending joins</p>
          <p className="text-stat">{pendingMembers}</p>
        </div>
        <div className="card">
          <p className="text-caption text-muted">Posts in review</p>
          <p className="text-stat">{reviewPosts}</p>
        </div>
      </div>

      <SegmentedTabs
        items={SUB_TABS.map((t) => ({
          ...t,
          badge: t.key === "communityMembers" ? pendingMembers : t.key === "communityPosts" ? reviewPosts : 0
        }))}
        value={subTab}
        onChange={setSubTab}
      />

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="card">
            <p className="text-caption font-mono text-muted">{row.id}</p>
            <p className="text-body mt-1 font-bold">{rowSummary(row, subTab)}</p>
            {subTab === "communityMembers" && (
              <p className="text-small mt-1 text-muted">{row.owner} · {row.phone} · {row.city}</p>
            )}
            {subTab === "communityPosts" && (
              <p className="text-body mt-2 line-clamp-3">{row.message}</p>
            )}
            {subTab === "communities" && (
              <p className="text-small mt-1 text-muted">{row.members} members · {row.status}</p>
            )}
            <p className="text-small mt-1 text-muted">Status: {row.status}</p>
            <div className="mt-3 flex flex-wrap gap-2">{renderActions(row)}</div>
          </div>
        ))}
        {!rows.length && <p className="text-body text-muted">No records in this section.</p>}
      </div>

      <div className="card hidden md:block">
        <div className="table-scroll">
          <table className="min-w-[720px] w-full text-left">
            <thead>
              <tr className="text-label border-b border-line">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Summary</th>
                {subTab === "communities" && <th className="px-3 py-2">Members</th>}
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="text-body border-b border-line/70">
                  <td className="px-3 py-3 font-mono text-caption">{row.id}</td>
                  <td className="max-w-md px-3 py-3">
                    <p>{rowSummary(row, subTab)}</p>
                    {subTab === "communityPosts" && (
                      <p className="text-small mt-1 text-muted line-clamp-2">{row.message}</p>
                    )}
                    {subTab === "communityMembers" && (
                      <p className="text-small mt-1 text-muted">{row.owner} · {row.phone}</p>
                    )}
                  </td>
                  {subTab === "communities" && <td className="px-3 py-3">{row.members}</td>}
                  <td className="px-3 py-3">{row.status}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">{renderActions(row)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <p className="text-body px-3 py-4 text-muted">No records in this section.</p>}
      </div>
    </div>
  );
}
