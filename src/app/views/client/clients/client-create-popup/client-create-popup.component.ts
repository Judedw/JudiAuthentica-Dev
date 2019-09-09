import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { egretAnimations } from "../../../../shared/animations/egret-animations";
import { GlobalVariable } from "../../../../shared/helpers/global-variable";
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { autoCompletableCategory, roleAuthority } from 'app/model/ClientModel.model';


@Component({
  selector: 'app-client-create-popup',
  templateUrl: './client-create-popup.component.html',
  animations: egretAnimations,
})
export class ClientCreatePopupComponent implements OnInit {

  private globalVariable: GlobalVariable = new GlobalVariable();
  private license = this.globalVariable.client.license;
  private regex = this.globalVariable.validators.regex;
  private formInputMessage = this.globalVariable.common.message.formInput;

  private selectable = true;
  private removable = true;
  private addOnBlur = true;
  private separatorKeysCodes: number[] = [ENTER, COMMA];
  private categoryCtrl = new FormControl();
  private allCategories: autoCompletableCategory[] = [];
  private allAuthorities: roleAuthority[] = [];
  private selectedAuthorities: roleAuthority[] = [];
  private filteredCategories: Observable<autoCompletableCategory[]>;
  private selectedCategories: autoCompletableCategory[] = [];
  private categories: string[] = [];

  private oldestValue = 0;

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  private clientFormGroup: FormGroup;
  private profilePicFormGroup: FormGroup;
  private adminFormGroup: FormGroup;
  private categoryFormGroup: FormGroup;
  private licenseFormGroup: FormGroup;
  private clientProfilePic;


  constructor(

    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ClientCreatePopupComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar

  ) {
    this.filteredCategories = this.categoryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(category => category ? this._filterCategories(category) : this.allCategories.slice())
      );
  }

  ngOnInit() {
    this.allCategories = JSON.parse(JSON.stringify(this.data.category));
    this.selectedCategories = [];

    console.log(this.data);

    this.selectedAuthorities = [];

    this.data.section.forEach(section => {
      section.authorities.forEach(authority => {
        if (authority.code === 'um-a') {
          this.selectedAuthorities.push(authority.id);
        } else if (authority.code !== 'cm-a') {
          this.allAuthorities.push(authority);
        }
      });
    });
    this.buildItemForm()
  }

  buildItemForm() {

    // this.clientFormGroup = this.fb.group({
    //   name: [''],
    //   description: ['']
    // });
    // this.profilePicFormGroup = this.fb.group({
    //   profilePic: [""]
    // });
    // this.adminFormGroup = this.fb.group({
    //   username: [''],
    //   email: ['']
    // });

    this.clientFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.regex._PosNumberAndLetter)]],
      description: ['', Validators.required]
    });
    this.profilePicFormGroup = this.fb.group({
      profilePic: ["", Validators.required]
    });
    this.adminFormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(this.regex._UserName)]],
      email: ['', [Validators.required, Validators.pattern(this.regex._Email)]]
    });

    this.categoryFormGroup = this.fb.group({
      category: this.categoryCtrl
    });

    this.licenseFormGroup = this.fb.group({
      tagCount: ['', [Validators.required, Validators.max(this.license.tagCount.max), Validators.min(this.license.tagCount.min), Validators.pattern(this.regex._PosNumber)]],
      userCount: ['', Validators.required],
      communityCount: ['1', Validators.required],
      feedbackCount: ['1', Validators.required],
      eventCount: ['1', Validators.required],
      promoCount: ['1', Validators.required]
    });

  }

  setOldValue() {
    this.oldestValue = this.licenseFormGroup.controls['communityCount'].value;
  }

  validateLicense() {
    let form = this.licenseFormGroup;
    let value = form.controls['communityCount'].value;

    if (value !== '' && value !== '0') {

      let diff = value - this.oldestValue;

      if (diff > 0) {
        form.controls['feedbackCount'].setValue(+(form.get('feedbackCount').value) + diff);
        form.controls['eventCount'].setValue(+(form.get('eventCount').value) + diff);
        form.controls['promoCount'].setValue(+(form.get('promoCount').value) + diff);
      }

    } else {
      this.setDefaultValue('communityCount');
      this.setDefaultValue('feedbackCount');
      this.setDefaultValue('eventCount');
      this.setDefaultValue('promoCount');
    }

  }

  setDefaultValue(control) {

    let form = this.licenseFormGroup;
    let value = form.controls[control].value;
    if (value === '' || value === '0') {
      form.controls[control].setValue(this.license.comunityCount.min);
    }

  }

  submit() {

    let forms = [this.clientFormGroup.value, this.clientProfilePic, this.adminFormGroup.value, this.licenseFormGroup.value, this.selectedCategories, this.selectedAuthorities];
    this.dialogRef.close(forms);

  }


  // File uploader validation and upload
  onSelectFile(event) {

    if (event.target.files && event.target.files[0]) {

      let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
      let pattern = /image-*/;
      let reader = new FileReader();
      if (!file.type.match(pattern)) {
        this.snackBar.open(
          "Invalid Format!",
          "close",
          { duration: 2000 }
        );
        return;
      }
      reader.onload = (event: any) => {
        this.clientProfilePic = event.target.result;
      };

      reader.readAsDataURL(file);

    } else {
      this.snackBar.open(
        "Can't upload",
        "close",
        { duration: 2000 }
      );
    }

  }

  removeSelectedImg() {
    this.clientProfilePic = null;
    this.profilePicFormGroup.controls['profilePic'].setValue('');
  }

  add(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      // const value = event.value;

      // if we need to add custom texts as Chips,
      // Add our category
      // if ((value || '').trim()) {
      //   this.categories.push(value.trim());
      // }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.categoryCtrl.setValue(null);
    }

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addSelectedCategory(event.option.value);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  addSelectedCategory(id) {
    this.allCategories.forEach((item, index) => {
      if (item.id === id) {
        this.selectedCategories.push(item);
        this.allCategories.splice(index, 1);
      }
    });
  }

  remove(category: autoCompletableCategory): void {
    this.selectedCategories.forEach((item, index) => {
      if (item.id === category.id) {
        this.allCategories.push(category);
        this.selectedCategories.splice(index, 1);
      }
    });
  }

  private _filterCategories(value: string): autoCompletableCategory[] {

    const filterValue = value.toLowerCase();
    return this.allCategories.filter(category => category.name.toLowerCase().indexOf(filterValue) === 0);

  }


  onChange(id) {
    
    if (this.selectedAuthorities.includes(id)) {
      this.selectedAuthorities.forEach((item, index) => {
        if (item === id) {
          this.selectedAuthorities.splice(index, 1);
        }
      });
    } else {
      this.selectedAuthorities.push(id);
    }

  }

}

