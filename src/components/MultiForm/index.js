import React, { PureComponent } from 'react';
import { Form, Button, Row, Col, Icon, Modal, Card } from 'antd';
import { get, map, set, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import CreateForm from './CreateForm';
import { formTrim } from './_utils/form';
import styles from './index.module.less';

@Form.create()
class MultiLevelForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    formAttr: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.any.isRequired,
        dataSource: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
        defaultValue: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
        multi: PropTypes.bool,
        max: PropTypes.number,
        children: PropTypes.array,
        col: PropTypes.object,
        style: PropTypes.object,
        shouldRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
      })
    ),
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    cancelAction: PropTypes.element,
    submitAction: PropTypes.element,
    submitText: PropTypes.string,
    col: PropTypes.object,
  };

  static defaultProps = {
    data: {},
    formAttr: [],
    submitText: 'Submit',
    col: { xs: 24, sm: 12, md: 8 },
  };

  constructor(props) {
    super(props);

    this.keyObj = {};

    this.formKeys = {};

    this.formItemKeys = [];

    this.formItemKeysObj = {};

    this.handleAttr('setKey', props.data);
  }

  handleSubmit = e => {
    const { form, onSubmit } = this.props;

    e && e.preventDefault();

    if (document && document.activeElement){
      document.activeElement.blur();
    }
    
    const arr = isEmpty(this.formItemKeysObj) ? this.formItemKeys : this.formItemKeys.filter(k => this.getFormItemShow(k));

    form.validateFieldsAndScroll(arr, { scroll: { offsetTop: 100 } }, (err, values) => {
      // console.log('old', values);
      if (err) return;
      let newVales = isEmpty(this.formKeys) ? values : this.handleAttr('setValues', values);
      // console.log('new', newVales);
      newVales = formTrim(newVales);
      onSubmit && onSubmit(newVales);
    });
  };

  handleAttr(type = 'setKey', data) {
    const { formAttr } = this.props;

    const obj = {};

    const handleChildrenAttr = (rChildren, pKey, action) => {
      if (Array.isArray(rChildren)) {
        rChildren.forEach(item => {
          action(item, pKey);
        });
      } else {
        console.error('Children record should be Array');
      }
    };

    const handleAttrForm = (record, parentkey = '') => {
      if (!record) return;
      const { transformData } = record;
      const recordData = get(data, `${parentkey}[${record.key}]`);
      if (record.multi) {
        const attrKey = `formKey-${parentkey}-${record.key}-multiFormKey`;
        let recordKeyArr;

        if (type === 'setKey') {
          recordKeyArr = [];
          for (let i = 0; i < (recordData || []).length; i++) {
            recordData[i] && recordKeyArr.push(i);
          }
          recordKeyArr = recordKeyArr.length ? recordKeyArr : [0];
          this.keyObj[attrKey] = recordKeyArr.length - 1;
          obj[attrKey] = recordKeyArr;
        } else {
          recordKeyArr = this.getItemKeyValue(attrKey);

          let recordVals = get(data, `${parentkey}[${record.key}]`, []) || [];
          if (recordVals.length) {
            recordVals = recordVals.length > 1 ? recordVals.filter(item => item) : recordVals;
            const recordValsData = transformData && typeof transformData === 'function' ? map(recordVals, item => transformData(item)) : recordVals;
            set(data, `${parentkey}[${record.key}]`, recordValsData);
          }
        }
        recordKeyArr.forEach(ark => {
          record.children && handleChildrenAttr(record.children, `${parentkey}[${record.key}][${ark}]`, handleAttrForm);
        });
      } else if (record.children) {
        recordData &&
          type === 'setValues' &&
          transformData &&
          typeof transformData === 'function' &&
          set(data, `${parentkey}[${record.key}]`, transformData(recordData));
        handleChildrenAttr(record.children, `${parentkey}[${record.key}]`, handleAttrForm);
      }
    };

    formAttr.forEach(attr => handleAttrForm(attr, ''));
    if (type === 'setKey') {
      this.formKeys = obj;
      return obj;
    }
    return data;
  }

  addItem(itemkey) {
    const keys = this.formKeys[itemkey];
    const nextKeys = keys.concat(++this.keyObj[itemkey]);

    this.setItemKey({ [itemkey]: nextKeys });
  }

  removeItem(itemkey, value) {
    const keys = this.formKeys[itemkey];
    if (!keys.length) {
      return;
    }

    Modal.confirm({
      title: `Are you sure you want to delete "this module"?`,
      onOk: () => {
        this.setItemKey({ [itemkey]: keys.filter(key => key !== value) });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  setItemKey(obj) {
    this.formKeys = { ...this.formKeys, ...obj };
    this.forceUpdate();
  }

  getItemKeyValue(itemkey) {
    if (itemkey in this.keyObj) {
      const v = this.formKeys[itemkey];
      return v;
    }
    this.keyObj[itemkey] = 0;
    this.formKeys[itemkey] = [0];
    return [0];
  }

  getFieldKey = (key = '', pk) => (typeof key === 'function' ? key(pk) || '' : key).trim();

  getFormItem(record, parentkey = '', ark = null) {
    const { form, data, col: responsive } = this.props;
    const { getFieldDecorator } = form;
    const recordkey = `${parentkey}[${this.getFieldKey(record.key, parentkey)}]${ark !== null ? `[${ark}]` : ''}`;
    const getItem = (item, itemkey, itemParentkey) => {
      const { label, key, defaultValue, required, dataSource = [], style, shouldRender, onlyLabel, ...rest } = item;

      const col = item.col || responsive;

      let showItem = true;
      if (shouldRender !== undefined) {
        showItem = typeof shouldRender === 'function' ? shouldRender(itemkey, itemParentkey) : shouldRender;
      }

      if (!showItem) {
        return null;
      }

      if (onlyLabel) {
        return (
          <Col {...col} key={`col-label-${parentkey}-${item.key}`} style={style}>
            <div className={`${styles.onlyLabel} flex align-middle`}>{label}</div>
          </Col>
        );
      }

      const v = get(data, itemkey);
      const dv =
        typeof defaultValue === 'function'
          ? defaultValue(v, get(data, itemParentkey), itemParentkey)
          : v !== undefined && v !== null
          ? v
          : defaultValue;
      const dataSourceArr = typeof dataSource === 'function' ? dataSource(itemkey, itemParentkey) : dataSource;

      const ifRequired = typeof required === 'function' ? required(itemkey, itemParentkey) : required;


      this.formItemKeys.push(itemkey);

      return (
        <Col {...col} key={`col-${itemkey}`} style={style}>
          {/* item key : {itemkey} */}
          <CreateForm
            getFieldDecorator={getFieldDecorator}
            name={itemkey}
            parentkey={itemParentkey}
            label={label}
            dataSource={dataSourceArr}
            required={ifRequired}
            {...rest}
            defaultValue={dv}
          />
        </Col>
      );
    };
    const getRenderChildren = rec =>
      rec.children && (
        <Row type="flex" gutter={32}>
          {map(rec.children, item => this.getRenderForm(item, recordkey))}
        </Row>
      );
    if (record.children) {
      return getRenderChildren(record);
    }
    return getItem(record, recordkey, parentkey);
  }

  getDelBtn({ itemkey, value }) {
    return (
      <a
        onClick={() => {
          this.removeItem(itemkey, value);
        }}
      >
        <Icon type="delete" />
        Delete
      </a>
    );
  }

  getAddBtn({ attrKey, label, props = {} }) {
    return (
      <Button
        type="primary"
        ghost
        onClick={() => {
          this.addItem(attrKey);
        }}
        className="btn-form"
        {...props}
      >
        <Icon type="plus" />
        {label}
      </Button>
    );
  }

  getRenderForm(record, parentkey = '') {
    if (!record) return null;
    const recordkey = this.getFieldKey(record.key, parentkey);
    const { max, min = 0, multi, cardProps = {}, buttonProps } = record;
    if (multi) {
      const attrKey = `formKey-${parentkey}-${recordkey}-multiFormKey`;
      const attrKeyArr = this.getItemKeyValue(attrKey);
      const rend = map(attrKeyArr, (ark, index) => (
        <Col span={24} key={`${parentkey}${ark}-${recordkey}`}>
          <Card
            title={`${record.label} ${index + 1}`}
            type="inner"
            style={{ marginBottom: 24 }}
            extra={attrKeyArr.length > min ? this.getDelBtn({ itemkey: attrKey, value: ark }) : null}
            bodyStyle={{ paddingBottom: 0 }}
            {...cardProps}
          >
            {this.getFormItem(record, parentkey, ark)}
          </Card>
        </Col>
      ));
      const add = (
        <Col span={24} key={`${parentkey}-${recordkey}-addbtn`}>
          <div className="text-center" style={{ marginBottom: 24 }}>
            {this.getAddBtn({ attrKey, label: record.label, props: buttonProps })}
          </div>
        </Col>
      );
      if (max && !(attrKeyArr.length < max)) {
        return rend;
      }
      rend.push(add);
      return rend;
    }
    if (record.children) {
      return (
        <Col span={24} key={`${parentkey}-${recordkey}-card`}>
          <Card title={record.label} type="inner" style={{ marginBottom: 24 }} bodyStyle={{ paddingBottom: 0 }}>
            {this.getFormItem(record, parentkey)}
          </Card>
        </Col>
      );
    }
    if (record.type === 'block') {
      return <Col span={24} key={`block-${parentkey}`} />;
    }
    return this.getFormItem(record, parentkey);
  }

  setFieldsValue = values => {
    this.props.form.setFieldsValue(values);
  };

  setFields = obj => {
    this.props.form.setFields(obj);
  };

  getFieldsValue = f => this.props.form.getFieldsValue(f);

  getFieldValue = s => s && this.props.form.getFieldValue(s);

  validateFields = s => s && this.props.form.validateFields(s);

  getFormKeys = () => this.formItemKeys;

  setFormItemShow = v => {
    this.formItemKeysObj = { ...this.formItemKeysObj, ...v };
  };

  getFormItemShow = key => {
    if (key in this.formItemKeysObj) {
      return this.formItemKeysObj[key];
    }
    return true;
  };

  render() {
    console.log('multi render');
    const { loading, formAttr, submitAction, cancelAction, submitText } = this.props;
    this.formItemKeys = [];
    const formSubmitAction =
      'submitAction' in this.props ? (
        submitAction
      ) : (
        <Button htmlType="submit" type="primary" className="btn-form" loading={loading}>
          {submitText}
        </Button>
      );
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={32}>
          {map(formAttr, (attr, index) => this.getRenderForm(attr, '', index))}
        </Row>
        <div className={styles.formAction}>
          {formSubmitAction}
          {cancelAction}
        </div>
      </Form>
    );
  }
}

export default MultiLevelForm;
