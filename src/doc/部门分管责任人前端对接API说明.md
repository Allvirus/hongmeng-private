# 部门分管责任人前端对接 API 说明

## 1. 文档目的

这份文档只面向前端联调，说明“部门分管责任人”从单负责人改为多负责人后，前端需要关注的接口、字段和兼容规则。

本次改造已经支持：

- 一个部门可配置多个分管负责人
- 一个用户可同时分管多个部门
- 登录态和数据范围会基于新的多对多绑定关系计算

## 2. 对前端的核心影响

### 2.1 需要从单值切换为数组的字段

前端需要优先使用以下新字段：

- `resDepartmentIds`
- `managerUserIds`
- `managerUsers`
- `manageDepartmentIds`

### 2.2 当前仍保留的兼容字段

以下旧字段目前仍会返回或仍可提交，但只用于兼容旧页面，不建议新页面继续依赖：

- `resDepartmentId`
- `userId`
- `userName`
- `manageDepartmentId`

兼容字段含义：

- `resDepartmentId` 取 `resDepartmentIds` 的第一个值
- `userId`、`userName` 表示部门主负责人兼容字段
- `manageDepartmentId` 取 `manageDepartmentIds` 的第一个值

## 3. 字段定义

### 3.1 登录态字段

| 字段名             | 类型       | 是否推荐 | 说明                                 |
| ------------------ | ---------- | -------- | ------------------------------------ |
| `resDepartmentIds` | `number[]` | 是       | 当前用户直接负责的部门 Id 集合       |
| `resDepartmentId`  | `number`   | 否       | 兼容字段，值为 `resDepartmentIds[0]` |

### 3.2 部门负责人字段

| 字段名           | 类型                                 | 是否推荐 | 说明                       |
| ---------------- | ------------------------------------ | -------- | -------------------------- |
| `managerUserIds` | `number[]`                           | 是       | 当前部门全部负责人用户 Id  |
| `managerUsers`   | `{ id: number, realName: string }[]` | 是       | 当前部门全部负责人展示信息 |
| `userId`         | `number`                             | 否       | 兼容字段，表示主负责人 Id  |
| `userName`       | `string`                             | 否       | 兼容字段，表示主负责人姓名 |

### 3.3 用户分管部门字段

| 字段名                | 类型       | 是否推荐 | 说明                                    |
| --------------------- | ---------- | -------- | --------------------------------------- |
| `manageDepartmentIds` | `number[]` | 是       | 当前用户负责的部门集合                  |
| `manageDepartmentId`  | `number`   | 否       | 兼容字段，值为 `manageDepartmentIds[0]` |

## 4. 需要对接的接口

### 4.1 获取当前登录用户信息

- 接口：`GET /api/user`
- 作用：获取登录态、菜单、按钮权限，以及当前用户负责的部门集合

返回示例：

```json
{
  "code": 200,
  "data": {
    "id": 3,
    "username": "Admin",
    "realName": "趣动久久",
    "menu": {},
    "menuList": [1, 2, 3],
    "buttonList": ["department.dept.add", "department.dept.edit"],
    "resDepartmentIds": [1, 2],
    "resDepartmentId": 1
  }
}
```

前端处理建议：

- 页面初始化时优先读取 `data.resDepartmentIds`
- 旧逻辑如果只支持单选部门，可临时继续取 `data.resDepartmentId`
- 新页面不要再把 `resDepartmentId` 作为唯一数据来源

### 4.2 获取部门列表

- 接口：`GET /api/department`
- 作用：部门管理页、部门下拉树、负责人展示

返回示例：

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "总公司",
      "userId": 3,
      "userName": "趣动久久",
      "managerUserIds": [3, 5],
      "managerUsers": [
        {
          "id": 3,
          "realName": "趣动久久"
        },
        {
          "id": 5,
          "realName": "C岗测试"
        }
      ],
      "superiorDepartmentId": null
    }
  ]
}
```

前端处理建议：

- 列表页负责人列优先显示 `managerUsers`
- 如果只是做回填，可直接用 `managerUserIds`
- 不要再用 `userName` 驱动“单负责人选择器”

### 4.3 获取单个部门详情

- 接口：`GET /api/department/{departmentId}`
- 作用：部门编辑页回填、多负责人展示、部门树详情
- 异常约定：当 `departmentId` 不存在时，后端返回 `404`

返回示例：

```json
{
  "code": 200,
  "data": {
    "id": 5,
    "name": "白班",
    "userId": 5,
    "userName": "C岗测试",
    "managerUserIds": [5, 9],
    "managerUsers": [
      {
        "id": 5,
        "realName": "C岗测试"
      },
      {
        "id": 9,
        "realName": "白班协管"
      }
    ],
    "isAjobDepartment": false,
    "superiorDepartmentId": 2,
    "departments": []
  }
}
```

前端处理建议：

- 编辑弹窗默认值请使用 `managerUserIds`
- 展示负责人标签请使用 `managerUsers`
- `userId`、`userName` 只做兼容兜底，不作为主逻辑字段

### 4.4 新增部门

- 接口：`POST /api/department`
- 作用：创建部门并保存多个负责人

推荐请求体：

```json
{
  "name": "测试部门",
  "managerUserIds": [3, 5],
  "superiorDepartmentId": 1,
  "isAjobDepartment": false
}
```

兼容请求体：

```json
{
  "name": "测试部门",
  "userId": 3,
  "superiorDepartmentId": 1,
  "isAjobDepartment": false
}
```

说明：

- 新页面统一提交 `managerUserIds`
- 旧页面仍可只提交 `userId`
- 如果 `managerUserIds` 为空且 `userId > 0`，后端会把 `userId` 自动转成单负责人列表

### 4.5 修改部门

- 接口：`PUT /api/department/{departmentId}`
- 作用：更新部门信息并覆盖负责人绑定关系

推荐请求体：

```json
{
  "name": "测试部门",
  "managerUserIds": [3, 5],
  "superiorDepartmentId": 1,
  "isAjobDepartment": false
}
```

说明：

- 更新时按“本次提交结果”覆盖负责人集合
- 前端编辑页提交前应以当前多选值完整回传，不要只传增量

### 4.6 获取单个用户详情

- 接口：`GET /api/user/{userId}`
- 作用：用户编辑页回填分管部门多选值
- 异常约定：当 `userId` 不存在时，后端返回 `404`

返回示例：

```json
{
  "userName": "test",
  "username": "test@163.com",
  "realName": "测试用户",
  "phoneNumber": "15677097705",
  "account": "xyz",
  "departmentId": 7,
  "job": 0,
  "hiredate": "2020-09-23T09:43:48.05",
  "remark": "string",
  "jobNumber": "A001",
  "manageDepartmentIds": [5, 7],
  "manageDepartmentId": 5,
  "photo": "string",
  "userRoles": ["员工"],
  "workingStatus": 1,
  "leavedate": "0001-01-01T00:00:00"
}
```

前端处理建议：

- 编辑用户时，分管部门多选控件直接绑定 `manageDepartmentIds`
- 若旧页面仍是单选控件，可临时继续读 `manageDepartmentId`

### 4.7 创建用户

- 接口：`POST /api/user`
- 作用：创建用户并绑定其分管部门

推荐请求体：

```json
{
  "realName": "测试",
  "phoneNumber": "12345678901",
  "account": "xyz",
  "departmentId": 7,
  "job": 0,
  "hiredate": "2020-09-23T09:43:48.05",
  "remark": "string",
  "jobNumber": "string",
  "manageDepartmentIds": [5, 7],
  "photo": "string",
  "password": "string",
  "confirmPassword": "string",
  "userRoles": ["员工"]
}
```

兼容请求体：

```json
{
  "realName": "测试",
  "departmentId": 7,
  "manageDepartmentId": 5,
  "userRoles": ["员工"]
}
```

说明：

- 推荐统一提交 `manageDepartmentIds`
- 若 `manageDepartmentIds` 为空且 `manageDepartmentId > 0`，后端会自动转成单元素数组
- 若提交的部门 Id 不存在，后端会返回 `分管部门不存在: xxx`

### 4.8 修改用户

- 接口：`PUT /api/user/{userId}`
- 作用：更新用户信息并覆盖用户分管部门绑定关系

推荐请求体：

```json
{
  "workingStatus": 0,
  "leavedate": "2022-01-07T03:37:05.339Z",
  "realName": "string",
  "phoneNumber": "string",
  "account": "string",
  "departmentId": 7,
  "job": 0,
  "hiredate": "2022-01-07T03:37:05.339Z",
  "remark": "string",
  "jobNumber": "string",
  "manageDepartmentIds": [5, 7],
  "photo": "string",
  "password": "string",
  "confirmPassword": "string",
  "userRoles": ["员工"]
}
```

说明：

- 推荐统一提交 `manageDepartmentIds`
- 更新时也按覆盖处理，不是增量追加
- 若前端要取消全部分管部门，提交空数组即可

### 4.9 额度相关接口的分管范围约束

以下额度接口现在也已经接入新的分管范围校验：

- `GET /api/quota/manage`
- `GET /api/quota/{quotaId}`
- `POST /api/quota`
- `PUT /api/quota/{quotaId}`
- `DELETE /api/quota/{quotaId}`

当前规则：

- `B岗` 和 `超管` 仍可按原逻辑管理全部额度数据
- 普通分管人只能查看、创建、修改、删除自己分管部门范围内用户的额度数据
- 如果前端传入的目标 `UserId` 不在当前分管范围内，后端会返回 `401/Unauthorized`

前端影响：

- 额度管理页中的用户选择范围，建议限制在当前分管范围内的用户
- 如果前端仍允许选到非分管范围用户，提交后会被后端直接拒绝

## 5. 数据范围变化说明

本次除了字段变化，还有一项对前端有感知的行为变化：

- 原来一个负责人只能看到一个负责部门对应的数据范围
- 现在一个负责人可看到“自己负责的多个部门及其下级部门”的并集范围

并且这套范围现在不只影响查询，也影响部分写操作权限。

这部分不要求前端额外传新参数，但会影响以下页面的数据结果：

- 业绩管理
- 玩家信息/订单/角色相关 manage 页面
- 统计、排行、工资等按分管范围查询的页面
- 额度管理页面的查看、新增、修改、删除

前端理解方式：

- 如果某个用户新绑定了多个分管部门，那么这些 manage 页面查出来的数据会比以前多
- 这是后端按新绑定关系自动生效，不需要前端手工合并部门树
- 对额度页面来说，不仅查询范围会变化，可操作的目标用户范围也会同步变化

## 6. 前端改造建议

### 6.1 部门管理页

- 负责人选择控件从单选改为多选
- 保存时提交 `managerUserIds`
- 详情和列表展示优先读取 `managerUsers`

### 6.2 用户管理页

- 用户新增/编辑页面增加“分管部门”多选控件
- 保存时提交 `manageDepartmentIds`
- 编辑回填时读取 `manageDepartmentIds`

### 6.3 登录态与筛选初始化

- 任何依赖当前用户负责部门的页面，优先读取 `resDepartmentIds`
- 如果页面仍是单部门默认选择，可以临时取 `resDepartmentIds[0]`

## 7. 联调注意事项

### 7.1 不要混用新旧字段作为主逻辑

错误方式：

- 新页面仍只读 `userId`
- 新页面仍只提 `manageDepartmentId`
- 新页面仍只用 `resDepartmentId` 初始化全部逻辑

正确方式：

- 多负责人统一用数组字段
- 兼容字段只作为旧代码兜底

### 7.2 更新接口是覆盖，不是追加

无论是部门负责人还是用户分管部门，更新接口都以本次提交的完整数组为准。

这意味着前端在编辑时要传“最终结果”，而不是“本次新增的项”。

### 7.3 空值处理

- 用户可不分管任何部门，此时 `manageDepartmentIds` 可传空数组
- 部门也可没有负责人，此时 `managerUserIds` 可传空数组
- 兼容字段在无数据时通常返回 `0` 或空值

## 8. 推荐联调顺序

1. 先联调 `GET /api/department` 和 `GET /api/department/{id}`，把部门负责人多选回填打通
2. 再联调 `POST /api/department` 和 `PUT /api/department/{id}`，确认多负责人保存正确
3. 再联调 `GET /api/user/{id}`、`POST /api/user`、`PUT /api/user/{id}`，把用户分管部门多选打通
4. 最后联调 `GET /api/user`，把登录态里的 `resDepartmentIds` 切到新逻辑

## 9. 本次对接结论

前端本次真正需要切换的主字段只有三组：

- 当前登录用户负责部门：`resDepartmentIds`
- 部门负责人：`managerUserIds` / `managerUsers`
- 用户分管部门：`manageDepartmentIds`

如果前端完成以上三处切换，就可以完整支持“一个部门多个分管人，一个人分管多个部门”的新逻辑。
