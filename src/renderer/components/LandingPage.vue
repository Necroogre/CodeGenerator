<template>
  <div id="wrapper">
    <Tabs value="name1">
        <TabPane label="单文件生成" name="name1" icon="android-person">
          <tab1></tab1>
        </TabPane>
        <TabPane label="批量生成" name="name2" icon="android-people">
          <tab2></tab2> 
        </TabPane>
    </Tabs>
  </div>
</template>

<script>
import tab1 from "./Tab1";
import tab2 from "./Tab2";

import { ipcRenderer } from "electron";
import _ from "lodash";

export default {
  name: "landing-page",
  components: { tab1, tab2 }
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
