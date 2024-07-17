import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../cookie.service";
export class TokenInterceptor {
    constructor(cookieService) {
        this.cookieService = cookieService;
    }
    intercept(request, next) {
        if (request.url.includes('https://sso-staging-idserver.secureid-digital.com.ng/api')) {
            if (request.url.includes('auth/get-token')) {
                console.log("here in token");
                const accessToken = this.cookieService.get('appParams');
                if (accessToken) {
                    request = request.clone({
                        setHeaders: {
                            Basic: `${accessToken}`,
                            // Accept: 'application/json',
                        },
                    });
                }
            }
            else if (this.cookieService.get(this.cookieService.COOKIE_NAME) !== null) {
                const accessToken = this.cookieService.get(this.cookieService.COOKIE_NAME);
                const tokenType = this.cookieService.get('tokenType');
                request.headers.delete('Authorization');
                request = request.clone({
                    setHeaders: {
                        Authorization: `${tokenType} ${accessToken}`,
                        // Accept: 'application/json',
                    },
                });
            }
            else {
                request = request.clone({
                    setHeaders: {
                        Authorization: '',
                        Basic: ``, // Clear the Authorization header if token is not available
                    },
                });
            }
        }
        console.log("its not working 😁");
        return next.handle(request);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TokenInterceptor, deps: [{ token: i1.CookieService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TokenInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: TokenInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CookieService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9teS1saWJyYXJ5L3NyYy9saWIvaW50ZXJjZXB0b3JzL3Rva2VuLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVczQyxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQztJQUVwRCxTQUFTLENBQ1AsT0FBeUIsRUFDekIsSUFBaUI7UUFFakIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQywwREFBMEQsQ0FBQyxFQUFFO1lBQ3BGLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtnQkFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRXhELElBQUksV0FBVyxFQUFFO29CQUNmLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO3dCQUN0QixVQUFVLEVBQUU7NEJBQ1YsS0FBSyxFQUFFLEdBQUcsV0FBVyxFQUFFOzRCQUN2Qiw4QkFBOEI7eUJBQy9CO3FCQUNGLENBQUMsQ0FBQztpQkFDSjthQUNGO2lCQUFNLElBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQy9EO2dCQUNBLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FDL0IsQ0FBQztnQkFDRixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDdEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3hDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUN0QixVQUFVLEVBQUU7d0JBQ1YsYUFBYSxFQUFFLEdBQUcsU0FBUyxJQUFJLFdBQVcsRUFBRTt3QkFDNUMsOEJBQThCO3FCQUMvQjtpQkFDRixDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDdEIsVUFBVSxFQUFFO3dCQUNWLGFBQWEsRUFBRSxFQUFFO3dCQUNqQixLQUFLLEVBQUUsRUFBRSxFQUFFLDJEQUEyRDtxQkFDdkU7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUdsQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQzsrR0FoRFUsZ0JBQWdCO21IQUFoQixnQkFBZ0I7OzRGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBIdHRwUmVxdWVzdCxcbiAgSHR0cEhhbmRsZXIsXG4gIEh0dHBFdmVudCxcbiAgSHR0cEludGVyY2VwdG9yLFxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnLi4vY29va2llLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVG9rZW5JbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29va2llU2VydmljZTogQ29va2llU2VydmljZSkge31cblxuICBpbnRlcmNlcHQoXG4gICAgcmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PixcbiAgICBuZXh0OiBIdHRwSGFuZGxlclxuICApOiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+PiB7XG4gICAgaWYgKHJlcXVlc3QudXJsLmluY2x1ZGVzKCdodHRwczovL3Nzby1zdGFnaW5nLWlkc2VydmVyLnNlY3VyZWlkLWRpZ2l0YWwuY29tLm5nL2FwaScpKSB7XG4gICAgICBpZiAocmVxdWVzdC51cmwuaW5jbHVkZXMoJ2F1dGgvZ2V0LXRva2VuJykpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJoZXJlIGluIHRva2VuXCIpO1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHRoaXMuY29va2llU2VydmljZS5nZXQoJ2FwcFBhcmFtcycpO1xuXG4gICAgICAgIGlmIChhY2Nlc3NUb2tlbikge1xuICAgICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgQmFzaWM6IGAke2FjY2Vzc1Rva2VufWAsXG4gICAgICAgICAgICAgIC8vIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdGhpcy5jb29raWVTZXJ2aWNlLmdldCh0aGlzLmNvb2tpZVNlcnZpY2UuQ09PS0lFX05BTUUpICE9PSBudWxsXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KFxuICAgICAgICAgIHRoaXMuY29va2llU2VydmljZS5DT09LSUVfTkFNRVxuICAgICAgICApO1xuICAgICAgICBjb25zdCB0b2tlblR5cGUgPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KCd0b2tlblR5cGUnKTtcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmRlbGV0ZSgnQXV0aG9yaXphdGlvbicpO1xuICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYCR7dG9rZW5UeXBlfSAke2FjY2Vzc1Rva2VufWAsXG4gICAgICAgICAgICAvLyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiAnJyxcbiAgICAgICAgICAgIEJhc2ljOiBgYCwgLy8gQ2xlYXIgdGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIGlmIHRva2VuIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcIml0cyBub3Qgd29ya2luZyDwn5iBXCIpO1xuXG5cbiAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XG4gIH1cbn1cbiJdfQ==