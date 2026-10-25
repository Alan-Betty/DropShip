// Shared by the checkout form and the orders API, so the browser and server
// accept exactly the same input.

export type CheckoutFields = {
  name: string;
  phone: string;
  pincode: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
};

export type FieldErrors = Partial<Record<keyof CheckoutFields, string>>;

/** Accepts "98765 43210", "+91 98765 43210", "09876543210". Returns 10 digits or null. */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function isValidPincode(pin: string): boolean {
  return /^[1-9]\d{5}$/.test(pin.trim());
}

export function validateCheckout(input: Partial<Record<keyof CheckoutFields, unknown>>):
  | { ok: true; data: CheckoutFields }
  | { ok: false; errors: FieldErrors } {
  const str = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");
  const data: CheckoutFields = {
    name: str(input.name),
    phone: str(input.phone),
    pincode: str(input.pincode),
    address: str(input.address),
    landmark: str(input.landmark),
    city: str(input.city),
    state: str(input.state),
  };
  const errors: FieldErrors = {};

  if (data.name.length < 2) errors.name = "Enter the name the parcel should be addressed to.";
  else if (data.name.length > 60) errors.name = "Keep the name under 60 characters.";

  const phone = normalizePhone(data.phone);
  if (!phone) errors.phone = "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
  else data.phone = phone;

  if (!isValidPincode(data.pincode)) errors.pincode = "Enter a 6-digit PIN code.";

  if (data.address.length < 8)
    errors.address = "Add your house or flat number and street so the courier can find you.";
  else if (data.address.length > 200) errors.address = "Keep the address under 200 characters.";

  if (data.landmark.length > 100) errors.landmark = "Keep the landmark under 100 characters.";
  if (data.city.length < 2) errors.city = "Enter your town or city.";
  if (data.state.length < 2) errors.state = "Enter your state.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
