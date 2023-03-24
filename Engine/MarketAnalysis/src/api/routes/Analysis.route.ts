import {NextFunction, Request, Response} from 'express';
import {Repository} from "typeorm";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {GameAndAssetIdDto} from "../../dto/gameandassetid.dto";
import {variance} from 'mathjs'
import {dataAnalisysDto} from "../../dto/data_analisys.sto";


export async function AnalysisRoute(req: Request, res: Response, next: NextFunction, marketEntityRepository : Repository<MarketEntity>, assetEntityRepository : Repository<AssetEntity>) {
    try {
        let VaR = 0
        let Beta = 0
        let ER = 0
        const ids = req.params as unknown as GameAndAssetIdDto

        const assetTickers = (await assetEntityRepository.find({})).map(asset => asset.ticker)
        if (!assetTickers.includes(ids.assetID)) {
            res.sendStatus(404)
            return;
        }

        const data = await Promise.all(
            assetTickers.map(assetTicker => {
                return marketEntityRepository.find({
                    where: {
                        gameId: ids.gameID,
                        assetTicker: assetTicker
                    },
                    order: {
                        tick: "DESC"
                    },
                    relations: {
                        asset: true
                    }
                })
            })
        )


        if (data[0].length == 0 || !data) {
            res.sendStatus(404)
            return
        }


        if (data[0].length < 600) {
            res.sendStatus(412)
            return
        }


        let indexAsset: number = findIndexAsset(data, ids.assetID)
        let assetList = marketToList(data[indexAsset])

        let marketvar = market(data)
        let returnmarketPercentage = dailyReturnPercentage(marketvar)
        let returnmarketValue = dailyReturnValue(marketvar)

        let returnassetPercentage = dailyReturnPercentage(assetList)
        let returnassetValue = dailyReturnValue(assetList)

        Beta = betafunc(returnassetPercentage, returnmarketPercentage)

        VaR = valueAtRisk95(returnassetValue)

        ER = expectedReturn(returnassetPercentage, returnmarketPercentage)

        res.json(new dataAnalisysDto(VaR, Beta, ER))
    } catch (e) {
        next(e)
    }
}

function marketToList(asset : MarketEntity[]){
    let list: number[] = []
    asset.forEach(x =>{
        list.push(x.value)
    })
    return list
}
function lastAssetReturn(asset : number[]){
    const assetLenght = asset.length
    return (asset[assetLenght]-asset[assetLenght-60])/asset[assetLenght-60]

}
function findIndexAsset(assets : MarketEntity[][], ticker : string){
    for(let i : number = 0;i<assets.length;i++){
        if(assets[i][0].assetTicker==ticker){
            return i
        }
    }
}
function market(assets : MarketEntity[][]){
    let marketasset = []
    let n = 0;
    const numberOfAsset = assets.length
    const numberOfTicks = assets[0].length
    for (let i = 0; i <numberOfTicks ; i++) {
        for (let j = 0; j < numberOfAsset; j++) {
            n+=assets[j][i].value
        }
        marketasset.push(n/numberOfAsset)

    }
    return marketasset

}
function dailyReturnPercentage(asset : number[]){
    let dailyReturnList = []

    for(let n = 0; n< asset.length; n++){
        if(n%120==0 && n!=0){
            dailyReturnList.push(((asset[n]-asset[n-60])/asset[n-60]))
        }
    }

    return dailyReturnList

}

function dailyReturnValue(asset : number[]){
    let dailyReturnList = []

    for(let n = 0; n< asset.length; n++){
        if(n%120==0 && n!=0){
            dailyReturnList.push(asset[n]-asset[n-60])
        }
    }

    return dailyReturnList

}

function valueAtRisk95(asset : number[]){
    asset.sort((a, b) => b - a)

    const index = Math.floor(asset.length * 0.95)

    return -asset[index]
}


function betafunc(re : number[], rm : number[]){
    // @ts-ignore
    return covariance(re,rm)/variance(rm)
}

// Function to find covariance.
function covariance(arr1 : number[], arr2 : number[])
{
    const n = arr1.length;
    const sum1 = arr1.reduce((acc, curr) => acc + curr, 0);
    const sum2 = arr2.reduce((acc, curr) => acc + curr, 0);
    const sum12 = arr1.map((val, index) => [val, arr2[index]]).reduce((acc, curr) => acc + (curr[0] * curr[1]), 0);

    return (sum12 - sum1 * sum2 / n) / n;
}

function expectedReturn(re : number[], rmPercent : number[]){

    return(0.035+betafunc(re,rmPercent)*(valueAtRisk95(rmPercent)-0.035))
}