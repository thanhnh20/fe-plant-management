import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { EditProductComponent } from '../products/edit-product/edit-product.component';
import { Pageable } from 'src/app/core/models/interface/Page';
import { User } from 'src/app/core/models/interface/User';
import { NzSizeDSType } from 'ng-zorro-antd/core/types';
import { UserService } from 'src/app/core/services/user/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, finalize, Observable } from 'rxjs';
import { PaginationResponse, Response } from 'src/app/core/models/generic/Response';
import { RequestParams } from 'src/app/core/models/generic/Request';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NzButtonModule,
    CardComponent,
    NzTableModule,
    NzIconModule,
    NzPaginationModule,
    EditProductComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  pageable: Pageable
  users: User[]
  nzSize: NzSizeDSType = "default";
  pageSizeOption: number[] = [10, 20]

  constructor(
    private userService: UserService,
    private nzMessageService: NzMessageService
  ){
    this.pageable = {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0
    }
    this.users = []
  }

  ngOnInit(){
    this.getUser()
  }

  getUser(){
    const param: RequestParams = {
      page: this.pageable.page,
      size: this.pageable.size,
    }
    const id = this.nzMessageService.loading("Loading", { nzDuration: 0, }).messageId
    this.userService.getAllUser(param).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Error")
        return new Observable<Response<User>>
      })
    ).subscribe({
      next: (response: Response<User>) => {
        const pageResponse: PaginationResponse<User> = response.data as PaginationResponse<User>
        this.users = pageResponse.content
        this.pageable.totalElements = pageResponse.pagination.totalElements
        this.pageable.totalPages = pageResponse.pagination.totalPages
      }
    })
  }

  onPageIndexChange(pageChange: number) {
    this.pageable.page = pageChange;
    this.getUser()
  }

  onPageSizeChange(pageSize: number) {
    this.pageable.size = pageSize;
    this.getUser()
  }
}
