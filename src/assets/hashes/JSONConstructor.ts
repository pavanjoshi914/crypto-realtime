
// you cant assign type JSON here
let metadata: {};

export function JsonConstructor( name: string, caption: string, about: string, height: number, width: number, thumbnail: string, url:string, contentUrl: string ){

     metadata = {
          "type": "ImageObject",
          "name": name,
          "creator": "Realtime Crypto",
          "caption": caption,
          "about": about,
          "height": height,
          "width": width,
          "thumbnail": thumbnail,
          "url": url,
          "contentUrl": contentUrl

        }
}


export function ExportMetadata(){
     return metadata;
}