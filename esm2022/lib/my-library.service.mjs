import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./cookie.service";
// import { environment } from '../environments/environment';
export class MyLibraryService {
    constructor(http, cookieStorage) {
        this.http = http;
        this.cookieStorage = cookieStorage;
        this.signUpSubject = new Subject();
        this.loginSubject = new Subject();
        this.appSetupSubject = new Subject();
        this.verifyEmailSubject = new Subject();
        this.sendOTPSubject = new Subject();
        this.validateOTPSubject = new Subject();
        this.forgotPasswordSubject = new Subject();
        this.resetPasswordSubject = new Subject();
        this.emailValidationRegex = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/;
        this.passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,100000}$/;
        this.phoneNumberValidationRegex = /^0\d{8,10}$/;
    }
    checkForSpecialCharacters(query) {
        const pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return pattern.test(query);
    }
    checkForDigits(query) {
        const pattern = /\d/;
        return pattern.test(query);
    }
    checkForLowercase(query) {
        const pattern = /[a-z]/;
        return pattern.test(query);
    }
    checkForUppercase(query) {
        const pattern = /[A-Z]/;
        return pattern.test(query);
    }
    get headers() {
        let headers = new HttpHeaders();
        const accessToken = this.cookieStorage.get(this.cookieStorage.COOKIE_NAME);
        const tokenType = this.cookieStorage.get('tokenType');
        if (accessToken) {
            headers = headers.append('Authorization', `${tokenType} ${accessToken}`.trim());
        }
        return headers;
    }
    setBaseAPI(url) {
        this.cookieStorage.set("baseApi", url);
    }
    get baseAPI() {
        const api = this.cookieStorage.get('baseApi');
        return api;
    }
    ;
    initializeApp(query) {
        const queryObject = query;
        this.queryObject = queryObject;
        const appParams = queryObject['params'];
        this.setBaseAPI(queryObject['url']);
        if (!appParams) {
            const error = {
                title: 'App Params Missing',
                message: 'No app params',
                type: 'error',
                queryObject: this.queryObject || {},
            };
            this.appSetupSubject.error(error);
            return this.appSetupSubject.asObservable();
        }
        // const role = queryObject['role'];
        // this.cookieStorage.set('sso', this.baseAPI);
        this.cookieStorage.set('appParams', appParams);
        // this.cookieStorage.set('role', role);
        return this.appInit();
    }
    appInit() {
        const accessToken = this.cookieStorage.get('appParams') || '';
        let headers = new HttpHeaders();
        headers = headers.append('Basic', accessToken);
        this.http
            .post(`${this.baseAPI}/auth/get-token`, {}, { headers })
            .subscribe({
            next: (res) => {
                if (res) {
                    this.setupApp(res);
                    return;
                }
                const error = {
                    title: 'No res from api call',
                    message: 'Check backend app',
                    type: 'error',
                    queryObject: this.queryObject || {},
                };
                this.appSetupSubject.error(error);
            },
            error: (err) => {
                const error = {
                    title: 'Api Error',
                    message: `Something went wrong, Please refresh the app`,
                    type: 'error',
                    queryObject: this.queryObject || {},
                };
                this.appSetupSubject.error(error);
            },
        });
        return this.appSetupSubject.asObservable();
    }
    setupApp(data) {
        // this.appIsSetup = true;
        this.cookieStorage.remove('appParams');
        this.cookieStorage.set('redirectUrl', data.client.redirectUri, data.expiresIn);
        this.cookieStorage.set('accessToken', data.accessToken, data.expiresIn);
        this.cookieStorage.set('tokenType', data.tokenType, data.expiresIn);
        this.appSetupSubject.next({
            title: 'Success',
            message: 'Items saved to cookies storage',
            type: 'success',
            queryObject: this.queryObject,
        });
    }
    login(payload) {
        // Todo: handle login
        const encodedData = btoa(JSON.stringify(payload));
        // let headers = this.headers;
        let headers = this.headers;
        headers = headers.append('Basic', encodedData);
        this.http
            .post(`${this.baseAPI}/auth/authenticate`, {}, { headers })
            .subscribe({
            next: (res) => {
                if (res['userId']) {
                    this.setUserDetails(res);
                    const userData = res;
                    this.loginSubject.next(userData);
                }
                else {
                    const errorMessage = res['description'];
                    this.loginSubject.next(errorMessage);
                }
            },
            error: (err) => {
                // scrollTo({ top: 0 });
                this.loginSubject.error(err);
            },
        });
        return this.loginSubject.asObservable();
    }
    // setUserDetails(data: LoginData) {
    setUserDetails(data) {
        for (const key in data) {
            if (data[key]) {
                if (typeof data[key] === 'object') {
                    this.cookieStorage.set(key, JSON.stringify(data[key]));
                }
                else {
                    this.cookieStorage.set(key, data[key]);
                }
            }
        }
    }
    signup(payload) {
        let headers = this.headers;
        this.http
            .post(`${this.baseAPI}/auth/register`, payload, { headers })
            .subscribe({
            next: (res) => {
                if (res['data']) {
                    this.signUpSubject.next(res);
                }
                else {
                    const errorMessage = res['description'];
                    this.signUpSubject.next(errorMessage);
                }
            },
            error: (err) => {
                // scrollTo({ top: 0 });
                this.signUpSubject.error(err);
            },
        });
        return this.signUpSubject.asObservable();
    }
    verifyEmail(payload) {
        let headers = this.headers;
        this.http
            .post(`${this.baseAPI}/auth/Confirm-Email`, payload, { headers })
            .subscribe({
            next: (res) => {
                if (res['userId']) {
                    this.verifyEmailSubject.next(true);
                }
                else {
                    const errorMessage = res['description'];
                    this.forgotPasswordSubject.next(errorMessage);
                }
            },
            error: (err) => {
                // scrollTo({ top: 0 });
                this.forgotPasswordSubject.error(err);
            },
        });
        return this.verifyEmailSubject.asObservable();
    }
    sendOTP(OtpType = 0) {
        let headers = this.headers;
        const userId = this.cookieStorage.get('userId');
        if (userId) {
            const payload = {
                OtpType,
                userId,
            };
            this.http
                .post(`${this.baseAPI}/otp/send-otp`, payload, {
                headers,
            })
                .subscribe({
                next: (res) => {
                    // scrollTo({ top: 0 });
                    if (res['userId']) {
                        this.sendOTPSubject.next(true);
                    }
                    else {
                        const errorMessage = res['description'];
                        this.sendOTPSubject.next(errorMessage);
                    }
                },
                error: (err) => {
                    // scrollTo({ top: 0 });
                    this.sendOTPSubject.error(err);
                },
            });
            return this.sendOTPSubject.asObservable();
        }
        this.sendOTPSubject.next(false);
        return this.sendOTPSubject.asObservable();
    }
    validateOTP(token) {
        const userId = this.cookieStorage.get('userId');
        if (userId) {
            const payload = {
                token,
                userId,
            };
            let headers = this.headers;
            this.http
                .post(`${this.baseAPI}/otp/validate-otp`, payload, {
                headers,
            })
                .subscribe({
                next: (res) => {
                    // scrollTo({ top: 0 });
                    if (res['token']) {
                        this.setUserDetails(res);
                        this.validateOTPSubject.next(res);
                    }
                    else {
                        const errorMessage = res['description'];
                        this.validateOTPSubject.next(errorMessage);
                    }
                },
                error: (err) => {
                    // scrollTo({ top: 0 });
                    this.validateOTPSubject.error(err);
                },
            });
            return this.validateOTPSubject.asObservable();
        }
        this.validateOTPSubject.next(false);
        return this.validateOTPSubject.asObservable();
    }
    forgotPassword(emailAddress) {
        const payload = {
            emailAddress,
        };
        let headers = this.headers;
        this.http
            .post(`${this.baseAPI}/auth/forgot-password`, payload, { headers })
            .subscribe({
            next: (res) => {
                if (res['data']) {
                    this.setUserDetails(res.data);
                    this.forgotPasswordSubject.next(true);
                }
                else {
                    const errorMessage = res['description'];
                    this.forgotPasswordSubject.next(errorMessage);
                }
            },
            error: (err) => {
                // scrollTo({ top: 0 });
                this.forgotPasswordSubject.next(err);
            },
        });
        return this.forgotPasswordSubject.asObservable();
    }
    resetPassword(payload) {
        let headers = this.headers;
        this.http
            .post(`${this.baseAPI}/auth/reset-password`, payload, { headers })
            .subscribe({
            next: (res) => {
                if (res['data'] === 'Password reset successful.') {
                    this.setUserDetails(res.data);
                    this.resetPasswordSubject.next(true);
                }
                else {
                    // scrollTo({ top: 0 });
                    const errorMessage = res['description'];
                    this.resetPasswordSubject.next(errorMessage);
                }
            },
            error: (err) => {
                // scrollTo({ top: 0 });
                this.resetPasswordSubject.error(err);
            },
        });
        return this.resetPasswordSubject.asObservable();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryService, deps: [{ token: i1.HttpClient }, { token: i2.CookieService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.CookieService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktbGlicmFyeS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbXktbGlicmFyeS9zcmMvbGliL215LWxpYnJhcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUcvRCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7O0FBQzNDLDZEQUE2RDtBQUs3RCxNQUFNLE9BQU8sZ0JBQWdCO0lBa0IzQixZQUNtQixJQUFnQixFQUNoQixhQUE0QjtRQUQ1QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBbEJ2QyxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDOUIsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzdCLG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNoQyx1QkFBa0IsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ25DLG1CQUFjLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUN4Qyx1QkFBa0IsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ25DLDBCQUFxQixHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFDL0MseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUdsRCx5QkFBb0IsR0FDbEIsOEtBQThLLENBQUM7UUFDakwsNEJBQXVCLEdBQ3JCLHdJQUF3SSxDQUFDO1FBQzNJLCtCQUEwQixHQUFHLGFBQWEsQ0FBQztJQUt4QyxDQUFDO0lBRUoseUJBQXlCLENBQUMsS0FBYTtRQUNyQyxNQUFNLE9BQU8sR0FBRyx5Q0FBeUMsQ0FBQztRQUMxRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxD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LENBQUM7WUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDWixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyw0QkFBNEIsRUFBRTtvQkFDaEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzlCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RDO3FCQUFNO29CQUNMLHdCQUF3QjtvQkFDeEIsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUM5QztZQUNILENBQUM7WUFDRCxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYix3QkFBd0I7Z0JBQ3hCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQztTQUNGLENBQUMsQ0FBQztRQUVMLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2xELENBQUM7K0dBaldVLGdCQUFnQjttSEFBaEIsZ0JBQWdCLGNBRmYsTUFBTTs7NEZBRVAsZ0JBQWdCO2tCQUg1QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJy4vY29va2llLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXBwUGFyYW1zLCBIdHRwUmVzcG9uc2UsIExvZ2luRGF0YSB9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuLy8gaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgTXlMaWJyYXJ5U2VydmljZSB7XG5cbiAgcHJpdmF0ZSBzaWduVXBTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBsb2dpblN1YmplY3QgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIGFwcFNldHVwU3ViamVjdCA9IG5ldyBTdWJqZWN0KCk7XG4gIHByaXZhdGUgdmVyaWZ5RW1haWxTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBzZW5kT1RQU3ViamVjdCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgdmFsaWRhdGVPVFBTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBmb3Jnb3RQYXNzd29yZFN1YmplY3QgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICBwcml2YXRlIHJlc2V0UGFzc3dvcmRTdWJqZWN0ID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcml2YXRlIHF1ZXJ5T2JqZWN0OiBhbnk7XG5cbiAgZW1haWxWYWxpZGF0aW9uUmVnZXggPVxuICAgIC8oWy0hIy0nKisvLTk9P0EtWl4tfl0rKFxcLlstISMtJyorLy05PT9BLVpeLX5dKykqfFwiKFtdISMtW14tfiBcXHRdfChcXFxcW1xcdCAtfl0pKStcIilAWzAtOUEtWmEtel0oWzAtOUEtWmEtei1dezAsNjF9WzAtOUEtWmEtel0pPyhcXC5bMC05QS1aYS16XShbMC05QS1aYS16LV17MCw2MX1bMC05QS1aYS16XSk/KSsvO1xuICBwYXNzd29yZFZhbGlkYXRpb25SZWdleCA9XG4gICAgL14oPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipcXGQpKD89LipbYCFAIyQlXiYqKClfK1xcLT1cXFtcXF17fTsnOlwiXFxcXHwsLjw+XFwvP35dKVtBLVphLXpcXGRgIUAjJCVeJiooKV8rXFwtPVxcW1xcXXt9Oyc6XCJcXFxcfCwuPD5cXC8/fl17OCwxMDAwMDB9JC87XG4gIHBob25lTnVtYmVyVmFsaWRhdGlvblJlZ2V4ID0gL14wXFxkezgsMTB9JC87XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29va2llU3RvcmFnZTogQ29va2llU2VydmljZVxuICApIHt9XG5cbiAgY2hlY2tGb3JTcGVjaWFsQ2hhcmFjdGVycyhxdWVyeTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0dGVybiA9IC9bYCFAIyQlXiYqKClfK1xcLT1cXFtcXF17fTsnOlwiXFxcXHwsLjw+XFwvP35dLztcbiAgICByZXR1cm4gcGF0dGVybi50ZXN0KHF1ZXJ5KTtcbiAgfVxuXG4gIGNoZWNrRm9yRGlnaXRzKHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gL1xcZC87XG4gICAgcmV0dXJuIHBhdHRlcm4udGVzdChxdWVyeSk7XG4gIH1cblxuICBjaGVja0Zvckxvd2VyY2FzZShxdWVyeTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0dGVybiA9IC9bYS16XS87XG4gICAgcmV0dXJuIHBhdHRlcm4udGVzdChxdWVyeSk7XG4gIH1cblxuICBjaGVja0ZvclVwcGVyY2FzZShxdWVyeTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0dGVybiA9IC9bQS1aXS87XG4gICAgcmV0dXJuIHBhdHRlcm4udGVzdChxdWVyeSk7XG4gIH1cblxuICBwcml2YXRlIGdldCBoZWFkZXJzKCk6IEh0dHBIZWFkZXJzIHtcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gdGhpcy5jb29raWVTdG9yYWdlLmdldCh0aGlzLmNvb2tpZVN0b3JhZ2UuQ09PS0lFX05BTUUpO1xuICAgIGNvbnN0IHRva2VuVHlwZSA9IHRoaXMuY29va2llU3RvcmFnZS5nZXQoJ3Rva2VuVHlwZScpO1xuICAgIGlmIChhY2Nlc3NUb2tlbikge1xuICAgICAgaGVhZGVycyA9IGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgYCR7dG9rZW5UeXBlfSAke2FjY2Vzc1Rva2VufWAudHJpbSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVycztcbiAgfVxuXG4gIHNldEJhc2VBUEkodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvb2tpZVN0b3JhZ2Uuc2V0KFwiYmFzZUFwaVwiLCB1cmwpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgYmFzZUFQSSgpIHtcbiAgICBjb25zdCBhcGkgPSB0aGlzLmNvb2tpZVN0b3JhZ2UuZ2V0KCdiYXNlQXBpJylcbiAgICByZXR1cm4gYXBpXG4gIH07XG5cblxuICBpbml0aWFsaXplQXBwKHF1ZXJ5OiB7IHBhcmFtczogc3RyaW5nOyB1cmw6IHN0cmluZyB9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBxdWVyeU9iamVjdCA9IHF1ZXJ5O1xuICAgIHRoaXMucXVlcnlPYmplY3QgPSBxdWVyeU9iamVjdDtcbiAgICBjb25zdCBhcHBQYXJhbXMgPSBxdWVyeU9iamVjdFsncGFyYW1zJ107XG4gICAgdGhpcy5zZXRCYXNlQVBJKHF1ZXJ5T2JqZWN0Wyd1cmwnXSk7XG4gICAgaWYgKCFhcHBQYXJhbXMpIHtcbiAgICAgIGNvbnN0IGVycm9yID0ge1xuICAgICAgICB0aXRsZTogJ0FwcCBQYXJhbXMgTWlzc2luZycsXG4gICAgICAgIG1lc3NhZ2U6ICdObyBhcHAgcGFyYW1zJyxcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgcXVlcnlPYmplY3Q6IHRoaXMucXVlcnlPYmplY3QgfHwge30sXG4gICAgICB9O1xuICAgICAgdGhpcy5hcHBTZXR1cFN1YmplY3QuZXJyb3IoZXJyb3IpO1xuICAgICAgcmV0dXJuIHRoaXMuYXBwU2V0dXBTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cbiAgICAvLyBjb25zdCByb2xlID0gcXVlcnlPYmplY3RbJ3JvbGUnXTtcbiAgICAvLyB0aGlzLmNvb2tpZVN0b3JhZ2Uuc2V0KCdzc28nLCB0aGlzLmJhc2VBUEkpO1xuICAgIHRoaXMuY29va2llU3RvcmFnZS5zZXQoJ2FwcFBhcmFtcycsIGFwcFBhcmFtcyk7XG4gICAgLy8gdGhpcy5jb29raWVTdG9yYWdlLnNldCgncm9sZScsIHJvbGUpO1xuICAgIHJldHVybiB0aGlzLmFwcEluaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXBwSW5pdCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gdGhpcy5jb29raWVTdG9yYWdlLmdldCgnYXBwUGFyYW1zJykgfHwgJyc7XG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcbiAgICBoZWFkZXJzID0gaGVhZGVycy5hcHBlbmQoJ0Jhc2ljJywgYWNjZXNzVG9rZW4pO1xuXG4gICAgdGhpcy5odHRwXG4gICAgICAucG9zdDxBcHBQYXJhbXM+KGAke3RoaXMuYmFzZUFQSX0vYXV0aC9nZXQtdG9rZW5gLCB7fSwgeyBoZWFkZXJzIH0pXG4gICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dDogKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBBcHAocmVzKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSB7XG4gICAgICAgICAgICB0aXRsZTogJ05vIHJlcyBmcm9tIGFwaSBjYWxsJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdDaGVjayBiYWNrZW5kIGFwcCcsXG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgcXVlcnlPYmplY3Q6IHRoaXMucXVlcnlPYmplY3QgfHwge30sXG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLmFwcFNldHVwU3ViamVjdC5lcnJvcihlcnJvcik7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSB7XG4gICAgICAgICAgICB0aXRsZTogJ0FwaSBFcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiBgU29tZXRoaW5nIHdlbnQgd3JvbmcsIFBsZWFzZSByZWZyZXNoIHRoZSBhcHBgLFxuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0OiB0aGlzLnF1ZXJ5T2JqZWN0IHx8IHt9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5hcHBTZXR1cFN1YmplY3QuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5hcHBTZXR1cFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIHNldHVwQXBwKGRhdGE6IEFwcFBhcmFtcykge1xuICAgIC8vIHRoaXMuYXBwSXNTZXR1cCA9IHRydWU7XG4gICAgdGhpcy5jb29raWVTdG9yYWdlLnJlbW92ZSgnYXBwUGFyYW1zJyk7XG4gICAgdGhpcy5jb29raWVTdG9yYWdlLnNldChcbiAgICAgICdyZWRpcmVjdFVybCcsXG4gICAgICBkYXRhLmNsaWVudC5yZWRpcmVjdFVyaSxcbiAgICAgIGRhdGEuZXhwaXJlc0luXG4gICAgKTtcbiAgICB0aGlzLmNvb2tpZVN0b3JhZ2Uuc2V0KCdhY2Nlc3NUb2tlbicsIGRhdGEuYWNjZXNzVG9rZW4sIGRhdGEuZXhwaXJlc0luKTtcbiAgICB0aGlzLmNvb2tpZVN0b3JhZ2Uuc2V0KCd0b2tlblR5cGUnLCBkYXRhLnRva2VuVHlwZSwgZGF0YS5leHBpcmVzSW4pO1xuICAgIHRoaXMuYXBwU2V0dXBTdWJqZWN0Lm5leHQoe1xuICAgICAgdGl0bGU6ICdTdWNjZXNzJyxcbiAgICAgIG1lc3NhZ2U6ICdJdGVtcyBzYXZlZCB0byBjb29raWVzIHN0b3JhZ2UnLFxuICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgcXVlcnlPYmplY3Q6IHRoaXMucXVlcnlPYmplY3QsXG4gICAgfSk7XG4gIH1cblxuICBsb2dpbihwYXlsb2FkOiB7IEVtYWlsQWRkcmVzczogc3RyaW5nOyBQYXNzd29yZDogc3RyaW5nIH0pIHtcbiAgICAvLyBUb2RvOiBoYW5kbGUgbG9naW5cbiAgICBjb25zdCBlbmNvZGVkRGF0YSA9IGJ0b2EoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xuICAgIC8vIGxldCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzO1xuICAgIGxldCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzO1xuICAgIGhlYWRlcnMgPSBoZWFkZXJzLmFwcGVuZCgnQmFzaWMnLCBlbmNvZGVkRGF0YSk7XG5cbiAgICB0aGlzLmh0dHBcbiAgICAgIC5wb3N0PExvZ2luRGF0YT4oYCR7dGhpcy5iYXNlQVBJfS9hdXRoL2F1dGhlbnRpY2F0ZWAsIHt9LCB7IGhlYWRlcnMgfSlcbiAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0OiAocmVzOiBMb2dpbkRhdGEpID0+IHtcbiAgICAgICAgICBpZiAocmVzWyd1c2VySWQnXSkge1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyRGV0YWlscyhyZXMpO1xuICAgICAgICAgICAgY29uc3QgdXNlckRhdGEgPSByZXMgYXMgTG9naW5EYXRhO1xuICAgICAgICAgICAgdGhpcy5sb2dpblN1YmplY3QubmV4dCh1c2VyRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IHJlc1snZGVzY3JpcHRpb24nXTtcbiAgICAgICAgICAgIHRoaXMubG9naW5TdWJqZWN0Lm5leHQoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgICAgLy8gc2Nyb2xsVG8oeyB0b3A6IDAgfSk7XG4gICAgICAgICAgdGhpcy5sb2dpblN1YmplY3QuZXJyb3IoZXJyKVxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5sb2dpblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvLyBzZXRVc2VyRGV0YWlscyhkYXRhOiBMb2dpbkRhdGEpIHtcbiAgcHJpdmF0ZSBzZXRVc2VyRGV0YWlscyhkYXRhOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoZGF0YVtrZXldKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YVtrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRoaXMuY29va2llU3RvcmFnZS5zZXQoa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhW2tleV0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvb2tpZVN0b3JhZ2Uuc2V0KGtleSwgZGF0YVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNpZ251cChwYXlsb2FkOiBhbnkpIHtcbiAgICBsZXQgaGVhZGVycyA9IHRoaXMuaGVhZGVycztcbiAgICB0aGlzLmh0dHBcbiAgICAgIC5wb3N0KGAke3RoaXMuYmFzZUFQSX0vYXV0aC9yZWdpc3RlcmAsIHBheWxvYWQsIHsgaGVhZGVycyB9KVxuICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgIG5leHQ6IChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChyZXNbJ2RhdGEnXSkge1xuICAgICAgICAgICAgdGhpcy5zaWduVXBTdWJqZWN0Lm5leHQocmVzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gcmVzWydkZXNjcmlwdGlvbiddO1xuICAgICAgICAgICAgdGhpcy5zaWduVXBTdWJqZWN0Lm5leHQoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICAvLyBzY3JvbGxUbyh7IHRvcDogMCB9KTtcbiAgICAgICAgICB0aGlzLnNpZ25VcFN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2lnblVwU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHZlcmlmeUVtYWlsKHBheWxvYWQ6IHsgdG9rZW46IHN0cmluZzsgdXNlcklkOiBzdHJpbmcgfSkge1xuICAgIGxldCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzO1xuXG4gICAgdGhpcy5odHRwXG4gICAgICAucG9zdChgJHt0aGlzLmJhc2VBUEl9L2F1dGgvQ29uZmlybS1FbWFpbGAsIHBheWxvYWQsIHsgaGVhZGVycyB9KVxuICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgIG5leHQ6IChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChyZXNbJ3VzZXJJZCddKSB7XG4gICAgICAgICAgICB0aGlzLnZlcmlmeUVtYWlsU3ViamVjdC5uZXh0KHRydWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSByZXNbJ2Rlc2NyaXB0aW9uJ107XG4gICAgICAgICAgICB0aGlzLmZvcmdvdFBhc3N3b3JkU3ViamVjdC5uZXh0KGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKGVycikgPT4ge1xuICAgICAgICAgIC8vIHNjcm9sbFRvKHsgdG9wOiAwIH0pO1xuICAgICAgICAgIHRoaXMuZm9yZ290UGFzc3dvcmRTdWJqZWN0LmVycm9yKGVycik7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLnZlcmlmeUVtYWlsU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHNlbmRPVFAoT3RwVHlwZTogbnVtYmVyID0gMCkge1xuICAgIGxldCBoZWFkZXJzID0gdGhpcy5oZWFkZXJzO1xuICAgIGNvbnN0IHVzZXJJZCA9IHRoaXMuY29va2llU3RvcmFnZS5nZXQoJ3VzZXJJZCcpO1xuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIE90cFR5cGUsXG4gICAgICAgIHVzZXJJZCxcbiAgICAgIH07XG4gICAgICB0aGlzLmh0dHBcbiAgICAgICAgLnBvc3Q8SHR0cFJlc3BvbnNlPHN0cmluZz4+KGAke3RoaXMuYmFzZUFQSX0vb3RwL3NlbmQtb3RwYCwgcGF5bG9hZCwge1xuICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgIH0pXG4gICAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICAgIG5leHQ6IChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gc2Nyb2xsVG8oeyB0b3A6IDAgfSk7XG4gICAgICAgICAgICBpZiAocmVzWyd1c2VySWQnXSkge1xuICAgICAgICAgICAgICB0aGlzLnNlbmRPVFBTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSByZXNbJ2Rlc2NyaXB0aW9uJ107XG4gICAgICAgICAgICAgIHRoaXMuc2VuZE9UUFN1YmplY3QubmV4dChlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IChlcnIpID0+IHtcbiAgICAgICAgICAgIC8vIHNjcm9sbFRvKHsgdG9wOiAwIH0pO1xuICAgICAgICAgICAgdGhpcy5zZW5kT1RQU3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5zZW5kT1RQU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB9XG4gICAgdGhpcy5zZW5kT1RQU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICByZXR1cm4gdGhpcy5zZW5kT1RQU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHZhbGlkYXRlT1RQKHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCB1c2VySWQgPSB0aGlzLmNvb2tpZVN0b3JhZ2UuZ2V0KCd1c2VySWQnKTtcblxuICAgIGlmICh1c2VySWQpIHtcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgIHRva2VuLFxuICAgICAgICB1c2VySWQsXG4gICAgICB9O1xuICAgICAgbGV0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnM7XG4gICAgICB0aGlzLmh0dHBcbiAgICAgICAgLnBvc3Q8TG9naW5EYXRhPihgJHt0aGlzLmJhc2VBUEl9L290cC92YWxpZGF0ZS1vdHBgLCBwYXlsb2FkLCB7XG4gICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgfSlcbiAgICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgICAgbmV4dDogKHJlcykgPT4ge1xuICAgICAgICAgICAgLy8gc2Nyb2xsVG8oeyB0b3A6IDAgfSk7XG4gICAgICAgICAgICBpZiAocmVzWyd0b2tlbiddKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0VXNlckRldGFpbHMocmVzKTtcbiAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZU9UUFN1YmplY3QubmV4dChyZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gcmVzWydkZXNjcmlwdGlvbiddO1xuICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlT1RQU3ViamVjdC5uZXh0KGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xuICAgICAgICAgICAgLy8gc2Nyb2xsVG8oeyB0b3A6IDAgfSk7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlT1RQU3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZU9UUFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgdGhpcy52YWxpZGF0ZU9UUFN1YmplY3QubmV4dChmYWxzZSk7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGVPVFBTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZm9yZ290UGFzc3dvcmQoZW1haWxBZGRyZXNzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgZW1haWxBZGRyZXNzLFxuICAgIH07XG4gICAgICBsZXQgaGVhZGVycyA9IHRoaXMuaGVhZGVycztcbiAgICAgIHRoaXMuaHR0cFxuICAgICAgLnBvc3Q8SHR0cFJlc3BvbnNlPExvZ2luRGF0YT4+KFxuICAgICAgICBgJHt0aGlzLmJhc2VBUEl9L2F1dGgvZm9yZ290LXBhc3N3b3JkYCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAge2hlYWRlcnN9XG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dDogKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKHJlc1snZGF0YSddKSB7XG4gICAgICAgICAgICB0aGlzLnNldFVzZXJEZXRhaWxzKHJlcy5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZm9yZ290UGFzc3dvcmRTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IHJlc1snZGVzY3JpcHRpb24nXTtcbiAgICAgICAgICAgIHRoaXMuZm9yZ290UGFzc3dvcmRTdWJqZWN0Lm5leHQoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgICAgLy8gc2Nyb2xsVG8oeyB0b3A6IDAgfSk7XG4gICAgICAgICAgdGhpcy5mb3Jnb3RQYXNzd29yZFN1YmplY3QubmV4dChlcnIpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5mb3Jnb3RQYXNzd29yZFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICByZXNldFBhc3N3b3JkKHBheWxvYWQ6IHtcbiAgICBwYXNzd29yZDogc3RyaW5nO1xuICAgIGNvbmZpcm1QYXNzd29yZDogc3RyaW5nO1xuICAgIHVzZXJJZDogc3RyaW5nO1xuICB9KSB7XG4gICAgICBsZXQgaGVhZGVycyA9IHRoaXMuaGVhZGVycztcbiAgICAgIHRoaXMuaHR0cFxuICAgICAgLnBvc3Q8TG9naW5EYXRhPihgJHt0aGlzLmJhc2VBUEl9L2F1dGgvcmVzZXQtcGFzc3dvcmRgLCBwYXlsb2FkLCB7aGVhZGVyc30pXG4gICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dDogKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXNbJ2RhdGEnXSA9PT0gJ1Bhc3N3b3JkIHJlc2V0IHN1Y2Nlc3NmdWwuJykge1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyRGV0YWlscyhyZXMuZGF0YSk7XG4gICAgICAgICAgICB0aGlzLnJlc2V0UGFzc3dvcmRTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNjcm9sbFRvKHsgdG9wOiAwIH0pO1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gcmVzWydkZXNjcmlwdGlvbiddO1xuICAgICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkU3ViamVjdC5uZXh0KGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKGVycikgPT4ge1xuICAgICAgICAgIC8vIHNjcm9sbFRvKHsgdG9wOiAwIH0pO1xuICAgICAgICAgIHRoaXMucmVzZXRQYXNzd29yZFN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMucmVzZXRQYXNzd29yZFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cbn1cbiJdfQ==