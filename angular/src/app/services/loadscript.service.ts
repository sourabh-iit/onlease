import { Injectable } from "@angular/core";


@Injectable()
export class ScriptLoadingService {

  private scripts: any = {
    googleMap: { src: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`, loaded: false}
  };

  constructor() {
  }
  
  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (this.scripts[name].loaded) {
        resolve({script: name, loaded: true, status: 'Already Loaded'});
      } else {
        const script = <any> document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.async = true;
        if (script.readyState) {
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({script: name, loaded: true, status: 'Loaded'});
            }
          };
        } else {
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({script: name, loaded: true, status: 'Loaded'});
          };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

}