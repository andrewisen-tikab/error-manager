export const getUser = () => {
    const info = {
        timeOpened: new Date(),
        timezone: new Date().getTimezoneOffset() / 60,
        pageOn: window.location.pathname,
        referrer: document.referrer,
        previousSites: history.length,
        browserName: navigator.appName,
        browserEngine: navigator.product,
        browserVersion1a: navigator.appVersion,
        browserVersion1b: navigator.userAgent,
        browserLanguage: navigator.language,
        browserOnline: navigator.onLine,
        browserPlatform: navigator.platform,
        javaEnabled: navigator.javaEnabled(),
        dataCookiesEnabled: navigator.cookieEnabled,
        dataCookies1: document.cookie,
        // @ts-ignore
        dataCookies2: decodeURIComponent(document.cookie.split(';')),
        dataStorage: localStorage,
        sizeScreenW: screen.width,
        sizeScreenH: screen.height,
        // @ts-ignore
        sizeDocW: document.width,
        //@ts-ignore
        sizeDocH: document.height,
        sizeInW: innerWidth,
        sizeInH: innerHeight,
        sizeAvailW: screen.availWidth,
        sizeAvailH: screen.availHeight,
        scrColorDepth: screen.colorDepth,
        scrPixelDepth: screen.pixelDepth,
        zoomLevel: window.visualViewport?.scale,
    } as const;
    return info;
};
