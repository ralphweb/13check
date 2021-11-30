<template>
    <div>
        <video playsinline ref="videoPlayer" class="video-js" :muted="muted" autoplay="false" :controls="controls" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></video>
    </div>
</template>

<script>
import moment from 'moment';
import videojs from 'video.js';
import axios from "axios";

export default {
    name: "VideoPlayer",
    props: {
        muted: {
            type: Boolean,
            default: true
        },
        controls: {
            type: Boolean,
            default: false
        },
        live: Boolean,
        ip: String,
        time: Number,
        options: {
            type: Object,
            default() {
                return {};
            }
        },
        url: {
            type: String,
            default: null
        },
    },
    data() {
        return {
            loading: false,
            player: null,
            currentFile: null,
            currentStart: null,
            currentEnd: null,
            localTime: null,
            diff: 0,
            isLive: false
        }
    },
    computed: {
        play: {
            get() {
                return this.$store.state.play;
            },
            set(value) {
                this.$store.commit('SET_PLAY', value);
            }
        }
    },
    mounted() {
        var that = this;
        that.player = videojs(that.$refs.videoPlayer, that.options, function onPlayerReady() {
            that.createPlayer();
        })
        that.player.on('play', function(){
            console.log("play");
            that.play = true;
        });
        that.player.on('pause', function(){
            console.log("pause");
            that.play = false;
        });
    },
    methods: {
        createPlayer() {
            let that = this;
            let now = moment();
            let query = moment(that.time);
            if(that.url) {
                that.player.src({
                    type: "video/mp4",
                    src: that.url
                });
            } else {
                if(!that.live&&now.diff(query,'minutes')>15) {
                    that.isLive = false;
                    if(!that.loading&&(that.currentFile==null||query.isBefore(that.currentStart)||query.isAfter(that.currentEnd))) {
                        that.loading = true;
                        that.localTime = that.time;
                        axios
                            .get('https://13checkqa.ingenieriac13.cl/vod/video/'+that.ip+'/'+query.format('YYYY-MM-DD[_]HH-mm-ss'))
                            .then((response) => {
                                that.loading = false;
                                console.log(response);
                                that.currentFile = response.data.path;
                                that.currentStart = response.data.timestampStart;
                                that.currentEnd = response.data.timestampEnd;
                                that.diff = response.data.diff;
                            })
                    } else {
                        let localDiff = ((that.diff*1000)+moment(that.time).diff(that.localTime))/1000;
                        console.log("moving cursor",localDiff);
                        if(!that.play) that.player.currentTime(localDiff);
                    }
                } else if(that.live&&that.player!=null&&!that.isLive) {
                    that.isLive = true;
                    that.player.src({
                        withCredentials: false,
                        type: "application/x-mpegURL",
                        src: "https://13checkqa.ingenieriac13.cl/stream/"+that.ip+"/index.m3u8"
                    });
                }
            }
        }
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    },
    watch: {
        ip: {
            immediate: true,
            handler(newIp) {
                let that = this;
                that.isLive = false;
                if(newIp!=null&&that.player!=null) {
                    that.createPlayer();
                }
            }
        },
        play: {
            immediate: true,
            handler(newPlay) {
                let that = this;
                if(that.player) {
                    if(newPlay) {
                        that.player.play();
                    } else {
                        that.player.pause();
                    }
                }
            }
        },
        live: {
            immediate: true,
            handler(isLive) {
                let that = this;
                if(that.player) {
                    if(isLive) {
                        that.isLive = true;
                        that.currentFile = null;
                        that.player.src({
                            withCredentials: false,
                            type: "application/x-mpegURL",
                            src: "https://13checkqa.ingenieriac13.cl/stream/"+that.ip+"/index.m3u8"
                        });
                    }
                }
            }
        },
        time: {
            immediate: true,
            handler(newTime) {
                let that = this;
                that.createPlayer();
            }
        },
        currentFile: {
            immediate: true,
            handler(newFile) {
                let that = this;
                if(newFile&&that.player!=null) {
                    that.player.src({
                        type: "video/mp4",
                        src: "https://13checkqa.ingenieriac13.cl/vod/getvideo/"+that.ip+"/"+encodeURIComponent(newFile)
                    });
                    that.player.on('loadedmetadata', function(){
                        this.currentTime(that.diff);
                        this.pause();
                    });
                } else {
                    
                }
            }
        }
    }
}
</script>
