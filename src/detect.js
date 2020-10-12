// 호환성을 위해 변수에 var 사용.
import Bowser from 'bowser';

// 브라우저 지원 여부 확인. (익스플로러 사용불가)
var bowser = Bowser.getParser(window.navigator.userAgent);
var name = bowser.getBrowserName().toLocaleLowerCase();

if (name.indexOf('explorer') > -1) {
    window.location.href = 'not-support.php';
}