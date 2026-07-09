"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import { useBreadcrumbLabels } from "../../context/breadcrumbContext";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { communityInterlinks } from "../../utils/interlinks";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [joinForm, setJoinForm] = useState({ business: "", owner: "", phone: "", city: "" });
  const [postForm, setPostForm] = useState({ author: "", business: "", message: "" });
  const [joining, setJoining] = useState(false);
  const [posting, setPosting] = useState(false);

  useBreadcrumbLabels(
    data?.community
      ? {
          [`community:${id}`]: data.community.name,
          communityName: data.community.name
        }
      : {}
  );

  const load = () =>
    api.communityById(id)
      .then(setData)
      .catch((err) => {
        setError(err.message);
        toastError(err.message);
      });

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (user) {
      setJoinForm((p) => ({
        ...p,
        owner: user.name || p.owner,
        phone: user.phone || p.phone,
        city: user.city || p.city
      }));
      setPostForm((p) => ({
        ...p,
        author: user.name || p.author
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user?.role || user.role !== "business_owner") return;
    api.ownerWorkspace()
      .then((ws) => {
        const primary = ws.businesses?.[0]?.name;
        if (primary) {
          setJoinForm((p) => ({ ...p, business: p.business || primary }));
          setPostForm((p) => ({ ...p, business: p.business || primary }));
        }
      })
      .catch(() => {});
  }, [user]);

  const submitJoin = async (e) => {
    e.preventDefault();
    setJoining(true);
    try {
      await api.joinCommunity({
        communityId: id,
        community: data.community.name,
        ...joinForm
      });
      success("Join request submitted. An admin will review it shortly.");
      await load();
    } catch (err) {
      toastError(err.message);
    } finally {
      setJoining(false);
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.createPost({
        communityId: id,
        community: data.community.name,
        phone: joinForm.phone || user?.phone,
        ...postForm
      });
      success("Post submitted for review. It will appear after admin approval.");
      setPostForm((p) => ({ ...p, message: "" }));
      await load();
    } catch (err) {
      toastError(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (error) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-body text-rose">{error}</p>
        <Link href="/communities" className="btn-primary btn-inline mt-4">Back to communities</Link>
      </div>
    );
  }

  if (!data) {
    return <div className="text-body flex min-h-[50vh] items-center justify-center px-4 text-muted">Loading...</div>;
  }

  const { community, members, posts, membership } = data;
  const isApproved = membership?.status === "Approved";
  const isPending = membership?.status === "Pending";
  const isRejected = membership?.status === "Rejected";
  const canPost = isApproved && (joinForm.phone || user?.phone);

  return (
    <section className="page-section">
      <div className="card">
        <p className="eyebrow">{community.city}{community.category ? ` · ${community.category}` : ""}</p>
        <h1 className="heading-page mt-2">{community.name}</h1>
        <p className="text-lead mt-3 text-muted">{community.description}</p>
        <p className="text-body mt-2 font-bold text-teal">
          Admin: {community.admin || "Platform team"} · {community.members} members
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="card space-y-3">
          <h2 className="text-subtitle">Join this community</h2>
          {isApproved ? (
            <p className="text-body text-teal-dark font-bold">
              You are an approved member. You can post discussions below.
            </p>
          ) : isPending ? (
            <p className="text-body text-muted">
              Your join request is pending admin review. You will be able to post once approved.
            </p>
          ) : isRejected ? (
            <p className="text-body text-rose">
              Your previous join request was rejected. Update details and submit again, or contact the community admin.
            </p>
          ) : (
            <>
              {!user && (
                <p className="text-small text-muted">
                  <Link href="/login" className="font-bold text-teal">Sign in</Link> to prefill your profile details.
                </p>
              )}
              <form onSubmit={submitJoin} className="space-y-3">
                <FormField label="Business name">
                  <input
                    className="input-field"
                    value={joinForm.business}
                    onChange={(e) => setJoinForm((p) => ({ ...p, business: e.target.value }))}
                    placeholder="Your shop or service name"
                  />
                </FormField>
                <FormField label="Owner name" required>
                  <input
                    className="input-field"
                    required
                    value={joinForm.owner}
                    onChange={(e) => setJoinForm((p) => ({ ...p, owner: e.target.value }))}
                  />
                </FormField>
                <FormField label="Phone" required>
                  <input
                    className="input-field"
                    required
                    type="tel"
                    value={joinForm.phone}
                    onChange={(e) => setJoinForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </FormField>
                <FormField label="City" required>
                  <input
                    className="input-field"
                    required
                    value={joinForm.city}
                    onChange={(e) => setJoinForm((p) => ({ ...p, city: e.target.value }))}
                  />
                </FormField>
                <button className="btn-primary" disabled={joining}>
                  {joining ? "Submitting..." : "Request to join"}
                </button>
              </form>
            </>
          )}
        </div>

        <form onSubmit={submitPost} className="card space-y-3">
          <h2 className="text-subtitle">Start a discussion</h2>
          {!canPost ? (
            <p className="text-body text-muted">
              {isPending
                ? "Waiting for membership approval before you can post."
                : "Join and get approved as a member to start discussions. Posts are reviewed before publishing."}
            </p>
          ) : (
            <>
              <FormField label="Your name" required>
                <input
                  className="input-field"
                  required
                  value={postForm.author}
                  onChange={(e) => setPostForm((p) => ({ ...p, author: e.target.value }))}
                />
              </FormField>
              <FormField label="Business (optional)">
                <input
                  className="input-field"
                  value={postForm.business}
                  onChange={(e) => setPostForm((p) => ({ ...p, business: e.target.value }))}
                />
              </FormField>
              <FormField label="Message" required>
                <textarea
                  className="input-field min-h-[120px]"
                  required
                  minLength={10}
                  placeholder="Share a tip, ask a question, or post a referral..."
                  value={postForm.message}
                  onChange={(e) => setPostForm((p) => ({ ...p, message: e.target.value }))}
                />
              </FormField>
              <button className="btn-primary" disabled={posting}>
                {posting ? "Posting..." : "Post discussion"}
              </button>
            </>
          )}
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-subtitle">Members ({members.length})</h2>
          <div className="mt-4 space-y-3">
            {members.map((m) => (
              <div key={m.id} className="card py-3">
                <p className="text-body font-bold">{m.business || m.owner}</p>
                <p className="text-small text-muted">
                  {m.business ? `${m.owner} · ` : ""}{m.role}
                  {m.joined ? ` · joined ${m.joined}` : ""}
                </p>
              </div>
            ))}
            {!members.length && <p className="text-body text-muted">No approved members yet.</p>}
          </div>
        </div>
        <div>
          <h2 className="text-subtitle">Discussions ({posts.length})</h2>
          <div className="mt-4 space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="card py-3">
                <p className="text-body font-bold">
                  {p.author}{p.business ? ` · ${p.business}` : ""}
                </p>
                <p className="text-body mt-2 whitespace-pre-wrap">{p.message}</p>
                <p className="text-caption mt-2 text-muted">{p.time}</p>
              </div>
            ))}
            {!posts.length && <p className="text-body text-muted">No published discussions yet.</p>}
          </div>
        </div>
      </div>
      <PageInterlinks links={communityInterlinks()} className="mt-8" />
    </section>
  );
}
