<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Alert type="warning">请按照表格字段位置上传excel文件  注意：违约时间的格式为:年-月-日</Alert>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                            <Form-item label="姓名" prop="realname">
                              <Input type="text" v-model="searchForm.realname" clearable placeholder="请输入用户名" style="width: 150px"/>
                            </Form-item>
                            <Form-item label="身份证号" prop="idcard">
                              <Input type="text" v-model="searchForm.idcard" placeholder="输入身份证号" style="width: 350px"/>
                            </Form-item>
                            <Form-item label="电话号码" prop="phone">
                              <Input type="text" v-model="searchForm.phone" clearable placeholder="请输入手机号" style="width: 200px"/>
                            </Form-item>
                            <Form-item style="margin-left:-35px;" class="br">
                              <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                        <Upload :action="this.$store.state.app.uploadUrl"
                          :headers="{Authorization: `bearer ${this.$store.state.user.token}`}" 
                          :on-success="handleSuccess"
                          :on-error="handleError"
                          :format="['xlsx']"
                          :before-upload="handleBeforeUpload"
                          :max-size="512000000"
                          :on-format-error="handleFormatError"
                          :on-exceeded-size="handleMaxSize"
                          ref="up"
                          class="upload">
                            <Button icon="ios-cloud-upload-outline">数据上传</Button>
                        </Upload>
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

export default {
    layout: 'permission',
  name: "user-manage",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    const validatephone = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      accessToken: {},
      loading: false,
      operationLoading: false,
      modalExportAll: false,
      searchKey: "",
      searchForm: {
        realname: "",
        departmentId: "",
        phone: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "created_at",
        order: "desc",
        startDate: "",
        endDate: ""
      },
      modalType: 0,
      submitLoading: false,
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "姓名",
          key: "realname",
          width: 100,
          sortable: true,
          fixed: "left"
        },
        {
          title: "身份证",
          key: "idcard",
          fixed: "left",
          width: 250
        },
        {
          title: "违约金额",
          key: "money",
          width: 100,
        },
        {
          title: "违约时间",
          key: "discredit_date",
          sortType: "desc",
          width: 200
        },
        {
          title: "数据提供者",
          key: "create_username",
          sortType: "desc",
          width: 100
        },
      ],
      data: [],
      exportData: [],
      total: 0
    };
  },
  methods: {
    initDepartmentData() {
      this.$axios.api.initDepartment().then(res => {
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.value = e.id;
              e.label = e.title;
              e.loading = false;
              e.children = [];
            } else {
              e.value = e.id;
              e.label = e.title;
            }
            if (e.status === -1) {
              e.label = "[已禁用] " + e.label;
              e.disabled = true;
            }
          });
          this.department = res.data;
        }
      });
    },
    initDepartmentTreeData() {
      this.$axios.api.initDepartment().then(res => {
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          this.dataDep = res.data;
        }
      });
    },
    loadData(item, callback) {
      item.loading = true;
      this.$axios.api.loadDepartment(item.value).then(res => {
        item.loading = false;
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.value = e.id;
              e.label = e.title;
              e.loading = false;
              e.children = [];
            } else {
              e.value = e.id;
              e.label = e.title;
            }
            if (e.status === -1) {
              e.label = "[已禁用] " + e.label;
              e.disabled = true;
            }
          });
          item.children = res.data;
          callback();
        }
      });
    },
    loadDataTree(item, callback) {
      this.$axios.api.loadDepartment(item.id).then(res => {
        if (res.message ===  'success') {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
            if (e.status === -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.data);
        }
      });
    },
    selectTree(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] === null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);
        this.userForm.departmentId = data.id;
        this.userForm.departmentTitle = data.title;
      }
    },
    clearSelectDep() {
      this.userForm.departmentId = "";
      this.userForm.departmentTitle = "";
    },
    handleChangeDep(value, selectedData) {
      // 获取最后一个值
      if (value && value.length > 0) {
        this.searchForm.departmentId = value[value.length - 1];
      } else {
        this.searchForm.departmentId = "";
      }
    },
    handleChangeUserFormDep(value, selectedData) {
      // 获取最后一个值
      if (value && value.length > 0) {
        this.userForm.departmentId = value[value.length - 1];
      } else {
        this.userForm.departmentId = "";
      }
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getUserList(false, false);
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserList(false, false);
    },
    getUserList(needRecord, showResult) {
      if (!this.searchForm.realname && !this.searchForm.phone && !this.searchForm.idcard) {
          this.$Message.error('请输入搜索条件');
          return;
      }
      // 多条件搜索用户列表
      this.loading = true;
      this.$axios.api.userRecordList({
          page: this.searchForm.pageNumber,
          pageSize: this.searchForm.pageSize,
          realname: this.searchForm.realname,
          idcard: this.searchForm.idcard,
          phone: this.searchForm.phone,
          needRecord,
      }).then(res => {
        this.loading = false;
        if (res.message ===  'success') {
          this.data = res.data.list;
          this.total = res.data.total;
          if (showResult && res.data.list.length) {
            this.$Message.success(`搜索成功, 剩余积分: ${res.data.record}`);
          }
        }
        
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getUserList(true, true);
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
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getUserList();
    },
    getRoleList() {
      this.$axios.api.getAllRoleList().then(res => {
        if (res.message ===  'success') {
          this.roleList = res.data;
        }
      });
    },
    handleDropdown(name) {
      if (name === "refresh") {
        this.getUserList();
      }
    },
    cancelUser() {
      this.userModalVisible = false;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "不支持的文件格式",
        desc:
          "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .xlsx格式文件"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件大小过大",
        desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
      });
    },
    handleSuccess(res, file) {
    if (res.message ===  'success') {
        file.url = res.data;
        this.$Message.success(`成功上传${res.data}条数据`);
    } else {
        this.$Message.error(res.message);
    }
    },
    handleError(error, file, fileList) {
      this.$Message.error(error.toString());
    },
    handleBeforeUpload() {
        let flag = false;
        this.$store.state.user.whiteApiList.forEach(item => {
            if (this.$store.state.app.uploadUrl.indexOf(item.url) && item.method === 'POST') {
                flag = true;
            }
        });
        if (!flag) {
            this.$Message.error('无此功能权限, 请联系管理员开通')
        }
        return flag;
    }
  },
};
</script>
<style lang="less" scoped>
.search {
    .operation {
        margin-bottom: 2vh;
    }
    .select-count {
        font-size: 13px;
        font-weight: 600;
        color: #40a9ff;
    }
    .select-clear {
        margin-left: 10px;
    }
    .page{
        margin-top: 2vh;
    }
    .drop-down{
        font-size: 13px;
        margin-left: 5px;
    }
}

.upload {
    margin-top: 10px;
}

.ivu-poptip {
    display: inline-block;
    width: 100%;
}

.ivu-poptip-rel {
    display: inline-block;
    position: relative;
    width: 100%;
}

.tree-bar {
    max-height: 500px;
    overflow: auto;
    margin-top: 5px;
}

.tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
}
</style>
