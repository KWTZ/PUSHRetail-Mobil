import { Component, OnInit } from '@angular/core';
import de from '@angular/common/locales/de';
import { DataService } from 'src/app/_services/data.service';


@Component({
  selector: 'app-outofstock',
  templateUrl: './outofstock.component.html',
  styleUrls: ['./outofstock.component.css']
})
export class OutofstockComponent implements OnInit {

  sqlCategory="Select idProductCategory as ID, productCategory as viewValue from prd_categories order by productCategory";
  sqlLine="Select idProductLine as ID, productLine as viewValue, cl.idCategory as idProductCategory from prd_lines l left join prd_categories_lines cl on l.idProductLine=cl.idLine order by productline";
  sqlProduct='Select idProduct as ID,  concat(productName," --- ", replace(format(productprice,2),".", ","), " €")  as viewValue, idProductLine, replace(format(productprice,2),".", ",") as price from prd_products order by productname';
 
  sqlInsertOOS = "INSERT INTO prd_outofstock(idProduct, internalPOSNo, promoterNo,  reportingDate, remainQuantity, modifed, modifedBy, created, createdBy) VALUES ";

  categoryList;
  listLine;
  listProduct;

  selectedCategory;
  selectedLine;
  selectedProduct;
  remainQuantity;
  filteredLineList;
  filteredProductsList;

  isValid=false;

  promoterNo;
  currentAssign;


  constructor(private dataservice: DataService) {  }

  ngOnInit(): void {
    let promoter = JSON.parse(localStorage.getItem("promoter"));
    this.promoterNo=promoter['promoterNo']
    this.currentAssign = JSON.parse(localStorage.getItem("assignment"));
    this.getData();
  }

  getData(){
    this.dataservice.getAll(this.sqlCategory).subscribe(data => { this.categoryList=data; });
    this.dataservice.getAll(this.sqlLine).subscribe(data => { this.listLine=data; this.filteredLineList=data; });
    this.dataservice.getAll(this.sqlProduct).subscribe(data => { this.listProduct=data; this.filteredProductsList=data; });
  }

  filterProductline() {
      this.filteredLineList= this.listLine.filter(e => e.idProductCategory==this.selectedCategory);
      this.selectedLine=null;
      this.selectedProduct=null;
  }
  filterProduct(){
      this.filteredProductsList = this.listProduct.filter(e => e.idProductLine == this.selectedLine);
      this.selectedProduct=null;
  }

  setSend() {
    this.isValid = true;
  }

  doSave() {
    let sqlInsertOOS= "(" + this.selectedProduct + ', CURRENT_TIMESTAMP, ' + this.remainQuantity + ', CURRENT_TIMESTAMP, ' ;
  }

}

