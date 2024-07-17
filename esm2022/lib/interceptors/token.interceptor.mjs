import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../cookie.service";
export class TokenInterceptor {
    constructor(cookieService) {
        this.cookieService = cookieService;
    }
    intercept(request, next) {
        if (request.url.includes('https://secureauth.secureid-digital.com.ng/api')) {
            console.log("here in staging");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9teS1saWJyYXJ5L3NyYy9saWIvaW50ZXJjZXB0b3JzL3Rva2VuLmludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVczQyxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQztJQUVwRCxTQUFTLENBQ1AsT0FBeUIsRUFDekIsSUFBaUI7UUFFakIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnREFBZ0QsQ0FBQyxFQUFFO1lBQzFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUUvQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7Z0JBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUV4RCxJQUFJLFdBQVcsRUFBRTtvQkFDZixPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzt3QkFDdEIsVUFBVSxFQUFFOzRCQUNWLEtBQUssRUFBRSxHQUFHLFdBQVcsRUFBRTs0QkFDdkIsOEJBQThCO3lCQUMvQjtxQkFDRixDQUFDLENBQUM7aUJBQ0o7YUFDRjtpQkFBTSxJQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUMvRDtnQkFDQSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQy9CLENBQUM7Z0JBQ0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3RELE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDdEIsVUFBVSxFQUFFO3dCQUNWLGFBQWEsRUFBRSxHQUFHLFNBQVMsSUFBSSxXQUFXLEVBQUU7d0JBQzVDLDhCQUE4QjtxQkFDL0I7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQ3RCLFVBQVUsRUFBRTt3QkFDVixhQUFhLEVBQUUsRUFBRTt3QkFDakIsS0FBSyxFQUFFLEVBQUUsRUFBRSwyREFBMkQ7cUJBQ3ZFO2lCQUNGLENBQUMsQ0FBQzthQUNKO1NBQ0Y7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFHbEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7K0dBbERVLGdCQUFnQjttSEFBaEIsZ0JBQWdCOzs0RkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgSHR0cFJlcXVlc3QsXG4gIEh0dHBIYW5kbGVyLFxuICBIdHRwRXZlbnQsXG4gIEh0dHBJbnRlcmNlcHRvcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJy4uL2Nvb2tpZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRva2VuSW50ZXJjZXB0b3IgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvb2tpZVNlcnZpY2U6IENvb2tpZVNlcnZpY2UpIHt9XG5cbiAgaW50ZXJjZXB0KFxuICAgIHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sXG4gICAgbmV4dDogSHR0cEhhbmRsZXJcbiAgKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgIGlmIChyZXF1ZXN0LnVybC5pbmNsdWRlcygnaHR0cHM6Ly9zZWN1cmVhdXRoLnNlY3VyZWlkLWRpZ2l0YWwuY29tLm5nL2FwaScpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImhlcmUgaW4gc3RhZ2luZ1wiKTtcblxuICAgICAgaWYgKHJlcXVlc3QudXJsLmluY2x1ZGVzKCdhdXRoL2dldC10b2tlbicpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZSBpbiB0b2tlblwiKTtcbiAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSB0aGlzLmNvb2tpZVNlcnZpY2UuZ2V0KCdhcHBQYXJhbXMnKTtcblxuICAgICAgICBpZiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICAgIEJhc2ljOiBgJHthY2Nlc3NUb2tlbn1gLFxuICAgICAgICAgICAgICAvLyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMuY29va2llU2VydmljZS5nZXQodGhpcy5jb29raWVTZXJ2aWNlLkNPT0tJRV9OQU1FKSAhPT0gbnVsbFxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gdGhpcy5jb29raWVTZXJ2aWNlLmdldChcbiAgICAgICAgICB0aGlzLmNvb2tpZVNlcnZpY2UuQ09PS0lFX05BTUVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgdG9rZW5UeXBlID0gdGhpcy5jb29raWVTZXJ2aWNlLmdldCgndG9rZW5UeXBlJyk7XG4gICAgICAgIHJlcXVlc3QuaGVhZGVycy5kZWxldGUoJ0F1dGhvcml6YXRpb24nKTtcbiAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3QuY2xvbmUoe1xuICAgICAgICAgIHNldEhlYWRlcnM6IHtcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGAke3Rva2VuVHlwZX0gJHthY2Nlc3NUb2tlbn1gLFxuICAgICAgICAgICAgLy8gQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XG4gICAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJycsXG4gICAgICAgICAgICBCYXNpYzogYGAsIC8vIENsZWFyIHRoZSBBdXRob3JpemF0aW9uIGhlYWRlciBpZiB0b2tlbiBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJpdHMgbm90IHdvcmtpbmcg8J+YgVwiKTtcblxuXG4gICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpO1xuICB9XG59XG4iXX0=