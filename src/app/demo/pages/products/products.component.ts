import { Component } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Product } from 'src/app/core/models/interface/Product';
import { ProductService } from 'src/app/core/services/product/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestParams } from 'src/app/core/models/generic/Request';
import { catchError, finalize, Observable } from 'rxjs';
import { PaginationResponse, Response } from 'src/app/core/models/generic/Response';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { Pageable } from 'src/app/core/models/interface/Page';
import { NzSizeDSType } from 'ng-zorro-antd/core/types';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { EditProductComponent } from "./edit-product/edit-product.component";


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NzButtonModule,
    CardComponent,
    NzTableModule,
    NzIconModule,
    NzPaginationModule,
    EditProductComponent
],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  size: NzButtonSize = 'large';
  products: Product[]
  pageable: Pageable
  pageSizeOption: number[] = [10, 20]
  nzSize: NzSizeDSType = "default";
  isEdit: boolean = false
  isVisible: boolean = false;
  titlePopup: string = "";
  productDetail: Product;

  constructor(
    private productService: ProductService,
    private nzMessageService: NzMessageService
  ) {
    this.products = []
    this.pageable = {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0
    }
    this.productDetail = {
      id: 0,
      name: "",
      category: "",
      createdAt: "",
      description: "",
      imageUrl: "",
      price: 0,
      updatedAt: "",
      timeStamp: ""
    }
  }

  onClose(){
    this.isVisible = false;
  }

  toggleVisible(){
    this.isVisible = !this.isVisible
  }

  openCreate(){
    this.productDetail = {
      id: 0,
      name: "",
      category: "",
      createdAt: "",
      description: "",
      imageUrl: "",
      price: 0,
      updatedAt: "",
      timeStamp: ""
    }
    this.titlePopup = "Tạo mới sản phẩm"
    this.isEdit = false;
    this.toggleVisible();
  }

  openEdit(product: Product){
    this.productDetail = product
    this.titlePopup = "Chỉnh sửa sản phẩm"
    this.isEdit = true;
    this.toggleVisible();
  }

  ngOnInit() {
    this.getProductsFiltered()
  }

  getProductsFiltered() {
    const param: RequestParams = {
      page: this.pageable.page,
      size: this.pageable.size,
    }
    const id = this.nzMessageService.loading("Loading", { nzDuration: 0, }).messageId
    this.productService.getFilterProduct(param).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Error")
        return new Observable<Response<Product>>
      })
    ).subscribe({
      next: (response: Response<Product>) => {
        const pageResponse: PaginationResponse<Product> = response.data as PaginationResponse<Product>
        this.products = pageResponse.content
        this.pageable.totalElements = pageResponse.totalElements
        this.pageable.totalPages = pageResponse.totalPages
      }
    })
  }

  onPageIndexChange(pageChange: number) {
    this.pageable.page = pageChange;
    this.getProductsFiltered()
  }

  onPageSizeChange(pageSize: number) {
    this.pageable.size = pageSize;
    this.getProductsFiltered()
  }

  onSubmit(isSuccess: boolean){
    if(isSuccess){
      this.getProductsFiltered()
    }
  }
}
