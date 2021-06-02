// 다른 Options 객체와 이름이 다르기 때문에 주석을 단다.
// 에디터에서는 MaterialOption 객체를 여러 개 묶어서 저장, 불러오기, 관리하는 변수로 MaterialOptions 라는 이름을 사용한다.
// 그래서 이 객체는 MaterialOption 라는 이름으로 만들어졌다.
export default class MaterialOption {
    constructor (obj = {}) {
        this.roughness = (typeof obj.roughness == 'number') ? obj.roughness : 1;
        this.metalness = (typeof obj.metalness == 'number') ? obj.metalness : 0.5;
        this.color = obj.color || '';
        this.map = obj.map || '';
        this.normalMap = obj.normalMap || '';
        this.metalnessMap = obj.metalnessMap || '';
        this.roughnessMap = obj.roughnessMap || '';
        this.emissive = obj.emissive || '';
        this.envMap = obj.envMap || [];
        this.reflectivity = (typeof obj.reflectivity == 'number') ? obj.reflectivity : 0;
    }
}