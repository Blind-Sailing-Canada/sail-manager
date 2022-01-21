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
import { EntityType } from '../../../models/entity-type';
import { editChallengeRoute, listDocumentsRoute } from '../../../routes/routes';
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

  public challenge_id: string;
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
    this.challenge_id = this.route.snapshot.params.challenge_id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES, () => {
      this.challenge = this.store[STORE_SLICES.CHALLENGES][this.challenge_id];

      if (!this.challenge) {
        return;
      }

      this.challengeActiveParticipants = this.challenge.participants.filter(participant => !participant.finished_at);
      this.challengeFinishedParticipants = this.challenge.participants.filter(participant => !!participant.finished_at);

      const notesControls = this.challengeActiveParticipants
        .reduce(
          (red, participant) => {
            red[participant.participant_id] = this.fb.control(undefined);
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

    this.dispatchAction(fetchChallenge({ challenge_id: this.challenge_id }));
  }

  public openChallengeCompleteDialog(challenger: Profile): void {
    const dialogData: ChallengeCompleteDialogData = {
      challenger,
      challenge: this.challenge,
      result: '',
      submit: (challenge_id, challengerId, result) => this.challengeAccomplished(challenge_id, challengerId, result),
    };

    this.dialog
      .open(ChallengeCompleteDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public canSubmitResult(participant: ChallengeParticipant): boolean {
    return participant.participant_id === this.user.profile.id ||
      this.user.access[UserAccessFields.JudgeChallenge];
  }

  public get userAccomplishedChallenge(): boolean {
    return this
      .challenge
      .participants
      .some(participant => participant.participant_id === this.user.profile.id && !!participant.finished_at);
  }

  public get userJoinedChallenge(): boolean {
    return this.challenge.participants.some(participant => participant.participant_id === this.user.profile.id);
  }

  public deleteCDNFile(formArrayIndex: number): void {
    this.fileToDelete = this.picturesForm.value.pictures[formArrayIndex].url;
    this.dispatchAction(deleteFile({ filePath: this.fileToDelete, notify: true }));
  }

  public uploadNewPicture(pictures: File[]): void {
    this.fileToUpload = pictures[0];
    this.dispatchAction(uploadChallengePicture({ file: pictures[0], challenge_id: this.challenge_id, notify: true }));
  }

  public editChallenge(): void {
    this.goTo([editChallengeRoute(this.challenge_id)]);
  }

  public deletePicture(picture: Media): void {
    this.dispatchAction(deleteFile({ filePath: picture.url, notify: true }));
    this.dispatchAction(deleteChallengePicture({ challenge_id: this.challenge_id, picture_id: picture.id }));
  }

  public get shouldAllowSaveButton(): boolean {
    return this.picturesForm && this.picturesForm.dirty;
  }

  public save(): void {
    const pictures: Media[] = this.picturesForm.value.pictures;

    this.dispatchAction(postChallengePictures({ pictures, challenge_id: this.challenge_id, notify: true }));
  }

  public postNewComment(comment: Comment): void {
    this.dispatchAction(postChallengeComment({ comment, challenge_id: this.challenge_id, notify: true }));
  }

  public deleteComment(comment_id: string): void {
    this.dispatchAction(deleteChallengeComment({ comment_id, challenge_id: this.challenge_id, notify: true }));
  }

  public joinThisChallenge(): void {
    this.dispatchAction(joinChallenge({ challenge_id: this.challenge_id, notify: true }));
  }

  public leaveThisChallenge(): void {
    this.dispatchAction(leaveChallenge({ challenge_id: this.challenge_id, notify: true }));
  }

  public get canEditNewChallenge() {
    return !!this.user.access[UserAccessFields.EditChallenge];
  }

  public goToClinicDocuments(): void {
    this.goTo(
      [listDocumentsRoute()],
      {
        queryParams: { entity_type: EntityType.Challenge, entity_id: this.challenge_id },
      }
    );
  }


  private challengeAccomplished(challenge_id: string, challengerId: string, note: string): void {
    this.dispatchAction(completeUserChallenge({ challengerId, note, challenge_id, notify: true }));
  }

  private buildForm(): void {
    this.picturesForm = this.fb.group({
      pictures: this.fb.array([
      ])
    });

    this.notesForm = this.fb.group({});
  }
}
