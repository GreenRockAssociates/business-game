import {GameRepository} from "../../game-repository";
import {AddGameIncomingMessageDto} from "../../dto/add-game-incoming-message.dto";

export function startGameSimulationListenerFactory(gameRepository: GameRepository){
    return async (message: AddGameIncomingMessageDto) => {
        gameRepository.addGame(message.gameId);
    }
}