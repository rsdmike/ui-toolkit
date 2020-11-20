/*********************************************************************
* Copyright (c) Intel Corporation 2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { HttpClient } from "../reactjs/components/services/HttpClient"

describe("Test HttpClient class", () => {

    it('Test HttpClient.get function', () => {
        // Mock HttpClient.fetch Implementation
        HttpClient.fetch = jest.fn(function (arg1, arg2) {
            return new Promise((resolve, reject) => {
                // Expected output in the parameter of the promise call
                expect(arg1).toBe("1.2.3.4:1234");
            });
        });

        // call HttpClient.get function
        HttpClient.get("1.2.3.4:1234", 'apikey');
    });

    it('Test HttpClient.post function', () => {
        // Mock HttpClient.fetch Implementation
        HttpClient.fetch = jest.fn(function (arg1, arg2) {
            return new Promise((resolve, reject) => {
                // Expected output in the parameter of the promise call
                expect(arg1).toBe("99.2.3.4:1234");
                expect(arg2).toStrictEqual({"body": "{\"apikey\":\"xxxxx\",\"method\":\"PowerActionX\",\"payload\":{\"guid\":\"abcd-1234-efgh-5678\",\"action\":\"20\"}}", "headers": {"Accept": "application/json", "Content-Type": "application/json", "X-MPS-API-Key": "APIKEYFORMPS123!", "X-RPS-API-Key": "APIKEYFORRPS123!"}, "method": "POST"});
            });
        });

        const body = JSON.stringify({
            apikey: 'xxxxx',
            method: 'PowerActionX',
            payload: { "guid": "abcd-1234-efgh-5678", "action": "20" }
        });

        // call HttpClient.get function
        HttpClient.post("99.2.3.4:1234", body);
    });
});