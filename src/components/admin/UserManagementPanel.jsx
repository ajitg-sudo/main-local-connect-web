import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import FormField from "../common/FormField";
import { formatAdminRole } from "../../utils/adminNav";

const ROLES = [
  { value: "business_owner", label: "Business owner" },
  { value: "city_admin", label: "City admin" },
  { value: "super_admin", label: "Super admin" }
];

const STATUSES = ["Active", "Suspended", "Inactive", "Pending KYC"];

const ROLE_CLASS = {
  business_owner: "user-role-owner",
  city_admin: "user-role-city",
  super_admin: "user-role-super"
};

const STATUS_CLASS = {
  Active: "user-status-active",
  Suspended: "user-status-suspended",
  Inactive: "user-status-inactive",
  "Pending KYC": "user-status-pending"
};

const EMPTY_CREATE = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "business_owner",
  city: "",
  status: "Active"
};

function userInitials(name) {
  return (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RoleBadge({ role }) {
  return (
    <span className={`user-role-badge ${ROLE_CLASS[role] || "user-role-owner"}`}>
      {formatAdminRole(role)}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`user-status-badge ${STATUS_CLASS[status] || "user-status-inactive"}`}>
      {status}
    </span>
  );
}

function UserAvatar({ name }) {
  return <span className="admin-user-avatar" aria-hidden="true">{userInitials(name)}</span>;
}

function UsersIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function StatCard({ label, value, accent, highlight }) {
  return (
    <div className="admin-user-stat">
      <span className={`admin-user-stat-accent ${accent}`} aria-hidden="true" />
      <p className="text-caption text-muted">{label}</p>
      <p className={`text-stat mt-1 ${highlight || ""}`}>{value}</p>
    </div>
  );
}

function UserActions({
  row,
  editingId,
  editForm,
  setEditForm,
  resetPwdId,
  setResetPwdId,
  newPassword,
  setNewPassword,
  currentUser,
  isSuperAdmin,
  roleOptions,
  onSave,
  onCancelEdit,
  onStartEdit,
  onQuickStatus,
  onResetPassword,
  onDelete
}) {
  const isEditing = editingId === row.id;

  if (isEditing) {
    return (
      <div className="flex flex-wrap gap-1">
        <button type="button" className="admin-action-btn admin-action-btn-primary" onClick={() => onSave(row.id)}>
          Save
        </button>
        <button type="button" className="admin-action-btn admin-action-btn-ghost" onClick={onCancelEdit}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-1">
        <button type="button" className="admin-action-btn admin-action-btn-edit" onClick={() => onStartEdit(row)}>
          Edit
        </button>
        {row.status === "Active" ? (
          <button type="button" className="admin-action-btn admin-action-btn-ghost" onClick={() => onQuickStatus(row.id, "Suspended")}>
            Suspend
          </button>
        ) : (
          <button type="button" className="admin-action-btn admin-action-btn-primary" onClick={() => onQuickStatus(row.id, "Active")}>
            Activate
          </button>
        )}
        <button
          type="button"
          className="admin-action-btn admin-action-btn-ghost"
          onClick={() => {
            onCancelEdit?.();
            setResetPwdId(resetPwdId === row.id ? null : row.id);
            setNewPassword("");
          }}
        >
          Reset pwd
        </button>
        {row.id !== currentUser?.id && (
          <button
            type="button"
            className="admin-action-btn admin-action-btn-danger"
            onClick={() => onDelete(row.id, row.name)}
          >
            Delete
          </button>
        )}
      </div>
      {resetPwdId === row.id && (
        <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-line bg-paper p-2">
          <input
            className="input-field min-w-[140px] flex-1"
            type="password"
            placeholder="New password"
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="button" className="admin-action-btn admin-action-btn-primary" onClick={() => onResetPassword(row.id)}>
            Set password
          </button>
        </div>
      )}
    </>
  );
}

function UserMobileCard(props) {
  const { row, editingId, editForm, setEditForm, isSuperAdmin, roleOptions } = props;
  const isEditing = editingId === row.id;

  return (
    <article className="admin-user-mobile-card">
      <div className="flex items-start gap-3">
        <UserAvatar name={isEditing ? editForm.name : row.name} />
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              className="input-field"
              value={editForm.name}
              onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
            />
          ) : (
            <p className="text-body truncate font-bold">{row.name}</p>
          )}
          <p className="text-caption mt-0.5 font-mono text-muted">{row.id}</p>
        </div>
        {!isEditing && <StatusBadge status={row.status} />}
      </div>

      <div className="grid gap-2 text-small">
        {isEditing ? (
          <>
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
            />
            <input
              className="input-field"
              type="tel"
              placeholder="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
            />
            <select
              className="input-field"
              value={editForm.role}
              onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
              disabled={!isSuperAdmin && row.role !== "business_owner"}
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <input
              className="input-field"
              placeholder="City"
              value={editForm.city}
              onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
            />
            <select
              className="input-field"
              value={editForm.status}
              onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        ) : (
          <>
            <p className="text-muted">{row.email || row.phone || "No contact info"}</p>
            <div className="flex flex-wrap items-center gap-2">
              <RoleBadge role={row.role} />
              {row.city && <span className="text-caption text-muted">{row.city}</span>}
              <span className="admin-user-listings-pill">{row.listings ?? 0} listings</span>
            </div>
          </>
        )}
      </div>

      <UserActions {...props} />
    </article>
  );
}

export default function UserManagementPanel({ onUpdated }) {
  const { user: currentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", role: "", status: "" });
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [resetPwdId, setResetPwdId] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const isSuperAdmin = currentUser?.role === "super_admin";
  const roleOptions = isSuperAdmin ? ROLES : ROLES.filter((r) => r.value === "business_owner");

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    suspended: users.filter((u) => u.status === "Suspended").length,
    pendingKyc: users.filter((u) => u.status === "Pending KYC").length,
    admins: users.filter((u) => u.role === "city_admin" || u.role === "super_admin").length
  }), [users]);

  const activeFilterCount = [filters.q, filters.role, filters.status].filter(Boolean).length;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listUsers(filters);
      setUsers(res.users || []);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, toastError]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createUser(createForm);
      setCreateForm(EMPTY_CREATE);
      setShowCreate(false);
      success("User created successfully.");
      await load();
      await onUpdated?.();
    } catch (err) {
      toastError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditForm({
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      city: row.city || "",
      role: row.role,
      status: row.status
    });
    setResetPwdId(null);
  };

  const saveEdit = async (id) => {
    try {
      await api.updateUser(id, editForm);
      setEditingId(null);
      success("User updated.");
      await load();
      await onUpdated?.();
    } catch (err) {
      toastError(err.message);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" (${id})? This cannot be undone.`)) return;
    try {
      await api.deleteUser(id);
      success("User deleted.");
      await load();
      await onUpdated?.();
    } catch (err) {
      toastError(err.message);
    }
  };

  const resetPassword = async (id) => {
    if (!newPassword || newPassword.length < 6) {
      toastError("Password must be at least 6 characters.");
      return;
    }
    try {
      await api.resetUserPassword(id, newPassword);
      setResetPwdId(null);
      setNewPassword("");
      success("Password reset successfully.");
    } catch (err) {
      toastError(err.message);
    }
  };

  const quickStatus = async (id, status) => {
    try {
      await api.updateUser(id, { status });
      success(`User marked as ${status}.`);
      await load();
      await onUpdated?.();
    } catch (err) {
      toastError(err.message);
    }
  };

  const clearFilters = () => setFilters({ q: "", role: "", status: "" });

  const actionProps = {
    editingId,
    editForm,
    setEditForm,
    resetPwdId,
    setResetPwdId,
    newPassword,
    setNewPassword,
    currentUser,
    isSuperAdmin,
    roleOptions,
    onSave: saveEdit,
    onCancelEdit: () => setEditingId(null),
    onStartEdit: startEdit,
    onQuickStatus: quickStatus,
    onResetPassword: resetPassword,
    onDelete: deleteUser
  };

  return (
    <div className="space-y-6">
      <div className="admin-user-stats">
        <StatCard label="Total users" value={stats.total} accent="bg-teal" />
        <StatCard label="Active" value={stats.active} accent="bg-emerald-500" highlight="text-teal" />
        <StatCard label="Suspended" value={stats.suspended} accent="bg-rose" highlight={stats.suspended > 0 ? "text-rose" : ""} />
        <StatCard label="Pending KYC" value={stats.pendingKyc} accent="bg-saffron" highlight={stats.pendingKyc > 0 ? "text-amber-600" : ""} />
        <StatCard label="Admins" value={stats.admins} accent="bg-sky-500" />
      </div>

      <div className="admin-create-panel">
        <button
          type="button"
          className="admin-create-panel-header w-full text-left"
          onClick={() => setShowCreate((v) => !v)}
          aria-expanded={showCreate}
        >
          <div className="flex items-center gap-3">
            <span className="admin-create-panel-icon">
              <UsersIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-subtitle">Create user</h2>
              <p className="text-small mt-0.5 text-muted">
                Add business owners, city admins, or super admins
              </p>
            </div>
          </div>
          <ChevronIcon open={showCreate} />
        </button>

        {showCreate && (
          <form onSubmit={handleCreate} className="admin-create-panel-body">
            <FormField label="Full name" required>
              <input
                className="input-field"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
              />
            </FormField>
            <FormField label="Email">
              <input
                className="input-field"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
              />
            </FormField>
            <FormField label="Phone">
              <input
                className="input-field"
                type="tel"
                value={createForm.phone}
                onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </FormField>
            <FormField label="Password" required hint="Min 6 characters">
              <input
                className="input-field"
                type="password"
                required
                minLength={6}
                value={createForm.password}
                onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
              />
            </FormField>
            <FormField label="Role">
              <select
                className="input-field"
                value={createForm.role}
                onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
              >
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="City">
              <input
                className="input-field"
                value={createForm.city}
                onChange={(e) => setCreateForm((p) => ({ ...p, city: e.target.value }))}
              />
            </FormField>
            <FormField label="Status">
              <select
                className="input-field"
                value={createForm.status}
                onChange={(e) => setCreateForm((p) => ({ ...p, status: e.target.value }))}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
            <div className="flex flex-wrap gap-2 lg:col-span-2">
              <button type="submit" className="btn-primary btn-inline" disabled={creating}>
                {creating ? "Creating..." : "Create user"}
              </button>
              <button type="button" className="btn-ghost btn-inline" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="admin-data-table-wrap">
        <div className="admin-data-table-header">
          <div className="filter-toolbar-top">
            <div>
              <h2 className="text-subtitle">All users</h2>
              <p className="text-small mt-0.5 text-muted">
                {loading ? "Loading..." : `${users.length} user${users.length === 1 ? "" : "s"} found`}
              </p>
            </div>
          </div>

          <div className="filter-toolbar-top mt-4">
            <div className="filter-search-wrap">
              <svg className="filter-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                className="filter-search-input"
                type="search"
                placeholder="Search name, email, phone, ID..."
                value={filters.q}
                onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
              />
            </div>
            <div className="filter-toolbar-actions">
              <label className="filter-select-wrap">
                <span className="sr-only">Role</span>
                <select
                  className="filter-select"
                  value={filters.role}
                  onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="">All roles</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </label>
              <label className="filter-select-wrap">
                <span className="sr-only">Status</span>
                <select
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              {activeFilterCount > 0 && (
                <button type="button" className="filter-panel-reset" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="active-filter-pills mt-4 border-t-0 pt-0">
              {filters.q && (
                <span className="active-filter-pill">
                  Search: {filters.q}
                  <button type="button" aria-label="Remove search filter" onClick={() => setFilters((p) => ({ ...p, q: "" }))}>×</button>
                </span>
              )}
              {filters.role && (
                <span className="active-filter-pill">
                  Role: {ROLES.find((r) => r.value === filters.role)?.label}
                  <button type="button" aria-label="Remove role filter" onClick={() => setFilters((p) => ({ ...p, role: "" }))}>×</button>
                </span>
              )}
              {filters.status && (
                <span className="active-filter-pill">
                  Status: {filters.status}
                  <button type="button" aria-label="Remove status filter" onClick={() => setFilters((p) => ({ ...p, status: "" }))}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-line/50" />
            ))}
          </div>
        ) : !users.length ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <UsersIcon className="h-7 w-7" />
            </div>
            <p className="text-subtitle">No users found</p>
            <p className="text-body mt-1 max-w-sm text-muted">
              {activeFilterCount > 0
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Create your first user using the form above."}
            </p>
            {activeFilterCount > 0 && (
              <button type="button" className="btn-ghost btn-inline mt-4" onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 md:hidden">
              {users.map((row) => (
                <UserMobileCard key={row.id} row={row} {...actionProps} />
              ))}
            </div>

            <div className="table-scroll hidden md:block">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Listings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <UserAvatar name={editingId === row.id ? editForm.name : row.name} />
                          <div className="min-w-0">
                            {editingId === row.id ? (
                              <input
                                className="input-field"
                                value={editForm.name}
                                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                              />
                            ) : (
                              <p className="text-body font-bold">{row.name}</p>
                            )}
                            <p className="text-caption mt-0.5 font-mono text-muted">{row.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-small">
                        {editingId === row.id ? (
                          <div className="space-y-2">
                            <input
                              className="input-field"
                              type="email"
                              placeholder="Email"
                              value={editForm.email}
                              onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                            />
                            <input
                              className="input-field"
                              type="tel"
                              placeholder="Phone"
                              value={editForm.phone}
                              onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                            />
                          </div>
                        ) : (
                          <>
                            <div>{row.email || "—"}</div>
                            <div className="text-muted">{row.phone || "—"}</div>
                          </>
                        )}
                      </td>
                      <td>
                        {editingId === row.id ? (
                          <select
                            className="input-field"
                            value={editForm.role}
                            onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                            disabled={!isSuperAdmin && row.role !== "business_owner"}
                          >
                            {roleOptions.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        ) : (
                          <RoleBadge role={row.role} />
                        )}
                      </td>
                      <td>
                        {editingId === row.id ? (
                          <input
                            className="input-field"
                            value={editForm.city}
                            onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                          />
                        ) : (
                          row.city || <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {editingId === row.id ? (
                          <select
                            className="input-field"
                            value={editForm.status}
                            onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={row.status} />
                        )}
                      </td>
                      <td>
                        <span className="admin-user-listings-pill">{row.listings ?? 0}</span>
                      </td>
                      <td>
                        <UserActions row={row} {...actionProps} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
