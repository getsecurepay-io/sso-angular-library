import * as i0 from '@angular/core';
import { Injectable, Component, NgModule, inject } from '@angular/core';
import * as i1 from '@angular/common/http';
import { HttpHeaders, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Subject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

class CookieService {
    constructor() {
        this.COOKIE_NAME = 'accessToken';
    }
    set(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
    get(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    remove(name) {
        this.set(name, '', -10000000000);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CookieService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CookieService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CookieService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

// import { environment } from '../environments/environment';
class MyLibraryService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryService, deps: [{ token: i1.HttpClient }, { token: CookieService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: CookieService }]; } });

class MyLibraryComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: MyLibraryComponent, selector: "lib-my-library", ngImport: i0, template: `
    <p>
      my-library works!
    </p>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-my-library', template: `
    <p>
      my-library works!
    </p>
  ` }]
        }] });

class ErrorInterceptor {
    constructor() {
        this.errorMessage = '';
    }
    intercept(request, next) {
        // TODO: show loading spinner as request starts here
        return next.handle(request).pipe(tap((evt) => {
            if (evt instanceof HttpResponse) {
                // TODO: if request is successful, hide spinners
                if (evt.body.error == true) {
                    // TODO: if error is a frontend error, like network, notify user
                    // this.errorMessage = evt.body.message;
                    // this.notification.danger(this.errorMessage);
                }
            }
        }), catchError((error) => {
            // TODO: if request fails, hide spinners
            if (error.error instanceof ErrorEvent) {
                //client-side error
                this.errorMessage = `Error: ${error.error.message}`;
            }
            else {
                // server-side error
                switch (error.status) {
                    case 503: {
                        this.errorMessage = 'Internal Server Error';
                        // this.notification.danger(this.errorMessage);
                        break;
                    }
                    case 500: {
                        this.errorMessage = 'Internal Server Error';
                        // this.notification.error(this.errorMessage, 'please try again later');
                        break;
                    }
                    case 400: {
                        const errorMessage = error.error.description;
                        throwError(() => new Error(errorMessage));
                        // this.notification.danger(errorMessage);
                        break;
                    }
                    case 404: {
                        // this.errorMessage = 'An Error Occurred, try again';
                        const errorMessage = error.error.description;
                        throwError(() => new Error(errorMessage));
                        // this.notification.danger(this.errorMessage);
                        break;
                    }
                    case 406: {
                        // this.errorMessage = 'An Error Occurred, try again';
                        const errorMessage = error.error['description'].split('.')[1] || error.error.description;
                        // throwError(() => new Error(errorMessage))
                        // this.notification.error(errorMessage, '');
                        break;
                    }
                    case 403: {
                        // this.notification.danger(
                        //   'Access Denied'
                        // );
                        // TODO: log user out and navigate to login page
                        // this.router.navigate(['/auth']);
                        break;
                    }
                    case 401: {
                        // this.notification.danger('Session Timed Out');
                        // TODO: log user out and navigate to login page
                        this.errorMessage = error.error.description || 'User not authorized';
                        // this.notification.error(this.errorMessage, '');
                        // this.router.navigate(['/auth']);
                        break;
                    }
                    case 405: {
                        this.errorMessage = 'Internal Server Error';
                        // this.notification.danger(this.errorMessage);
                        break;
                    }
                    case 0: {
                        this.errorMessage =
                            'Connection Error. Check Your Internet Connection';
                        // this.notification.danger(this.errorMessage);
                        break;
                    }
                }
            }
            return throwError(error.error);
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ErrorInterceptor, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ErrorInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ErrorInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class MyLibraryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryModule, declarations: [MyLibraryComponent], exports: [MyLibraryComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryModule, providers: [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: ErrorInterceptor,
                multi: true
            },
            // {
            //   provide: HTTP_INTERCEPTORS,
            //   useClass: TokenInterceptor,
            //   multi: true
            // },
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: MyLibraryModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MyLibraryComponent
                    ],
                    imports: [],
                    exports: [
                        MyLibraryComponent
                    ],
                    providers: [
                        {
                            provide: HTTP_INTERCEPTORS,
                            useClass: ErrorInterceptor,
                            multi: true
                        },
                        // {
                        //   provide: HTTP_INTERCEPTORS,
                        //   useClass: TokenInterceptor,
                        //   multi: true
                        // },
                    ],
                }]
        }] });

const dashboardGuard = (_route, _state) => {
    const cookieService = inject(CookieService);
    const router = inject(Router);
    const query = router.getCurrentNavigation()?.extractedUrl['queryParams']['userData'];
    const setUserDetails = (data) => {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'object') {
                    cookieService.set(key, JSON.stringify(data[key]));
                }
                else {
                    cookieService.set(key, data[key]);
                }
            }
        }
    };
    if (!cookieService.get('token')) {
        if (query) {
            const stringifiedData = atob(query);
            const userData = JSON.parse(stringifiedData);
            const token = userData['token'];
            if (token) {
                const decodedToken = jwt_decode.jwtDecode(token);
                if (Date.now() < decodedToken?.exp * 1000) {
                    setUserDetails(userData);
                    return true;
                }
                else {
                    router.navigate(['']);
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            router.navigate(['']);
            return false;
        }
    }
    else {
        const token = cookieService.get('token') || '';
        const decodedToken = jwt_decode.jwtDecode(token);
        if (Date.now() < decodedToken.exp * 1000) {
            return true;
        }
        else {
            router.navigate(['']);
            return false;
        }
    }
};

/*
 * Public API Surface of my-library
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MyLibraryComponent, MyLibraryModule, MyLibraryService, dashboardGuard };
//# sourceMappingURL=sso-library.mjs.map
