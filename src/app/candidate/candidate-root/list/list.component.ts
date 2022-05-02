import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CandidateModalComponent } from '../candidate-modal/candidate-modal.component';
import { MatSort, Sort } from '@angular/material/sort';
import { Apollo, gql } from 'apollo-angular';
import { countries } from 'src/shared/countries';

export interface PeriodicElement {
  name: string;
  idNumber: string;
  location: string;
  emailAddress: string;
  mobileNumber: string;
  daysActive: string;
  country: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'User 1', idNumber: '7589114587987', location: 'Centurion, South Africa', emailAddress: 'greg1@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'India' },
  { name: 'User 2', idNumber: '7589256987452', location: 'Centurion, South Africa', emailAddress: 'greg3@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Zimbabwe' },
  { name: 'User 3', idNumber: '7589396365874', location: 'Centurion, South Africa', emailAddress: 'greg5@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Singapore' },
  { name: 'User 4', idNumber: '7589512454787', location: 'Centurion, South Africa', emailAddress: 'greg7@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Australia' },
  { name: 'User 5', idNumber: '7589552558747', location: 'Centurion, South Africa', emailAddress: 'greg9@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'South Africa' },
  { name: 'User 6', idNumber: '7589623144777', location: 'Centurion, South Africa', emailAddress: 'greg2@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'United States' },
  { name: 'User 7', idNumber: '7589396414784', location: 'Centurion, South Africa', emailAddress: 'greg4@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'India' },
  { name: 'User 8', idNumber: '7583419744578', location: 'Centurion, South Africa', emailAddress: 'greg6@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Zimbabwe' },
  { name: 'User 9', idNumber: '7587623165457', location: 'Centurion, South Africa', emailAddress: 'greg8@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Singapore' },
  { name: 'User 10', idNumber: '7582323641653', location: 'Centurion, South Africa', emailAddress: 'greg10@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Australia' },
];


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {

  constructor(public dialog: MatDialog, private apollo: Apollo) { }

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['select', 'name', 'idNumber', 'location', 'emailAddress', 'mobileNumber', 'daysActive', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  ngOnInit(): void {
    this.countryFlagForListHandler(this.dataSource);
    // this.apollo
    //   .watchQuery({
    //     query: gql`
    //       {
    //         rates(currency: "USD") {
      //           currency
      //           rate
    //         }
    //       }
    //     `,
    //   })
    //   .valueChanges.subscribe((result: any) => {
    //     this.rates = result?.data?.rates;
    //     this.loading = result.loading;
    //     this.error = result.error;
    //   });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  countryFlagForListHandler(list) {
    console.log(list.data)
    list.data.forEach(val => {
      // val.flag = findFlagUrlByCountryName(val.country);
      // val.flag = "../../../../assets/flags/AD.svg";
      val.flag = this.countryFlagHandler(val);
    })
    console.log('list : ', list.data)
    // this.dataSource = new MatTableDataSource<PeriodicElement>(list);
    this.idNumberHandler(list);
  }

  countryFlagHandler(list) {
    let foundLink = '';
    countries.forEach(country => {
      if (list.country === country.name) {
        foundLink = `../../../../assets/flags/${country.code}.svg`;
      }
    })
    return foundLink;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): any {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  idNumberHandler(tempData) {
    console.log(tempData)
    tempData.data.map((src: any) => {
      let totalLength = src.idNumber.length;
      console.log(src.idNumber + ' - ' + src.idNumber.substring(0, 6) + ' - ' + totalLength);
      let firstSixCharacters = src.idNumber.substring(0, 6) + 'X'.repeat(totalLength - 6);
      src.idNumber = firstSixCharacters;
    })
    this.dataSource = new MatTableDataSource<PeriodicElement>(tempData.data);
  }

  openDialog() {
    const dialogRef = this.dialog.open(CandidateModalComponent, {
      height: '754px',
      width: '800px',
      data: {
        candidateData: { name: 'candidate' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
