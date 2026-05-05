const firstFilled = (...values) =>
  values.find(value => value !== undefined && value !== null && value !== "" && value !== " ")

const cleanParams = params => {
  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === "" || params[key] === " ") {
      delete params[key]
    }
  })
  return params
}

const buildRechargeBaseParams = model => cleanParams({
  UserCode: firstFilled(model.UserCode, model.UserAccount),
  IfunId: firstFilled(model.IfunId, model.ifunId),
  startTime: model.startTime,
  endTime: model.endTime,
  Account: model.Account,
  GameName: model.GameName,
  RoleName: model.RoleName,
  AreaName: model.AreaName,
  AreaCode: model.AreaCode,
  TotalPrice: model.TotalPrice,
  Platform: firstFilled(model.platform, model.Platform),
  page: model.page,
  pageSize: model.pageSize
})

const buildRechargeParams = model => buildRechargeBaseParams(model)

const buildDptRechargeParams = model => cleanParams({
  ...buildRechargeBaseParams(model),
  userId: model.userId,
  resDepId: model.resDepId
})

module.exports = {
  buildRechargeParams,
  buildDptRechargeParams
}
