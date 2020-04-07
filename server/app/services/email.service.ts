import { HttpException } from '@app/classes/http-exception';
import { EmailRequest } from '@common/communication/email-request';
import { HttpStatusCode } from '@common/communication/http-status-code.enum';
import * as FormData from 'form-data';
// import * as queryString from 'querystring';
import * as http from 'http';
import * as https from 'https';
import { injectable } from 'inversify';

interface Response {
    message: http.IncomingMessage;
    data: object;
}

@injectable()
export class EmailService {
    async sendEmail(emailRequest: EmailRequest): Promise<void> {
        // this.dothings(emailRequest);
        const returnValue = await this.makeFullRequest(emailRequest);
        console.log(returnValue);
        return;
    }

    private async makeFullRequest(emailRequest: EmailRequest): Promise<HttpStatusCode> {
        const requestOptions = this.makeRequestOptions(false, false, false);
            const requestResponse = await this.sendRequest(requestOptions, emailRequest);
            if (requestResponse.message.statusCode !== HttpStatusCode.Ok) {
                throw new HttpException(HttpStatusCode.BadRequest, requestResponse.data.toString());
            }
            return requestResponse.message.statusCode!;
    }

    private async sendRequest(options: https.RequestOptions, emailRequest: EmailRequest): Promise<Response> {
        const test = new FormData();
        const inter = emailRequest.drawing as unknown as Express.Multer.File;
        // test.append('Content-Type', 'multipart/form-data');
        // test.append('X-Team-Key', `${process.env.EMAIL_API_KEY}`);
        test.append('to', emailRequest.address);
        test.append('payload', inter.buffer);
        const please = {
            hostname: 'log2990.step.polymtl.ca',
            protocol: 'https:',
            path: '/email?dry_run=true&address_validation=true',
            method: 'POST',
            headers: test.getHeaders({'X-Team-Key': process.env.EMAIL_API_KEY}),
        };
        console.log(please);
        return new Promise<Response>((resolve: (response: Response) => void): void => {
            const request = https.request(please, (response: http.IncomingMessage) => {
                response.on('error', (error: Error) => {
                    throw error;
                });
                const reponseBody: Buffer[] = [];
                response.on('data', (chunk: Buffer) => {
                    reponseBody.push(chunk);
                });
                response.on('end', () => {
                    resolve({
                        message: response,
                        data: Buffer.concat(reponseBody),
                    });
                });
            });
            test.pipe(request);
            // const body = {
            //     to: emailRequest.address,
            //     payload: (emailRequest.drawing as unknown as Express.Multer.File).buffer,
            // };
            // const body = {
            //     formData: {
            //         to: emailRequest.address,
            //         payload: {
            //             value: (emailRequest.drawing as unknown as Express.Multer.File).buffer,
            //             options: {
            //                 filename: 'Sans titre.jpeg',
            //                 contentType: null,
            //             },
            //         },
            //     },
            // };
            // request.write(Buffer.from(body));
            // request.end();
        });
    }

    private makeRequestOptions(isDryRun: boolean, isAddressValidation: boolean, isQuickReturn: boolean): https.RequestOptions {
        return {
            hostname: 'log2990.step.polymtl.ca',
            protocol: 'https:',
            path: '/email?dry_run=true&address_validation=true',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Team-Key': process.env.EMAIL_API_KEY,
            },
        };
    }

    // tslint:disable-next-line: member-ordering
    // dothings(emailRequest: EmailRequest): void {
    //     var request = require('request');
    //     // var fs = require('fs');
    //     const inter = emailRequest.drawing as unknown as Express.Multer.File;
    //     var options = {
    //         method: 'POST',
    //         url: 'https://log2990.step.polymtl.ca/email?dry_run=true',
    //         headers: {
    //             'X-team-key': 'e397fc20-cc2c-4efb-b191-1e14f4c67d38',
    //         },
    //         formData: {
    //                     to: emailRequest.address,
    //                     payload: {
    //                     value: inter.buffer,
    //                     options: {
    //                         filename: 'Sans titre.jpeg',
    //                         contentType: null,
    //                     },
    //                 },
    //             },
    //         };

    //     request(options, (error: any, response: any) => {
    //         if (error) {
    //             throw new Error(error);
    //         }
    //         console.log(response.body);
    //     });
    // }
}
