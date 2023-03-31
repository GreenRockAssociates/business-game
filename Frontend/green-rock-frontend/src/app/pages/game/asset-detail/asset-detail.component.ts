import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AssetDetailDto} from "../../../interfaces/dto/asset-detail.dto";
import {QueryService} from "../../../services/query-service/query.service";

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {

  gameId: string | undefined;
  asset: AssetDetailDto | undefined;

  constructor(
    private route: ActivatedRoute,
    private queryService: QueryService,
  ) { }

  ngOnInit(): void {
    this.gameId = this.route.parent!.snapshot.params['gameId']; // Never null since we always refer to a game when navigating to this URL
    const assetId: string = this.route.snapshot.params['assetId'];
    if (this.gameId && assetId) {
      this.queryService.getAssetDetail(this.gameId, assetId).subscribe({
        next: assetDetail => this.asset = assetDetail
      })
    }
  }

}
