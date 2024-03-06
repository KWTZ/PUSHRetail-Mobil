import { Component, OnInit } from '@angular/core';
import de from '@angular/common/locales/de';
import { DataService } from 'src/app/_services/data.service';


@Component({
  selector: 'app-sales-result',
  templateUrl: './sales-result.component.html',
  styleUrls: ['./sales-result.component.css']
})
export class SalesResultComponent implements OnInit {

  sqlCategory="Select idProductCategory as ID, productCategory as viewValue from prd_categories order by productCategory";
  sqlLine="Select idProductLine as ID, productLine as viewValue, idProductCategory from prd_lines order by productline";
  sqlProduct='Select idProduct as ID, productName as viewValue, idProductLine, replace(format(productprice,2),".", ",") as price from prd_products order by productname';
  sqlSales = 'SELECT  p.productName, replace(format(s.quantity, 2), ".", ",") as quantity ' +
            ', replace(format(s.price, 2), ".", ",") as price , replace(format(s.quantity*s.price,2), ".", ",") as total ' +
            'FROM `prd_sales` s  left join prd_products p on s.idProduct=p.idProduct ' +
            'where promoterNo="@promoterNo"';
  sqlInsertSales='INSERT INTO `prd_sales`( `idProduct`, `quantity`, `price`, `salesdate`, `promoterNo`, `internalPosNo`, `modified`, `modifiedBy`, `created`, `createdBy`) ' +
      'VALUES(' ;

  listCategory;
  listLine;
  listProducts;
  listSales;


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

  flagQuantity=false;

  constructor(private dataservice: DataService) { }

  ngOnInit(): void {
    let promoter = JSON.parse(localStorage.getItem("promoter"));
    this.promoterNo=promoter['promoterNo']
    this.currentAssign = JSON.parse(localStorage.getItem("assignment"));
     this.getData();
    this.calcTotals();
      
  }

  getData() {
      let sqlSales = this.sqlSales.replace("@promoterNo", this.promoterNo);
      this.dataservice.getAll(this.sqlCategory).subscribe(data => { this.listCategory=data; });
      this.dataservice.getAll(this.sqlLine).subscribe(data => { this.listLine=data; this.filteredListLine=data});
      this.dataservice.getAll(this.sqlProduct).subscribe(data => { this.listProducts=data; this.filteredListProducts=data});
      this.dataservice.getAll(sqlSales).subscribe(data => { this.listSales=data; console.log(this.listSales)});

      this.calcTotals();
  }

  doSave() {
    let idPOS = this.currentAssign['internalPOSNo'];
    this.sqlInsertSales+=this.selectedProductID + ", " + this.quantity + ", " + this.selectedProductPrice.replace(",", ".") + 
        ', CURRENT_TIMESTAMP, "' + this.promoterNo + '", ' + idPOS + ', CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, 0)';
    console.log(this.sqlInsertSales);
    this.dataservice.storeData(this.sqlInsertSales).subscribe(result => { console.log(result)});

    this.getData();
    this.calcTotals();

  }

  filterProductline() {
      this.filteredListLine=this.listLine.filter(e => e.idProductCategory==this.selectedCategory);
  }

  filterProduct() {
    this.filteredListProducts = this.listProducts.filter(e => e.idProductLine == this.selectedLine)
  }

  setProduct() {
      let arrProduct = this.filteredListProducts.filter(e=> e.ID==this.selectedProductID);
      this.selectedProductPrice=arrProduct[0]['price'];
  }

  setQuantity() {
      if(this.quantity>0)
        this.flagQuantity=true;
  }

  calcTotals() {

    this.dailyTotal=0;
    this.dailyTotalFocus=0;
    this.monthlyTotal=0;
    this.monthlyTotalFocus=0;

    this.listSales.forEach(element => {
        this.dailyTotal+=element['quantity']*element['price'];
    });

  }
}


