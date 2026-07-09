const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise = null;

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Opens Razorpay checkout and resolves when payment succeeds.
 */
export async function openRazorpayCheckout({ order, user, onDismiss }) {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "India Local Connect",
      description: `${order.plan} plan — ${order.businessName}`,
      order_id: order.orderId,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || ""
      },
      theme: { color: "#0d9488" },
      handler(response) {
        resolve({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
      },
      modal: {
        ondismiss() {
          if (onDismiss) onDismiss();
          reject(new Error("Payment cancelled"));
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      reject(new Error(response.error?.description || "Payment failed"));
    });
    rzp.open();
  });
}
