$(function () {
  //0.自定义滚动条
  $(".content_list").mCustomScrollbar();

  //1.监听歌曲的移入移出事件
  //事件委托
  $(".content_list").delegate(".list_music", "mouseenter", function () {
    //移入：显示子菜单、隐藏时长
    $(this).find(".list_menu").stop().fadeIn(100);    //四个按钮显示
    $(this).find(".list_time a").stop().fadeIn(100);  //删除按钮显示
    $(this).find(".list_time span").stop().fadeOut(1);   //时长消失
  });
  $(".content_list").delegate(".list_music", "mouseleave", function () {
    //移出，显示时长
    $(this).find(".list_menu").stop().fadeOut(100);   //四个按钮消失
    $(this).find(".list_time a").stop().fadeOut(100); //删除按钮小消失
    $(this).find(".list_time span").stop().fadeIn(1); //时长显示
  });

  //2.监听复选框的点击事件
  $(".content_list").delegate(".list_check", "click", function () {
    // console.log($(".list_check")[0]);
    // console.log($(this)[0]);
    //如果选择第一个复选框（歌曲旁边的全选键）则全选
    if ($(this)[0] == $(".list_check")[0]) {
      // console.log($(this).hasClass("list_checked"));
      //如果点击已选中状态则反之
      if($(this).hasClass("list_checked")){
        $(".list_check").removeClass("list_checked");
      }else{
        $(".list_check").addClass("list_checked");
      }
    } else {
      $(this).toggleClass("list_checked");    //  给指定的元素切换样式类名(选中与非选中)
    }

  });

  var $musicPlay = $(".music_play");
  //3.添加子菜单播放按钮的监听
  $(".content_list").delegate(".list_menu_play", "click", function () {
    var $item = $(this).parents(".list_music");
    // 3.1切换播放图标
    //这个是多添加一个元素
    $(this).toggleClass("list_menu_play2");
    //这种是删除元素再添加元素的方法
    // $(this).removeClass("list_menu_play");
    // $(this).addClass("list_menu_play2");


    //3.2复原其他的播放图标
    //(找到该节点的父级元素下的所有list_music元素，且找到该元素的所有后代元素list_menu_play.删除list_menu_play2类）
    //[siblings()带有类名list_music的元素]
    //[find()返回被选元素的后代元素]
    $(this).parents(".list_music").siblings().find(".list_menu_play2").removeClass("list_menu_play2");
    //这种是删除元素再添加元素的方法
    // $(this).parents(".list_music").siblings().find(".list_menu_play2").addClass("list_menu_play").removeClass("list_menu_play2");

    //判断该元素是否包含list_menu_play2类（表示播放状态则一直播放）
    if ($(this).hasClass("list_menu_play2")) {
      //添加进度条播放按钮
      $musicPlay.addClass("music_play2");
      // 让文字高亮
      $item.find("div").css("color", "#fff");
      //除了自己高亮，其他元素不高亮
      $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
    } else {
      //删除进度条播放按钮
      $musicPlay.removeClass("music_play2");
      // 让文字不高亮
      $item.find("div").css("color", "rgba(255,255,255,0.5)");
    }
    // 序号变成播放动画
    $item.find(".list_number").toggleClass("list_number2");
    //点击其他时只有当前数字有变化
    $item.siblings().find(".list_number").removeClass("list_number2")
  })

  //4.加载歌曲列表
  getPlayerList();
  function getPlayerList() {
    $.ajax({
      url: "./source/musiclist.json",
      dataType: "json",
      success: function (data) {
        console.log(data);
        var $musicList = $(".content_list ul");
        $.each(data, function (index, ele) {
          var $item = crateMusicItem(index, ele);
          $musicList.append($item);
        })
      },
      error: function (e) {
        console.log(e);
      }
    });
  }


  // 定义一个方法创建一条音乐
  function crateMusicItem(index, music) {
    var $item = $("" +
      "<li class=\"list_music\">\n" +
      "<div class=\"list_check\"><i></i></div>\n" +
      "<div class=\"list_number\">" + (index + 1) + "</div>\n" +
      "<div class=\"list_name\">" + music.name + "" +
      "     <div class=\"list_menu\">\n" +
      "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
      "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
      "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
      "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
      "     </div>\n" +
      "</div>\n" +
      "<div class=\"list_singer\">" + music.singer + "</div>\n" +
      "<div class=\"list_time\">\n" +
      "     <span>" + music.time + "</span>\n" +
      "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
      "</div>\n" +
      "</li>");

    // $item.get(0).index = index;
    // $item.get(0).music = music;

    return $item;
  }
})