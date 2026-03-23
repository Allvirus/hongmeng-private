# 页面按钮权限与 API 映射

## 说明

- 本文档用于整理“页面按钮权限点”对应的实际 API，便于后续拆分按钮级权限。
- 仅收录当前代码中已经明确查到的按钮与接口调用关系。
- 查询、重置这类按钮如果只是复用列表接口，也一并记录。
- 某些按钮只是打开弹窗，真正提交接口在子组件中，文档中会标注“入口页面”和“实际提交组件”。
- 个别按钮未直接走 this.\$api，而是本地逻辑或 axios 直连，也已单独标注。

### 相关产物

- 后端权限字典（JSON）： [src/doc/权限点字典.json](src/doc/权限点字典.json)
- 前端接入清单（执行步骤）： [src/doc/前端按钮权限接入清单.md](src/doc/前端按钮权限接入清单.md)

## 部门管理

页面入口： [src/views/pages/Department/index.vue](src/views/pages/Department/index.vue)

### 页面按钮

| 按钮     | 页面方法       | API 方法      | HTTP   | 接口路径                            | 备注                                   | 建议权限 code            |
| -------- | -------------- | ------------- | ------ | ----------------------------------- | -------------------------------------- | ------------------------ |
| 新增人员 | showMbEditDlg  | 无            | -      | -                                   | 仅打开弹窗，实际提交在 UserEdit 组件   | department.user.add      |
| 新增部门 | showDptEditDlg | 无            | -      | -                                   | 仅打开弹窗，实际提交在 DepartEdit 组件 | department.dept.add      |
| 编辑部门 | showDptEditDlg | 无            | -      | -                                   | 仅打开弹窗，实际提交在 DepartEdit 组件 | department.dept.edit     |
| 删除部门 | showDelDepart  | delDepart     | DELETE | /api/department/{id}                | 删除当前选中部门                       | department.dept.delete   |
| 编辑人员 | showMbEditDlg  | 无            | -      | -                                   | 仅打开弹窗，实际提交在 UserEdit 组件   | department.user.edit     |
| 锁定     | lockUser       | lockUser      | POST   | api/user/{id}/lock                  | 行内按钮                               | department.user.lock     |
| 解锁     | unlockUser     | unlockUser    | POST   | api/user/{id}/unlock                | 行内按钮                               | department.user.unlock   |
| 重置密码 | resetPad       | resetPassword | POST   | /api/user/reset?userName={userName} | 行内按钮                               | department.user.resetPwd |

### 人员编辑弹窗

实际组件： [src/views/pages/Department/comps/UserEdit.vue](src/views/pages/Department/comps/UserEdit.vue)

| 按钮             | 组件方法 | API 方法   | HTTP | 接口路径      | 备注           | 建议权限 code        |
| ---------------- | -------- | ---------- | ---- | ------------- | -------------- | -------------------- |
| 提交（新增人员） | submmit  | addUser    | POST | api/user/     | userId 为 0 时 | department.user.add  |
| 提交（编辑人员） | submmit  | updateUser | PUT  | api/user/{id} | userId 非 0 时 | department.user.edit |

### 部门编辑弹窗

实际组件： [src/views/pages/Department/comps/DepartEdit.vue](src/views/pages/Department/comps/DepartEdit.vue)

| 按钮             | 组件方法 | API 方法     | HTTP | 接口路径                       | 备注            | 建议权限 code        |
| ---------------- | -------- | ------------ | ---- | ------------------------------ | --------------- | -------------------- |
| 提交（新增部门） | submmit  | addDepart    | POST | /api/department/               | isEdit 为 false | department.dept.add  |
| 提交（编辑部门） | submmit  | updateDepart | PUT  | /api/department/{departmentId} | isEdit 为 true  | department.dept.edit |

## 等级管理

页面： [src/views/pages/Home/LevelManage/index.vue](src/views/pages/Home/LevelManage/index.vue)

| 按钮         | 页面方法    | API 方法      | HTTP   | 接口路径        | 备注                  | 建议权限 code |
| ------------ | ----------- | ------------- | ------ | --------------- | --------------------- | ------------- |
| 新增等级     | showEditDlg | 无            | -      | -               | 仅打开弹窗            | level.add     |
| 编辑         | showEditDlg | 无            | -      | -               | 仅打开弹窗            | level.edit    |
| 删除         | deleteLevel | delLevelById  | DELETE | /api/level/{id} | 行内按钮              | level.delete  |
| 提交（新增） | submmitEdit | addLevel      | POST   | /api/level/     | model.isEdit 为 false | level.add     |
| 提交（编辑） | submmitEdit | updateLevById | PUT    | /api/level/{id} | model.isEdit 为 true  | level.edit    |

## 业务配置

页面： [src/views/pages/Home/FixedPost/index.vue](src/views/pages/Home/FixedPost/index.vue)

说明：该页面组件名是 BizConfig，但路由目录在 FixedPost 下。

| 按钮         | 页面方法    | API 方法                 | HTTP   | 接口路径          | 备注             | 建议权限 code  |
| ------------ | ----------- | ------------------------ | ------ | ----------------- | ---------------- | -------------- |
| 搜索         | searchCfg   | getBusinessConfiguration | GET    | /api/bizconf      | 条件查询         | bizconf.query  |
| 重置         | reset       | getBusinessConfiguration | GET    | /api/bizconf      | 重置后重新查询   | bizconf.query  |
| 新增配置     | showEditDlg | 无                       | -      | -                 | 仅打开弹窗       | bizconf.add    |
| 编辑         | showEditDlg | 无                       | -      | -                 | 仅打开弹窗       | bizconf.edit   |
| 删除         | deleteCfg   | deleteBusinessionsById   | DELETE | /api/bizconf/{id} | 行内按钮         | bizconf.delete |
| 提交（新增） | submmitEdit | batchToCreateBusiness    | POST   | /api/bizconf/bluk | 批量创建业务配置 | bizconf.add    |
| 提交（编辑） | submmitEdit | modifiedBusinessById     | PUT    | /api/bizconf/{id} | 更新 B/C 岗信息  | bizconf.edit   |

## 角色管理

页面： [src/views/pages/Home/RoleList/index.vue](src/views/pages/Home/RoleList/index.vue)

| 按钮             | 页面方法    | API 方法         | HTTP   | 接口路径           | 备注                           | 建议权限 code |
| ---------------- | ----------- | ---------------- | ------ | ------------------ | ------------------------------ | ------------- |
| 添加角色         | addRole     | 无               | -      | -                  | 仅打开弹窗                     | role.add      |
| 编辑             | showEditDlg | getRoleMenuPower | GET    | api/role/{roleId}  | 先读取角色已有权限，再打开弹窗 | role.edit     |
| 删除             | deleteRole  | deleteRole       | DELETE | /api/role/{roleId} | 行内按钮                       | role.delete   |
| 确定（新增角色） | determine   | createRole       | POST   | /api/role          | isModify 为 false              | role.add      |
| 确定（编辑角色） | determine   | updateRole       | PUT    | /api/role/         | isModify 为 true               | role.edit     |

## 经验明细

页面： [src/views/pages/Home/ExpDetail/index.vue](src/views/pages/Home/ExpDetail/index.vue)

| 按钮     | 页面方法         | API 方法                 | HTTP   | 接口路径                                 | 备注                                     | 建议权限 code     |
| -------- | ---------------- | ------------------------ | ------ | ---------------------------------------- | ---------------------------------------- | ----------------- |
| 搜索     | search           | getDptExpList / getMyExp | GET    | /api/experience/ 或 /api/experience/user | 取决于混入中的权限逻辑                   | experience.query  |
| 重置     | reset            | getDptExpList / getMyExp | GET    | /api/experience/ 或 /api/experience/user | 取决于混入中的权限逻辑                   | experience.query  |
| 新增经验 | newExpDlg = true | 无                       | -      | -                                        | 仅打开弹窗                               | experience.add    |
| 提交     | submmit          | createExp                | POST   | /api/experience/                         | 新增经验记录                             | experience.add    |
| 删除     | deleteExp        | delExpById               | DELETE | /api/experience/{id}                     | 方法已定义，但当前表格未直接看到删除按钮 | experience.delete |

## 账号关联

页面： [src/views/pages/Home/AssociatedAccount/index.vue](src/views/pages/Home/AssociatedAccount/index.vue)

| 按钮 | 页面方法             | API 方法                  | HTTP   | 接口路径           | 备注           | 建议权限 code   |
| ---- | -------------------- | ------------------------- | ------ | ------------------ | -------------- | --------------- |
| 搜索 | search               | getAccountAssociatData    | GET    | /api/userbind      | 列表查询走混入 | userbind.query  |
| 新增 | dialogVisible = true | 无                        | -      | -                  | 仅打开弹窗     | userbind.add    |
| 删除 | deleteLevel          | byIDDeleteAccountAssociat | DELETE | /api/userbind/{id} | 行内按钮       | userbind.delete |
| 确定 | confirmAdd           | createAssociatedUser      | POST   | /api/userbind      | 弹窗提交       | userbind.add    |

## 玩家换绑

页面： [src/views/pages/Home/SwitchBind/index.vue](src/views/pages/Home/SwitchBind/index.vue)

| 按钮             | 页面方法            | API 方法          | HTTP   | 接口路径                              | 备注                                     | 建议权限 code             |
| ---------------- | ------------------- | ----------------- | ------ | ------------------------------------- | ---------------------------------------- | ------------------------- |
| 玩家换绑         | swBindDlg = true    | 无                | -      | -                                     | 仅打开弹窗                               | playerswitch.switch       |
| 搜索             | getListMixin        | getBindChangeList | GET    | /api/playerswitch/                    | 列表查询                                 | playerswitch.query        |
| 重置             | resetPageMixin      | getBindChangeList | GET    | /api/playerswitch/                    | 重置后查询                               | playerswitch.query        |
| 玩家代码变更联动 | onUserAccountChange | getOriginBind     | GET    | /api/playerswitch/usercode/{userCode} | 自动带出当前绑定 A/B/C 岗                | playerswitch.origin.query |
| 提交             | commitSwBind        | switchBind        | POST   | /api/playerswitch/                    | 弹窗提交换绑                             | playerswitch.switch       |
| 删除记录         | delRecord           | delBindRec        | DELETE | /api/playerswitch/{id}                | 方法已定义，但当前表格未直接看到删除按钮 | playerswitch.delete       |

## 游戏渠道

页面： [src/views/pages/GameChannel/index.vue](src/views/pages/GameChannel/index.vue)

| 按钮         | 页面方法     | API 方法       | HTTP   | 接口路径            | 备注                                  | 建议权限 code    |
| ------------ | ------------ | -------------- | ------ | ------------------- | ------------------------------------- | ---------------- |
| 添加         | showEditDlg  | 无             | -      | -                   | 仅打开弹窗                            | channel.add      |
| 搜索         | getListMixin | getGameChannel | GET    | /api/channel/       | 列表查询                              | channel.query    |
| 下载         | downLoad     | 无             | -      | -                   | 本地直接 window.open(row.downloadUrl) | channel.download |
| 编辑         | showEditDlg  | 无             | -      | -                   | 仅打开弹窗                            | channel.edit     |
| 删除         | deleteGame   | deleteChannel  | DELETE | /api/channel/{id}   | 行内按钮                              | channel.delete   |
| 提交（新增） | submmit      | createChannel  | POST   | /api/channel/       | gameInfo.isEdit 为 false              | channel.add      |
| 提交（编辑） | submmit      | updateChannel  | PUT    | /api/channel/{id}   | gameInfo.isEdit 为 true               | channel.edit     |
| 上传 apk     | onApkChanged | uploadApi      | POST   | api/common/file/apk | 上传后回填 downloadUrl                | channel.upload   |

## 工资记录

页面： [src/views/pages/Home/TotalKpi/index.vue](src/views/pages/Home/TotalKpi/index.vue)

| 按钮     | 页面方法             | API 方法             | HTTP | 接口路径                  | 备注                                 | 建议权限 code |
| -------- | -------------------- | -------------------- | ---- | ------------------------- | ------------------------------------ | ------------- |
| 搜索     | getSalaryList        | getSalaryData        | GET  | /api/salary               | 列表查询                             | salary.query  |
| 新增     | dialogVisible = true | 无                   | -    | -                         | 仅打开弹窗                           | salary.add    |
| 确定     | confirmChange        | createPayrollRecords | POST | /api/salary?month={month} | 创建某月工资记录                     | salary.add    |
| 导出工资 | exportWages          | 无                   | GET  | /api/salary/excel         | 直接使用 axios 下载，不走 this.\$api | salary.export |

## 可直接拆成权限点的建议按钮（含查询）

下面按“查询类”和“写操作类”一起列出，便于一次性补齐按钮级权限。

### 查询类按钮建议

- 部门管理：按部门查看人员（节点点击触发查询）、是否包含离职人员切换查询、姓名筛选（前端本地过滤）
- 等级管理：等级列表查询（页面初始化查询）
- 业务配置：搜索、重置
- 角色管理：角色列表查询（页面初始化查询）
- 经验明细：搜索、重置
- 账号关联：搜索
- 玩家换绑：搜索、重置
- 游戏渠道：搜索（含运营商/游戏类型筛选）
- 工资记录：搜索

### 写操作类按钮建议

- 部门管理：新增人员、编辑人员、锁定、解锁、重置密码、新增部门、编辑部门、删除部门
- 等级管理：新增等级、编辑等级、删除等级
- 业务配置：新增配置、编辑配置、删除配置
- 角色管理：添加角色、编辑角色、删除角色
- 经验明细：新增经验
- 账号关联：新增、删除
- 玩家换绑：玩家换绑
- 游戏渠道：添加、编辑、删除、上传 apk
- 工资记录：新增、导出工资

### 查询按钮权限编码建议

如果需要把查询也纳入权限控制，建议单独定义 query 维度，避免和写操作混用：

- department.user.query
- level.query
- bizconf.query
- role.query
- experience.query
- userbind.query
- playerswitch.query
- channel.query
- salary.query

说明：

- 查询权限建议默认给大多数角色放开；
- 若某角色仅允许查看不允许操作，可只赋予 query，不赋予 add/edit/delete/export；
- 对“前端本地过滤”型查询（如姓名关键词过滤）可不单独控权，统一跟随列表 query 权限。

## 建议权限 code 总表

以下 code 可直接用于前端 v-permission 和后端权限点配置。

### 部门管理

| 按钮/能力                     | 建议 code                |
| ----------------------------- | ------------------------ |
| 查看部门人员列表/切换部门查询 | department.user.query    |
| 新增人员                      | department.user.add      |
| 编辑人员                      | department.user.edit     |
| 锁定人员                      | department.user.lock     |
| 解锁人员                      | department.user.unlock   |
| 重置密码                      | department.user.resetPwd |
| 新增部门                      | department.dept.add      |
| 编辑部门                      | department.dept.edit     |
| 删除部门                      | department.dept.delete   |

### 等级管理

| 按钮/能力    | 建议 code    |
| ------------ | ------------ |
| 查询等级列表 | level.query  |
| 新增等级     | level.add    |
| 编辑等级     | level.edit   |
| 删除等级     | level.delete |

### 业务配置

| 按钮/能力     | 建议 code      |
| ------------- | -------------- |
| 搜索/重置查询 | bizconf.query  |
| 新增配置      | bizconf.add    |
| 编辑配置      | bizconf.edit   |
| 删除配置      | bizconf.delete |

### 角色管理

| 按钮/能力            | 建议 code            |
| -------------------- | -------------------- |
| 查询角色列表         | role.query           |
| 新增角色             | role.add             |
| 编辑角色             | role.edit            |
| 删除角色             | role.delete          |
| 查看角色菜单权限明细 | role.permission.view |

### 经验明细

| 按钮/能力     | 建议 code         |
| ------------- | ----------------- |
| 搜索/重置查询 | experience.query  |
| 新增经验      | experience.add    |
| 删除经验      | experience.delete |

### 账号关联

| 按钮/能力 | 建议 code       |
| --------- | --------------- |
| 搜索查询  | userbind.query  |
| 新增关联  | userbind.add    |
| 删除关联  | userbind.delete |

### 玩家换绑

| 按钮/能力                          | 建议 code                 |
| ---------------------------------- | ------------------------- |
| 搜索/重置查询                      | playerswitch.query        |
| 查看原绑定信息（玩家代码联动查询） | playerswitch.origin.query |
| 执行换绑                           | playerswitch.switch       |
| 删除换绑记录                       | playerswitch.delete       |

### 游戏渠道

| 按钮/能力     | 建议 code        |
| ------------- | ---------------- |
| 搜索/筛选查询 | channel.query    |
| 新增渠道      | channel.add      |
| 编辑渠道      | channel.edit     |
| 删除渠道      | channel.delete   |
| 下载 apk      | channel.download |
| 上传 apk      | channel.upload   |

### 工资记录

| 按钮/能力      | 建议 code     |
| -------------- | ------------- |
| 搜索查询       | salary.query  |
| 新增月工资记录 | salary.add    |
| 导出工资       | salary.export |

## 备注

- 部分页面存在“方法已定义，但当前模板未直接展示按钮”的情况，例如经验删除、换绑记录删除；如果后续要做权限点，建议先确认按钮是否还会开放。
- 查询类按钮通常不建议细拆到很细，除非业务明确要求“只允许看，不允许查”。
- 若下一步要继续推进按钮级权限，建议基于本文档给每个写操作按钮分配唯一 permission code，再统一挂到 v-permission 上。
