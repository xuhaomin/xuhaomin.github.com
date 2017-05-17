//zhihu
Vue.component('zhihu', {
  props: ['content'],
  template: '<div class="thumbnail" style="min-height:100px"> \
              <div class="caption">\
              <div class="pull-right">\
              <button type="button" class="close" v-on:click="remove"\
              aria-label="Close"><span aria-hidden="true">&times;</span></button>\
              </div>\
              <h4><a :href="get_url" target="view_window">{{content.title}}</a></h4>\
              <p><strong>{{content.author}}:</strong>{{content.abstract}}\
              <button class="readmore-btn btn btn-default pull-right" data-toggle="modal" data-target="#zhihucontent" \
              v-on:click="getcontent" style="color:#055db5">\
              <span class="glyphicon glyphicon-eye-open"></span>查看全文</button></p>\
              </div></div></div>',
  computed:{
    get_url:function(){
      return "https://www.zhihu.com/question/"+this.content.qid+"/answer/"+this.content.aid
    },
  },
  methods:{
    remove:function(){
      this.$emit('remove')
    },
    getcontent:function(){
      this.$emit('getcontent')
    },
  },
});
Vue.component('zhihudaily', {
  props: ['content'],
  template: '<div class="thumbnail" style="min-height:310px"> \
              <img :src="content.img">\
              <h5><a :href="get_url" target="view_window">{{content.title}}</a>\
              <div class="pull-right">\
              <button type="button" class="close" v-on:click="remove"\
              aria-label="Close"><span aria-hidden="true">&times;</span></button>\
              </div></h5>\
              </div></div></div>',
  computed:{
    get_url:function(){
      return "http://daily.zhihu.com/story/"+this.content.id
    },

  },
  methods:{
    remove:function(){
      this.$emit('remove')
    },

  },
});

//bilibili uper
Vue.component('bilibili', {
  props: ['data'],
  template:'<div class="col-md-12 bilibili">\
              <p style="text-align:center;">\
              <a :href="get_auth_url(data.mid)" target="view_window" style="color:#4e0f39">{{data.name}}</a><img class="pull-left" :src="data.face" alt="" style="width:30px"/>\
              <button type="button" class="close pull-right" v-on:click="remove"\
              aria-label="Close"><span aria-hidden="true">&times;</span></button>\
              </p>\
              <div class="rightside col-md-12">\
              <div v-for="arch in data.archive">\
              <a style="text-align:center; color:rgb(222, 93, 179)"\
              :href="get_arch_url(arch.aid)" target="view_window">{{arch.title.substring(0,28)}}</a>\
              </div>\
              </div>\
            </div>',
  computed:{

  },
  methods:{
    remove:function(){
      this.$emit('remove')
    },
    get_arch_url:function(aid){
      return "http://www.bilibili.com/video/av"+aid
    },
    get_auth_url:function(mid){
      return "http://space.bilibili.com/"+mid
    },
  },
});




//position presentation
Vue.component('my-position', {
  props: ['position'],
  data: function () {
    return { 
   		shower:false,
   }
  },
  template: '<div class="thumbnail" style="min-height:360px"> \
							<div class="caption">\
							<div class="pull-right">\
							<button type="button" class="close" v-on:click="remove"\
							aria-label="Close"><span aria-hidden="true">&times;</span></button>\
							</div>\
							<h4><a :href="get_url">{{position.position}}</a></h4>\
							<p>{{position.city}} <a :href="position.companylink">{{position.company}}</a></p>\
							<p> {{position.salary}}</p>\
							<p> {{get_content}}</p>\
							<div class="pull-right" v-if="position.requirement.length>260">\
							<div v-on:click="showmore"  style="cursor: pointer">查看全部<span class="glyphicon glyphicon-menu-right"></span></div>\
							</div>\
							</div></div></div>',
	computed:{
		get_url:function(){
			return "https://www.lagou.com/jobs/"+this.position.pid+".html"
		},
		get_content:function(){
			if (this.shower){
				return this.position.requirement
			}
			else{
				return this.position.requirement.substring(0,250)
			}
		}
	},
	methods:{
		remove:function(){
			this.$emit('remove')
		},
		showmore:function(){
			this.shower = !this.shower;
		},
	},
});

 //video ajax selector

function resultFormatResult(data) { 
    if (data.loading) return data.title;
    return "<div class='select2-result-respository'>"
     +"<img  src='" + data.img + "' style='width:100px;height:60px'/>"
     + data.title + "</div>";
};
function resultFormatSelection(data) { 
    if (data.loading) return data.title;
    return "<div class='select2-result-respository'>" + data.title + "</div>";
};

Vue.component('select2video', {
  props: ['value'],
  template: '<select><slot></slot></select>',
  mounted: function () {
    var vm = this;
    $(this.$el)
      .val(this.value)
      // init select2
      .select2({width: "60%" ,
    ajax:{
      url:host+'video/search',
      delay:800,
      dataType: 'json',
      data:function(params){ 
        return{
          title:params.term,
          page: params.page,
        };
      },
      processResults: function (data, params) {
        // parse the results into the format expected by Select2
        // since we are using custom formatting functions we do not need to
        // alter the remote JSON data, except to indicate that infinite
        // scrolling can be used
        params.page = params.page || 1;
        return {
          results: data.items,
          pagination: {
            more: (params.page * 30) < data.total_count
          }
        };
      },
      cache:true
    },
    escapeMarkup: function (markup) { return markup; }, 
    minimumInputLength: 1,
    templateResult:resultFormatResult,
    templateSelection:resultFormatSelection,
    containerCssClass:'select2-user',
  })
      // emit event on change.
      .on('change', function () {
        vm.$emit('input', this.value)
      })
  },
  watch: {
    value: function (value) {
      // update value
      $(this.$el).val(value)
    },
  },
  destroyed: function () {
    $(this.$el).off().select2('destroy')
  }
})

//video player------------------------------------
//for urllist auto play next part when a part playend
Vue.component('player',{
	props:['playurl','img','ind'],
	data:function(){
		return {cur:0}
	},
	template:'#video-template',
	mounted: function () {
		var myPlayer = videojs('my-video');
		var self = this;
    myPlayer.pause();
    myPlayer.poster(this.img);
    if (self.playurl.length>0){
      myPlayer.src({type: "video/mp4", src: this.playurl[self.cur]});
    }
    myPlayer.on('ended', function()
    { 
      self.cur++;
      if (self.cur<self.playurl.length){
        myPlayer.src({type: "video/mp4", src: self.playurl[self.cur]});
        myPlayer.play();
      }
      else{
        myPlayer.src({type: "video/mp4", src: self.playurl[0]});
      }
    });
  },
  watch:{
  	ind: function (value) {
			var myPlayer = videojs('my-video');
			this.cur = value;
	    myPlayer.pause();
	    myPlayer.src({type: "video/mp4", src: this.playurl[value]});
      myPlayer.play();
	    },
	  playurl: function (value) {
			var myPlayer = videojs('my-video');
			this.ind = 0;
			this.cur = 0;
			myPlayer.pause();
	    myPlayer.src({type: "video/mp4", src: value[0]});
	    },
	  img: function (value) {
			var myPlayer = videojs('my-video');
	    myPlayer.pause();
	    myPlayer.poster(this.img);
    	},
  },

})

//simple select
Vue.component('select2-simple', {
  props: ['options', 'value'],
  template: '#select2-template',
  mounted: function () {
    var vm = this
    $(this.$el)
      .val(this.value)
      // init select2
      .select2({ data: this.options, width: "60%" })
      // emit event on change.
      .on('change', function () {
        vm.$emit('input', this.value)
      })
  },
  watch: {
    value: function (value) {
      // update value
      $(this.$el).val(value)
    },
    options: function (options) {
      // update options
      var vm = this
      $(this.$el).select2({ data: options, width: "80%"}).on('change', function () {
        vm.$emit('input', this.value)
      })
    }
  },
  destroyed: function () {
    $(this.$el).off().select2('destroy')
  }
})

//-----main----------------------------------

//var host = 'http://123.207.26.140:8000/';
var host = 'http://127.0.0.1:8000/';
var app = new Vue({
	el:"#app",
	data:{
		sec:'font', //section selected
    slogan:'',
		items:[ 
			{ text:"刷日常", class:'glyphicon-home', href:"#font", event:'font', title:"欢迎光临"},
//			{ text:"博客", class:'glyphicon-user', href:"#blog", event:'blog', title:"主人写的一些文字"},
//			{ text:"照片", class:'glyphicon-camera', href:"#pic", event:'pic', title:"主人游山玩水拍下的PP"},
			{ text:"看视频", class:'glyphicon-film', href:"#video", event:'video', title:"不用广告就可以看优酷咯"},
			{ text:"找工作", class:'glyphicon-briefcase', href:"#work", event:'work', title:"主人要找工作"},
			{ text:"小工具", class:'glyphicon-file', href:"#proj", event:'proj', title:"主人业余写的一些奇怪工具"},
		], //sections 
//for zhihu part
		zhihuday:{ offset:0,content:[]},
		zhihumonth:{ offset:0,content:[]},
		zhihureco:{ offset:0,content:[]},
		zhihudaily:{ offset:0,content:[]},
    detailcontent:{ 
      title:'',
      author:'',
      content:'',
    },
//for bilibili part
    bilibiliday:{},
    bilibiliweek:{},

		blogs:[],
		pics:[],

		projs:[],
//for position section
		siteoptions:[
			{ id:'lagou', text:'拉勾'},
			{ id:'liepin', text:'猎聘'},
		],
		positionsite:'lagou',
		city:0,
		catagory:0,
		lagoucityoptions:[],
		liepincityoptions:[],
		positions:[], //initialize at created
		catagories:[
			{ id:'python',text:'python'},
			{ id:'爬虫', text:'爬虫'},
			{ id:'数据采集', text:'数据采集'},
		],

//for video section
		vid:'',
		vdata:[],
    vimg:'',
    playurl:[],
// {img,vid,video_urls:[{urls,mod,id,text},]}
		videotype:0, 
//0:no video; num:different video type, high quality or normal
		vindex:0,
//index of parts of video play urls
	},
	created:function(){
//initialize some data
// 1.position options
		var self = this;
    fetch(host+"slogan").then(function(response) {
      return response.json()
    }, function(error) {
      console.log(error)
    }).then(function(json) {
      self.slogan = json['text'];
    });
		fetch(host+this.positionsite+"/position").then(function(response) {
			return response.json()
		}, function(error) {
		  console.log(error)
		}).then(function(json) {
	    self.positions = json;
	  });
	  fetch(host+"lagou/citylist/").then(function(response) {
			return response.json()
		}, function(error) {
		  console.log(error)
		}).then(function(json) {
	    self.lagoucityoptions = json;
	  });
	  fetch(host+"liepin/citylist/").then(function(response) {
			return response.json()
		}, function(error) {
		  console.log(error)
		}).then(function(json) {
	    self.liepincityoptions = json;
	  });
		fetch(host+"zhihu/get_day/?offset="+self.zhihuday.offset.toString()).then(function(response) {
      return response.json()
    }, function(error) {
      console.log(error)
    }).then(function(json) {
      self.zhihuday.content = json;
      self.zhihuday.offset += 6;
    });
    fetch(host+"bilibili/get_day").then(function(response) {
      return response.json()
    }, function(error) {
      console.log(error)
    }).then(function(json) {
      self.bilibiliday = json;
    });
    setInterval(function(){
      fetch(host+"slogan").then(function(response) {
        return response.json()
      }, function(error) {
        console.log(error)
      }).then(function(json) {
        self.slogan = json['text'];
      });
    }, 10000)
	},
	watch:{
		vid:function(val){
			//  get play urls when select a video
			var self = this;
			var data;
			var url= host+'video/parse_website/?url='+ val;
			fetch(url).then(function(response) {
				return response.json()
			}, function(error) {
			  console.log(error)
			}).then(function(json) {
		    self.vdata = json;
		  });
		},
    videotype:function(val){
      if (val>0) {
        this.playurl = this.vdata.video_urls[val-1].urls;
        this.vimg = this.vdata.img;
      } 
      else {
        this.playurl = '';
        this.vimg = '';
      }
    }

	},
	methods:{
    refresh:function(){
      this.vid = '';
      this.vdata = [];
      this.videotype = 0;
      this.vindex = 0;
    },
		show:function(word){
			// section changer
			this.sec = word
		},
		remove: function (index,items){
            items.splice(index, 1)
          },
    removedict: function (index,items){
            delete items[index]
          },
		randomwork:function(){
			// random show position
			var self = this;
			var url = host+this.positionsite+"/position?";
			if (self.city){
				url = url + "city=" + self.city
			};
			if (self.catagory){
				url = url + "&catagory=" + self.catagory
			};
			fetch(url).then(function(response) {
				return response.json()
			}, function(error) {
			  console.log(error)
			}).then(function(json) {
		    self.positions = json;
		  })
		},
    zhihugetmonth:function(){
      var self = this;
      fetch(host+"zhihu/get_month/?offset="+self.zhihumonth.offset.toString()).then(function(response) {
      return response.json()
      }, function(error) {
        console.log(error)
      }).then(function(json) {
        self.zhihumonth.content = json;
        self.zhihumonth.offset += 6;
      });
    },
    zhihugetreco:function(){
      var self = this;
      fetch(host+"zhihu/get_reco/?offset="+self.zhihureco.offset.toString()).then(function(response) {
      return response.json()
      }, function(error) {
        console.log(error)
      }).then(function(json) {
        self.zhihureco.content = json;
        self.zhihureco.offset += 6;
      });
    },
    zhihugetdaily:function(){
      var self = this;
      fetch(host+"zhihu/get_daily/?offset="+self.zhihudaily.offset.toString()).then(function(response) {
      return response.json()
      }, function(error) {
        console.log(error)
      }).then(function(json) {
        self.zhihudaily.content = json;
        self.zhihudaily.offset += 6;
      });
    },
    zhihugetday:function(){
      var self = this;
      fetch(host+"zhihu/get_day/?offset="+self.zhihuday.offset.toString()).then(function(response) {
      return response.json()
      }, function(error) {
        console.log(error)
      }).then(function(json) {
        self.zhihuday.content = json;
        self.zhihuday.offset += 6;
      });
    },
    zhihugetcontent:function(aid){
      var self = this;
      fetch(host+"zhihu/get_content/?aid="+aid.toString()).then(function(response) {
      return response.json()
      }, function(error) {
        console.log(error)
      }).then(function(json) {
        self.detailcontent = json;
      });
    },
    bigetweek:function(aid){
      var self = this;
      fetch(host+"bilibili/get_week").then(function(response) {
        return response.json()
      }, function(error) {
        console.log(error)
      }).then(function(json) {
        self.bilibiliweek = json;
      });
    },
    vtypeselect:function(i){
      this.videotype = i
    },
    playpart:function(urls,i){
      this.vindex = i;
      this.playurl = urls
      var myPlayer = videojs('my-video');
      myPlayer.play();
    }
	},

});
