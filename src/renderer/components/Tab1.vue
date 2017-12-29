<template>
  <div>
    <Row>
      <Input v-model="key" placeholder='JsonObj:{"name":"Hello"}' size="large"></Input>
    </Row>
    <br>
    <Row>
    <Upload
        multiple
        type="drag"
        :show-upload-list="false"
        :before-upload="handleBeforeUpload"
        action="//jsonplaceholder.typicode.com/posts/">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>Click here to upload</p>
        </div>
    </Upload>        
    </Row>
    <br>
    <Row>
    <Button @click="exportFile" type="primary" shape="circle" style="float:right">
      <Icon type="forward"></Icon>
      <span>导出</span>
    </Button>
    </Row>
    <br>   
    <pre>
      {{code }}
    </pre>      
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
import _ from "lodash";

export default {
  name: "tab1",
  data() {
    return {
      key: '{"name":"Hello"}',
      code: ""
    };
  },
  created() {},
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    handleBeforeUpload(file) {
      let vm = this;
      try {
        let path = file.path;
        let key = vm.key;

        let replaceJson = JSON.parse(key);

        let content = ipcRenderer.sendSync("getContent", path);
        let text = _.template(content)(replaceJson);
        vm.code = text;
      } catch (e) {
        vm.$Message.error(e.message);
        return;
      }
    },
    exportFile() {
      let vm = this;
      if (_.isEmpty(vm.code)) {
        vm.$Message.error("请先上传模板");
        return false;
      }
      ipcRenderer.send("export", vm.code);
    }
  }  
}
</script>
