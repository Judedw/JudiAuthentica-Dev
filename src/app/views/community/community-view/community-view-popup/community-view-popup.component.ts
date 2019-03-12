import { Component, OnInit, Inject } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunityService } from '../../community.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';

@Component({
  selector: 'app-community-view-popup',
  templateUrl: './community-view-popup.component.html',
  animations: egretAnimations
})
export class CommunityViewPopupComponent implements OnInit {

  public communityForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CommunityViewPopupComponent>,
    private fb: FormBuilder,
    private errDialog: AppErrorService,
    private comunityService: ComunityService
  ) { }

  ngOnInit() {
    if (!this.data.isNew) {
      this.getCommunityById(this.data.payload.id);
    }
    this.buildCommunityForm(this.data.payload);
  }

  /*
  * Build community create and update form
  * 05-03-2019
  * Prasad Kumara
  */
  buildCommunityForm(community) {
    this.communityForm = this.fb.group({
      name: [community.name || '', Validators.required],
      description: [community.description || '', Validators.required],
      status: [community.status || false, Validators.required]
    });
  }

  /*
  * Get community details using cimmunity id
  * 05-03-2019
  * Prasad Kumara
  */
  getCommunityById(communityId) {
    this.comunityService.getCommunityById(communityId)
      .subscribe(
        response => {
          if (response.status === 'ACTIVE') {
            response.status = true;
          } else {
            response.status = false;
          }
          this.buildCommunityForm(response);
        },
        error => {
          if (error.status !== 401) {
            this.errDialog.showError(error);
          }
        }
      );
  }

  /*
  * Submit community create and update form
  * 05-03-2019
  * Prasad Kumara
  */
  submitCommunityForm(): any {
    this.dialogRef.close(this.communityForm.value);
  }

}
