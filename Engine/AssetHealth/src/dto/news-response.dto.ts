import {Expose, Type} from "class-transformer";
import {IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, ValidateNested} from "class-validator";

export class NewsResponseDto {
    @Expose()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => NewsReportDto)
    news: NewsReportDto[]

    constructor(news: NewsReportDto[]) {
        this.news = news;
    }
}

export class NewsReportDto {
    @Expose()
    @IsUUID()
    id: string

    @Expose()
    @IsNumber()
    @IsPositive()
    generatedTick: number

    @Expose()
    @IsString()
    @IsNotEmpty()
    title: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    content: string

    @Expose()
    @IsNumber()
    influenceFactor: number

    constructor(id: string, generatedTick: number, title: string, content: string, influenceFactor: number) {
        this.id = id;
        this.generatedTick = generatedTick;
        this.title = title;
        this.content = content;
        this.influenceFactor = influenceFactor;
    }
}
