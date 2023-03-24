import {NextFunction, Request, Response} from 'express';
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {GameIdDto} from "../../dto/game-id.dto";
import {AssetDto} from "../../dto/asset.dto";
import {assetStateDto} from "../../dto/assetstate.dto";
import util from "util";
import {GameAndAssetIdDto} from "../../dto/gameandassetid.dto";
import {forEach, i, number, re, variance} from 'mathjs'
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
        let returnmarket = dailyReturn(marketvar)

        let returnasset = dailyReturn(assetList)

        Beta = betafunc(returnasset, returnmarket)

        VaR = valueAtRisk95(returnasset)

        ER = expectedReturn(returnasset, returnmarket)

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
function dailyReturn(asset : number[]){
    let dailyReturnList = []

    for(let n = 0; n< asset.length; n++){
        if(n%120==0 && n!=0){
            dailyReturnList.push(((asset[n]-asset[n-60])/asset[n-60]) * 100)
        }
    }

    return dailyReturnList

}

function valueAtRisk95(asset : number[]){
    asset.sort((a,b)=>a-b)

    const index = Math.floor(asset.length *0.95)

    return asset[index]
}


function betafunc(re : number[], rm : number[]){
    // @ts-ignore
    return covariance(re,rm)/variance(rm)
}

function mean(arr : number[])
{
    const lenghtArray = arr.length
    let sum = 0;
    for(let i = 0; i < lenghtArray; i++)
        sum = sum + arr[i];

    return sum / lenghtArray;
}

// Function to find covariance.
function covariance(arr1 : number[], arr2 : number[])
{
    let sum = 0;
    const lenghtArray = arr1.length

    let mean_arr1 = mean(arr1);
    let mean_arr2 = mean(arr2);
    for(let i = 0; i < lenghtArray; i++)
        sum = sum + (arr1[i] - mean_arr1) *
            (arr2[i] - mean_arr2);

    return sum / (lenghtArray - 1);
}

function expectedReturn(re : number[], rm : number[]){

    return(0.035+betafunc(re,rm)*(valueAtRisk95(rm)-0.035))
}