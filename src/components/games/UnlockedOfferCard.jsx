export default function UnlockedOfferCard({ offer }) {
  return (
    <article className="card border-teal/20 bg-teal/5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-teal">Unlocked offer</p>
          <h3 className="text-subtitle mt-1">{offer.title}</h3>
          <p className="text-body text-muted">{offer.business} · {offer.type}</p>
        </div>
        {offer.couponCode && (
          <span className="rounded-lg border border-dashed border-teal bg-white px-3 py-1.5 font-mono text-small font-bold text-teal-dark">
            {offer.couponCode}
          </span>
        )}
      </div>
      {offer.discount && (
        <p className="text-body mt-2 font-bold text-teal-dark">{offer.discount}</p>
      )}
      {offer.description && (
        <p className="text-small mt-2 text-muted">{offer.description}</p>
      )}
      {offer.validUntil && <p className="text-caption mt-1 text-muted">Valid until {offer.validUntil}</p>}
      <p className="text-caption mt-2 text-muted">
        Won via {offer.gameType === "spin" ? "Spin wheel" : offer.gameType === "memory" ? "Memory match" : "Tap & win"}
        {offer.emailsSent ? " · Emailed to you & owner" : ""}
      </p>
    </article>
  );
}
