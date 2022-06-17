export interface GoogleUser {
  id: string
  emails: { value: string }[];
  displayName: string
  photos: { value: string }[]
}
