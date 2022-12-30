import {IsNotEmpty, IsNumber, IsPositive, IsString,ArrayMinSize} from "class-validator";
import {Expose} from "class-transformer";
import "reflect-metadata";

/**
 * Data transfer object for the NewGame HTTP request
 */
export class NewsallResponseDto {
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsString({each: true})
    @Expose()
    news : string[];



    constructor(news: string[]) {
        this.news = news;
    }
}