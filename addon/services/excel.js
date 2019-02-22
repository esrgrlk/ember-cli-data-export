import Service from '@ember/service';
import optionize from "../utils/utils";

const defaultConfig = {
  sheetName: 'Sheet1',
  fileName: 'export.xlsx'
};

export default Service.extend({

  export : function(data, options) {

    options = optionize(options, defaultConfig);

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!==s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
      return buf;
    }

    function datenum(v, date1904) {
      if(date1904) { v+=1462; }
      var epoch = Date.parse(v);
      return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function isDateString(str){
      if(str && str.length === 10){
        if(!isNaN(str[0]) && !isNaN(str[1]) && !isNaN(str[3]) && !isNaN(str[4]) && !isNaN(str[6]) && !isNaN(str[7]) && !isNaN(str[8]) && !isNaN(str[9])){
          if((str[2] === "." && str[5] === ".") || (str[2] === "/" && str[5] === "/")){
            return true;
          }
        }
      }
      return false;
    }

    function sheet_from_array_of_arrays(data, headerRows=[0]) {
      var ws = {};
      var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
      for(var R = 0; R !== data.length; ++R) {
        for(var C = 0; C !== data[R].length; ++C) {
          if(range.s.r > R) { range.s.r = R; }
          if(range.s.c > C) { range.s.c = C; }
          if(range.e.r < R) { range.e.r = R; }
          if(range.e.c < C) { range.e.c = C; }
          let cellObject = data[R][C];

          let cell;
          var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

          // if type is given do not look for another type through value
          if(typeof cellObject === 'object'){
            cell = {v: cellObject.v, t: cellObject.t}

            if(cell.v == null) { continue; }

            if(headerRows.includes(R)){
              cell.s = {font: {bold: true}, alignment: {horizontal: "center"}};
            }

          }
          else{
            cell = {v: cellObject};

            if(cell.v == null) { continue; }

            if(headerRows.includes(R)){
              cell.s = {font: {bold: true}, alignment: {horizontal: "center"}};
            }

            if(typeof cell.v === 'number') { cell.t = 'n'; }
            else if(typeof cell.v === 'boolean') { cell.t = 'b'; }
            else if((typeof cell.v === 'object') && (cell.v._d instanceof Date)) {
              cell.t = 'n'; cell.z = XLSX.SSF._table[14];
              cell.v = datenum(cell.v._d);
            }
            else {
              if(cell.v){
                let cellValue = cell.v;
                cellValue = cellValue.trim();
                let isDateStr = isDateString(cellValue);

                if(isDateStr){
                  let datePattern = /(\d{2})\.(\d{2})\.(\d{4})/;
                  let dateObject = new Date(cellValue.replace(datePattern,'$3-$2-$1'));
                  cell.v = dateObject;
                  cell.t = 'd';
                }
                else{
                  let cellValueCommasReplacedWithDots = cellValue;
                  let cellValueStartsWithDollar = (cellValueCommasReplacedWithDots[0] === '$');
                  if(cellValueStartsWithDollar){
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.substr(1);
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.replace(/\./g, "___");
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.replace(/\,/g, ".");
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.replace(/___/g, ",");
                  }

                  let cellValueStartsWithPound = (cellValueCommasReplacedWithDots[0] === '£');
                  if(cellValueStartsWithPound){
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.substr(1);
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.replace(/\./g, "___");
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.replace(/\,/g, ".");
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.replace(/___/g, ",");
                  }

                  let cellValueEndsWithTL = (cellValueCommasReplacedWithDots[cellValueCommasReplacedWithDots.length - 1] === '₺');
                  if(cellValueEndsWithTL){
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.substr(0, cellValueCommasReplacedWithDots.length - 1);
                  }

                  let cellValueEndsWithEUR = (cellValueCommasReplacedWithDots[cellValueCommasReplacedWithDots.length - 1] === '€');
                  if(cellValueEndsWithEUR){
                    cellValueCommasReplacedWithDots = cellValueCommasReplacedWithDots.substr(0, cellValueCommasReplacedWithDots.length - 1);
                  }

                  let cellValueDefaultNumber = cellValueCommasReplacedWithDots.replace(/\./g, "");
                  cellValueDefaultNumber = cellValueDefaultNumber.replace(/\,/g, ".");

                  if(!isNaN(cellValueDefaultNumber)){
                    let formattedNumberString = '###,###,###,###,##0.00';
                    if(!cellValueDefaultNumber.includes('.')){
                      formattedNumberString = '###,###,###,###,###';
                    }
                    cell.v = parseFloat(cellValueDefaultNumber);
                    if(cellValueStartsWithDollar){
                      formattedNumberString = '$' + formattedNumberString;
                    }
                    if(cellValueStartsWithPound){
                      formattedNumberString = '£' + formattedNumberString;
                    }
                    if(cellValueEndsWithTL){
                      formattedNumberString = formattedNumberString + '₺';
                    }
                    if(cellValueEndsWithEUR){
                      formattedNumberString = formattedNumberString + '€';
                    }
                    cell.z = formattedNumberString;
                    cell.t = 'n';
                  }
                  else{
                    cell.t = 's';
                  }
                }
              }
              else{
                cell.t = 's';
              }
            }
          }

          ws[cell_ref] = cell;
        }
      }

      let wscols = [
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20},
        {wch:20}
      ];
      ws['!cols'] = wscols;

      if(range.s.c < 10000000) { ws['!ref'] = XLSX.utils.encode_range(range); }
      return ws;
    }

    function Workbook() {
      if(!(this instanceof Workbook)) { return new Workbook(); }
      this.SheetNames = [];
      this.Sheets = {};
    }

    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    /* add worksheet to workbook */
    wb.SheetNames.push(options.sheetName);
    wb.Sheets[options.sheetName] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), options.fileName);

  }

});
