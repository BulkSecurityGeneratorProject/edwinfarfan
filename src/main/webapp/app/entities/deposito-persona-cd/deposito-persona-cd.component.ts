import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IDepositoPersonaCd } from 'app/shared/model/deposito-persona-cd.model';
import { AccountService } from 'app/core';
import { DepositoPersonaCdService } from './deposito-persona-cd.service';

@Component({
    selector: '-deposito-persona-cd',
    templateUrl: './deposito-persona-cd.component.html'
})
export class DepositoPersonaCdComponent implements OnInit, OnDestroy {
    depositoPersonas: IDepositoPersonaCd[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected depositoPersonaService: DepositoPersonaCdService,
        protected jhiAlertService: JhiAlertService,
        protected dataUtils: JhiDataUtils,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.depositoPersonaService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IDepositoPersonaCd[]>) => res.ok),
                    map((res: HttpResponse<IDepositoPersonaCd[]>) => res.body)
                )
                .subscribe(
                    (res: IDepositoPersonaCd[]) => (this.depositoPersonas = res),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.depositoPersonaService
            .query()
            .pipe(
                filter((res: HttpResponse<IDepositoPersonaCd[]>) => res.ok),
                map((res: HttpResponse<IDepositoPersonaCd[]>) => res.body)
            )
            .subscribe(
                (res: IDepositoPersonaCd[]) => {
                    this.depositoPersonas = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDepositoPersonas();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IDepositoPersonaCd) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    registerChangeInDepositoPersonas() {
        this.eventSubscriber = this.eventManager.subscribe('depositoPersonaListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
