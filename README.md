### 此方案已弃用

**弃用原因：**

渲染大表单时会卡顿。增加表单项过多会卡顿。
此方案当时设计时，增加及删除表单项是强制整个表单重新渲染，考虑欠佳。

项目中已使用 rc-field-form 重新封装。

> rc-field-form 采用增量更新方式，性能比 rc-form 提升很多，提供了 List 组件自带增加删除表单项，仍要考虑避免不必要的更新。
> 参考 antd 源码和 rc-field-form。

---

### react multi-level form

用到了Ant Design 的 Form组件、布局组件、表单控件 ，如果没有使用Ant Design，可以用rc-form代替，并对组件中使用的表单控件和布局进行替换。

参考了官网的示例：动态增减表单项 https://ant.design/components/form-cn/#components-form-demo-dynamic-form-item

The form component uses the Ant-design's `Form` component. You can use `rc-form` instead.
