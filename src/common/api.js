import wepy from 'wepy';
//  let baseUrl = 'http://sdkdemo.artqiyi.com', videoUrl = 'http://test.yimizhibo.tv';
let baseUrl = 'https://yimi.artqiyi.com', videoUrl = 'https://www.yimizhibo.tv';
export default {
    // 主播首页
    starInfo: `${videoUrl}/api/v1/zbinfo`,
    // 用户相关
    userInfo: `${videoUrl}/api/v1/userinfo`,
    login: `${videoUrl}/api/v1/applet_login`,
    sdkInfo: `${videoUrl}/api/v1/get_sdk_zbinfo`,
    // 商品分类
    typeList: `${baseUrl}/mobile/index/type_list`,
    // 订单相关接口
    orderList: `${videoUrl}/api/v1/tbk_order`,
    // 加入米淘
    join: `${videoUrl}/api/v2/join_mitao`,
    // 加入米淘
    sendCode: `${videoUrl}/api/v1/send_verification`,
    // 商城下单流程相关接口
    goodsList: `${baseUrl}/mobile/index/tbk_goods`,
    goodsDetail: `${baseUrl}/mobile/index/tbkGoodsDetail`,
    // 弹出剪切板商品
    getInfoShorturl: `${baseUrl}/mobile/index/get_info_by_shorturl`,
    // 高佣接口
    get_info_by_numiid: `${baseUrl}/mobile/index/get_info_by_numiid`,
    // 淘宝令
    get_tpwd_by_numiid: `${baseUrl}/mobile/index/get_tpwd_by_numiid`,
    // 绑定微信手机
    bind_wx_phone: `${videoUrl}/api/v1/bind_wx_phone`,
    // 海报截图
    getWxacodeunlimit: `${videoUrl}/weixin/authorization/getWxacodeunlimit`,
    // 提现
    withdraw: `${videoUrl}/api/v1/withdraw`,
    // 登录
    getSession(code) {
        return this.request({
            url: this.login,
            method: 'POST',
            data: {
                act: 1,
                code: code,
                buid: this.buid,
                from_uid: this.from_id
            }
        });
    },
    // 获取用户信fd息
    getUserInfo() {
        return this.request({
            url: this.userInfo,
            data: {
                act: 1
            }
        });
    },
    checkLogin() {
        let tokenkey = wx.getStorageSync('tokenkey') || '';
        let requestData = {
            url: this.userInfo,
            data: {
                act: 1,
                tokenkey: tokenkey
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            }
        };
        return new Promise((resolve, reject) => {
            wepy.request(requestData).then(json => {
                var data = json.data.data;
                if (data.uid) {
                    wx.setStorageSync('userInfo', data);
                    resolve(data);
                } else {
                    wx.setStorageSync('sdk_zbinfo', '');
                    wepy.login()
                        .then(res => this.getSession(res.code))
                        .then(res => {
                            // console.log(res, 'res');
                            wx.setStorageSync('tokenkey', res.tokenkey);
                            if (res.uid) {
                                wx.setStorageSync('uid', res.uid);
                            }
                            resolve(res);
                        });
                }
            });
        });
    },
    // 封装request
    request(data, again) {
        let tokenkey = wx.getStorageSync('tokenkey') || '',
            reqData = data.data || {};
        reqData.tokenkey = tokenkey;
        let requestData = {
            url: data.url,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: reqData,
            method: data.method || 'GET'
        };
        return new Promise((resolve, reject) => {
            wepy.request(requestData).then(res => {
                if (res.data.state.code === 10401 || res.data.state.code === '10401') {
                    if (again) {
                        reject('Something is wrong');
                        return;
                    }
                    return wepy.login()
                        .then(loginRes => this.getSession(loginRes.code))
                        .then(res => {
                            wx.setStorageSync('tokenkey', res.tokenkey);
                            if (res.uid) {
                                wx.setStorageSync('uid', res.uid);
                            }
                            return this.request(data, true);
                        }).catch(reject);
                } else {
                    if (res.data.state.code === 10400 || res.data.state.code === '10400') {
                        reject(res.data.state.msg);
                    }
                    if (res.data.state.code === '10400') {
                        reject(res.data.state.msg);
                    }
                    resolve(res.data.data);
                }
            }).catch(reject);
        });
    },
    // buid: 2449,
    buid: 12481,
    title: '米淘联盟',
    from_id: 0,
    is_tbk: 0,
    version: 1,
    //tpwdFrom: true,
    showFail(msg) {
        wx.showToast({
            image: '../images/fail.png',
            title: msg
        });
    }
};
