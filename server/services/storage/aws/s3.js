'use strict';

import URL from 'url';
import http from 'http';
import https from 'https';
import request from 'request';
import AWS from 'aws-sdk';


export default () => {

  const getClient = (url) => {
    const urlObj = URL.parse(url);
    if(urlObj.protocol ==='https:'){
      return https;
    }
    else {
      return http;
    }
  };


  const UrlToS3 = (url) => {
    return new Promise((resolve, reject) => {
      getClient(url)
        .get(url, (response)=> {

          const contentType = response.headers['content-type'];

          const filename = url.substring(url.lastIndexOf('/') + 1);
          const s3obj = new AWS.S3({params: {Bucket: 'astone-res', Key: filename, ContentType: contentType}});
          s3obj.upload({Body: response}, (err, data) => {
            if (200 == response.statusCode) {
              if (err)
                reject(err);
              else
                resolve(data);
            }
            else
              reject(response.statusCode);
          });
        });
    });
  };

  return {
    urlToS3: UrlToS3
  };
};
