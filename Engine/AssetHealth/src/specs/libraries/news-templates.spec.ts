import {
    GenericCompanyNewsGenerator,
    GenericNewsTemplate,
    GenericSectorNewsGenerator,
    GlobalNewsGenerator,
    SpecificNewsTemplate,
    SpecificSectorNewsGenerator,
    parseNewsTemplateJson
} from "../../libraries/news-templates";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {SectorEntity} from "../../../../DataSource/src/entities/sector.entity";

describe("News template and generators", () => {
    const assets = [
        new AssetEntity("APPL", "Apple", "A tech company", "logo.png"),
        new AssetEntity("MSFT", "Microsoft", "A tech company", "logo.png"),
        new AssetEntity("TTE", "Total energie", "A petrol company", "logo.png"),
        new AssetEntity("TSLA", "Tesla", "A petrol company", "logo.png"),
    ]
    assets[0].sectors = [new SectorEntity("Technology")];
    assets[1].sectors = [new SectorEntity("Technology")];
    assets[2].sectors = [new SectorEntity("Energy")];
    assets[3].sectors = [new SectorEntity("Technology"), new SectorEntity("Transportation")];

    describe("GenericNewsTemplate", () => {
        test("fill should return a new entity", () => {
            const templateTitle = "";
            const templateContent = "";
            const templateImpact = 1;

            const genericNewsTemplate = new GenericNewsTemplate(templateTitle, templateContent, templateImpact);

            expect(genericNewsTemplate.fill(new Map())).not.toBe(genericNewsTemplate);
        })

        test("fill should replace values in the title and content", () => {
            const templateTitle = "[[replace]] lorem ipsum";
            const expectedTemplateTitle = "replaced lorem ipsum";
            const templateContent = "[[replace]] lorem ipsum dolor sit amet [[replace]]";
            const expectedTemplateContent = "replaced lorem ipsum dolor sit amet replaced";
            const templateImpact = 1;

            const filledTemplate = new GenericNewsTemplate(templateTitle, templateContent, templateImpact).fill(new Map([[/\[\[replace]]/g, "replaced"]]));

            expect(filledTemplate.title).toEqual(expectedTemplateTitle);
            expect(filledTemplate.content).toEqual(expectedTemplateContent);
        })

        test("fill should not modify the title and content if no match is present", () => {
            const templateTitle = "lorem ipsum";
            const expectedTemplateTitle = "lorem ipsum";
            const templateContent = "lorem ipsum dolor sit amet";
            const expectedTemplateContent = "lorem ipsum dolor sit amet";
            const templateImpact = 1;

            const filledTemplate = new GenericNewsTemplate(templateTitle, templateContent, templateImpact).fill(new Map([[/\[\[replace]]/g, "replaced"]]));

            expect(filledTemplate.title).toEqual(expectedTemplateTitle);
            expect(filledTemplate.content).toEqual(expectedTemplateContent);
        })
    })

    describe("GlobalNewsGenerator", () => {
        const genericNewsTemplate = new GenericNewsTemplate(
            "[[replace]] [[country]] lorem ipsum",
            "[[replace]] [[country]] lorem ipsum",
            1
        );

        it("Should generate a valid NewsReportEntity", () => {
            const generator = new GlobalNewsGenerator(genericNewsTemplate);

            const entity = generator.toNewsReportEntity(10, assets);

            const expectedTitle = "[[replace]] country lorem ipsum";
            const expectedContent = "[[replace]] country lorem ipsum";
            expect(entity.generatedTick).toEqual(10);
            expect(entity.title).toEqual(expectedTitle);
            expect(entity.content).toEqual(expectedContent);
            expect(entity.assets).toEqual(assets);
            expect(entity.influenceFactor).toEqual(1);
        })
    })

    describe("GenericCompanyNewsGenerator", () => {
        const genericNewsTemplate = new GenericNewsTemplate(
            "[[replace]] [[company]] lorem ipsum",
            "[[replace]] [[company]] lorem ipsum",
            1
        );

        it("Should generate a valid NewsReportEntity", () => {
            const generator = new GenericCompanyNewsGenerator(genericNewsTemplate);

            const entity = generator.toNewsReportEntity(10, assets);

            const asset = entity.assets[0];
            const expectedTitle = `[[replace]] ${asset.name} lorem ipsum`;
            const expectedContent = `[[replace]] ${asset.name} lorem ipsum`;
            expect(entity.generatedTick).toEqual(10);
            expect(entity.title).toEqual(expectedTitle);
            expect(entity.content).toEqual(expectedContent);
            expect(entity.assets.length).toEqual(1);
            expect(assets).toContain(entity.assets[0]);
            expect(entity.influenceFactor).toEqual(1);
        })
    })

    describe("GenericSectorNewsGenerator", () => {
        const genericNewsTemplate = new GenericNewsTemplate(
            "[[sector]]",
            "[[replace]] [[sector]] lorem ipsum",
            1
        );

        it("Should generate a valid NewsReportEntity", () => {
            const generator = new GenericSectorNewsGenerator(genericNewsTemplate);

            const entity = generator.toNewsReportEntity(10, assets);

            const asset = entity.assets[0];
            const possibleTitles = asset.sectors.map(sector => sector.name);
            const possibleContents = asset.sectors.map(sector => `[[replace]] ${sector.name} lorem ipsum`);
            expect(entity.generatedTick).toEqual(10);
            expect(possibleTitles).toContain(entity.title);
            expect(possibleContents).toContain(entity.content);
            const selectedSector = entity.title;
            expect(entity.assets).toEqual(assets.filter(item => item.sectors.map(sector => sector.name).includes(selectedSector)));
            expect(entity.influenceFactor).toEqual(1);
        })
    })

    describe("SpecificSectorNewsGenerator", () => {
        const specificNewsTemplate = new SpecificNewsTemplate(
            "[[sector]]",
            "[[replace]] [[sector]] lorem ipsum",
            1,
            "Technology"
        );

        it("Should generate a valid NewsReportEntity", () => {
            const generator = new SpecificSectorNewsGenerator(specificNewsTemplate);

            const entity = generator.toNewsReportEntity(10, assets);

            expect(entity.title).toEqual("[[sector]]");
            expect(entity.content).toEqual("[[replace]] [[sector]] lorem ipsum"); // Don't replace anything
            expect(entity.assets).toEqual(assets.filter(item => item.sectors.map(sector => sector.name).includes(specificNewsTemplate.target)));
            expect(entity.generatedTick).toEqual(10);
        })
    })

    describe("parseNewsTemplateJson", () => {
        it("Should parse properly formatted json", () => {
            const json = `
            {
                "globalNews": [
                {
                    "title": "Le barrage de Hoover s'effondre.",
                    "content": "Suite à des manquements dans la maintenance, le barrage de Hoover aux États-Unis s'est effondré tard dans la soirée. Plus de 80 000 personnes sont portées disparues, et des millions d'autres sont dans des conditions de précarité critique alors que l'accès à l'eau et l'électricité n'est plus garanti dans une bonne partie de l'Ouest des États-Unis.",
                    "impact": -4.0
                }],
                "genericCompanyNews": [
                {
                    "title": "[[company]] enregistre des résultats records après le lancement de leur nouveau produit.",
                    "content": "[[company]] lance aujourd'hui son nouveau produit, une vraie révolution. 200 000 personnes ont été comptabilisées hier soir devant ses magasins partout dans le monde. Les analystes s'attendent à des profits records au prochain trimestre.",
                    "impact": 7.0
                }],
                "genericSectorNews": [
                {
                    "title": "Nouvelles régulations européennes pour les entreprises de [[sector]] !",
                    "content": "Avec ces nouvelles directives et critères de qualité sur les produits de [[sector]], l'Union Européenne prends de court les fabricants et les oblige à revoir leurs méthodes de productions.",
                    "impact": 0.0
                }],
                "specificSectorNews": [
                {
                    "target": "Technology",
                    "news": {
                        "title": "Nouvelles régulations européennes pour les entreprises de [[sector]] !",
                        "content": "Avec ces nouvelles directives et critères de qualité sur les produits de [[sector]], l'Union Européenne prends de court les fabricants et les oblige à revoir leurs méthodes de productions.",
                        "impact": 0.0
                    }
                }]
            }
            `

            const generators = parseNewsTemplateJson(json);

            expect(generators.length).toEqual(4);
            expect( generators[0] instanceof GlobalNewsGenerator).toBeTruthy();
            expect(generators[1] instanceof GenericCompanyNewsGenerator).toBeTruthy();
            expect(generators[2] instanceof GenericSectorNewsGenerator).toBeTruthy();
            expect(generators[3] instanceof SpecificSectorNewsGenerator).toBeTruthy();

            expect((generators[0] as GlobalNewsGenerator).template.title).toEqual("Le barrage de Hoover s'effondre.")
            expect((generators[0] as GlobalNewsGenerator).template.content).toEqual("Suite à des manquements dans la maintenance, le barrage de Hoover aux États-Unis s'est effondré tard dans la soirée. Plus de 80 000 personnes sont portées disparues, et des millions d'autres sont dans des conditions de précarité critique alors que l'accès à l'eau et l'électricité n'est plus garanti dans une bonne partie de l'Ouest des États-Unis.")
            expect((generators[0] as GlobalNewsGenerator).template.impact).toEqual(-4)

            expect((generators[1] as GenericCompanyNewsGenerator).template.title).toEqual("[[company]] enregistre des résultats records après le lancement de leur nouveau produit.")
            expect((generators[1] as GenericCompanyNewsGenerator).template.content).toEqual("[[company]] lance aujourd'hui son nouveau produit, une vraie révolution. 200 000 personnes ont été comptabilisées hier soir devant ses magasins partout dans le monde. Les analystes s'attendent à des profits records au prochain trimestre.")
            expect((generators[1] as GenericCompanyNewsGenerator).template.impact).toEqual(7)

            expect((generators[2] as GenericSectorNewsGenerator).template.title).toEqual("Nouvelles régulations européennes pour les entreprises de [[sector]] !")
            expect((generators[2] as GenericSectorNewsGenerator).template.content).toEqual("Avec ces nouvelles directives et critères de qualité sur les produits de [[sector]], l'Union Européenne prends de court les fabricants et les oblige à revoir leurs méthodes de productions.")
            expect((generators[2] as GenericSectorNewsGenerator).template.impact).toEqual(0)

            expect((generators[3] as SpecificSectorNewsGenerator).template.news.title).toEqual("Nouvelles régulations européennes pour les entreprises de [[sector]] !")
            expect((generators[3] as SpecificSectorNewsGenerator).template.news.content).toEqual("Avec ces nouvelles directives et critères de qualité sur les produits de [[sector]], l'Union Européenne prends de court les fabricants et les oblige à revoir leurs méthodes de productions.")
            expect((generators[3] as SpecificSectorNewsGenerator).template.news.impact).toEqual(0)
            expect((generators[3] as SpecificSectorNewsGenerator).template.target).toEqual("Technology")
        })

        it("Should parse properly json that doesn't include all kinds of news", () => {
            const json = `
            {
                "globalNews": [
                {
                    "title": "Le barrage de Hoover s'effondre.",
                    "content": "Suite à des manquements dans la maintenance, le barrage de Hoover aux États-Unis s'est effondré tard dans la soirée. Plus de 80 000 personnes sont portées disparues, et des millions d'autres sont dans des conditions de précarité critique alors que l'accès à l'eau et l'électricité n'est plus garanti dans une bonne partie de l'Ouest des États-Unis.",
                    "impact": -4.0
                }, 
                {
                    "title": "Le barrage de Hoover s'effondre.",
                    "content": "Suite à des manquements dans la maintenance, le barrage de Hoover aux États-Unis s'est effondré tard dans la soirée. Plus de 80 000 personnes sont portées disparues, et des millions d'autres sont dans des conditions de précarité critique alors que l'accès à l'eau et l'électricité n'est plus garanti dans une bonne partie de l'Ouest des États-Unis.",
                    "impact": -4.0
                }],
                "genericCompanyNews": [
                {
                    "title": "[[company]] enregistre des résultats records après le lancement de leur nouveau produit.",
                    "content": "[[company]] lance aujourd'hui son nouveau produit, une vraie révolution. 200 000 personnes ont été comptabilisées hier soir devant ses magasins partout dans le monde. Les analystes s'attendent à des profits records au prochain trimestre.",
                    "impact": 7.0
                }]
            }
            `

            const generators = parseNewsTemplateJson(json);

            expect(generators.length).toEqual(3);
            expect( generators[0] instanceof GlobalNewsGenerator).toBeTruthy();
            expect(generators[1] instanceof GlobalNewsGenerator).toBeTruthy();
            expect(generators[2] instanceof GenericCompanyNewsGenerator).toBeTruthy();
        })

        it("Should parse properly empty json", () => {
            const json = `{}`

            const generators = parseNewsTemplateJson(json);

            expect(generators.length).toEqual(0);
        })
    })
})