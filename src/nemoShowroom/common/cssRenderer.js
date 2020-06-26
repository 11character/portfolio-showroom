import * as THREE from 'three/build/three.module';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';

import * as StaticVariable from './staticVariable';
import Utils from '../../class/utils';
import CssUnit from './cssUnit';
import YouTubeApi from './youtubeApi';

export default class CssRenderer {
    constructor (renderer, camera) {
        const me = this;

        me.__cssUnitArr = [];
        me.__cssUnits = {};
        me.__isRun = true;
        me.__closeItemPopup = function () {};

        me.webglRenderer = renderer;
        me.arCamera = camera;
        me.isPopupOpen = false;

        me.cssRenderer = new CSS3DRenderer();
        me.cssScene = new THREE.Scene();
        me.domElement = me.cssRenderer.domElement;

        me.youTubeApi = new YouTubeApi();

        me.domElement.style.position = 'relative';
        me.resize();
    }

    add(assetItem) {
        const me = this;

        if (assetItem.type === StaticVariable.ITEM_TYPE_HTML || assetItem.type === StaticVariable.ITEM_TYPE_YOUTUBE) {
            me.__add(new CssUnit(assetItem));
        }
    }

    __add(cssUnit) {
        const me = this;

        const assetItem = cssUnit.assetItem;
        const scale = assetItem.scale;
        const position = assetItem.position;
        const rotation = assetItem.rotation;

        const group = new THREE.Group();
        const bodyEl = document.body;
        const fieldEl = Utils.createDivElement();
        const contentEl = Utils.createDivElement();

        contentEl.id = assetItem.id;
        contentEl.classList.add(StaticVariable.CLASS_NAME_HTML_CONTENT);
        contentEl.style.overflow = 'hidden';

        // 3D랜더링 관련 투명영역 치수처리를 위한 임시배치
        contentEl.style.position = 'fixed';
        contentEl.style.visibility = 'hidden';
        bodyEl.appendChild(contentEl);

        // 유튜브 콘텐츠의 경우 상단으로 5px 올라가는 오차가 생기기 때문에 위치를 보정한다.(아직 원인은 모른다.)
        if (assetItem.type === StaticVariable.ITEM_TYPE_YOUTUBE) {
            contentEl.style.marginTop = StaticVariable.CSSRENDERER_YOUTUBE_GAP_TOP + 'px';
        }

        let itemCss3D;

        if (assetItem.isSprite) {
            itemCss3D = new CSS3DSprite(fieldEl);

        } else {
            itemCss3D = new CSS3DObject(fieldEl);
        }

        // scale, position, rotation 값은 AssetItem의 객체다. 그렇기 때문에 copy()를 사용하지 않고 set() 메소드로 값을 넣는다.
        itemCss3D.scale.set(scale.x, scale.y, scale.z);
        itemCss3D.position.set(position.x, position.y, position.z);
        itemCss3D.rotation.set(rotation.x, rotation.y, rotation.z, 0);

        group.add(itemCss3D);
        me.cssScene.add(group);

        cssUnit.cssObject3D = group;

        // 유튜브 링크의 경우 별도로 처리한다.
        if (assetItem.type === StaticVariable.ITEM_TYPE_YOUTUBE) {
            me.__settingYouTubeApi(cssUnit);

            const width = StaticVariable.YOUTUBE_DEFAULT_W;
            const height = StaticVariable.YOUTUBE_DEFAULT_H;

            assetItem.width = width;
            assetItem.height = height;

            //마스크가 되는 3D객체 크기 설정.
            assetItem.object3D.scale.setX(width);
            assetItem.object3D.scale.setY(height);

            contentEl.style.position = 'relative';
            contentEl.style.visibility = '';
            fieldEl.appendChild(contentEl);

            me.__cssUnits[cssUnit.assetItem.id] = cssUnit;
            me.__cssUnitArr.push(cssUnit);
            me.__onAdd(cssUnit);

        // html인 경우 치수 관련 처리를 한다.
        } else {
            contentEl.innerHTML = assetItem.content;

            // 내용을 배치한 후 화면에 그려질 시간이 필요하다. 그 이후에 정확한 크기를 구할 수 있다.
            setTimeout(function () {
                // 사이즈 값이 없는 경우(혹은 0인 경우) 1을 넣는 이유는 크기가 0일때 3D랜더러에서 오류가 나기 때문이다.
                const width = contentEl.offsetWidth || 1;
                const height = contentEl.offsetHeight || 1;

                assetItem.width = width;
                assetItem.height = height;

                contentEl.style.width = width + 'px';
                contentEl.style.height = height + 'px';

                //마스크가 되는 3D객체 크기 설정.
                assetItem.object3D.scale.setX(width);
                assetItem.object3D.scale.setY(height);

                contentEl.style.position = 'relative';
                contentEl.style.visibility = '';

                fieldEl.appendChild(contentEl);

                me.__cssUnits[cssUnit.assetItem.id] = cssUnit;
                me.__cssUnitArr.push(cssUnit);
                me.__onAdd(cssUnit);
            }, 500);
        }
    }

    render() {
        const me = this;

        me.cssRenderer.render(me.cssScene, me.arCamera);
    }

    updateAll() {
        const me = this;

        const unitArr = me.__cssUnitArr;

        if (me.__isRun) {
            for (let i = 0; i < unitArr.length; i++) {
                unitArr[i].update();
            }
        }
    }

    resize() {
        const me = this;

        const vector2 = new THREE.Vector2();
        me.webglRenderer.getSize(vector2);

        const webglDomElement = me.webglRenderer.domElement;
        const cssDomElement = me.domElement;

        me.cssRenderer.setSize(vector2.x, vector2.y);

        cssDomElement.style.left = webglDomElement.offsetLeft + (vector2.x * StaticVariable.CSSRENDERER_POSITION_GAP_X) + 'px';
        cssDomElement.style.top = webglDomElement.offsetTop - (vector2.y * StaticVariable.CSSRENDERER_POSITION_GAP_Y) + 'px';

        me.closeItemPopup();
    }

    showObject3D(callEvent = true) {
        const me = this;

        for (let i = 0; i < me.__cssUnitArr.length; i++) {
            me.__cssUnitArr[i].showObject3D(callEvent);
        }
    }

    hideObject3D(callEvent = true) {
        const me = this;

        for (let i = 0; i < me.__cssUnitArr.length; i++) {
            me.__cssUnitArr[i].hideObject3D(callEvent);
        }
    }

    itemPopup(assetItem, openCallback = function () {}, closeCallback = function () {}) {
        const me = this;

        // 대상 element에 정해져 있는 기본 변경값, 부모의 부모에 정의되어 있다.
        // 랜더링이 재시작 되어도 자동 설정이 되지 않기 때문에 수동으로 되돌려 놓아야 한다.
        const arDomEl = me.webglRenderer.domElement;
        const cssDomEl = me.domElement;
        const parentEl = cssDomEl.parentNode;
        const bgEl = Utils.createDivElement();
        const itemEl = document.getElementById(assetItem.id);

        bgEl.classList.add(StaticVariable.ITEM_POPUP_BACKGROUND_CLASS_NAME);
        bgEl.style.width = parentEl.scrollWidth + 'px';
        bgEl.style.height = parentEl.scrollHeight + 'px';
        bgEl.style.position = 'absolute';
        bgEl.style.left = '0px';
        bgEl.style.top = '0px';
        bgEl.style.backgroundColor = 'black';

        // iframe 리로드 문제 때문에 형재 노드의 위치를 조작하여 순서를 바꾼다.
        parentEl.insertBefore(arDomEl, cssDomEl);
        parentEl.insertBefore(bgEl, cssDomEl);

        let cssUnit = null;
        let tempUnit = null;
        for (let i = 0; i < me.__cssUnitArr.length; i++) {
            tempUnit = me.__cssUnitArr[i];

            if (tempUnit.assetItem === assetItem) {
                cssUnit = tempUnit;

            } else {
                tempUnit.hideCssObject3D();

                // 유튜브 플레이어가 있는경우 팝업이 열린 이후의 상황에 따라 일시정지를 시킨다.
                if (tempUnit.ytPlayer) {
                    tempUnit.ytPlayer.pauseVideo();
                }
            }
        }

        if (cssUnit) {
            tempUnit.assetItem.onShow();

            console.log(cssUnit.cssObject3D);

            const orgLocalT = cssUnit.cssObject3D.children[0].element.parentNode.style.transform;
            const orgItemStyleW = itemEl.style.width;
            const orgItemStyleH = itemEl.style.height;

            me.__isRun = false;

            cssUnit.cssObject3D.children[0].element.style.transform = 'none';
            cssUnit.cssObject3D.children[0].element.parentNode.style.transform = 'none';

            const sW = parentEl.offsetWidth / itemEl.offsetWidth;
            const sH = parentEl.offsetHeight / itemEl.offsetHeight;
            const scale = Math.abs(1 - sW) <= Math.abs(1 - sH) ? sW : sH;

            let left = parentEl.offsetLeft - arDomEl.offsetLeft;
            let top = parentEl.offsetTop - arDomEl.offsetTop;

            left += (parentEl.offsetWidth / 2);
            top += (parentEl.offsetHeight / 2);

            itemEl.classList.add(StaticVariable.ITEM_POPUP_CLASS_NAME);
            itemEl.style.position = 'absolute';
            itemEl.style.left = left + 'px';
            itemEl.style.top = top + 'px';
            itemEl.style.transform = 'translate(-50%, -50%)';
            itemEl.style.width = itemEl.offsetWidth * scale + 'px';
            itemEl.style.height = itemEl.offsetHeight * scale + 'px';

            me.isPopupOpen = true;

            openCallback();

            me.__closeItemPopup = function () {
                parentEl.removeChild(bgEl);
                parentEl.appendChild(arDomEl);

                cssUnit.cssObject3D.children[0].element.parentNode.style.transform = orgLocalT;

                itemEl.classList.remove(StaticVariable.ITEM_POPUP_CLASS_NAME);
                itemEl.style.transform = '';
                itemEl.style.position = '';
                itemEl.style.left = '0px';
                itemEl.style.top = '0px';
                itemEl.style.width = orgItemStyleW;
                itemEl.style.height = orgItemStyleH;

                for (let i = 0; i < me.__cssUnitArr.length; i++) {
                    me.__cssUnitArr[i].update();
                }

                // 유튜브 플레이어가 있는경우 팝업이 닫힌 이후의 상황에 따라 일시정지를 시킨다.
                if (cssUnit.ytPlayer && !cssUnit.assetItem.isVisible) {
                    cssUnit.ytPlayer.pauseVideo();
                }

                me.__isRun = true;

                closeCallback();
            };
        }
    }

    closeItemPopup() {
        const me = this;

        me.__closeItemPopup();
        me.__closeItemPopup = function () {};

        me.isPopupOpen = false;
    }

    playYoutube() {
        const me = this;

        for (let i = 0; i < me.__cssUnitArr.length; i++) {
            const cssUnit = me.__cssUnitArr[i];

            if (cssUnit.ytPlayer) {
                cssUnit.ytPlayer.playVideo();
            }
        }
    }

    pauseYoutube() {
        const me = this;

        for (let i = 0; i < me.__cssUnitArr.length; i++) {
            const cssUnit = me.__cssUnitArr[i];

            if (cssUnit.ytPlayer) {
                cssUnit.ytPlayer.pauseVideo();
            }
        }
    }

    __onAdd(cssUnit, me = this) {
        // 연결된 3D 개체의 현재 상태로 업데이트 한다.
        cssUnit.update();

        // 화면에 그려진 후에 준비완료 이벤트를 실행한다.
        setTimeout(function () {
            if (document.getElementById(cssUnit.assetItem.id)) {
                cssUnit.onReady();

            } else {
                me.__onAdd(cssUnit, me);
            }
        }, 500);
    }

    __settingYouTubeApi(cssUnit) {
        const me = this;

        const assetItem = cssUnit.assetItem;

        let palyTimeout;
        let stopTimeout;

        cssUnit.onReady = function () {
            me.youTubeApi.player(assetItem).then(function (player) {
                player.addEventListener('onReady', function () {
                    cssUnit.ytPlayer = player;

                    player.mute();

                    // 준비가 되었을 때 보이고 있는 상태면 바로 재생한다.
                    if (assetItem.isVisible) {
                        palyTimeout = setTimeout(function () {
                            cssUnit.ytPlayer.playVideo();
                        }, 150);
                    }
                });
            });
        };

        assetItem.onShow = function () {
            if (cssUnit.ytPlayer) {
                clearTimeout(palyTimeout);

                if (assetItem.isVisible && !me.isPopupOpen) {
                    palyTimeout = setTimeout(function () {
                        cssUnit.ytPlayer.playVideo();
                    }, 150);
                }
            }
        };

        assetItem.onHide = function () {
            if (cssUnit.ytPlayer) {
                clearTimeout(stopTimeout);

                // 팝업이 닫혀있을 때만 영상을 종료한다.
                if (!me.isPopupOpen) {
                    stopTimeout = setTimeout(function () {
                        cssUnit.ytPlayer.pauseVideo();
                    }, 150);
                }
            }
        };
    }
}