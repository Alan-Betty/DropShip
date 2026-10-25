import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePhone, validateCheckout } from "./validation.ts";

test("normalizes common Indian phone formats", () => {
  assert.equal(normalizePhone("98765 43210"), "9876543210");
  assert.equal(normalizePhone("+91 98765-43210"), "9876543210");
  assert.equal(normalizePhone("09876543210"), "9876543210");
  assert.equal(normalizePhone("5876543210"), null);
  assert.equal(normalizePhone("98765"), null);
});

const valid = {
  name: "Anjali Menon",
  phone: "+91 94470 12345",
  pincode: "682019",
  address: "12/450, Rose Villa, Thammanam Road",
  landmark: "Near Vyttila Hub",
  city: "Ernakulam",
  state: "Kerala",
};

test("accepts a complete Kerala address and cleans the phone", () => {
  const result = validateCheckout(valid);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.phone, "9447012345");
});

test("reports every bad field at once", () => {
  const result = validateCheckout({ ...valid, phone: "12345", pincode: "012345", address: "x" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(Object.keys(result.errors).sort(), ["address", "phone", "pincode"]);
});

test("landmark is optional, non-string input is treated as empty", () => {
  const result = validateCheckout({ ...valid, landmark: undefined, city: 42 });
  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(Object.keys(result.errors), ["city"]);
});
