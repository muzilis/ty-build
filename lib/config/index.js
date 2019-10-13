import axios from "axios";
import env from "./env.json"
import gateway from "./gateway"
import setResponseInterceptors from "./interceptor"
import "./router"

let geoserver, hls, videoHttp, authHttp, dictionHttp, gatewayHttp;
/**
 * 获取直播地址
 * @param {String} url 
 */
function getHls(url) {
    return function (id) {
        return url + id + "/index.m3u8"
    }
}

/**
 * 初始化视频请求http服务
 * @param {String} url 
 */
function initVideoHttp(url) {
    url = url || "";
    videoHttp = axios.create({
        baseURL: url + gateway.video
    });
}

/**
 * 初始化app请求http服务
 * @param {String} url 
 */
function setAxiosBaseUrl(url) {
    url = url || "";
    axios.defaults.baseURL = url + gateway.base;
    authHttp = axios.create({
        baseURL: url + gateway.auth
    });
    dictionHttp = axios.create({
        baseURL: url + gateway.diction
    });
    gatewayHttp = axios.create({
        baseURL: url
    });
}

/**
 * 设置header
 * 作用范围：所有axios实例
 * @param {*} header 
 */
function setHeader(header){
    for(let key in header){
        _https.forEach(function(item){
            item.defaults.headers.common[key] = header[key];
        })
    }
}

switch (process.env.NODE_ENV) {
    case "production":
        setAxiosBaseUrl(env.prod.app);
        initVideoHttp(env.prod.video);
        geoserver = env.prod.geoserver;
        hls = getHls(env.prod.hls);
        console.log("production");
        break;
    case "development":
        setAxiosBaseUrl(env.dev.app);
        initVideoHttp(env.dev.video);
        geoserver = env.dev.geoserver;
        hls = getHls(env.dev.hls);
        console.log("development");
        break;
    case "proxy-dev":
        setAxiosBaseUrl();
        initVideoHttp();
        geoserver = env.dev.geoserver;
        hls = getHls(env.dev.hls);
        console.log("proxy-dev");
        break;
    case "proxy-mock":
        setAxiosBaseUrl();
        initVideoHttp();
        geoserver = env.dev.geoserver;
        hls = getHls(env.dev.hls);
        console.log("proxy-mock");
        break;
    default:
        setAxiosBaseUrl();
        initVideoHttp();
        geoserver = env.dev.geoserver;
        hls = function (id) {
            return env.mock.hls + id
        }
        console.log("mock");
        break;
}
let _https = [axios, videoHttp, authHttp, dictionHttp, gatewayHttp];

//为每个实例设置拦截器
_https.forEach(function(item){
    setResponseInterceptors(item);
})

console.log("ty app baseURL:", axios.defaults.baseURL);
console.log("ty geoserver:", geoserver);
console.log("ty video baseURL:", videoHttp.prototype.constructor.defaults.baseURL);
console.log("ty hls:", hls(11));

export { geoserver, hls, videoHttp, authHttp, dictionHttp, gatewayHttp, setHeader }