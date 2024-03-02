import { Component, OnInit } from '@angular/core';
import { Line } from '../productLine';
import { Products } from '../products';

@Component({
  selector: 'app-outofstock',
  templateUrl: './outofstock.component.html',
  styleUrls: ['./outofstock.component.css']
})
export class OutofstockComponent implements OnInit {

  productline = Line;
  productList = Products;
  filteredProductList=Products;
  selectedLine;

  constructor() { }

  ngOnInit(): void {
    this.productline.sort();
    this.productList.sort();
  }

  filterProduct() {
    this.filteredProductList=this.productList.filter(e=> e.line==this.selectedLine)
  }
}
