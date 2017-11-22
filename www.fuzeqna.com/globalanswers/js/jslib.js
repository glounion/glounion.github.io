if (!com) var com = {};
if (!com.fuze) com.fuze = {};
if (!com.fuze.jslib) com.fuze.jslib = {};

com.fuze.jslib = {
    onlinehelpbaseurl: 'https://www.fuzeqna.com/onlinehelp',
    jQueryScriptOutputted: false,
    initJQuery: function (version, uiversion, callback) {
        if (typeof jQuery == 'undefined') {
            if (!com.fuze.jslib.jQueryScriptOutputted) {
                com.fuze.jslib.jQueryScriptOutputted = true;
                if (version == undefined) version = '1.3.2';
                if (uiversion == undefined) uiversion = '1.7.2';
                //com.fuze.jslib.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js');
                //com.fuze.jslib.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/jquery-ui.min.js');
                if (uiversion != 'noui') {
                    com.fuze.jslib.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/' + version + '/jquery.min.js');
                    com.fuze.jslib.loadJQueryUI(uiversion, callback);
                } else {
                    com.fuze.jslib.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/' + version + '/jquery.min.js', callback);
                }
            } else {
                if (callback) {
                    callback();
                }
            }
        } else {
            if (typeof jQuery.ui == 'undefined') {
                if (uiversion != 'noui') {
                    com.fuze.jslib.loadJQueryUI(uiversion, callback);
                } else {
                    callback();
                }
            } else {
                if (callback) {
                    callback();
                }
            }
        }
    },
    loadJQueryUI: function (uiversion, callback) {
        if (typeof jQuery != 'undefined') {
            if (uiversion == undefined) uiversion = '1.7.2';
            com.fuze.jslib.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jqueryui/' + uiversion + '/jquery-ui.min.js', callback);
        } else {
            setTimeout(function () { com.fuze.jslib.loadJQueryUI(uiversion, callback); }, 500);
        }
    },
    getPathToSelf: function () {
        var myName = /(^|[\/\\])jslib\.js(\?|$)/;
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            var src;
            if (src = scripts[i].getAttribute("src")) {
                if (src.match(myName)) {
                    return src;
                }
            }
        }
        return null;
    },
    loadJQPlugin: function (url, callback) {
        if (typeof jQuery != 'undefined') {
            com.fuze.jslib.loadJSFile(url, callback);
        } else {
            setTimeout(function () { com.fuze.jslib.loadJQPlugin(url, callback); }, 500);
        }
    },
    loadJSFile: function (url, callback) {
        var e = document.createElement("script");
        e.src = url;
        e.type = "text/javascript";
        if (callback) {
            var loadFunction = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    callback();
                }
            };
            if (e.addEventListener) {
                e.addEventListener("load", callback, false);
            } else if (e.readyState) {
                e.onreadystatechange = loadFunction;
            }
        }
        document.getElementsByTagName("head")[0].appendChild(e);

    },
    loadCSSFile: function (url) {
        var e = document.createElement("link");
        e.setAttribute("rel", "stylesheet");
        e.setAttribute("type", "text/css");
        e.setAttribute("href", url);

        document.getElementsByTagName("head")[0].appendChild(e);
    },
    parseUri: function (str) {
        var o = com.fuze.jslib.parseUriOptions,
		    m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		    uri = {},
		    i = 14;

        while (i--) uri[o.key[i]] = m[i] || "";

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if ($1) uri[o.q.name][$1] = $2;
        });

        return uri;
    },
    parseUriOptions: {
        strictMode: false,
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    },
    readCookie: function (name) {
        var nameEq = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEq) == 0) {
                return c.substring(nameEq.length, c.length);
            }
        }
        return null;
    },
    setCookie: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/.test(sKey)) {
            return;
        }
        var sExpires = "";
        if (vEnd) {
            if (typeof vEnd == "number") {
                sExpires = "; max-age=" + vEnd;
            }
            if (typeof vEnd == "string") {
                sExpires = "; expires=" + vEnd;
            }
            if (typeof vEnd == "object") {
                if (vEnd.toUTCString) {
                    sExpires = "; expires=" + vEnd.toUTCString();
                }
            }
        }
        var cookieVal = encodeURI(sKey) + "=" + encodeURI(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        document.cookie = cookieVal;
    },
    getHomeDir: function () {
        var scriptPath, homeDir;
        if (document.getElementById('jslib')) {
            scriptPath = document.getElementById('jslib').src;
        } else {
            //scriptPath = new String(document.location.pathname);
            //homeDir = scriptPath.substring(0, scriptPath.indexOf("/", 1));
            scriptPath = com.fuze.jslib.getPathToSelf();

        }
        homeDir = scriptPath.substring(0, scriptPath.lastIndexOf("../js/index.html"));
        //scriptPath = new String(document.location.pathname);
        //homeDir = scriptPath.substring(0, scriptPath.indexOf("/", 1));

        return homeDir;
    },
    getPath: function () {
        var uri = com.fuze.jslib.parseUri(com.fuze.jslib.getHomeDir());
        return uri["directory"];
    },
    getUser: function (callback) {
        var url;
        var data;
        var auth = com.fuze.jslib.auth();
        url = com.fuze.jslib.getHomeDir() + '/services/v1/user.svc/JSON/Get';
        data = 'auth=' + auth;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                callback(data.d);
            }
        });
    },
    getOnlinehelpSSOUrl: function (finalurl,callback) {
        var url;
        var data;
        var auth = com.fuze.jslib.auth();
        if (!auth) callback(null);

        url = com.fuze.jslib.getHomeDir() + '/services/v1/user.svc/JSON/GetOnlineHelpSSOUrl';
        data = 'auth=' + auth;
        data += '&url=' + encodeURI(finalurl);
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                callback(data.d);
            }
        });
    },
    getUserByUsername: function (username, callback) {
        var url;
        var data;
        var auth = com.fuze.jslib.auth();
        url = com.fuze.jslib.getHomeDir() + '/services/v1/user.svc/JSON/GetUserByUsername';
        data = 'auth=' + auth + "&username=" + username;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                callback(data.d);
            }
        });
    },
    getUnAnsweredQuestions: function (callback) {
        var url;
        var data;
        if (!com.fuze.jslib.auth()) {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/social.svc/JSON/GetUnansweredQuestionsCountAnon';
            data = '';
        } else {
            url = com.fuze.jslib.getHomeDir() + '/services/v1//social.svc/JSON/GetUnansweredQuestionsCount';
            data = 'auth=' + com.fuze.jslib.auth();
        }
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                if (callback) {
                    callback(data.d);
                }
            }
        });
    },
    getSocialItemCount: function (socialtype, callback) {
        var url;
        var data;
        if (!com.fuze.jslib.auth()) {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/social.svc/JSON/GetSocialItemCountAnon';
            data = 'social_type=' + socialtype;
        } else {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/social.svc/JSON/GetSocialItemCount';
            data = 'auth=' + com.fuze.jslib.auth() + '&social_type=' + socialtype;
        }

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                if (callback) {
                    callback(data.d);
                }
            }
        });
    },
    getShoutOutCount: function (callback) {
        var url = com.fuze.jslib.getHomeDir() + '/services/v1/social.svc/JSON/GetShoutOutCount';
        var data;
        if (!com.fuze.jslib.auth()) {
            return null;
        } else {
            data = 'auth=' + com.fuze.jslib.auth();
            $.ajax({
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: data,
                type: 'GET',
                url: url,
                success: function (data) {
                    if (callback) {
                        callback(data.d);
                    }
                }
            });
            return null;
        }
    },
    getTopKBs: function (callback) {
        var url;
        var data = 'order=rel&priority=true&searchSubCats=false&statuses=1,2,8,9&showExcludedItems=false&startIndex=1&pageLength=10';

        if (!com.fuze.jslib.auth()) {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/kb.svc/JSON/SearchAnon';
        } else {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/kb.svc/JSON/Search';
            data = 'auth=' + com.fuze.jslib.auth() + '&' + data;
        }
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                if (callback) {
                    callback(data.d);
                }
            }
        });
    },
    searchKB: function (order, priority, searchSubCats, showExcludedItems, startIndex, pageLength, catid, statuses, callback) {
        var url;
        //args = 'order=rel&priority=true&searchSubCats=false&statuses=1,2,8,9&showExcludedItems=false&startIndex=1&pageLength=10';
        var data = 'order=' + order + '&priority=' + priority + '&searchSubCats=' + searchSubCats +
            '&statuses=' + statuses + '&showExcludedItems=' + showExcludedItems + '&startIndex=' + startIndex +
            '&pageLength=' + pageLength + "&catid=" + catid;

        if (!com.fuze.jslib.auth()) {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/kb.svc/JSON/SearchAnon';
        } else {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/kb.svc/JSON/Search';
            data = 'auth=' + com.fuze.jslib.auth() + '&' + data;
        }
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                if (callback) {
                    callback(data.d);
                }
            }
        });
    },
    searchCommunity: function (contentTypes, itemstates, sort, priority, searchtext, logicop, startDate, startIndex, pageLength, catids, includeChildren, callback) {
        var url;
        var statuses = "1,2,8,9";
        if (startDate) {
            startDate = new Date(startDate);
            startDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
        }
        //args = 'order=rel&priority=true&searchSubCats=false&statuses=1,2,8,9&showExcludedItems=false&startIndex=1&pageLength=10';
        var data = 'contentTypes=' + contentTypes + '&searchtext=' + searchtext + '&logicop=' + logicop + '&sort=' + sort + '&priority=' + priority +
            '&statuses=' + statuses + '&states=' + itemstates + '&startIndex=' + startIndex +
            '&pageLength=' + pageLength + "&catids=" + catids + "&includeChildren=" + includeChildren + "&startDate=" + startDate;
        url = com.fuze.jslib.getHomeDir() + '/services/v1/social.svc/JSON/Search';

        if (com.fuze.jslib.auth()) {
            data = 'auth=' + com.fuze.jslib.auth() + '&' + data;
        }
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                if (callback) {
                    callback(data.d);
                }
            }
        });
    },
    getKB: function (kbid, callback, errorcallback) {
        var url;
        var data;
        if (!com.fuze.jslib.auth()) {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/kb.svc/JSON/GetAnon';
            data = 'kbid=' + kbid;
        } else {
            url = com.fuze.jslib.getHomeDir() + '/services/v1/kb.svc/JSON/Get';
            data = "auth=" + com.fuze.jslib.auth() + "&kbid=" + kbid;
        }
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                if (callback) {
                    callback(data.d);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                if (errorcallback) {
                    errorcallback(jqXhr, textStatus, errorThrown);
                }
            }
        });
    },
    replaceKBIDPlaceholders: function (text, callback, errorcallback) {
        var url;
        var data;
        url = com.fuze.jslib.getHomeDir() + '/services/v1/kb.svc/JSON/ReplaceKBIDPlaceholders';
        if (com.fuze.jslib.auth()) {
            data = 'auth=' + com.fuze.jslib.auth();
        }
        data = "html=" + text;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: data,
            type: 'GET',
            url: url,
            success: function (data) {
                if (callback) {
                    callback(data.d);
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                if (errorcallback) {
                    errorcallback(jqXhr, textStatus, errorThrown);
                }
            }
        });
    },
    getConfigOption: function (callback, optionName) {
        if (com.fuze.jslib.ConfigOptions == undefined || com.fuze.jslib.ConfigOptions == null) {
            var url, data;
            data = '';
            if (!com.fuze.jslib.auth()) {
                url = com.fuze.jslib.getHomeDir() + '/services/v1/config.svc/JSON/GetOptionsAnon';
            } else {
                url = com.fuze.jslib.getHomeDir() + '/services/v1/config.svc/JSON/GetOptions';
                data = 'auth=' + com.fuze.jslib.auth() + '&' + data;
            }
            $.ajax({
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: data,
                type: 'GET',
                url: url,
                success: function (data) {
                    com.fuze.jslib.ConfigOptions = new Object();
                    com.fuze.jslib.ConfigOptions = data.d;
                    if (callback) {
                        callback(com.fuze.jslib.getConfigOptionInner(optionName));
                    }
                }
            });
        } else {
            callback(com.fuze.jslib.getConfigOptionInner(optionName));
        }
    },
    getConfigOptionInner: function (optionName) {

        for (var i = 0; i < com.fuze.jslib.ConfigOptions.length; i++) {
            if (com.fuze.jslib.ConfigOptions[i].Key.toString().toLowerCase() == optionName.toString().toLowerCase()) {
                return com.fuze.jslib.ConfigOptions[i].Value.toString();
            }
        }

        return null;
    },
    auth: function () {
        return com.fuze.jslib.readCookie("GUID");
    },
    usertype: function () {
        return com.fuze.jslib.readCookie("UserType");
    },
    getHost: function (url) {
        var a = document.createElement('a');
        a.href = url;
        return a.hostname;
    },
    sanitizeStrict: function (input) {
        var output = input;
        if (output) {
            output = output.replace('&', '&amp;');
            output = output.replace(/[^a-zA-Z0-9.\-\&\/%:\?\=_ ]/g, "");
        }
        return output;
    },
    getParameterFromUrl: function(name, url) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));

    },
    getParameterByName: function (name) {
        return com.fuze.jslib.getParameterFromUrl(name, window.location.href);
    },
    getParameterByNameWithSanitize: function (name) {
        return com.fuze.jslib.sanitizeStrict(com.fuze.jslib.getParameterByName(name));
    },
    ellipsisText: function (text, limit) {
        if (!text) return text;
        if (!limit) return text;
        limit = parseInt(limit);
        if (limit == NaN) return text;
        if (text.length > (limit + 3)) {
            text = text.substring(0, limit);
            text += "...";
        }
        return text;
    },
    stripHtml: function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    },
    endsWith: function (str, suffix) {
        var s = str.toString();
        return s.indexOf(suffix, s.length - suffix.length) !== -1;
    },
    showConfirmDialog: function (text, okBtnText, cancelBtnText, okCallback, cancelCallback, title, width) {
        $("<div><p>" + text + "</p></div>").dialog({
            resizable: false,
            autoResize: true,
            title: title,
            width: width + 'px',
            dialogClass: "fuzeJQueryConfirm",
            modal: true,
            buttons: [
                {
                    text: cancelBtnText,
                    click: function () {
                        cancelCallback();
                        $(this).dialog("close");
                    }
                },
                {
                    text: okBtnText,
                    click: function () {
                        okCallback();
                        $(this).dialog("close");
                    }
                }

            ]
        });
    },
    setAuthTokenToLocalStorage: function () {
        try {
            if (com.fuze.jslib.isLocalStorageNameSupported()) {
                var key = 'fuzeauth';
                var auth = com.fuze.jslib.getParameterByNameWithSanitize('sgid');
                var storage = window.sessionStorage;
                if (storage && auth) {
                    storage.setItem(key, auth);
                }
            }
        } catch (error) {
            return null;
        }
    },
    getAuthTokenFromLocalStorage: function () {
        try {
            if (com.fuze.jslib.isLocalStorageNameSupported()) {
                var key = 'fuzeauth';
                var storage = window.sessionStorage;
                if (storage) {
                    return storage.getItem(key);
                }
            }
        } catch (error) {
            return null;
        }
    },
    checkForAuthRedir: function() {
        var cookieAuth = com.fuze.jslib.readCookie('GUID');
        if (!cookieAuth) {
            var auth = com.fuze.jslib.getAuthTokenFromLocalStorage();
            if (auth && !com.fuze.jslib.getParameterByNameWithSanitize('sgid')) {
                var newUrl = document.location;
                if (newUrl.toString().indexOf("?") > 0 && !newUrl.toString().endsWith("?")) {
                    newUrl += "&";
                } else {
                    newUrl += "?";
                }
                newUrl += "sgid=" + auth;
                document.location = newUrl;
            }
        }
    },
    isLocalStorageNameSupported: function () {
        var testKey = 'test', storage = window.sessionStorage;
        try  {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    },
    checkForFormSubmit: function (e, btnId) {

        var evt = e ? e : window.event;

        var bt = document.getElementById(btnId);
        if (bt) {
            if (evt.keyCode == 13) {
                bt.click();
                e.stopPropagation();
                e.returnValue = false;
                e.cancelBubble = true;
                return false;
            }
        }
    },
    CommunityKnowledgeBase: 1,
    CommunityAnswers: 2,
    CommunityIdeas: 3,
    CommunityConversations: 4,
    Contests: 5,
    ConfigOptions: null

}