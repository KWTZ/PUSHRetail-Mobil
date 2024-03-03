import { Component, OnInit } from '@angular/core';
import { ProductLines } from '../productLine';
import { ProductCategories } from '../productCategories';
import { Products } from '../products';

@Component({
  selector: 'app-outofstock',
  templateUrl: './outofstock.component.html',
  styleUrls: ['./outofstock.component.css']
})
export class OutofstockComponent implements OnInit {

  categoryList = ProductCategories;
  productline = ProductLines;
  filteredProductLine=ProductLines;
  productList = Products;
  filteredProductList=Products;
  selectedCategory;
  selectedLine;

  constructor() { }

  ngOnInit(): void {
    this.categoryList.sort();
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
