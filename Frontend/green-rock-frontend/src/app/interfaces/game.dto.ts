import {InvitationDto} from "./invitation.dto";
import {GameStateEnum} from "./game-state.enum";

export interface GameDto {
  id: string;
  name: string;
  gameState: GameStateEnum,
  ownerId: string,
  invitations?: InvitationDto[]
}
