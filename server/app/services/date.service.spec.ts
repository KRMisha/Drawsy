import { expect } from 'chai';
import * as sinon from 'sinon';
import { DateService } from './date.service';

describe('Date Service', () => {
    let dateService: DateService;
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        dateService = new DateService();
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('currenTime should return a valid message', async () => {
        const result = await dateService.currentTime();
        expect(result.title).to.equals('Time');
        expect(result.body).to.be.equal(new Date(0).toString());
    });

    it('currentTime should return different dates if called later', async () => {
        const { body: currentTime } = await dateService.currentTime();
        clock.tick(5000); // tslint:disable-line: no-magic-numbers
        const { body: now } = await dateService.currentTime();
        expect(new Date(currentTime)).to.be.below(new Date(now));
    });
});
