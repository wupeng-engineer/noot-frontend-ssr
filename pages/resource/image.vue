<template>
    <Card>
        <Row>
            <Col>
                 <Upload :action="this.$store.state.app.uploadUrl"
                          :on-success="handleSuccess"
                          :on-error="handleError"
                          :format="['jpg', 'png', 'jpeg']"
                          :before-upload="handleBeforeUpload"
                          :max-size="512000000"
                          :on-format-error="handleFormatError"
                          :on-exceeded-size="handleMaxSize"
                          :with-credentials=true
                          name="image"
                          ref="up"
                          class="upload">
                            <Button icon="ios-cloud-upload-outline">数据上传</Button>
                        </Upload>
            </Col>
        </Row>
        <Row :gutter="16">
            <Col span="4" v-for="item in list" :key="item.id" style="margin-top: 10px">
                <Card>
                    <div>
                        <div class="image-wrap" :style="`background: url(${item.url_path}) no-repeat`"/>
                        <Row>
                            <Col span="12" offset="4">
                                <Button
                                    type="default"
                                    shape="circle"
                                    icon="ios-link"
                                    @click="copyLink(item.url_path)"
                                    size="small"
                                >
                                    复制链接
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12" offset="6"><Page :total="this.total" @on-change="this.pageChange" show-total style="margin-top: 40px"/></Col>
        </Row>
        <Spin size="large" fix v-if="loading"></Spin>
    </Card>
</template>

<script>
import circleLoading from "~/components/circle-loading.vue";
export default {
    data() {
        return {
            list: ['', '', '', '', ''],
            list: [],
            total: 0,
            pageNumber: 1,
            loading: true
        }
    },
    layout: 'common',
    name: "home",
    components: {
        circleLoading,
    },
    methods: {
        getImagesList() {
            this.loading= true;
            this.$axios.api.imageList({
                limit: 20,
                offset: (this.pageNumber - 1) * 20
            }).then(res => {
                if (res.result === 'Y') {
                    this.total = Number(res.count);
                    this.list = res.data;
                }
                this.loading = false;
            }).catch(err => {
                console.log(err);
                this.loading = true;
            })
        },
        copyLink(url) {
            const copyContainer = document.createElement('input');
            copyContainer.value = url; 
            document.body.appendChild(copyContainer);
            copyContainer.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            this.$Message.success('复制成功');
        },
        pageChange(value) {
            this.pageNumber = Number(value);
            this.getImagesList();
        },
        handleBeforeUpload() {
            return true;
        },
        handleFormatError(file) {
          this.$Notice.warning({
            title: "不支持的文件格式",
            desc:
              "所选文件‘ " +
              file.name +
              " ’格式不正确, 请选择正确格式图片"
          });
        },
        handleMaxSize(file) {
          this.$Notice.warning({
            title: "文件大小过大",
            desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
          });
        },
        handleSuccess(res, file) {
            if (res.result ===  'Y') {
                file.url = res.data;
                this.getImagesList();
                this.$Message.success(`成功上传`);
            } else {
                this.$Message.error(`文件大小或格式错误`);
            }
        },
        handleError(error, file, fileList) {
          this.$Message.error(error.toString());
        },
    },
    mounted() {
        this.getImagesList();
    }
};
</script>
<style lang="less" scoped>
    .image-wrap {
        height: 150px;
        width: 100%;
        background-size:100% 100% !important;
    }
</style>
