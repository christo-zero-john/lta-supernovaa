import assert from "node:assert/strict";
import {
  calculateChances,
  validateProfile,
  validateUpload,
  validateBooking,
  parseNavigation,
  hasAccess,
} from "../src/app/figma/dashboard/_lib/model.ts";
import {
  APPLICATIONS,
  MENTORS,
  CHANCE_UNIVERSITIES,
  PERSONAS,
} from "../src/app/figma/dashboard/_lib/fixtures.ts";
assert.equal(APPLICATIONS.length, 9);
assert.equal(MENTORS.length, 6);
assert.equal(CHANCE_UNIVERSITIES.length, 5);
assert.equal(PERSONAS.p004.ent.ZENNA, "archived");
assert.equal(hasAccess("free", "zenna"), false);
assert.equal(hasAccess("p004", "zenna"), true);
assert.deepEqual(parseNavigation(new URLSearchParams("view=bad&persona=bad")), {
  view: "dashboard",
  persona: "paid",
});
assert.deepEqual(
  parseNavigation(
    new URLSearchParams("view=bad&view=zenna&persona=bad&persona=free"),
  ),
  { view: "zenna", persona: "free" },
);
const profile = {
  degree: "B.Tech Mechanical Engineering",
  cgpa: 7.8,
  ielts: 7,
  german: "A2",
  field: "Logistics / Supply Chain",
};
const result = calculateChances(profile, CHANCE_UNIVERSITIES);
assert.deepEqual(
  result.map((r) => r.pct),
  [58, 55, 48, 40, 38],
);
assert.deepEqual(result, calculateChances(profile, CHANCE_UNIVERSITIES));
assert.ok(validateProfile({ ...profile, cgpa: NaN }).length);
assert.ok(validateProfile({ ...profile, ielts: 10 }).length);
assert.equal(
  validateUpload({ name: "p.pdf", type: "application/pdf", size: 10 }),
  null,
);
assert.ok(
  validateUpload({ name: "p.exe", type: "application/octet-stream", size: 10 }),
);
assert.ok(
  validateUpload({
    name: "p.pdf",
    type: "application/pdf",
    size: 11 * 1024 * 1024,
  }),
);
assert.ok(validateBooking("2026-12-31", "", new Date(2026, 8, 29)));
assert.equal(
  validateBooking("2027-01-01", "17:00", new Date(2026, 11, 31)),
  null,
);
const { initialState, appReducer } = await import(
  "../src/app/figma/dashboard/_lib/reducer.ts"
);
const initial = initialState();
const next = appReducer(initial, {
  type: "book",
  persona: "free",
  session: { id: "test", mentorId: "team", date: "2027-01-01", slot: "17:00" },
});
assert.equal(next.free.notices[0].view, "support");
assert.equal(next.paid.sessions.length, 0);
assert.equal(appReducer(next, { type: "reset" }).free.sessions.length, 0);
console.log(
  "PASS: source fixtures, persona entitlements, deterministic chances, input/upload/date validation",
);
