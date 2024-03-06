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
  sqlLine="Select idProductLine as ID, productLine as viewValue, idProductCategory from prd_lines order by productline";
  sqlProduct='Select idProduct as ID, productName as viewValue, idProductLine, replace(format(productprice,2),".", ",") as price from prd_products order by productname';

  categoryList;
  listLine;
  listProduct;

  selectedCategory;
  selectedLine;
  filteredLineList;
  filteredProductsList;


  constructor(private dataservice: DataService) {  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.dataservice.getAll(this.sqlCategory).subscribe(data => { this.categoryList=data; });
    this.dataservice.getAll(this.sqlLine).subscribe(data => { this.listLine=data; this.filteredLineList=data; });
    this.dataservice.getAll(this.sqlProduct).subscribe(data => { this.listProduct=data; this.filteredProductsList=data; });
  }

  filterProductline() {
      this.filteredLineList= this.listLine.filter(e => e.idProductCategory==this.selectedCategory);
  }
  filterProduct(){
      this.filteredProductsList = this.listProduct.filter(e => e.idProductLine == this.selectedLine);
  }

}
