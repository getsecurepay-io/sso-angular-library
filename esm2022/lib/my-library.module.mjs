import { NgModule } from '@angular/core';
import { MyLibraryComponent } from './my-library.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import * as i0 from "@angular/core";
export class MyLibraryModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktbGlicmFyeS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9teS1saWJyYXJ5L3NyYy9saWIvbXktbGlicmFyeS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7QUEwQnBFLE1BQU0sT0FBTyxlQUFlOytHQUFmLGVBQWU7Z0hBQWYsZUFBZSxpQkFwQnhCLGtCQUFrQixhQUtsQixrQkFBa0I7Z0hBZVQsZUFBZSxhQWJmO1lBQ1Q7Z0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNELElBQUk7WUFDSixnQ0FBZ0M7WUFDaEMsZ0NBQWdDO1lBQ2hDLGdCQUFnQjtZQUNoQixLQUFLO1NBQ047OzRGQUVVLGVBQWU7a0JBdEIzQixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWixrQkFBa0I7cUJBQ25CO29CQUNELE9BQU8sRUFBRSxFQUNSO29CQUNELE9BQU8sRUFBRTt3QkFDUCxrQkFBa0I7cUJBQ25CO29CQUNELFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixRQUFRLEVBQUUsZ0JBQWdCOzRCQUMxQixLQUFLLEVBQUUsSUFBSTt5QkFDWjt3QkFDRCxJQUFJO3dCQUNKLGdDQUFnQzt3QkFDaEMsZ0NBQWdDO3dCQUNoQyxnQkFBZ0I7d0JBQ2hCLEtBQUs7cUJBQ047aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTXlMaWJyYXJ5Q29tcG9uZW50IH0gZnJvbSAnLi9teS1saWJyYXJ5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIVFRQX0lOVEVSQ0VQVE9SUyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEVycm9ySW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9ycy9lcnJvci5pbnRlcmNlcHRvcic7XG5cblxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNeUxpYnJhcnlDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTXlMaWJyYXJ5Q29tcG9uZW50XG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxuICAgICAgdXNlQ2xhc3M6IEVycm9ySW50ZXJjZXB0b3IsXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0sXG4gICAgLy8ge1xuICAgIC8vICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXG4gICAgLy8gICB1c2VDbGFzczogVG9rZW5JbnRlcmNlcHRvcixcbiAgICAvLyAgIG11bHRpOiB0cnVlXG4gICAgLy8gfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTXlMaWJyYXJ5TW9kdWxlIHsgfVxuIl19