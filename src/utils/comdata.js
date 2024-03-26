export const statusData = [
  { id: "1", descs: "未领用" },
  { id: "2", descs: "已领" },
  { id: "3", descs: "已归还" },
  { id: "4", descs: "遗失" },
  { id: "5", descs: "报废" },
  { id: "6", descs: "登记错误" },
];

export const hrStatus = [
  { itemid: "0", itemname: "在职" },
  { itemid: "1", itemname: "离职" },
  { itemid: "2", itemname: "离职提交" },
  { itemid: "3", itemname: "未入职" },
  { itemid: "4", itemname: "储备" },
];

export const mealsType = [
  { itemid: "1", itemname: "早" },
  { itemid: "2", itemname: "中" },
  { itemid: "3", itemname: "晚" },
  { itemid: "4", itemname: "夜" },
  { itemid: "5", itemname: "次早" },
];

export const pritemType = [
  { itemid: "0", itemname: "手工" },
  { itemid: "1", itemname: "计算" },
  { itemid: "2", itemname: "链接" },
  { itemid: "3", itemname: "累计" },
];
export const stopKQ = [
  { itemid: "0", itemname: "考勤人员" },
  { itemid: "1", itemname: "停考人员" },
];

export const avOptions = [
  { itemid: "0", itemname: "积假明细" },
  { itemid: "1", itemname: "积假加班" },
  { itemid: "2", itemname: "积假假单" },
];

export const alOptions = [
  { itemid: "0", itemname: "年假明细" },
  { itemid: "1", itemname: "年假单" },
];

export const chkMoney = (val) => {
  if (!val) {
    val = 0.0;
  }
  const str = val;

  const regex = /^[-+]?\d*\.?\d+$/;

  return regex.test(str);
};
