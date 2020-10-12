let buildType = 'watch';

if (process.argv[2] === 'watch' || process.argv[2] === 'production') {
    buildType = process.argv[2];
    console.log('is ' + buildType);
}

console.log('NODE_ENV : ' + process.env.NODE_ENV);

const Bundler = require('parcel-bundler');
const Path = require('path');

const file1 = Path.join(__dirname, './src/index.js');
const file2 = Path.join(__dirname, './src/showroom.js');
const file3 = Path.join(__dirname, './src/login.js');
const file4 = Path.join(__dirname, './src/detect.js');

const options1 = {
    outDir: 'public/dist/index',
    publicUrl: './',
    sourceMaps: false,
    watch: (buildType === 'watch')
};

const options2 = {
    outDir: 'public/dist/showroom',
    publicUrl: './',
    sourceMaps: false,
    watch: (buildType === 'watch')
};

const options3 = {
    outDir: 'public/dist/login',
    publicUrl: './',
    sourceMaps: false,
    watch: (buildType === 'watch')
};

const options4 = {
    outDir: 'public/dist',
    publicUrl: './',
    sourceMaps: false,
    watch: (buildType === 'watch')
};

const bundler1 = new Bundler(file1, options1);
const bundler2 = new Bundler(file2, options2);
const bundler3 = new Bundler(file3, options3);
const bundler4 = new Bundler(file4, options4);

bundler1.bundle();
bundler2.bundle();
bundler3.bundle();
bundler4.bundle();