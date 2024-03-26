// const table = [
//   {
//     emid: "1001",
//     dept: "1",
//     grade: "1",
//     sex: "1",
//     comid: "1",
//     奖金: 156.2567,
//     salary: 200.2567,
//   },
//   {
//     emid: "1002",
//     dept: "2",
//     grade: "0",
//     sex: "1",
//     comid: "1",
//     奖金: 156.2567,
//     salary: 250.2567,
//   },
//   {
//     emid: "1003",
//     dept: "1",
//     grade: "1",
//     sex: "0",
//     comid: "1",
//     奖金: 156.2567,
//     salary: 100.2567,
//   },
//   {
//     emid: "1004",
//     dept: "2",
//     grade: "0",
//     sex: "1",
//     comid: "1",
//     奖金: 156.2567,
//     salary: 250.2567,
//   },
//   {
//     emid: "1005",
//     dept: "1",
//     grade: "1",
//     sex: "0",
//     comid: "1",
//     奖金: 156.2567,
//     salary: 300.2567,
//   },
//   {
//     emid: "1006",
//     dept: "2",
//     grade: "0",
//     sex: "1",
//     comid: "1",
//     奖金: 156.2567,
//     salary: 350.2567,
//   },
// ];
// // console.log(table);
// //显示的字段
// const flds = ["emid", "salary"];
// //分组的字段
// // const gFlds = ["comid", "dept", "grade", "sex"];
// const gFlds = ["comid", "dept"];
// //需要合计的字段
// const sumFlds = ["salary", "奖金"];

//字段属性：
const FP_Obj = { fld: "id", descs: "id", width: "auto", show: 0, grpsum: 0 };
//-----------------
const grpData = (grpObj, data) => {
  const ids = [];
  data.forEach((item) => {
    let obj = { id: "", descs: "", data: [] };
    let id = "";
    let descs = "";
    grpObj.forEach((gb) => {
      id += item[gb.fld] + "#";
      descs += gb.descs + "#";
    });
    obj.id = id;
    obj.descs = descs;
    obj.data.push(item);
    if (ids.length == 0) {
      ids.push(obj);
    } else {
      let ishas = false;
      for (let i = 0; i < ids.length; i++) {
        if (ids[i]["id"] == id) {
          ids[i]["descs"] == descs;
          ids[i]["data"].push(item);
          ishas = true;
          break;
        }
      }
      if (!ishas) {
        ids.push(obj);
      }
    }
  });
  return ids.sort((a, b) => {
    return a.id.localeCompare(b.id);
  });
};

const Tgrp = (data) => {
  let tids = [];
  let s = "";
  data.forEach((item) => {
    let ids = item.id.split("#");
    for (let i = 0; i < ids.length - 1; i++) {
      s = "";
      for (let j = 0; j <= i; j++) {
        s += ids[j] + "#";
      }
      if (tids.indexOf(s) == -1) {
        tids.push(s);
      }
    }
  });
  return tids.sort();
};

const Dgrp = (data) => {
  let pids = [];
  let grpids = [];
  let repStruct = [];
  const tmp = [];
  let s = "";
  for (let i = 0; i < data.length; i++) {
    grpids.push(data[i]);
    if (i == data.length - 1) {
      grpids.push(data[i]);
      for (let i = pids.length - 1; i >= 0; i--) {
        grpids.push(pids[i]);
        pids.splice(i, 1);
      }
    } else {
      let node = data[i];
      let nextNode = data[i + 1];

      //   console.log(node, nextNode);
      let nLen = node.split("#").length;
      let nNLen = nextNode.split("#").length;
      //parent node
      if (nLen < nNLen) {
        pids.push(node);
      }
      //brother node
      if (nLen == nNLen) {
        grpids.push(node);
      }
      //finished parent node
      if (nLen > nNLen) {
        // console.log("-----", node, nextNode, pids);
        grpids.push(node);
        for (let i = pids.length - 1; i >= 0; i--) {
          let pLen = pids[i].split("#").length;
          //   console.log("--", pids[i], pLen, ">=", nNLen);
          if (pLen >= nNLen) {
            grpids.push(pids[i]);
            pids.splice(i, 1);
          }
        }
      }
    }
  }
  let margin = 2;
  grpids.forEach((gid) => {
    if (tmp.includes(gid)) {
      // repStruct.forEach((node) => {
      //   if (node.id == gid) {
      //     repStruct.push({ id: gid, grptype: "foot", margin: node["margin"] });
      //   }
      // });
      repStruct.push({ id: gid, grptype: "foot", margin });
    } else {
      repStruct.push({ id: gid, grptype: "head", margin });
    }
    margin += 0;
    tmp.push(gid);
  });
  return repStruct;
};

const sumGrp = (tids, sumFlds, grpdata, grpObj) => {
  const sumData = [];
  //遍历树结构
  tids.forEach((tel) => {
    // console.log(">", tel);
    let obj = {};
    let headCount = 0;
    //遍历数据
    grpdata.forEach((gd) => {
      //找到匹配数据
      if (gd.id.indexOf(tel) == 0) {
        // console.log("-->", gd.id);
        //遍历需要合计的字段
        gd.data.forEach((da) => {
          //   console.log("da", sumFlds);
          headCount++;
          sumFlds.forEach((fld) => {
            let val = Math.round(da[fld] * 100) / 100;
            // console.log("fld---->", fld, da[fld], val, obj[fld]);
            if (obj[fld]) {
              obj[fld] += val;
            } else {
              obj[fld] = val;
            }
            if (typeof obj[fld] === "number") {
              obj[fld] = Math.round(obj[fld] * 100) / 100;
            }
          });
        });
      }
    });
    sumData.push({ id: tel, sum: obj, headCount });
    // console.log("--------------", tel, obj, "--------------------------------");
  });

  sumData.forEach((sd) => {
    let ids = sd.id.split("#");
    let idsLen = ids.length - 1;
    sd.descs = grpObj[idsLen - 1]["descs"] + ":" + ids[idsLen - 1];
    sd.shortdescs = ids[idsLen - 1];
    sd.paddingleft = (idsLen - 1) * 20;
    grpdata.forEach((gd) => {
      if (sd.id === gd.id) {
        sd.data = gd.data;
      }
    });
  });
  //   console.log(sumData);
  return sumData;
};

const drawHeader = (opts, flds) => {
  let html = "";
  let colspan = 0;
  flds.forEach((fp) => {
    //如果需要显示详细内容
    if (opts.showData) {
      if (fp.show) {
        html += `<th width="${fp.width}%" class="hclk" data="${fp.fld}">${fp.descs}</th>`;
      }
    } else {
      //如果存在字段也同时是组合计字段
      if (fp.grpsum == 1) {
        html += `<th width="${fp.width}%">${fp.descs}</th>`;
      } else {
        //如果不是，那么把各自的边框去掉，让他看上去是一整个各自
        //比如有详细数据的时候，报表的抬头是要出现的，比如 工号和姓名，部门等
        //但如果没有详细数据的时候，一般就是合计出现，那么上面的抬头的内容为空，并把
        //所有空的的各自去掉。这告诉我们，财务数据必须放到报表的最后，而且需要合计的
        //数据字段必须是连续出现的，不能把合计字段和非合计字段混合。不然格子会出问题。
        html += `<th width="${fp.width}%" style="border-right-color:transparent;"></th>`;
      }
    }
    if (fp.show) {
      colspan++;
    }
  });
  html = `
            <thead>
              <tr class='headtr'><td colspan=${colspan}><div class='header'></div><div class='printdate'></div></td></tr>
              <tr style='background-color:lightgray;'>
                ${html} 
              </tr>
            </thead>`;
  return html;
};

const calgrpcolspan = (flds, sumFlds) => {
  let colspan = 0;
  flds.forEach((fld) => {
    if (fld.show == 1) {
      colspan++;
    }
  });

  let idx = 0;
  let sumfldsidx = [];
  flds.forEach((f) => {
    if (f.show == 1) {
      sumFlds.forEach((sf) => {
        if (f.fld == sf) {
          colspan = colspan > idx ? idx : colspan;
          sumfldsidx.push(idx);
        }
      });
      idx++;
    }
  });
  return { colspan, sumfldsidx };
};

//通过字段来匹配字段的属性，必须在drawhead之前处理，否则没用。
//主要是控制字段再报表中的长度和描述，非常重要。
const defFlds = (options) => {
  let opts = {
    sumgrp: "foot",
    showData: true,
    showGrpHead: true,
    showGrpFoot: true,
    eachRowHead: false,
    showGrpFootTitle: true,
    showGrpHeadTitle: true,
  };

  Object.keys(options).forEach((v) => {
    opts[v] = options[v];
  });

  return opts;
};

const drawRow = (data, rows, gids, fld_obj, colspan, opts = {}) => {
  const tmp = [];

  let flds = [];
  fld_obj.forEach((fld) => {
    if (fld.show == 1) {
      flds.push(fld.fld);
    }
  });

  let html = "";
  let htmlrowhead = "";
  let td = [];
  let idx = 0;
  let cssdisplay = "";
  if (gids && gids.length > 0) {
    //遍历结构
    gids.forEach((gid) => {
      // console.log(gid, colspan, tmp);

      //遍历数据
      rows.forEach((fld) => {
        if (gid.id == fld.id) {
          //判断组合计是在组头，还是组尾合计
          if (gid.grptype == opts.sumgrp) {
            cssdisplay = opts.showGrpFoot ? "" : "display:none;";
            html = `<tr  style='${cssdisplay}font-weight:700;font-style:italic;background-color:lightgray;font-size:7px;'>
                      <td  style="padding-left:${
                        fld.paddingleft
                      }px;text-align:left;" colspan=${colspan.colspan} >${
              opts.showGrpFootTitle ? fld.descs : fld.shortdescs
            } 合计： hc:${fld.headCount}</td>`;
            idx = 0;

            flds.forEach((f) => {
              if (colspan.sumfldsidx.includes(idx)) {
                html += `<td align='center'>${fld.sum[f]}</td>`;
              } else {
                //判断必须大于colspan后再写空位置，否则不需要。
                if (idx >= colspan.colspan) {
                  html += `<td style='border-right:0px'></td>`;
                }
              }
              idx++;
            });
            html += "</tr>";
            // if (!opts.showGrpFoot) {
            //   html = "";
            // }
          } else {
            cssdisplay = opts.showGrpHead ? "" : "display:none;";
            html = `<tr style='${cssdisplay}font-weight:700;'><td style="text-align:left;padding-left:${
              fld.paddingleft
            }px;" colspan=${flds.length}>${
              opts.showGrpHeadTitle ? fld.descs : fld.shortdescs
            }</td><tr>`;
          }
          td.push(html);

          //把组中带有data就是detail的数据显示出来；这里需要一个开关，把DETAIL不显示。
          if (fld.data && !tmp.includes(fld.id)) {
            tmp.push(fld.id);
            fld.data.forEach((d) => {
              htmlrowhead =
                "<tr align='center' style='border-bottom:1px solid transparent;'>";
              html = "<tr align='center' class='rc'>";
              flds.forEach((f) => {
                htmlrowhead += `<td width='10%'>${f}</td>`;

                if (
                  typeof d[f] === "number" ||
                  /^[sS]\d{2,3}$/.test(f) ||
                  /^[0-9]+[.]?[0-9]+$/.test(d[f])
                ) {
                  if (d[f]) {
                    d[f] = Math.round(d[f] * 100) / 100;
                  } else {
                    d[f] = "";
                  }
                }
                if (!d[f]) {
                  d[f] = "";
                }

                html += `<td  class='${f}'>${d[f]}</td> `;
              });
              htmlrowhead += "</tr>";
              html += "</tr>";

              if (opts.showData) {
                if (opts.eachRowHead) {
                  td.push(htmlrowhead);
                }
                td.push(html);
              }
            });
          }
        }
      });
    });
  } else {
    //没有组和结构的时候，就得用直接整

    data.forEach((d) => {
      htmlrowhead =
        "<tr align='center' style='border-bottom:1px solid transparent;'>";
      html = "<tr align='center' class='rc'>";
      flds.forEach((f) => {
        htmlrowhead += `<td width='10%'>${f}</td>`;
        console.log(f, d[f], /^[0-9]+[.]?[0-9]+$/.test(f));
        if (
          typeof d[f] === "number" ||
          /^[sS]\d{2,3}$/.test(f) ||
          /^[0-9]+[.]?[0-9]+$/.test(d[f])
        ) {
          if (d[f]) {
            d[f] = Math.round(d[f] * 100) / 100;
          } else {
            d[f] = "";
          }
        }
        if (!d[f]) {
          d[f] = "";
        }

        html += `<td  class='${f}'>${d[f]}</td> `;
      });
      htmlrowhead += "</tr>";
      html += "</tr>";

      if (opts.showData) {
        if (opts.eachRowHead) {
          td.push(htmlrowhead);
        }
        td.push(html);
      }
    });
  }

  html = ` <tfoot>
              <tr class='foottr'>
                <td colspan='${flds.length}'>
                   <div class='footer'><span class="pgnum">Page</span></div>
                </td>
              </tr>
           </tfoot>
                  <div class='nextpage'></div>`;
  td.push(html);
  return td.join("");
};

const IntegrateFlds = (
  data,
  showflds = [],
  grpflds = [],
  sumflds = [],
  fldprop = []
) => {
  if (!data || data.length === 0) {
    return [];
  }

  //如果flds中的字段名称等于fldprop中的字段fld的值，那么在判断
  //fldprop 中fld,descs,width,sort是否存在，不存在就给一个默认值。
  //如果fldprop中没有和flds中所匹配的值，那么就直接加入带有上面4个特性的对象
  //然后push到新的数组中

  let newData = [];

  const flds = Object.keys(data[0]);

  //1:去掉ID,SYSID...
  //这里需要把flds中如果包括了ID，和SYSID的默认要去掉，因为这些数据
  //最好不要出现在报表中。当然如果你要出现，可以再showflds中加入即可。
  flds.forEach((f, idx) => {
    if (["id", "sysid"].includes(f)) {
      flds.splice(idx, 1);
    }
  });
  //

  //2:合并字段
  //如果showfld中有数据集中没有的字段，就加入。
  //比如 rct 这个数据计数字段，本身不存在在任何表中，但报表需要，所以需要加入。
  //也可以把id，sysid 加入进去，默认为了安全再上一步去掉的。
  showflds.forEach((k) => {
    if (!flds.includes(k)) {
      flds.push(k);
    }
  });

  //3:合并字段属性
  flds.forEach((f, idx) => {
    let ishas = false;
    let fdidx = 0;
    for (let fp of fldprop) {
      fdidx++;
      if (f === fp.fld) {
        // console.log(f, "=====", fp.fld, fp.descs ? fp.descs : fp.fld);
        ishas = true;
        fp.descs = fp.descs ? fp.descs : fp.fld;
        fp.width = fp.width ? fp.width : 0;

        //showflds是show的唯一依据。
        //show的主要依据是showflds中是否存在，如果存在就是1，不存在就是0；
        fp.show = showflds.includes(fp.fld) ? 1 : 0;

        //sumflds是sum的唯一依据。
        fp.grpsum = sumflds.includes(fp.fld) ? 1 : 0;
        //这是组的序，默认为99.grpidx 简写：gi
        //如果本身fldprop中存在，就默认存在，否则就为0
        //无论存不存，最后都需要根据sumflds这个字段更新。
        //当然sumflds也可以不存在,直接通过fldprop来。

        //如果grpflds 中存在，就按grpflds中的来。
        fp.grp = grpflds.indexOf(f);

        //4: sort 必须默认为50以上，根据showflds为准。
        fp.sort = fp.sort ? fp.sort : fdidx + 50;
        //不需要下面的，因为sort可以直接改，所以按本来的sort为主，没有的话，按顺即可。
        //这里不删除的原因是提示不要加如下语句。
        // fp.sort = showflds.indexOf(f) > -1 ? showflds.indexOf(f) : fdidx + 50;

        newData.push(fp);
        break;
      }
    }
    //这里的意思只是fldprop中没有存在，其他正常情况下只有RCT存在，其他一般没有。
    if (!ishas) {
      if (!newData.includes(f)) {
        newData.push({
          fld: f,
          descs: f,
          width: 0,
          show: showflds.includes(f) ? 1 : 0,
          grpsum: sumflds.includes(f) ? 1 : 0,
          grp: grpflds.indexOf(f),
          //4:只要showflds中存在，就把需要给它，否则50以上。
          sort: showflds.indexOf(f) > -1 ? showflds.indexOf(f) : fdidx + 50,
        });
      }
    }
  });

  //按照FLDS的默认排序，就是先后排序。这样比较容易。除非sort中已经指定了
  newData.sort((a, b) => {
    return a.sort - b.sort;
  });
  //console.log("000000000000000000000000", newData);
  return newData;
};

const filterData = (data, fltData) => {
  if (!fltData) {
    return data;
  }
  const tableData = [];
  for (let pd of data) {
    let isyes = true;
    for (let k of Object.keys(fltData)) {
      if (!fltData[k].includes(pd[k])) {
        isyes = false;
      }
      if (!isyes) {
        break;
      }
    }
    if (isyes) {
      tableData.push(pd);
    }
  }
  // console.log(tableData, fltData);
  return tableData;
};

const getGrpObj = (flds) => {
  const glds = [];
  for (let g of flds) {
    if (g.grp > -1) {
      glds.push(g);
    }
  }
  glds.sort((a, b) => a.grp - b.grp);
  return glds;
};

const drawRep = async (table, flds, options = {}) => {
  const html = [];

  if (!table || table.length === 0) {
    return html;
  }

  //**1：想过滤数据，根据设置过滤，没有就返回空，不需要在操作了 */
  const tableData = filterData(table, options.filterOpts);
  if (!tableData || tableData.length === 0) {
    return html;
  }

  //***2 这里其实是合并数据，不要在这里做了，一般为做好了再导入进来，因为保存的时候，只保存一个整合的数据即可，不需要在整合*/
  // const fldsX = IntegrateFlds(tableData, flds, sumFlds, options.fldprop);

  //3:这里是设置组数据。
  const grpObj = getGrpObj(flds);
  //console.log("111 grpobj==========", flds, grpObj);

  const grpdata = grpData(grpObj, tableData);
  //console.log("222 grpdata==========", grpdata);

  const tids = Tgrp(grpdata);
  //console.log("333 tids==========", tids);
  const gids = Dgrp(tids);
  //console.log("gids ==========", gids);

  const sumflds = [];
  flds.filter((el) => {
    if (el.grpsum == 1) {
      sumflds.push(el.fld);
    }
  });
  //console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", sumflds);

  const sumData = sumGrp(tids, sumflds, grpdata, grpObj);

  //console.log("sumData==========sumData", sumData);

  const colspan = calgrpcolspan(flds, sumflds);

  //console.log("colspan==========colspan", colspan);

  const opts = defFlds(options);

  const header = drawHeader(opts, flds);
  // console.log(header);
  const row = drawRow(tableData, sumData, gids, flds, colspan, opts);
  // console.log(row);

  html.push(header);
  html.push(row);

  return html.join("");
};

module.exports = {
  drawRep,
  IntegrateFlds,
  filterData,
};
