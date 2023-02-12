import {AssetEntity} from "../../../DataSource/src/entities/asset.entity";
import {SectorEntity} from "../../../DataSource/src/entities/sector.entity";
import {NewsReportEntity} from "../../../DataSource/src/entities/news-report.entity";
import {selectRandomItemFromList} from "./select-random-item-from-list";
import {Expose, plainToInstance} from "class-transformer";
import {IsNumber, IsString, Max, Min} from "class-validator";

export class GenericNewsTemplate {
    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsString()
    content: string;

    @Expose()
    @IsNumber()
    @Min(-10)
    @Max(10)
    impact: number;
    
    fill(replacementMap: Map<RegExp, string>): GenericNewsTemplate {
        const filledTemplate = new GenericNewsTemplate(this.title, this.content, this.impact);
        replacementMap.forEach((replacement, target) => {
            filledTemplate.title = filledTemplate.title.replace(target, replacement);
            filledTemplate.content = filledTemplate.content.replace(target, replacement);
        })
        return filledTemplate;
    }

    constructor(title: string, content: string, impact: number) {
        this.title = title;
        this.content = content;
        this.impact = impact;
    }
}

export class SpecificNewsTemplate {
    @Expose()
    news: GenericNewsTemplate;

    @Expose()
    @IsString()
    target: string;

    constructor(title: string, content: string, impact: number, target: string) {
        this.news = new GenericNewsTemplate(title, content, impact);
        this.target = target;
    }
}

export interface INewsGenerator {
    toNewsReportEntity: (currentTick: number, allAssets: AssetEntity[]) => NewsReportEntity;
}

export class GlobalNewsGenerator implements INewsGenerator {
    template: GenericNewsTemplate;

    toNewsReportEntity(currentTick: number, allAssets: AssetEntity[]): NewsReportEntity {
        const filledTemplate = this.template.fill(new Map([
            [/\[\[country]]/g, "country"]
        ]));
        const newsReportEntity: NewsReportEntity = new NewsReportEntity(currentTick, filledTemplate.title, filledTemplate.content, filledTemplate.impact);
        newsReportEntity.assets = allAssets;

        return newsReportEntity;
    }


    constructor(template: GenericNewsTemplate) {
        this.template = template;
    }
}

export class GenericCompanyNewsGenerator implements INewsGenerator {
    template: GenericNewsTemplate;

    toNewsReportEntity(currentTick: number, allAssets: AssetEntity[]): NewsReportEntity {
        const asset: AssetEntity = selectRandomItemFromList(allAssets);
        const filledTemplate = this.template.fill(new Map([
            [/\[\[company]]/g, asset.name]
        ]));

        const newsReportEntity: NewsReportEntity = new NewsReportEntity(currentTick, filledTemplate.title, filledTemplate.content, filledTemplate.impact);
        newsReportEntity.assets = [asset];

        return newsReportEntity;
    }


    constructor(template: GenericNewsTemplate) {
        this.template = template;
    }
}

export class GenericSectorNewsGenerator implements INewsGenerator {
    template: GenericNewsTemplate;

    toNewsReportEntity(currentTick: number, allAssets: AssetEntity[]): NewsReportEntity {
        const sector: SectorEntity = selectRandomItemFromList(selectRandomItemFromList(allAssets).sectors);
        const filledTemplate = this.template.fill(new Map([
            [/\[\[sector]]/g, sector.name]
        ]));
        const selectedAssets: AssetEntity[] = allAssets.filter(asset => asset.sectors.map(sector => sector.name).includes(sector.name));

        const newsReportEntity: NewsReportEntity = new NewsReportEntity(currentTick, filledTemplate.title, filledTemplate.content, filledTemplate.impact);
        newsReportEntity.assets = selectedAssets;

        return newsReportEntity;
    }


    constructor(template: GenericNewsTemplate) {
        this.template = template;
    }
}

export class SpecificSectorNewsGenerator implements INewsGenerator {
    template: SpecificNewsTemplate;

    toNewsReportEntity(currentTick: number, allAssets: AssetEntity[]): NewsReportEntity {
        const selectedAssets: AssetEntity[] = allAssets.filter(asset => asset.sectors.map(sector => sector.name).includes(this.template.target));

        const newsReportEntity: NewsReportEntity = new NewsReportEntity(currentTick, this.template.news.title, this.template.news.content, this.template.news.impact);
        newsReportEntity.assets = selectedAssets;

        return newsReportEntity;
    }


    constructor(template: SpecificNewsTemplate) {
        this.template = template;
    }
}

class NewsTemplateJson {
    globalNews?: GenericNewsTemplate[];
    genericCompanyNews?: GenericNewsTemplate[];
    genericSectorNews?: GenericNewsTemplate[];
    specificSectorNews?: SpecificNewsTemplate[];
}

export function parseNewsTemplateJson(json: string): INewsGenerator[] {
    const parsedJson = JSON.parse(json);
    const newsTemplateList: NewsTemplateJson = plainToInstance(NewsTemplateJson, parsedJson);

    const generatorList: INewsGenerator[] = []
    newsTemplateList.globalNews?.forEach(template => {
        generatorList.push(new GlobalNewsGenerator(template));
    })
    newsTemplateList.genericCompanyNews?.forEach(template => {
        generatorList.push(new GenericCompanyNewsGenerator(template));
    })
    newsTemplateList.genericSectorNews?.forEach(template => {
        generatorList.push(new GenericSectorNewsGenerator(template));
    })
    newsTemplateList.specificSectorNews?.forEach(template => {
        generatorList.push(new SpecificSectorNewsGenerator(template));
    })

    return generatorList;
}