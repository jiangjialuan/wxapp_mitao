/**
 * Created by Administrator on 2017/10/25.
 */
export default {
    getCode() {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        if (timestamp >= wx.getStorageSync('curentTime') + 5 * 60) {
            wx.setStorageSync('curentTime', timestamp);
            wx.setStorageSync('time', '');
        } else if (wx.getStorageSync('curentTime') === '') {
            wx.setStorageSync('curentTime', timestamp);
        }
        this.getCodeS();
    },
    getCodeS() {
        if (wx.getStorageSync('time') === '') {
            wx.request({
                url: 'https://www.yimizhibo.tv/api/v1/get_clipboard_tpwd',
                data: {
                    adzone_id: 133794723,
                },
                method: 'get',
                dataType: 'json',
                success: function(res) {
                    wx.setClipboardData({
                        data: res.data.data.tpwd,
                        success: function(res) {
                            wx.setStorageSync('time', 1);
                            console.log('导入成功！');
                        }
                    });
                }
            });
        }
    }
};
