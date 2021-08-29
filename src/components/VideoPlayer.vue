<template>
    <div>
        <video ref="videoPlayer" class="video-js" :muted="muted" autoplay="false"></video>
    </div>
</template>

<script>
import moment from 'moment';
import videojs from 'video.js';
import axios from "axios";

export default {
    name: "VideoPlayer",
    props: {
        muted: Boolean,
        live: Boolean,
        ip: String,
        time: Number,
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
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
        },
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
            if(!that.live&&now.diff(query,'minutes')>15) {
                that.isLive = false;
                if(that.currentFile==null||query.isBefore(that.currentStart)||query.isAfter(that.currentEnd)) {
                    that.localTime = that.time;
                    axios
                        .get('http://'+that.ip+':7900/video/'+query.format('YYYY-MM-DD[_]HH-mm-ss'))
                        .then((response) => {
                            console.log(response);
                            that.currentFile = response.data.path;
                            that.currentStart = response.data.timestampStart;
                            that.currentEnd = response.data.timestampEnd;
                            that.diff = response.data.diff;
                        })
                }
            } else if(that.live&&that.player!=null&&!that.isLive) {
                that.isLive = true;
                that.player.src({
                    withCredentials: false,
                    type: "application/x-mpegURL",
                    src: "http://"+that.ip+":8000/hls_1080p/stream/index.m3u8"
                });
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
                if(that.player!=null) {
                    that.player.src({
                        type: "video/mp4",
                        src: "http://"+that.ip+":7900/getvideo/"+encodeURIComponent(newFile)
                    });
                    that.player.on('loadedmetadata', function(){
                        this.currentTime(that.diff);
                        this.pause();
                    });
                }
            }
        }
    }
}
</script>