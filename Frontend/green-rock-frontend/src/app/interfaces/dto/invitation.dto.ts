export interface InvitationDto {
  userId: string;
  userEmail: { userEmail: string };
  gameId: string;
  acceptedInvitation: boolean
}
