"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import { useBreadcrumbLabels } from "../../context/breadcrumbContext";
import PageInterlinks from "../../components/layout/PageInterlinks";
import { setRedirectPath } from "../../utils/navigation";
import { businessInterlinks } from "../../utils/interlinks";
import PageBanner from "../../components/layout/PageBanner";
import BusinessAvatar from "../../components/business/BusinessAvatar";
import SpinWheelGame from "../../components/games/SpinWheelGame";
import MemoryMatchGame from "../../components/games/MemoryMatchGame";
import TapWinGame from "../../components/games/TapWinGame";
import UnlockedOfferCard from "../../components/games/UnlockedOfferCard";

const GAME_META = {
  spin: { title: "Spin the wheel", desc: "Spin to unlock a percent-off coupon for this shop." },
  memory: { title: "Memory match", desc: "Match cards to reveal your discount code." },
  tap: { title: "Tap & win", desc: "Tap 12 targets in 10 seconds to win your coupon." }
};

function playReturnPath(slug) {
  return `/play-offers?business=${encodeURIComponent(slug)}`;
}

export default function PlayOffersPage() {
  const searchParams = useSearchParams();
  const businessSlug = searchParams.get("business") || "";
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const [business, setBusiness] = useState(null);
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [claiming, setClaiming] = useState(null);
  const [pendingWin, setPendingWin] = useState(null);

  const returnPath = businessSlug ? playReturnPath(businessSlug) : "/play-offers";

  useBreadcrumbLabels({
    playBusinessSlug: businessSlug || undefined,
    playBusinessName: business?.name
  });

  useEffect(() => {
    if (!businessSlug) {
      setBusiness(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.businessBySlug(businessSlug)
      .then(setBusiness)
      .catch((err) => {
        setBusiness(null);
        setLoadError(err.message);
        toastError(err.message);
      })
      .finally(() => setLoading(false));
  }, [businessSlug]);

  const load = useCallback(async () => {
    if (!business?.id || !user) return;
    try {
      const data = await api.gamesHub(business.id);
      setHub(data);
    } catch (err) {
      toastError(err.message);
    }
  }, [business?.id, user, toastError]);

  useEffect(() => {
    if (business?.id && user) load();
  }, [business?.id, user, load]);

  const gameStatus = (type) => hub?.games?.find((g) => g.type === type);

  const handleWin = (gameType) => {
    if (!user) return;
    if (gameStatus(gameType)?.onCooldown) return;
    setPendingWin(gameType);
  };

  const claimOffer = async (gameType) => {
    if (!business?.id || !user) return;
    setClaiming(gameType);
    try {
      const res = await api.claimGameOffer({ gameType, businessId: business.id });
      const notice = res.offer.emailNotice ? ` ${res.offer.emailNotice}` : "";
      success(`You won ${res.offer.discount} at ${res.offer.business}! Code: ${res.offer.couponCode}.${notice}`);
      setPendingWin(null);
      await load();
    } catch (err) {
      toastError(err.message);
    } finally {
      setClaiming(null);
    }
  };

  if (!businessSlug) {
    return (
      <div>
        <PageBanner
          eyebrow="Play & win"
          title="Business discount games"
          subtitle="Open a business listing and tap “Play game & win discount”. Login required — coupons are emailed to you and the shop owner."
        />
        <section className="page-section">
          <div className="card text-center">
            <p className="text-body text-muted">Pick a business from the directory first.</p>
            <Link href="/" className="btn-primary btn-inline mt-4">Browse businesses</Link>
          </div>
        </section>
      </div>
    );
  }

  if (loading || authLoading) {
    return <div className="text-body flex min-h-[50vh] items-center justify-center text-muted">Loading...</div>;
  }

  if (!business) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-body text-rose">{loadError || "Business not found."}</p>
        <Link href="/" className="btn-primary btn-inline mt-4">Back home</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageBanner
          eyebrow="Login required"
          title={`Play for ${business.name}`}
          subtitle="Create a free account or log in to win a discount coupon. We'll email the code to you and the business owner."
        />
        <section className="page-section">
          <div className="card mx-auto max-w-lg text-center">
            <BusinessAvatar business={business} variant="circle" className="mx-auto" />
            <h2 className="text-subtitle mt-4">{business.name}</h2>
            <p className="text-body mt-2 text-muted">
              Coupons are sent by email after you win. You must be signed in with a valid email address.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                onClick={() => setRedirectPath(returnPath)}
                className="btn-primary btn-inline"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setRedirectPath(returnPath)}
                className="btn-ghost btn-inline"
              >
                Create free account
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        eyebrow="Play & win"
        title={`Win a discount at ${business.name}`}
        subtitle="Complete a mini-game to unlock a percent-off coupon. We'll email the code to you and the business owner."
      />

      <section className="page-section space-y-8">
        <div className="card flex flex-col gap-4 sm:flex-row sm:items-center">
          <BusinessAvatar business={business} variant="circle" />
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{business.category} · {business.city}</p>
            <h2 className="text-subtitle">{business.name}</h2>
            <p className="text-body mt-1 text-muted">
              Signed in as <strong>{user.email}</strong> — coupon emails go to you and the shop owner.
            </p>
          </div>
          <Link href={`/business/${business.slug}`} className="btn-ghost btn-inline shrink-0">
            View business
          </Link>
        </div>

        {!!hub?.unlocks?.length && (
          <div>
            <h2 className="heading-section">Your coupons for {business.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {hub.unlocks.map((offer) => (
                <UnlockedOfferCard key={`${offer.id}-${offer.unlockedAt}`} offer={offer} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="heading-section">Choose a game</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            {(["spin", "memory", "tap"]).map((type) => {
              const status = gameStatus(type);
              const meta = GAME_META[type];
              const GameComponent = type === "spin" ? SpinWheelGame : type === "memory" ? MemoryMatchGame : TapWinGame;
              return (
                <div key={type} className="card">
                  <h3 className="text-subtitle">{meta.title}</h3>
                  <p className="text-body mt-1 text-muted">{meta.desc}</p>
                  {status?.onCooldown && (
                    <p className="text-caption mt-2 font-bold text-amber-700">On cooldown — try again later</p>
                  )}
                  <div className="mt-4">
                    <GameComponent disabled={status?.onCooldown} onWin={() => handleWin(type)} />
                  </div>
                  {pendingWin === type && !status?.onCooldown && (
                    <button
                      type="button"
                      className="btn-primary mt-4 w-full"
                      onClick={() => claimOffer(type)}
                      disabled={claiming === type}
                    >
                      {claiming === type ? "Sending coupon..." : "Claim & email coupon"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="page-section pt-0">
        <PageInterlinks
          title={business ? `More from ${business.name}` : "Explore the directory"}
          links={business ? businessInterlinks(business) : [
            { href: "/", label: "Directory home" },
            { href: "/categories", label: "Categories" },
            { href: "/signup", label: "Create account" }
          ]}
        />
      </section>
    </div>
  );
}
