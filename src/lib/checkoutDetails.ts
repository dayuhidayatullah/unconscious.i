export interface CheckoutDetails {
  customerName: string;
  phone: string;
  address: string;
}

const KEY = "unconscious-checkout-details";

export function loadDetails(): CheckoutDetails {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return { customerName: d.customerName ?? "", phone: d.phone ?? "", address: d.address ?? "" };
  } catch {
    return { customerName: "", phone: "", address: "" };
  }
}

export function saveDetails(d: CheckoutDetails) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* diabaikan */
  }
}
