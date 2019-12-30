import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { SortController, SortOrder } from '../shared/sort-controller';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { EmployeeComponent } from './employee.component';

@Component({
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  errorIcon = faExclamationCircle;
  isLoading: boolean;
  errorMessage: string;
  filteredEmployees: Employee[];

  isDeletingEmployee: boolean;
  deletedEmployeeId: number;
  deleteEmployeeError: string;

  private _allEmployees: Employee[] = null;
  private _filter: string;
  private _modalReference: BsModalRef;
  
  constructor(
    private _modalService: BsModalService,
    private _employeeService: EmployeeService, 
    private _sortController: SortController)
  {}

  get hasError(): boolean {
    return this.errorMessage != null;
  }

  get didLoad(): boolean {
    return this._allEmployees != null;
  }

  get filter(): string {
    return this._filter;
  }
  set filter(newFilter: string) {
    this._filter = newFilter;
    this.refreshFilteredEmployees();
  }

  ngOnInit() {
    this._modalService.onHidden.subscribe(_ => {
      if (this._modalReference.content.didSave)
        this.load();
    });
    
    this.load();
  }

  addEmployee() {
    this._modalReference = this._modalService.show(EmployeeComponent);
  }

  editEmployee(employeeId: number) {
    this._modalReference = this._modalService.show(EmployeeComponent);
    this._modalReference.content.initForEmployee(employeeId);
  }

  confirmDelete(id: number, name: string) {
    if (confirm('Delete ' + name + '?')) {
      this.deleteEmployeeError = null;
      this.deletedEmployeeId = id;
      this.isDeletingEmployee = true;
      this._employeeService.deleteEmployee(id)
        .subscribe(
          v => {
            this.isDeletingEmployee = false;
            this.deletedEmployeeId = null;
            this.load();
          },
          error => {
            this.isDeletingEmployee = false;
            this.deleteEmployeeError = error;
          }
        );
    }
  }

  toggleSortField(fieldName: string) {
    this._sortController.toggleSortField(fieldName);
    this._sortController.sort(this.filteredEmployees);
  }

  sortIndicatorClass(fieldName: string): string {
    if (this._sortController.currentSortField === fieldName)
      return this._sortController.sortOrder === SortOrder.Ascending ? 'sort-arrow up' : 'sort-arrow down';
    
    return '';
  }

  private load() {
    this.isLoading = true;

    this._employeeService.getEmployees()
      .subscribe(
        e => {
          this.isLoading = false;
          this.errorMessage = null;
          this.deletedEmployeeId = null;
          this._allEmployees = e;
          this._sortController.setSortField('lastName');

          this.refreshFilteredEmployees();
        },
        error => {
          this.isLoading = false;
          this.errorMessage = error;
          this.deletedEmployeeId = null;
          this._allEmployees = null;
          this.filteredEmployees = null;
        }
      );
  }

  private refreshFilteredEmployees() {
    this.filteredEmployees = (!this._filter) || (this._filter == '')
      ? this._allEmployees
      : this._allEmployees.filter(e => this.employeeDoesMatchFilter(e));

    this._sortController.sort(this.filteredEmployees);
  }

  private employeeDoesMatchFilter(employee: Employee): boolean {
    for (var property in employee) {
      if ((employee.hasOwnProperty(property)) && (String(employee[property]).toLowerCase().indexOf(this._filter.toLowerCase()) != -1))
        return true;
    }
    return false;
  }
}
