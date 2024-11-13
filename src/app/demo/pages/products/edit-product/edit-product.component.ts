import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { catchError, finalize, Observable } from 'rxjs';
import { Constants } from 'src/app/core/constants/Constants';
import { Response } from 'src/app/core/models/generic/Response';
import { Product } from 'src/app/core/models/interface/Product';
import { ProductService } from 'src/app/core/services/product/product.service';
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    NzButtonModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  @Input() visible!: boolean
  @Output() onClose = new EventEmitter<boolean>
  @Output() onSubmit = new EventEmitter<boolean>
  @Input() title!: string;
  @Input() product!: Product;
  @Input() isEdit!: boolean;
  formProduct: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private nzMessageService: NzMessageService,
    private productService: ProductService
  ){
    this.formProduct = this.formBuilder.group({
      id: [0, [Validators.required]],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: [1, [Validators.required, Validators.min(1)]],
      description: ["", [Validators.required, Validators.required]],
      imageUrl: ["", [Validators.required, Validators.required]]
    });
  }

  ngOnInit(){

  }

  ngOnChanges() {
    this.patchValue(this.product)
  }

  patchValue(product: Product){
    this.formProduct.patchValue({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl
    })
  }

  close(){
    this.onClose.emit(false)
  }

  onCreateSubmit(){
    let productRequest: Product = this.formProduct.value
    console.log(productRequest)
    this.createProduct(productRequest)
  }

  onUpdateSubmit(){
    let productRequest: Product = this.formProduct.value
    console.log(productRequest)
    this.updateProduct(productRequest)
  }

  createProduct(productCreate: Product) {
    const id = this.nzMessageService.loading("Đang tạo mới", { nzDuration: 0 }).messageId
    this.productService.createProduct(productCreate).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Thất bại");
        return new Observable<Response<Product>>;
      })
    ).subscribe(
      (response: Response<Product>) => {
        this.product = response.data as Product
        this.nzMessageService.success("Tạo mới thành công");
        this.onSubmit.emit(true)
      }
    )
  }

  updateProduct(productUpdate: Product) {
    const id = this.nzMessageService.loading("Đang cập nhật", { nzDuration: 0 }).messageId
    this.productService.updateProduct(productUpdate).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Thất bại");
        return new Observable<Response<Product>>;
      })
    ).subscribe(
      (response: Response<Product>) => {
        this.product = response.data as Product
        this.nzMessageService.success("Cập nhật thành công");
        this.onSubmit.emit(true)
      }
    )
  }
}
