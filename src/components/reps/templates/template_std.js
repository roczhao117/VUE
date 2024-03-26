export default {
  panels: [
    {
      index: 0,
      height: 297,
      width: 210,
      paperHeader: 49.5,
      paperFooter: 780,
      printElements: [
        {
          options: {
            left: 175.5,
            top: 10.5,
            height: 27,
            width: 259,
            title: "部门结构报表",
            fontSize: 19,
            fontWeight: "600",
            fontFamily: "宋体",
            textAlign: "center",
            lineHeight: 26,
            coordinateSync: true,
            widthHeightSync: true,
            draggable: false,
          },
          printElementType: { title: "表头", type: "text" },
        },
        {
          options: {
            left: 60,
            top: 27,
            height: 13,
            width: 52,
            title: "页眉",
            textAlign: "center",
          },
          printElementType: { title: "打印日期", type: "text" },
        },

        {
          options: { left: 30, top: 50, height: 10, width: 540 },
          printElementType: { title: "横线", type: "hline" },
        },

        {
          options: {
            left: 30,
            top: 65,
            height: 56,
            width: 540.5,
            field: "table",
            tableFooterRepeat: "",
            // tableHeaderCellBorder: "noBorder",
            // tableBorder: "noBorder",

            fields: [
              { text: "id", field: "id" },
              { text: "姓名", field: "name" },
              { text: "性别", field: "gender" },
              { text: "数量", field: "count" },
            ],

            columns: [
              [
                { width: 85.25, colspan: 1, rowspan: 1, checked: true },
                {
                  title: "id",
                  field: "id",
                  width: 85.25,
                  colspan: 1,
                  rowspan: 1,
                  checked: true,
                },
                {
                  title: "姓名",
                  field: "name",
                  width: 85.25,
                  align: "center",
                  colspan: 1,
                  rowspan: 1,
                  checked: true,
                  tableSummary: "count",
                },
                {
                  title: "姓名",
                  field: "name",
                  width: 85.25,
                  align: "center",
                  colspan: 1,
                  rowspan: 1,
                  checked: true,
                  tableSummary: "count",
                },
                {
                  title: "姓别",
                  field: "gender",
                  width: 85.25,
                  align: "center",
                  colspan: 1,
                  rowspan: 1,
                  checked: true,
                  tableSummary: "count",
                },

                {
                  title: "数量",
                  field: "count",
                  width: 85.25,
                  align: "center",
                  colspan: 1,
                  rowspan: 1,
                  checked: true,
                  tableSummary: "sum",
                },
                {
                  width: 85.25,
                  colspan: 1,
                  rowspan: 1,
                  checked: true,
                },
                { width: 85.25, colspan: 1, rowspan: 1, checked: true },
              ],
            ],
          },
          printElementType: {
            title: "表格",
            type: "table",
            groupFields: ["gender"],

            // footerFormatter: function (a, b, c, d) {

            //   return `${a}这里自定义统计头信息${a}`;
            // },
            groupFormatter: function (a, b, c, d, e) {
              return `   group formatter`;
            },
            groupFooterFormatter: function (a, b, c, d, e) {
              // let summary = {};
              // d.rows.forEach((item) => {
              //   if (summary[item.gender]) {
              //     summary[item.gender] += parseFloat(item.count);
              //   } else {
              //     summary[item.gender] = parseFloat(item.count);
              //   }
              // });
              // return `   Total Age for${d.gender} ${summary[d.gender]}`;
              // // return `${a}这里自定义统计脚信息${b.length}`;
              return "foot";
            },
          },
        },

        {
          options: { left: 12, top: 786, height: 49, width: 49 },
          printElementType: { title: "html", type: "html" },
        },
      ],
      paperNumberLeft: 565.5,
      paperNumberTop: 819,
    },
  ],
};
