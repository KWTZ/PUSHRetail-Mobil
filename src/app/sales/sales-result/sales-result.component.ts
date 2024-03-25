import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { DataService } from 'src/app/_services/data.service';
import { CustomUtilityService } from 'src/app/_services/customUtilites.service';

import de from '@angular/common/locales/de';


@Component({
  selector: 'app-sales-result',
  templateUrl: './sales-result.component.html',
  styleUrls: ['./sales-result.component.css']
})
export class SalesResultComponent implements OnInit {

  sqlCategory="Select idProductCategory as ID, productCategory as viewValue from prd_categories order by productCategory";
  sqlLine="Select idProductLine as ID, productLine as viewValue, cl.idCategory as idProductCategory from prd_lines l left join prd_categories_lines cl on l.idProductLine=cl.idLine order by productline";
  sqlProduct='Select idProduct as ID,  concat(productName," --- ", replace(format(productprice,2),".", ","), " €")  as viewValue, idProductLine, replace(format(productprice,2),".", ",") as price from prd_products order by productname';
  sqlSales = 'SELECT  p.productName, replace(format(s.quantity, 0), ".", ",") as quantity ' +
            ', replace(format(s.price, 2), ".", ",") as price , replace(format(s.quantity*s.price,2), ".", ",") as total, salesdate ' +
            'FROM `prd_sales` s  left join prd_products p on s.idProduct=p.idProduct ' +
            'where promoterNo="@promoterNo"';
  sqlInsertSales='INSERT INTO `prd_sales`( `idProduct`, `quantity`, `price`, `salesdate`, `promoterNo`, `internalPosNo`, `modified`, `modifiedBy`, `created`, `createdBy`) ' +
      'VALUES(' ;

  listCategory;
  listLine;
  listProducts;
  listSales;
  listSalesDaily;


  filteredListLine;
  filteredListProducts;


  selectedCategory;
  selectedLine;
  selectedProductID;
  selectedProduct;
  selectedProductPrice;
  quantity;

  dailyTotal;
  dailyTotalFocus;

  monthlyTotal;
  monthlyTotalFocus;

  promoterNo;
  currentAssign;
  salesDate;

  flagQuantity=false;
  isValid=true;
  callbackReport=false;

  constructor(private dataservice: DataService,
    private util:CustomUtilityService) { }

  ngOnInit(): void {
    registerLocaleData( de );
    let promoter = JSON.parse(localStorage.getItem("promoter"));
    this.promoterNo=promoter['promoterNo']
    this.currentAssign = JSON.parse(localStorage.getItem("assignment"));
    this.salesDate=this.currentAssign['operationDate'];
    this.getData();
    this.calcTotals();
      
  }

  getData() {
      let sqlSales = this.sqlSales.replace("@promoterNo", this.promoterNo);
      this.dataservice.getAll(this.sqlCategory).subscribe(data => { this.listCategory=data; });
      this.dataservice.getAll(this.sqlLine).subscribe(data => { this.listLine=data; this.filteredListLine=data});
      this.dataservice.getAll(this.sqlProduct).subscribe(data => { this.listProducts=data; this.filteredListProducts=data});
      this.dataservice.getAll(sqlSales).subscribe(data => { 
        this.listSales=data;
        this.listSalesDaily=data.filter(e=> e.salesdate.substring(0,10)==this.util.convertToSQLDate(this.currentAssign['operationDate']));
        this.calcTotals(); 
      });

      if(localStorage.getItem('report'))
        this.callbackReport=true;

      
  }

  doSave() {
    if(this.validate()) {
    let idPOS = this.currentAssign['internalPOSNo'];
    let sqlInsert = this.sqlInsertSales + this.selectedProductID + ", " + this.quantity + ", " + this.selectedProductPrice.replace(",", ".") + 
        ', "'+ this.util.convertToSQLDate(this.salesDate) + '", "' + this.promoterNo + '", ' + idPOS + ', CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, 0)';
    console.log(this.sqlInsertSales);
    this.dataservice.storeData(sqlInsert).subscribe(result => { console.log(result)});

    this.getData();
    this.calcTotals();
    
    this.selectedCategory=null;
    this.selectedLine=null;
    this.selectedProduct=null;
    this.selectedProductID=null;
    }

  }

  validate() {
    console.log("pl", this.selectedProductID)
    let valid=true;
    if(this.selectedProductID==null) 
        valid=false;
    if(this.quantity==null)
        valid=false;
    if(this.selectedProductPrice==undefined)
      valid=false;

    this.isValid=valid;

    return valid;

  }

  filterProductline() {
      this.filteredListLine=this.listLine.filter(e => e.idProductCategory==this.selectedCategory);
      this.selectedLine=null;
      this.selectedProduct=null;
  }

  filterProduct() {
    this.filteredListProducts = this.listProducts.filter(e => e.idProductLine == this.selectedLine)
    this.selectedProduct=null;
  }

  setProduct() {
      let arrProduct = this.filteredListProducts.filter(e=> e.ID==this.selectedProductID);
      this.selectedProductPrice=arrProduct[0]['price'];
  }


  calcTotals() {
    this.dailyTotal=0;
    this.dailyTotalFocus=0;
    this.monthlyTotal=0;
    this.monthlyTotalFocus=0;


    if (this.listSales!=undefined) {
      let today = new Date().getDate();
      let month = new Date().getMonth();
      

      this.listSales.forEach(element => {
          let sdate = new Date(element['salesdate']);
          console.log(element['salesdate'].substring(0,10), this.util.convertToSQLDate(this.currentAssign['operationDate']))
          if(element['salesdate'].substring(0,10)==this.util.convertToSQLDate(this.currentAssign['operationDate'])) {
            this.dailyTotal+=this.util.convertToNumberDOT(element['quantity'])*this.util.convertToNumberDOT(element['price']);
          }
          if (sdate.getMonth()==month) {
            this.monthlyTotal+=this.util.convertToNumberDOT(element['quantity'])*this.util.convertToNumberDOT(element['price']);
          }

      });
    }

  }
}


