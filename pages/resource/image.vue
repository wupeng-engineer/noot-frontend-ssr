<template>
    <Card>
        <Row>
            <Col>
                 <Upload
                    :before-upload="handleUpload"
                    action="//jsonplaceholder.typicode.com/posts/">
                    <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
                </Upload>
                <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>
            </Col>
        </Row>
        <Row :gutter="16">
            <Col span="6" v-for="item in list" :key="item.id" style="margin-top: 10px">
                <Card>
                    <div style="text-align:center">
                        <img src="https://icarusion.gitee.io/iview/2ecd3b0452aa197097d5131afacab7b8.png">
                        <Row>
                            <Col span="12"><Button type="default" shape="circle" icon="ios-link">复制链接</Button></Col>
                            <Col span="12"><Button type="error" shape="circle" icon="ios-bug">删除</Button></Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col span="12" offset="8"><Page :total="100" show-total style="margin-top: 40px"/></Col>
        </Row>
    </Card>
</template>

<script>
import circleLoading from "~/components/circle-loading.vue";
export default {
    data() {
        return {
            list: ['', '', '', '', ''],
        }
    },
    layout: 'common',
    name: "home",
    components: {
        circleLoading,
    },
};
</script>
<style lang="less" scoped>
</style>
