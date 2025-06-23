import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";

@Component({
  selector: "app-dynamicform-item",
  templateUrl: "./dynamicform-item.component.html",
  styleUrls: ["./dynamicform-item.component.scss"],
})
export class DynamicformItemComponent implements OnInit {
  @Output() fieldValue: EventEmitter<string> = new EventEmitter();
  formCreate: any = FormGroup;
  submitted = false;
  isShowAddButton = true;
  constructor(public fb: FormBuilder) {}

  get f() {
    return this.formCreate.controls;
  }

  ngOnInit(): void {
    this.formCreate = this.fb.group({
      form_name: [""],
      submit_button_name: [""],
    });
  }

  addItem(form: NgForm) {
    const form_name = form.value.form_name;
    const submit_button_name = form.value.submit_button_name;
    this.fieldValue.emit(form.value);
    this.isShowAddButton = false;
  }
}
