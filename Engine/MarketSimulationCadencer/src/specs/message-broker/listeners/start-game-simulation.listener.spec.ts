import {GameRepository} from "../../../game-repository";
import {startGameSimulationListenerFactory} from "../../../message-broker/listeners/start-game-simulation.listener";
import {AddGameIncomingMessageDto} from "../../../dto/add-game-incoming-message.dto";

describe("Start game simulation listener", () => {
    let gameRepository: GameRepository;
    let listener: (arg0: AddGameIncomingMessageDto) => Promise<void>;

    beforeEach(() => {
        gameRepository = new GameRepository()
        listener = startGameSimulationListenerFactory(gameRepository);
    })

    it("Should add the game id to the repository", async () => {
        const message = new AddGameIncomingMessageDto("4cde6c6b-3212-4e21-80b9-da31e45f2e74");
        await listener(message);

        const games = gameRepository.getAllGames();
        expect(games.length).toEqual(1)
        expect(games[0]).toEqual(message.gameId);
    })
})