export interface AddGroupMemberDialogData {
  group: string;
  memberEmail: string;
  addMember: (group: string, memberEmail: string) => void;
}
