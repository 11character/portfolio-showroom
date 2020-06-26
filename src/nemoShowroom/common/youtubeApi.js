const Promise = window.Promise;

export default class YouTubeApi {
    constructor () {
        const me = this;

        me.__readyPromise = Promise.resolve();

        let scriptEl = document.getElementById('youtubeApi');

        if (!scriptEl) {
            scriptEl = document.createElement('SCRIPT');
            scriptEl.id='youtubeApi';

            const firstScriptTag = document.getElementsByTagName('SCRIPT')[0];
            scriptEl.src = 'https://www.youtube.com/iframe_api';
            firstScriptTag.parentNode.insertBefore(scriptEl, firstScriptTag);

            me.__readyPromise = new Promise(function (resolve, reject) {
                try {
                    window.onYouTubeIframeAPIReady = function () {
                        resolve();
                    };

                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            });
        }
    }

    player(asset) {
        const me = this;
        const index = asset.content.lastIndexOf('/');

        let youtubeId = asset.content;

        if (index > -1) {
            youtubeId = youtubeId.substring(index + 1);
        }

        return me.__readyPromise.then(function () {
            return new Promise(function (resolve, reject) {
                const player = new YT.Player(asset.id, {
                    width: asset.width,
                    height: asset.height,
                    videoId: youtubeId,
                    suggestedQuality : 'small',
                    playerVars: {
                        //autoplay: 1,(준비완료 이벤트에서 처리)
                        controls: 2,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        loop: 1,
                        playlist: youtubeId,
                        modestbranding: 0,
                        playsinline: 1,
                        rel: 0,
                        showinfo: 0
                    },
                    events: {
                        onError: reject
                    }
                });

                resolve(player);
            });
        });
    }
}