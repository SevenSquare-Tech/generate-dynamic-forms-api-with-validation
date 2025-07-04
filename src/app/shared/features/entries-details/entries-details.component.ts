import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormService } from "../../services/form.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MessageContent } from "../../model/message-content";

declare var $: any;
@Component({
  selector: "app-entries-details",
  templateUrl: "./entries-details.component.html",
  styleUrls: ["./entries-details.component.scss"],
})
export class EntriesDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  id!: any;
  entryData: any;
  closeResult: string = "";
  deleteIndex;
  dataSource = new MatTableDataSource<[]>();
  profileData: any = [];
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  entryDataById: any;
  formId!: any;
  messageContent = new MessageContent();
  userRole: any;
  isLoading = false;
  constructor(
    private formService: FormService,
    private actRoute: ActivatedRoute,
    private modalService: NgbModal,
    private route: Router
  ) {
    this.id = this.actRoute.snapshot.params["_id"];
    this.getListEntriesById();
  }

  ngOnInit(): void {
    var retrievedObject = localStorage.getItem("authObject");
    var authObj = JSON.parse(retrievedObject);
    this.userRole = authObj.user_role.split("_")[1];
  }

  getListEntriesById(isDeleted = false) {
    this.isLoading = true;
    this.formService.getListEntriesById(this.id).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.isLoading = false;
          this.entryDataById = res.data;
          let data = this.entryDataById;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          let indx = data.length - 1;
          data.forEach((element) => {
            // let el = element.is_visible_in_entry;
            element.is_visible_in_entry.forEach((el) => {
              for (const key in this.entryDataById[indx]?.value) {
                if (key === el) {
                  console.log(key);
                  delete this.entryDataById[indx]?.value[key];
                }
              }
            });
          });

          if (!isDeleted) {
            for (const key in this.entryDataById[indx]?.value) {
              if (
                Object.prototype.hasOwnProperty.call(
                  this.entryDataById[indx]?.value,
                  key
                )
              ) {
                this.displayedColumns.push(key);
              }
            }
            if (this.userRole === "ADMIN" || this.userRole === "MODERATOR") {
              this.displayedColumns.push("actions");
            }

            this.columnsToDisplay = this.displayedColumns;
          }
        } else {
          this.dataSource = new MatTableDataSource(null);
          this.route.navigate(["/home"]);
        }
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }

  deleteEntry(id: any) {
    if (this.dataSource.data.length == 0) {
      this.route.navigate(["/home"]);
    }
    if (id) {
      this.formService.FormFieldsEntrieDelete(id).subscribe({
        next: (res) => this.getListEntriesById(true),
        error: (err) => console.log(err),
      });
      this.formService.showSuccess(
        this.messageContent.successMessageForDelete,
        this.messageContent.successMessageTitle
      );
      // this.route.navigate(['/home'])
    }
  }

  openConfirmationModel(model, id) {
    this.deleteIndex = id;
    this.modalService
      .open(model, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          // console.log(`Closed with: ${result}`);
        },
        (reason) => {
          // console.log(`Dismissed ${this.getDismissReason(reason)}`);
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
