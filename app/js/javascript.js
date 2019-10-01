let tt = 10;
const ss = 20;
console.log(tt);
console.log(ss);

/**
 * @file culture.js 公司文化
 * @author 
 * @par Copyright (c): 
 *
 * **/

var fsCulture = {
	/**
     *  {data JSON对象数据的封装}
     * **/
    data: {
    },
    /**
     *  {init 初始化}
     * **/
    init: {
        /**
         *  {initEvent 初始化事件}
         * **/
        initEvent: function() {
        	$('.culture .cells .fsCell1').on('click', function(){
        		fsCulture.switchover(1, 2, 3);
        	});
        	$('.culture .cells .fsCell2').on('click', function(){
        		fsCulture.switchover(2, 3, 1);
        	});
        	$('.culture .cells .fsCell3').on('click', function(){
        		fsCulture.switchover(3, 2, 1);
        	});
        },
        /**
         *  {initData 初始化数据}
         * **/
        initData: function() {

        }
    },
    /**
     *  {switchover 切换 div}
     * **/
    switchover: function(i, j, k) {
    	var Ctrl1 = $('.culture .cells .fsCell'+i);
    	var Ctrl2 = $('.culture .cells .fsCell'+j);
    	var Ctrl3 = $('.culture .cells .fsCell'+k);
    	// --- banner bg
    	$('.culture .bg-banner .bannerImg'+i).css({ 'display': 'block' });
    	$('.culture .bg-banner .bannerImg'+j).css({ 'display': 'none' });
    	Ctrl3.find('.fs-cover-layer').css({ 'opacity': 0.5, 'background-color': 'black' });
    	// 此处对 Ctrl1 的高度进行修正 -- 基于 Ctrl2
    	Ctrl1.css({ 'width': '40%', 'height': Ctrl2.height() });
    	Ctrl1.find('.fs-cover-layer').css({ 'opacity': 1, 'background-color': Ctrl1.attr("data-bgColor") });
    	Ctrl1.find('.cell-con img').css({ 'margin-top': '-30px' });
    	Ctrl1.find('.fsCellVisible1').css({ 'display': 'inline-block' });
    	Ctrl1.find('.fsCellVisible2').css({ 'display': 'block' });
    	// 缩小的
    	Ctrl2.css({ 'width': '30%' });
    	Ctrl2.find('.fs-cover-layer').css({ 'opacity': 0.5, 'background-color': 'black' });
    	Ctrl2.find('.cell-con img').css({ 'margin-top': '0px' });
    	Ctrl2.find('.fsCellVisible1').css({ 'display': 'none' });
    	Ctrl2.find('.fsCellVisible2').css({ 'display': 'none' });
    	Ctrl3.css({ 'width': '30%' });
    	Ctrl3.find('.cell-con img').css({ 'margin-top': '0px' });
    	Ctrl3.find('.fsCellVisible1').css({ 'display': 'none' });
    	Ctrl3.find('.fsCellVisible2').css({ 'display': 'none' });
    	// --- banner bg
    	$('.culture .bg-banner .bannerImg'+k).css({ 'display': 'none' });
    	// 再次对 Ctrl1 的高度进行修正 -- 基于 Ctrl2
    	Ctrl1.css({ 'height': Ctrl2.height() });
    },
    /**
     *  {fixBannerHeight 修改 bg-banner 高度}
     * **/
    fixBannerHeight: function() {
        var bodyHeight = $('body').height();
        var cultureHeight = $('.culture').height();
        var footerHeight = $('.footer-wrap').height();
        var tmpVal = bodyHeight - (cultureHeight + footerHeight)
        if (tmpVal > 0) {
            var bgBanner = $('.culture .bg-banner');
            bgBanner.height(bgBanner.height() + tmpVal);
        }
    }
}

$(document).ready(function() {
	// console.log('culture');
	fsCulture.init.initEvent();
    // 修改 bg-banner 高度
    fsCulture.fixBannerHeight();
    $(window).resize(function() {
        fsCulture.fixBannerHeight();
    });
});