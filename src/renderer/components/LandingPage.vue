<template>
  <div id="wrapper">
    <Row>
      <Input v-model="key" placeholder='JsonObj:{"name":"Hello"}'></Input>
    </Row>
    <br>
    <Row>
    <Upload
        multiple
        type="drag"
        :before-upload="handleBeforeUpload"
        action="//jsonplaceholder.typicode.com/posts/">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>Click here to upload</p>
        </div>
    </Upload>        
    </Row>
    <br>
    <pre>
      {{code }}
    </pre>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import { ipcRenderer } from "electron";
import _ from "lodash";

export default {
  name: "landing-page",
  data() {
    return {
      tmpls: [{ text: "moban1" }, { text: "moban2" }],
      checkedNames: [],
      key: '{"name":"Hello"}',
      code: ""
    };
  },
  created() {},
  components: { SystemInformation },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    handleBeforeUpload(file) {
      let vm = this;
      let path = file.path;
      let key = vm.key;
      let replaceJson = "";
      try {
        replaceJson = JSON.parse(key);
      } catch (e) {
        vm.$Message.error(e.message);
        return;
      }
      let content = ipcRenderer.sendSync("getContent", path);
      let text = _.template(content)(replaceJson);
      vm.code = text;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}
pre {
  border: #ddd 1px solid;
  padding: 5px;
}
#wrapper {
  padding: 60px 80px;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}
</style>
