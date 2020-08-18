export default class MaterialOption {
    constructor (obj = {}) {
        this.roughness = (typeof obj.roughness == 'number') ? obj.roughness : 1;
        this.metalness = (typeof obj.metalness == 'number') ? obj.metalness : 0.5;
        this.color = obj.color || 'rgb(255, 255, 255)';
        this.map = obj.map || '';
        this.normalMap = obj.normalMap || '';
        this.metalnessMap = obj.metalnessMap || '';
        this.roughnessMap = obj.roughnessMap || '';
        this.emissive = obj.emissive || 'rgb(0, 0, 0)';
        this.envMap = obj.envMap || [];
        this.reflectivity = (typeof obj.reflectivity == 'number') ? obj.reflectivity : 0;
    }
}