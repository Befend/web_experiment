/**
 * header的cookie解析
 */
const pairSplitRegExp = /; */;
const decode = decodeURIComponent;
function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

function cookieParse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  const obj = {};
  const opt = options || {};
  const pairs = str.split(pairSplitRegExp);
  const dec = opt.decode || decode;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    let eq_idx = pair.indexOf('=');

    if (eq_idx < 0) {
      continue;
    }
    const key = pair.substr(0, eq_idx).trim();
    let val = pair.substr(++eq_idx, pair.length).trim();
    // eslint-disable-next-line
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }
    // eslint-disable-next-line
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }
  return obj;
}

function setCookie(cname, cvalue, exdays = 0.1) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toGMTString();
  if (process.env.VUE_APP_SSO_AUTH === 'yzt_ssjd') {
    /**
     * 和其他平台集成时无法设置cookie
     * 解决办法：1.启用https协议同时标记SameSite=None; Secure
     * document.cookie = cname + "=" + cvalue + "; " + expires+"; SameSite=None; Secure";
     * 2.使用sessionStorage代替cookie
     */
    sessionStorage.setItem(cname, cvalue);
  } else {
    document.cookie = cname + '=' + cvalue + '; ' + expires;
  }
}
function getCookie(cname) {
  let ca;
  if (process.env.VUE_APP_SSO_AUTH === 'yzt_ssjd') {
    return sessionStorage.getItem(cname);
  } else {
    const name = cname + '=';
    ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
  }
  return '';
}
function checkCookie() {
  const user = getCookie('username');
  if (user !== '') {
    // alert("欢迎 " + user + " 再次访问");
  } else {
    // user = prompt("请输入你的名字:","");
    if (user !== '' && user !== null) {
      if (process.env.VUE_APP_SSO_AUTH !== 'yzt_ssjd') {
        setCookie('username', user, 30);
      }
    }
  }
}

export { cookieParse, setCookie, getCookie, checkCookie };
