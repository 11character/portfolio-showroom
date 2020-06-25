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
 * 아이템이 배치되어 있는 그룹 이름.
 */
export const ITEM_OBJECT_FIELD_NAME = 'itemObjectField';

/**
 * 화면에 배치하는 필드 영역의 클래스명.
 */
export const ELEMENT_FIELD_CLASS_NAME = 'nemo-showroom-field';

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