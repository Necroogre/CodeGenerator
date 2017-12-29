<template>
  <div>
    <Card>
      <div slot="title">
        <Button icon="plus" @click="addRow"></Button>
      </div>
      <div slot="extra">
        <Button icon="ios-redo" type="primary" @click="doIt">Let's do it</Button>
      </div>
      <ul>
        <li v-for="(list,index) in lists" :key="index">
          <Row type="flex" :gutter="16">
            <Col span="7">
            <Input type="text" v-model="list.path">
            <span slot="prepend">模板路径</span>
            </Input>            
            </Col>
            <Col span="7">
            <Input type="text" v-model="list.keyword">
            <span slot="prepend">变量</span>
            </Input>           
            </Col>
            <Col span="7">
            <Input type="text" v-model="list.exportPath">
            <span slot="prepend">导出路径</span>
            </Input>           
            </Col>
            <Col span="3">
            <Button type="error" icon="trash-b" @click="removeRow(index)"></Button>
            </Col>            
          </Row>
          <br>  
        </li>
      </ul>
    </Card>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
import _ from "lodash";

export default {
  name: "tab2",
  data() {
    return {
      lists: [
        {
          path: "D:/test.tmpl",
          keyword: '{ "name": "HelloWorld" }',
          exportPath: "D:/test.js"
        }
      ]
    };
  },
  created() {
    let vm = this;
    var dataString = ipcRenderer.sendSync("getData", "");
    var data = JSON.parse(dataString);
    if (!_.isEmpty(data)) vm.lists = data;
    
    ipcRenderer.on("batch-export-reply", (event, arg) => {
      vm.$Message.info(arg);
    });
    ipcRenderer.on("error", (event, arg) => {
      vm.$Message.error(arg);
    });
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    addRow: function() {
      if (_.isEmpty(this.lists)) {
        this.lists.push({ path: "", keyword: "", exportPath: "" });
      } else {
        this.lists.push(_.clone(_.last(this.lists)));
      }
    },
    doIt: function() {
      var vm = this;
      ipcRenderer.send("batch-export", vm.lists);

      vm.checker().then(value => {});
    },
    checker: function() {
      let vm = this;
      return new Promise((resolve, reject) => {
        _.each(vm.lists, function(x) {
          try {
            JSON.parse(x.keyword);
          } catch (error) {
            vm.$Message.error(error.message);
            return false;
          }
        });
      });
      resolve();
    },
    removeRow: function(index) {
      this.lists.splice(index, 1);
    }
  }
};
</script>

<style scoped>

</style>
