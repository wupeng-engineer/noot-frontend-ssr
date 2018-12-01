<template>
<!-- advanced -->
    <Row>
        <Col>
            <Card>
                <Row>
                    <Form ref="searchForm" :model="condition" inline :label-width="70" class="search-form">
                        <Form-item label="分类" prop="category">
                            <Select v-model="condition.category" placeholder="请选择" clearable style="width: 200px">
                              <Option value="blog">博客</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="语言" prop="language">
                            <Select v-model="condition.language" placeholder="请选择" clearable style="width: 200px">
                              <Option value="zh">简体</Option>
                              <Option value="tw">繁体</Option>
                              <Option value="en">英文</Option>
                            </Select>
                        </Form-item>
                        <Button :loading="loading" style="float: right" type="warning" @click="createOrUpdateArticle" >保存</Button>
                    </Form>
                </Row>
            </Card>
            <Card>
                <codemirror
                    :value="code"
                    :options="this.options"
                    ref="myEditor"
                    @change="editorChange">
                </codemirror>
            </Card>
        </Col>
    </Row>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/vue/vue')

  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/javascript-hint.js')
export default {
    components: {
        codemirror
    },
    layout: 'common',
    name: 'editor',
    data () {
        return {
            loading: false,
            id: 0,
            code: '',
            options: {
                tabSize: 2,
                mode: {
                    name: 'javascript',
                    json: true,
                },
                lineNumbers: true,
                line: true,
                highlightDifferences: true
            },
            condition: {
                category: '',
                language: ''
            }
        }
    },
    methods: {
        editorChange(value) {
            this.code = value;
        },
        createOrUpdateArticle() {
            if (!this.condition.category || !this.condition.language) {
                this.$Message.error('语言和分类不能为空');
                return;
            }
            try {
                const tmp = JSON.parse(this.code);
            } catch(e) {
                console.log(e);
                this.$Message.error('JSON格式错误');
                return;
            }
            this.loading = true;
            this.$axios.api.createOrUpdateArticle({
                aritcle_id: this.id,
                category_name: `${this.condition.category}:${this.condition.language}`,
                title: JSON.parse(this.code).title || '',
                content: this.code
            }).then(res => {
                this.loading = false;
                if (res.result === 'Y') {
                    this.$Message.success('保存成功');
                    this.$router.push({ path: '/article/list' })
                }
            })
        }
    },
    computed: {
        editor() {
            return this.$refs.myEditor.editor
        }
    },
    mounted() {
        const id = this.$route.params.editor
        if (id) {
            this.id = id;
        }
    }
}
</script>
<style lang="less">
    .CodeMirror {
        min-height: 500px;
    }
</style>


