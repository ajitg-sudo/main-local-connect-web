"use client";

import Link from "next/link";

export default function CommunityCard({ community }) {
  return (
    <article>
      <Link
        href={`/community/${community.id}`}
        className="card flex h-full min-h-[12rem] flex-col transition hover:border-teal hover:shadow-lg focus-visible:outline-offset-4"
      >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-subtitle">{community.name}</h3>
        <span className="text-caption rounded-full bg-teal/10 px-2.5 py-1 font-semibold text-teal-dark">
          {community.members} members
        </span>
      </div>
      <p className="text-body text-muted">
        {community.city}
        {community.category ? ` · ${community.category}` : ""}
      </p>
      <p className="text-body mt-3 flex-1 leading-relaxed line-clamp-3">{community.description}</p>
      {community.admin && (
        <p className="text-caption mt-4 font-bold text-muted">Admin: {community.admin}</p>
      )}
      </Link>
    </article>
  );
}
