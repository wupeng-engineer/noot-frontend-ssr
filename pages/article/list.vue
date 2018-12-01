<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                            <Form-item label="分类" prop="category">
                                <Select v-model="searchForm.category" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="blog">博客</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="语言" prop="language">
                                <Select v-model="searchForm.language" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="zh">简体</Option>
                                  <Option value="tw">繁体</Option>
                                  <Option value="en">英文</Option>
                                </Select>
                            </Form-item>
                            <Button @click="handleReset" >重置</Button>
                            <Button type="primary" @click="getArticleList" >搜索</Button>
                            <Button style="float: right" type="warning" @click="addArticle" >新建</Button>
                        </Form>
                    </Row>
                    <Row>
                        <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" ref="table"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import circleLoading from "~/components/circle-loading.vue";
import constant from '~/libs/constant';
export default {
    layout: 'common',
  name: "user-manage",
  components: {
    circleLoading,
  },
  data() {
    return {
      loading: true,
      searchForm: {
        category: "blog",
        language: "zh",
        pageNumber: 1,
        pageSize: 10,
      },
      submitLoading: false,
      columns: [{
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        }, {
          title: "ID",
          key: "id",
          width: 80,
          align: "center",
          fixed: "left"
        }, {
            title: "分类",
            key: "category",
            width: 145,
            render: (h, params) => {
                return h("div", { }, constant.categoryValueMapping[params.row.category])
            }
        }, {
            title: "语言",
            key: "language",
            width: 80,
            align: "center",
            render: (h, params) => {
                return h("div", { }, constant.languageValueMapping[params.row.language])
            }
        }, {
          title: "标题",
          key: "title",
          width: 400,
          align: "center",
        }, {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row.id);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.row);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
        }
      ],
      data: [],
      exportData: [],
      total: 0
    };
  },
  methods: {
    init() {
      this.getArticleList();
    },
    addArticle() {
        this.$router.push({ path: '/article/0'})
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getArticleList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getArticleList();
    },
    getArticleList() {
      // 多条件搜索用户列表
      this.loading = true;
      this.$axios.api.articleList({
          category_name: `${this.searchForm.category}:${this.searchForm.language}`
      }).then(res => {
        this.loading = false;
        if (res.result ===  'Y') {
            const result = [];
            res.data.forEach(item => {
                const tmp = item.category_name.split(':')
                result.push({
                    id: item.article_id,
                    title: item.title,
                    category: tmp[0],
                    language: tmp[1]
                })
            })
            this.data = result;
            this.total = Number(res.count);
        }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getArticleList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.selectDep = [];
      this.searchForm.departmentId = "";
      // 重新加载数据
      this.getArticleList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getArticleList();
    },
    edit(id) {
        this.$router.push({
            path: '/article/' + id,
        });
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除用户 " + v.title + " ?",
        onOk: () => {
          this.operationLoading = true;
          deleteUser(v.id).then(res => {
            this.operationLoading = false;
            if (res.result ===  'Y') {
              this.$Message.success("删除成功");
              this.getArticleList();
            }
          });
        }
      });
    },
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
</style>
