import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Challenge } from '../../../../../../api/src/types/challenge/challenge';
import { ChallengeParticipant } from '../../../../../../api/src/types/challenge/challenge-participant';
import { Comment } from '../../../../../../api/src/types/comment/comment';
import { Media } from '../../../../../../api/src/types/media/media';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { ChallengeCompleteDialogComponent } from '../../../components/challenge-complete-dialog/challenge-complete-dialog.component';
import { ICDNState } from '../../../models/cdn-state.interface';
import { ChallengeCompleteDialogData } from '../../../models/challenge-complete-dialog-data.interface';
import { editChallengeRoute } from '../../../routes/routes';
import {
  CDN_ACTION_STATE,
  deleteFile,
  uploadChallengePicture,
} from '../../../store/actions/cdn.actions';
import {
  completeUserChallenge,
  deleteChallengeComment,
  deleteChallengePicture,
  fetchChallenge,
  joinChallenge,
  leaveChallenge,
  postChallengeComment,
  postChallengePictures,
} from '../../../store/actions/challenge.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-challenge-view-page',
  templateUrl: './challenge-view-page.component.html',
  styleUrls: ['./challenge-view-page.component.css']
})
export class ChallengeViewPageComponent extends BasePageComponent implements OnInit {

  public challengeId: string;
  public challenge: Challenge;
  public challengeActiveParticipants: ChallengeParticipant[];
  public challengeFinishedParticipants: ChallengeParticipant[];
  public picturesForm: FormGroup;
  public notesForm: FormGroup;
  public fileToDelete: string;
  public fileToUpload: File;
  public pictures: Media[];
  public allowDelete = false;
  public challengePictureInput = 'challenge_picture_input';
  public uploadProgress = 0;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit() {
    this.challengeId = this.route.snapshot.params.challengeId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES, () => {
      this.challenge = this.store[STORE_SLICES.CHALLENGES][this.challengeId];

      if (!this.challenge) {
        return;
      }

      this.challengeActiveParticipants = this.challenge.participants.filter(participant => !participant.finishedAt);
      this.challengeFinishedParticipants = this.challenge.participants.filter(participant => !!participant.finishedAt);

      const notesControls = this.challengeActiveParticipants
        .reduce(
          (red, participant) => {
            red[participant.participantId] = this.fb.control(undefined);
            return red;
          },
          {}
        );

      this.notesForm = this.fb.group(notesControls);

      (this.picturesForm.get('pictures') as FormArray).clear();
      this.picturesForm.reset();
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn: ICDNState) => {
      if (this.fileToUpload) {
        const fileName = this.fileToUpload.name;
        if (cdn[fileName].state === CDN_ACTION_STATE.ERROR) {
          this.fileToUpload = null;

          const fileInput = document.getElementById(this.challengePictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADING) {
          this.uploadProgress = cdn[fileName].progress;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADED) {
          const picturesForm = this.picturesForm.get('pictures') as FormArray;

          picturesForm
            .push(this.fb.group({
              url: this.fb.control(cdn[fileName].url),
              description: this.fb.control(undefined),
              title: this.fb.control(undefined),
            }));

          picturesForm.updateValueAndValidity();
          picturesForm.markAsDirty();
          this.picturesForm.updateValueAndValidity();

          const fileInput = document.getElementById(this.challengePictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
          this.uploadProgress = 0;
        }
      }

      if (this.fileToDelete) {
        if (cdn[this.fileToDelete].state === CDN_ACTION_STATE.DELETED) {
          const picturesForm = this.picturesForm.get('pictures') as FormArray;

          const index = picturesForm.controls.findIndex(control => control.get('url').value === this.fileToDelete);

          picturesForm.removeAt(index);

          this.picturesForm.updateValueAndValidity();

          if (picturesForm.length === 0) {
            this.picturesForm.markAsPristine();
          }

          this.fileToDelete = null;
        }

        if (cdn[this.fileToDelete]?.state === CDN_ACTION_STATE.ERROR) {
          this.fileToDelete = null;
        }
      }

    });

    this.dispatchAction(fetchChallenge({ challengeId: this.challengeId }));
  }

  public openChallengeCompleteDialog(challenger: Profile): void {
    const dialogData: ChallengeCompleteDialogData = {
      challenger,
      challenge: this.challenge,
      result: '',
      submit: (challengeId, challengerId, result) => this.challengeAccomplished(challengeId, challengerId, result),
    };

    this.dialog
      .open(ChallengeCompleteDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  private buildForm(): void {
    this.picturesForm = this.fb.group({
      pictures: this.fb.array([
      ])
    });

    this.notesForm = this.fb.group({});
  }

  public canSubmitResult(participant: ChallengeParticipant): boolean {
    return participant.participantId === this.user.profile.id ||
      this.user.access[UserAccessFields.JudgeChallenge];
  }

  public get userAccompliedChallenge(): boolean {
    return this.challenge.participants.some(participant => participant.participantId === this.user.profile.id && !!participant.finishedAt);
  }

  public get userJoinedChallenge(): boolean {
    return this.challenge.participants.some(participant => participant.participantId === this.user.profile.id);
  }

  public deleteCDNFile(formArrayIndex: number): void {
    this.fileToDelete = this.picturesForm.value.pictures[formArrayIndex].url;
    this.dispatchAction(deleteFile({ filePath: this.fileToDelete, notify: true }));
  }

  public uploadNewPicture(pictures: File[]): void {
    this.fileToUpload = pictures[0];
    this.dispatchAction(uploadChallengePicture({ file: pictures[0], challengeId: this.challengeId, notify: true }));
  }

  public editChallenge(): void {
    this.goTo([editChallengeRoute(this.challengeId)]);
  }

  public deletePicture(picture: Media): void {
    this.dispatchAction(deleteFile({ filePath: picture.url, notify: true }));
    this.dispatchAction(deleteChallengePicture({ challengeId: this.challengeId, pictureId: picture.id }));
  }

  public get shouldAllowSaveButton(): boolean {
    return this.picturesForm && this.picturesForm.dirty;
  }

  public save(): void {
    const pictures: Media[] = this.picturesForm.value.pictures;

    this.dispatchAction(postChallengePictures({ pictures, challengeId: this.challengeId, notify: true }));
  }

  public postNewComment(comment: Comment): void {
    this.dispatchAction(postChallengeComment({ comment, challengeId: this.challengeId, notify: true }));
  }

  public deleteComment(commentId: string): void {
    this.dispatchAction(deleteChallengeComment({ commentId, challengeId: this.challengeId, notify: true }));
  }

  private challengeAccomplished(challengeId: string, challengerId: string, note: string): void {
    this.dispatchAction(completeUserChallenge({ challengerId, note, challengeId, notify: true }));
  }

  public joinThisChallenge(): void {
    this.dispatchAction(joinChallenge({ challengeId: this.challengeId, notify: true }));
  }

  public leaveThisChallenge(): void {
    this.dispatchAction(leaveChallenge({ challengeId: this.challengeId, notify: true }));
  }

  public get canEditNewChallenge() {
    return !!this.user.access[UserAccessFields.EditChallenge];
  }
}
