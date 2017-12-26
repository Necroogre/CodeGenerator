# CodeGenerator

### 原因

新项目出现，定好整体代码结构风格后，接踵而至的就是茫茫多的复制，粘贴，然后替换某些名字；CodeGenerator的出现就是为了优化这些繁琐的操作(｀・ω・´)

### 使用

预先整理一个模板文件，把需要替换的地方用 <#= name#>写好,如下

```
public class <%=name%>{
    public string <%=property%>;
}
```

在input中输入Json字符串,如

```json
{"name":"Hello","property":"Human"}
```

上传模板文件，生成对应替换后的代码

```c#
public class Hello{
    public string Human;
}
```

### 须知

- 模板语法来自lodash
- 基于electron-vue开发
- UI用的iView