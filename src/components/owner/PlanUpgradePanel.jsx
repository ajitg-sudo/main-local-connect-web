import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useToast } from "../../context/toastContext";
import { PLANS, planBadgeClass, isPaidPlan } from "../../utils/constants";
import { openRazorpayCheckout } from "../../utils/razorpay";

const PLAN_RANK = { Free: 0, Premium: 1, Featured: 2 };

export default function PlanUpgradePanel({ business, onUpgraded }) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("Premium");
  const [paying, setPaying] = useState(false);

  const currentPlan = business?.premium || "Free";
  const upgradeOptions = PLANS.filter(
    (p) => (PLAN_RANK[p.name] ?? 0) > (PLAN_RANK[currentPlan] ?? 0)
  );

  useEffect(() => {
    if (!business?.id) return;
    api
      .paymentSubscriptions(business.id)
      .then(setSubscriptions)
      .catch(() => setSubscriptions([]));
  }, [business?.id]);

  useEffect(() => {
    if (upgradeOptions.length && !upgradeOptions.find((p) => p.name === selectedPlan)) {
      setSelectedPlan(upgradeOptions[0].name);
    }
  }, [currentPlan, upgradeOptions, selectedPlan]);

  const startPayment = async () => {
    if (!business?.id || !isPaidPlan(selectedPlan)) return;
    setPaying(true);
    try {
      const order = await api.createPaymentOrder({
        businessId: business.id,
        plan: selectedPlan
      });
      const payment = await openRazorpayCheckout({ order, user });
      const subscription = await api.verifyPayment(payment);
      success(`${selectedPlan} plan activated! Renews on ${subscription.renewsOn || "next year"}.`);
      onUpgraded?.();
    } catch (err) {
      if (err.message !== "Payment cancelled") {
        toastError(err.message);
      }
    } finally {
      setPaying(false);
    }
  };

  const activeSub = subscriptions.find((s) => s.paymentStatus === "Paid");

  return (
    <div className="card mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-subtitle">Listing plan</h2>
        <span className={`text-caption rounded-full px-2.5 py-1 font-bold ${planBadgeClass(currentPlan)}`}>
          Current: {currentPlan}
        </span>
      </div>

      {activeSub && (
        <p className="text-body mt-2 text-muted">
          Active until <strong className="text-ink">{activeSub.renewsOn || "—"}</strong>
          {activeSub.invoiceRef && ` · Ref: ${activeSub.invoiceRef}`}
        </p>
      )}

      {upgradeOptions.length > 0 ? (
        <div className="mt-4">
          <p className="text-body mb-3 text-muted">Upgrade for better visibility and more features.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {upgradeOptions.map((plan) => (
              <button
                key={plan.name}
                type="button"
                onClick={() => setSelectedPlan(plan.name)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedPlan === plan.name
                    ? "border-teal bg-teal/5 ring-2 ring-teal/20"
                    : "border-line hover:border-teal/40"
                }`}
              >
                <p className="font-bold text-ink">{plan.name}</p>
                <p className="text-body font-semibold text-teal">{plan.price}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn-primary mt-4"
            disabled={paying}
            onClick={startPayment}
          >
            {paying ? "Processing payment..." : `Pay & upgrade to ${selectedPlan}`}
          </button>
        </div>
      ) : (
        <p className="text-body mt-3 text-muted">You are on the highest plan. Thank you!</p>
      )}

      {subscriptions.length > 0 && (
        <div className="mt-6 border-t border-line pt-4">
          <h3 className="text-body font-bold text-ink">Payment history</h3>
          <div className="mt-2 space-y-2">
            {subscriptions.slice(0, 5).map((sub) => (
              <div key={sub.id} className="text-small flex flex-wrap justify-between gap-2 rounded-lg bg-line/30 px-3 py-2">
                <span>{sub.plan} · {sub.amount}</span>
                <span className={sub.paymentStatus === "Paid" ? "text-teal-dark font-bold" : "text-muted"}>
                  {sub.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
