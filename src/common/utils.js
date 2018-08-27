export default {
    imageUtil(e) {
        let imageSize = {},
            originalWidth = e.detail.width,
            originalHeight = e.detail.height,
            originalScale = originalHeight / originalWidth;
        wx.getSystemInfo({
            success: (res) => {
                var windowWidth = res.windowWidth;
                var windowHeight = res.windowHeight;
                var windowscale = windowHeight / windowWidth; //屏幕高宽比  
                if (originalScale < windowscale) { //图片高宽比小于屏幕高宽比  
                    //图片缩放后的宽为屏幕宽  
                    imageSize.imageWidth = windowWidth;
                    imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
                } else { //图片高宽比大于屏幕高宽比  
                    //图片缩放后的高为屏幕高  
                    imageSize.imageHeight = windowHeight;
                    imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
                }
                return imageSize;
            }
        });
    }
}
