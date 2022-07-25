<template>
    <div>
        <el-dialog title="" append-to-body :close-on-click-modal="false" :visible="showDialog" :width="dialogWidth"
                   @close="showDialog=false"
        >
            <div class="imgContent">
<!--                <img :src="imgsrc" v-if="showDialog" :style="{ transform: 'rotateZ(' + deg + 'deg)' }" alt="图片加载中...">-->
                <el-image :src="imgsrc" :style="{ transform: 'rotateZ(' + deg + 'deg)' }">
                    <div slot="placeholder" class="image-slot">
                        加载中...
                    </div>
                </el-image>
            </div>
            <div class="control-button hidden-md-and-down">
                <el-button-group>
                    <el-button size="large" icon="el-icon-refresh-left" circle @click="rotateleft"></el-button>
                    <el-button size="large" icon="el-icon-download" circle @click="roload"></el-button>
                    <el-button size="large" icon="el-icon-refresh-right" circle @click="rotateright"></el-button>
                </el-button-group>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const { body } = document
const WIDTH = 992

export default {
    components: {},
    data() {
        return {
            dialogWidth: '',
            imgsrc: '',
            mark: '',
            showDialog: false, // 新增修改对话框
            deg: 0 //旋转角度
        }
    },
    computed: {},
    methods: {
        // 新增 / 修改
        addOrUpdateHandle: function(imgsrc) {
            // 适配移动端
            const rect = body.getBoundingClientRect()
            // 移动端窗口宽度100% PC端宽度自适应
            this.dialogWidth = rect.width - 1 < WIDTH ? '100%' : ''

            // 重置旋转方向
            this.deg = 0
            this.imgsrc = imgsrc
            this.showDialog = true
        },
        addOrUpdateHandleAndLoad: function(imgsrc, mark) {
            this.imgsrc = imgsrc
            this.mark = mark
            this.showDialog = true
        },
        //图片旋转
        rotateleft() {
            this.deg -= 90
            if (this.deg >= 360 || this.deg < -360) {
                this.deg = 0
            }
        },
        rotateright() {
            this.deg += 90
            if (this.deg >= 360 || this.deg < -360) {
                this.deg = 0
            }
        },
        roload() {
            this.downloadIamge(this.imgsrc, this.mark)
        },
        downloadIamge(imgsrc, name) {//下载图片地址和图片名
            var image = new Image()
            // 解决跨域 Canvas 污染问题
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function() {
                var canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height
                var context = canvas.getContext('2d')
                context.drawImage(image, 0, 0, image.width, image.height)
                var url = canvas.toDataURL('image/png') //得到图片的base64编码数据

                var a = document.createElement('a') // 生成一个a元素
                var event = new MouseEvent('click') // 创建一个单击事件
                a.download = name || 'photo' // 设置图片名称
                a.href = url // 将生成的URL设置为a.href属性
                a.dispatchEvent(event) // 触发a的单击事件
            }
            image.src = imgsrc
        }
    }
}
</script>

<!--<style lang="css" scoped src="element-ui/lib/theme-chalk/display.css"></style>-->
<style lang="scss" scoped>
//图片外的div
.imgContent {
    width: 100%;
    text-align: center;

    img {
        width: 100%;
    }
}

.control-button {
    text-align: center;
    margin-top: 20px;
}
</style>
