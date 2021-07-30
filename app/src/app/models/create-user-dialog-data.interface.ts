export interface CreateUserDialogData {
  createUser: (name: string, email: string) => Promise<void>;
}
