import { Component, OnInit } from "@angular/core";
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { MatDialog, MatDialogRef } from "@angular/material";
import { AnswerTemplatePopupComponent } from "../answer-template-popup/answer-template-popup.component";
import { Subscription } from "rxjs";
import { SurveyService } from "../survey.service";
import { AppErrorService } from "../../../shared/services/app-error/app-error.service";
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: "app-survey-setting",
  templateUrl: "./survey-setting.component.html",
  animations: egretAnimations
})
export class SurveySettingComponent implements OnInit {
  rows: any[];
  public getAnswersTemplatesSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private surveyService: SurveyService,
    private errDialog: AppErrorService,
    private loader : AppLoaderService,
    private confirmService : AppConfirmService
  ) {}

  ngOnInit() {
    this.getAllAnsTemplates();
  }

  ngOnDestroy() {
    if (this.getAnswersTemplatesSub) {
      this.getAnswersTemplatesSub.unsubscribe();
    }
  }

  getAllAnsTemplates() {
    this.getAnswersTemplatesSub = this.surveyService
      .getAnswerTemplates()
      .subscribe(
        successResp => {
          this.rows = successResp.content;
          console.log(this.rows);
        },
        error => {
          console.log(error);
          console.log(error.status);
          this.errDialog.showError({
            title: "Error",
            status: error.status,
            type: "http_error"
          });
        }
      );
  }

  openAnswerTemplatePopup(data: any = {}, isNew?) {
    let title = isNew ? "Add New Answer Template " : "Update Answer Template ";
    let dialogRef: MatDialogRef<any> = this.dialog.open(
      AnswerTemplatePopupComponent,
      {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.loader.open();
      if(isNew){
        this.surveyService.addNewAnsTemplate(res,this.rows).subscribe(
          data => {
            console.log("response of creation ")
            console.log(data)
           this.rows =  data;
            this.loader.close();
          },
          error => {
            this.loader.close();
            this.errDialog.showError({
              title: "Error",
              status: error.status,
              type: "http_error"
            });
          }
        );


      }else{

      }

      console.log("input : ");
      console.log(JSON.stringify(res));
    });
  }


  deleteAnsTemplate(row){
    this.confirmService
    .confirm({ message: `Delete ${row.name}?` })
    .subscribe(res => {
      if (res) {
        this.loader.open();
        this.surveyService.removeAnsTemplate(row, this.rows).subscribe(
          data => {
            console.log(data)
            this.rows = data;
            this.loader.close();
          },
          error => {
            this.loader.close();
            this.errDialog.showError({
              title: "Error",
              status: error.status,
              type: "http_error"
            });
          }
        );
      }
    });
  }


  //for the movement unused
  getAnsTemplateById(id){
    this.surveyService.getAnsTemplateById(id,this.rows).subscribe(
      successResp => {
        console.log('by id response')
        console.log(successResp)
        this.openAnswerTemplatePopup(successResp);
      },
      error => {
        this.errDialog.showError({
          title: "Error",
          status: error.status,
          type: "http_error"
        });
      }
    );
  }
}
