import $ from 'jquery';

const Promise = window.Promise;

export default class Utils {
    static randomString(count = 16) {
        let str = '';

        for (let i = 0; i < count; i++) {
            str += Math.floor(Math.random() * 36).toString(36);
        }

        return str;
    }

    static parseUrl(url) {
        const aEl = document.createElement('A');

        aEl.href = url;

        const arr = aEl.search.replace(/^\?/, '').split('&');
        const searchObj={};

        let queries;

        for (let i = 0; i < arr.length; i++) {
            queries = arr[i].split('=');
            searchObj[queries[0]] = queries[1];
        }

        return {
            protocol: aEl.protocol,
            host: aEl.host,
            hostname: aEl.hostname,
            port: aEl.port,
            // 브라우저에 따라서 pathname 값 앞에 `/`가 붙지 않는 겨우가 있다.
            // 브라우저 상관없이 `/`가 붙어있도록 처리한다.
            pathname: ('/' + aEl.pathname).replace(/^\/\//, '\/'),
            search: aEl.search,
            searchObj: searchObj,
            hash: aEl.hash
        };
    }

    static snakeToCamel(str = '') {
        str = str.toLowerCase();

        return str.replace(/([-_].)/g, function (group) {
            return group.toUpperCase().replace(/-|_/g, '');
        });
    }

    static snakeObjToCamelObj(sObj) {
        const cObj = {};

        for (let key in sObj) {
            cObj[Utils.snakeToCamel(key)] = sObj[key];
        }

        return cObj;
    }

    static apiRequest(url, obj = {}, method = 'get') {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method: method,
                url: url,
                dataType: 'json',
                data: obj
            }).done(function (obj) {
                if (obj.code == 0) {
                    resolve(obj);

                } else {
                    reject(new Error(obj.message));
                }
            }).fail(reject);
        });
    };

    static dateToDateString (date) {
        date = date || new Date();

        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
    };

    static sizeFromImageUrl(url) {
        return new Promise(function (resolve, reject) {
            const image = new Image();

            image.onload = function () {
                resolve({
                    url: url,
                    width: image.width,
                    height: image.height
                });
            };

            image.onerror = function (error) {
                console.error(error);
                return reject(error);
            };

            image.src = url;
        });
    }

    static createDivElement() {
        const el = document.createElement('DIV');

        el.style.color = '#000000';
        el.style.background = 'initial';

        return el;
    }

    static r2d(r = 0) {
        return (180 / Math.PI) * r;
    }

    static d2r(d = 0) {
        return (Math.PI / 180) * d;
    }

    static urlToParentPath(url) {
        return url.substring(0, url.lastIndexOf('/'));
    }

    static urlToFileName(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    static urlToParentName(url) {
        const parentPath = Utils.urlToParentPath(url);

        return parentPath.substring(parentPath.lastIndexOf('/') + 1);
    }
}