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
            'where promoterNo="9999"';
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

  constructor(private dataservice: DataService) { }

  ngOnInit(): void {
      this.getData();
      this.calcTotals();
  }

  getData() {
      this.dataservice.getAll(this.sqlCategory).subscribe(data => { this.listCategory=data; });
      this.dataservice.getAll(this.sqlLine).subscribe(data => { this.listLine=data; this.filteredListLine=data});
      this.dataservice.getAll(this.sqlProduct).subscribe(data => { this.listProducts=data; this.filteredListProducts=data});
      this.dataservice.getAll(this.sqlSales).subscribe(data => { this.listSales=data; });
  }

  doSave() {
    this.sqlInsertSales+=this.selectedProductID + ", " + this.quantity + ", " + this.selectedProductPrice.replace(",", ".") +
        "CURRENT_TIMESTAMP, 9999, 27, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP, 0)";
    this.dataservice.storeData(this.sqlInsertSales).subscribe(result => { console.log(result)});

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

  calcTotals() {
    this.dailyTotal='601,00';
    this.dailyTotalFocus='0';
    this.monthlyTotal='601,00';
    this.monthlyTotalFocus='0';
  }
}


