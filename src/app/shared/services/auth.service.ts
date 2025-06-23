import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  BASE_URL = environment.base_url;

  constructor(private http: HttpClient, private router: Router) {}

  Register(formBody: any): Observable<any> {
    return this.http.post(this.BASE_URL + "auth/signup", formBody);
  }

  login(formBody: any): Observable<any> {
    return this.http.post(this.BASE_URL + "auth/signin", formBody);
  }

  forgotPassword(formBody: any): Observable<any> {
    return this.http.post(this.BASE_URL + "auth/changePassword", formBody);
  }

  UpdateProfileImage(newBody: any) {
    const headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("access-token"),
    });
    return this.http.put(
      this.BASE_URL +
        "auth/updateProfileImage?id=" +
        localStorage.getItem("userid"),
      newBody,
      { headers: headers }
    );
  }

  getProfileInfo() {
    const headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("access-token"),
    });
    return this.http.get(
      this.BASE_URL +
        "auth/getProfile?userid=" +
        localStorage.getItem("userid"),
      { headers: headers }
    );
  }

  refreshToken(formBody: any): Observable<any> {
    return this.http.post(this.BASE_URL + "auth/refreshToken", formBody).pipe(
      catchError((error) => {
        if (error.status === 403) {
          this.router.navigate(["/login"]);
        }
        throw error;
      })
    );
  }
}
