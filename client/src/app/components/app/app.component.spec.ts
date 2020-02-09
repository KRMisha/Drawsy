import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IndexService } from '../../services/index/index.service';
import { ModalService } from '../../services/modal/modal.service';
import { AppComponent } from './app.component';
import SpyObj = jasmine.SpyObj;

describe('AppComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [{ provide: IndexService, useValue: indexServiceSpy },
            {provide: ModalService, useValue: {} as ModalService}],
        });
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
