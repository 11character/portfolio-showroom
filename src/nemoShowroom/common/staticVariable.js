import * as THREE from 'three/build/three.module';

/**
 * 화면이 표시되는 최소거리.
 */
export const CAMERA_NEAR = 0.1;

/**
 * 화면이 표시되는 최대거리.
 */
export const CAMERA_FAR = 50000;

/**
 * 건물이 배치되는 그룹 이름.
 */
export const ITEM_BASE_FIELD_NAME = 'itemBaseField';

/**
 * 아이템이 배치되어 있는 그룹 이름.
 */
export const ITEM_OBJECT_FIELD_NAME = 'itemObjectField';

/**
 * 화면에 배치하는 필드 영역의 클래스명.
 */
export const ELEMENT_FIELD_CLASS_NAME = 'nemo-showroom-field';

/**
 * CSS랜더링 객체를 보여주는 마스크 3D객체의 이름.
 */
export const TRANSPARENT_OBJECT_NAME = 'transparentObject3D';

/**
 * 화면에 배치하는 필드 영역의 ID.
 */
export const ELEMENT_FIELD_ID = '';

/**
 * 에디터 카메라의 초기 위치.
 */
export const CAMERA_ZERO_POSITION = new THREE.Vector3(0, 4, 10);

/**
 * 에디터 카메라가 바라보는 지점.
 */
export const CAMERA_ZERO_LOOK_AT = new THREE.Vector3(0, 0, 0);

/**
 * 화면을 위 아래로 이동할 때의 최소 각도. (위쪽이 0도)
 */
export const CONTROLS_MIN_POLAR_ANGLE = 0;

/**
 * 화면을 위 아래로 이동할 때의 최대 각도. (위쪽이 0도)
 */
export const CONTROLS_MAX_POLAR_ANGLE = Math.PI;

/**
 * 그리드 색.
 */
export const GRID_COLOR = new THREE.Color(0xb8b8b8);

/**
 * 그리드 사이즈.
 */
export const GRID_SIZE = 100;

/**
 * 그리드 간격.
 */
export const GRID_DIVISIONS = 100;

/**
 * 아이템 타입
 */
export const ITEM_TYPE_NONE = 'none';
export const ITEM_TYPE_3D_OBJ = 'obj';
export const ITEM_TYPE_3D_STL = 'stl';
export const ITEM_TYPE_3D_FBX = 'fbx';
export const ITEM_TYPE_HTML = 'html';
export const ITEM_TYPE_YOUTUBE = 'youtube';
export const ITEM_TYPE_IMAGE = 'image';
export const ITEM_TYPE_TEXT = 'text';

/**
 * 대상 복제시 리로드 할 타입.
 */
export const CLONE_RELOAD_TYPE = ITEM_TYPE_3D_FBX;

/**
 * html 내용이 표시되는 css필드의 클래스명.
 */
export const CLASS_NAME_HTML_CONTENT = 'asset-html-content';

/**
 * 3D객체와 유튜브 콘텐츠의 위치 보정값.
 */
export const CSSRENDERER_YOUTUBE_GAP_TOP = 5;

/**
 * 유튜브 플레이어 기본 사이즈.
 */
export const YOUTUBE_DEFAULT_W = 480;

/**
 * 유튜브 플레이어 기본 사이즈.
 */
export const YOUTUBE_DEFAULT_H = 270;

// webGlRenderer 창의 크기와 사용되는 카메라를 동일하게 사용해도 두 화면을 합쳤을 때 오차가 발생한다.
// 이 오차는 화면 크기에 비례하여 달라진다.
// 640 x 480 화면을 기준으로 일치하는 위치를 눈으로 측정했다. 보정 간격은 left : 4, top -2 로 나왔다.
// 적용하기 위한 비율은 대략 left : 0.00625, top : 0.0042 가 나왔다.
/**
 * webGlRenderer 의 창 크기 비례하여 cssRenderer가 움직여야 하는 보정비율
 */
export const CSSRENDERER_POSITION_GAP_X = 0.00625;

/**
 * webGlRenderer 의 창 크기 비례하여 cssRenderer가 움직여야 하는 보정비율
 */
export const CSSRENDERER_POSITION_GAP_Y = 0.0042;

/**
 * 아이템 팝업의 백그라운드 클래스명.
 */
export const ITEM_POPUP_BACKGROUND_CLASS_NAME = 'nemo-item-popup-background';

/**
 * 아이템 팝업 클래스명.
 */
export const ITEM_POPUP_CLASS_NAME = 'nemo-item-popup';