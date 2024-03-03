import { Component, OnInit } from '@angular/core';
import { ProductLines } from '../../productLine';
import { Products } from '../../products';
import { ProductCategories } from 'src/app/productCategories';


@Component({
  selector: 'app-sales-result',
  templateUrl: './sales-result.component.html',
  styleUrls: ['./sales-result.component.css']
})
export class SalesResultComponent implements OnInit {

  categoryList = ProductCategories
  productline = ProductLines;
  filteredProductLine=ProductLines;
  productList = Products;
  filteredProductList=Products;

  selectedCategory;
  selectedLine;
  constructor() { }

  ngOnInit(): void {
    this.productline.sort();
    this.productList.sort();
  }

  filterProductLine() {
    this.filteredProductLine=this.productline.filter(e => e.groupLine==this.selectedCategory);
  }

  filterProduct() {
    this.filteredProductList=this.productList.filter(e=> e.line==this.selectedLine)
  }

}


