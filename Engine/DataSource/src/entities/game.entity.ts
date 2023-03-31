import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty} from "class-validator";
import {PlayerEntity} from "./player.entity";
import {AssetHealthEntity} from "./asset-health.entity";
import {MarketEntity} from "./market.entity";
import {NewsReportEntity} from "./news-report.entity";

enum GameState {
    CREATED,
    RUNNING,
    ENDED
}

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @IsNotEmpty()
    @Column()
    gameState: GameState

    @OneToMany(() => PlayerEntity, (player) => player.game, {cascade: true})
    players: PlayerEntity[]

    @OneToMany(() => AssetHealthEntity, (assetHealth) => assetHealth.game)
    assetHealthEntries: AssetHealthEntity[]

    @OneToMany(() => MarketEntity, (market) => market.game)
    markets: MarketEntity[]

    @OneToMany(() => NewsReportEntity, (newsReport) => newsReport.game)
    newsReportEntries: NewsReportEntity[]

    constructor(gameState: GameState = GameState.CREATED) {
        this.gameState = gameState;
    }
}