// ==UserScript==
// @name         [TH] Auto Skip Queue สำหรับ Steam
// @namespace    https://github.com/be1stmaster/TH-Steam
// @version      0.2
// @description  สคริปชุดนี้ถูกแปลเป็นภาษาไทย ซึ่ง Code ต้นฉบับมาจากคุณ xPaw และ mig4ng
// @author       Be1st (กมลภพ หรั่งเจริญ)
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://store.steampowered.com/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var type = "fast"; // เลือกปรับระหว่าง fast กับ slow, ให้ตั้งเป็น fast หากต้องการให้แสดงปุ่มลัดรวดเดียว 3 คิว, และให้ตั้งเป็น slow หากต้องการเพียงแค่การ skip หน้าร้านค้าไปทีละเกม
var alerts = true; // ให้ตั้งเป็น false หากคุณไม่ต้องการให้มันขึ้น alerts
var donateAlerts = true;
var maxTime = 6000;
var minTime = 500;

if(type=="fast"){
    if ($('div.discover_queue_empty_refresh_btn').length) {
        $( "<div class='autoQueueBox' align='center'><a href='http://steamcommunity.com/profiles/76561198064167413'><img src='http://be1st.blacksuit.info/files/steam/script/Banner-Script.png' alt='click ไปยัง Profile'></a><div class='discover_queue_empty winter_sale' style=''><div class='discover_queue_empty_refresh_btn'><span class='btnv6_lightblue_blue btn_medium' id='instant_queue_btn'><span>ข้าม 3 คิว ทันที <b>คลิก</b> &gt;&gt;</span></span></div><div class='discovery_queue_winter_sale_where_trading_cards' align='center'><h2>กลุ่มของพวกเรา</h2></br>Facebook Group: <a href='https://www.facebook.com/groups/steam.etc' target='_blank'><b>[Thailand] (Steam) Events and Trading Cards</b></a></br>Steam Group: <a href='http://steamcommunity.com/groups/TH-ETC' target='_blank'><b>[Thailand] Events and Trading Cards</b></a></div>" ).insertBefore( ".discovery_queue_apps" );
        $( "#instant_queue_btn" ).click(function() {
            GenerateQueue(0);
        });
    }
    if ($('span.queue_sub_text').length || $('span.finish_queue_text').length) {
        $J('#next_in_queue_form').submit();
    }
} else {
    if ($('span.queue_sub_text').length) {
        setTimeout(function(){ $J('#next_in_queue_form').submit(); }, (maxTime-minTime)*Math.random() + minTime);
    }
    if ($('span.finish_queue_text').length) {
        setTimeout(function(){ $J('#next_in_queue_form').submit(); }, (maxTime-minTime)*Math.random() + minTime);
    }
    if ($('div.discover_queue_empty_refresh_btn').length) {
        if(donateAlerts){
            $( "<h3 class='donateAuthor'>บริจาคการ์ดที่ไม่ได้ใช้มาให้ผมได้นะครับ หากคุณคิดว่าสคริปนี้มีประโยชน์</h3>" ).insertAfter( ".discovery_queue_winter_sale_cards_header" );
            $( "<h2 class='donateTradeOffer'><a href='https://steamcommunity.com/tradeoffer/new/?partner=103901685&token=CWIx_60X' target='_blank'>-> คลิกที่นี่, หากต้องการบริจาคของเพื่อสนับสนุนผม <-</a></h2>" ).insertAfter( ".donateAuthor" );
        }
        if(alerts){
            alert("หากคุณยังมีการ์ดที่สามารถรับได้จากการเข้าดูคิวร้านค้าในวันนี้ อย่ารอช้า! กดเริ่มคิวได้เลยทันที!");
        }
    }
}

var GenerateQueue = function( queueNumber ){
    $J('#instant_queue_btn').html("<span>คิวชุดที่ " + ++queueNumber + " กำลังทำงาน...</span>");
    jQuery.post( 'http://store.steampowered.com/explore/generatenewdiscoveryqueue', { sessionid: g_sessionID, queuetype: 0 } ).done( function( data ){
        var requests = [];
        for( var i = 0; i < data.queue.length; i++ ){
            requests.push( jQuery.post( 'http://store.steampowered.com/app/10', { appid_to_clear_from_queue: data.queue[ i ], sessionid: g_sessionID } ) );
        }
        jQuery.when.apply( jQuery, requests ).done( function(){
            if( queueNumber < 3 ){
                GenerateQueue( queueNumber );
            } else {
                $J('#instant_queue_btn').html("<span>คิวทั้งหมด ทำงานเรียบร้อย โปรดกลับมาใหม่ในวันพรุ่งนี้</span>");
            }
        });
    });
};
