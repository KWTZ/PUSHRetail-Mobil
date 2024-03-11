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

  sqlOOS = 'Select idOOS, tblPD.productname, internalPOSNo, promoterNo, DATE_FORMAT(oos.reportingDate, "%d.%m.%Y") as reportdate , remainQuantity, settledDate ' +
        ' from prd_outofstock oos  left join prd_products tblPD on oos.idProduct=tblPD.idProduct ' +
        ' where internalPOSNo=@internalPOSNo and promoterNo="@promoterNo" order by oos.reportingdate';

  categoryList;
  listLine;
  listProduct;
  listOOS;

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
    this.sqlOOS=this.sqlOOS.replace("@internalPOSNo", this.currentAssign['internalPOSNo']);
    this.sqlOOS=this.sqlOOS.replace("@promoterNo", this.promoterNo);
    this.dataservice.getAll(this.sqlOOS).subscribe(data => { this.listOOS=data; })
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
    let sqlInsertOOS= this.sqlInsertOOS + "(" + this.selectedProduct + ", " + this.currentAssign['internalPOSNo'] + ', "' + this.promoterNo + '"' + 
    ', CURRENT_TIMESTAMP, ' + this.remainQuantity + ', CURRENT_TIMESTAMP, "' + this.promoterNo + '", CURRENT_TIMESTAMP,  "' + this.promoterNo + '")'; 
    console.log(sqlInsertOOS)
    this.dataservice.storeData(sqlInsertOOS).subscribe(res => { console.log(res) })
    this.getData();

  }

}

