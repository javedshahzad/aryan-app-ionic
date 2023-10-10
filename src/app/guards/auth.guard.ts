import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('aryanUser')) {
        return true;
      }

      let skipWelcome =  localStorage.getItem('skipWelcome');
      console.log("skipWelcome", skipWelcome)
      if(skipWelcome !== "true") {
        this.router.navigate(['/welcome']);
      } else {
        this.router.navigate(['/login']);
      }

      return false;
  }
  
}
