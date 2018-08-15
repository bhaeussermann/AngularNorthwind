import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader.component';
import { SortController } from './sort-controller';
import { defaultTimeout, DEFAULT_TIMEOUT, TimeoutInterceptor } from './timeout-interceptor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    LoaderComponent
  ],
  providers: [
    SortController,
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: defaultTimeout }]
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LoaderComponent
  ]
})
export class SharedModule { }
