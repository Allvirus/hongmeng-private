const assert = require("assert");

const {
  buildRechargeParams,
  buildDptRechargeParams
} = require("../src/api/playerRechargeParams");

const baseModel = {
  UserCode: "account-id-001",
  UserAccount: "legacy-player-account",
  IfunId: 123456789,
  platform: "0",
  startTime: "2026-04-30 00:00:00",
  endTime: "2026-04-30 23:59:59",
  Account: "promoter",
  GameName: "game",
  RoleName: "role",
  AreaName: "area",
  AreaCode: "area-code",
  TotalPrice: 100,
  userId: 11,
  resDepId: 22,
  page: 1,
  pageSize: 10
};

const params = buildRechargeParams(baseModel);
assert.strictEqual(params.UserCode, "account-id-001");
assert.strictEqual(params.IfunId, 123456789);
assert.strictEqual(params.Platform, "0");
assert.strictEqual(Object.prototype.hasOwnProperty.call(params, "UserAccount"), false);

const fallbackParams = buildRechargeParams({
  UserAccount: "account-id-002",
  platform: "1",
  page: 1,
  pageSize: 10
});
assert.strictEqual(fallbackParams.UserCode, "account-id-002");
assert.strictEqual(fallbackParams.Platform, "1");

const manageParams = buildDptRechargeParams(baseModel);
assert.strictEqual(manageParams.UserCode, "account-id-001");
assert.strictEqual(manageParams.IfunId, 123456789);
assert.strictEqual(manageParams.Platform, "0");
assert.strictEqual(manageParams.userId, 11);
assert.strictEqual(manageParams.resDepId, 22);
assert.strictEqual(Object.prototype.hasOwnProperty.call(manageParams, "UserAccount"), false);
