import React from 'react';
import { Form, Radio, Checkbox, Input, Select, InputNumber } from 'antd';
import PropTypes from 'prop-types';
import { isNaN } from 'lodash';

const Textarea = Input.TextArea;

const FormItem = Form.Item;
const { Option } = Select;
// const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const getDv = defaultValue => {
  if (defaultValue && typeof defaultValue === 'string') {
    const v = Number(defaultValue);
    if (!isNaN(v)) {
      return v;
    }
  }
  return defaultValue;
};

const CreateForm = props => {
  const {
    getFieldDecorator,
    required,
    message,
    name,
    label,
    dataSource,
    formProps,
    fieldProps,
    showItem,
    custom,
    component,
    disabled,
    parentkey,
  } = props;

  let { placeholder, rules, type='text', defaultValue } = props;

  const key = name;
  placeholder = placeholder || label;

  type = type.toLowerCase();

  const myrule = [{ required, message: 'This field is required' }];

  if (defaultValue === null) {
    defaultValue = undefined;
  }

  if ((type === 'text' || type === 'email' || type === 'textarea' || type === 'url') && !custom) {
    // myrule[0].transform = v => `${v || ''}`.trim();
  }

  const setRule = (v, msg, obj = {}) => {
    obj.type = v;
    obj.message = message || msg;
    myrule.push(obj);
  };

  const createField = () => {
    let field;
    const commonProp = {
      parentkey,
      name,
      ...fieldProps,
    };
    const textItem = <Input type="text" placeholder={placeholder} {...commonProp} />;

    if (custom) {
      field = component ? React.cloneElement(component, commonProp) : <span>{defaultValue}</span>;
    } else if (disabled) {
      field = <span>{defaultValue}</span>;
    } else {
      switch (type) {
        case 'email':
          setRule('email', 'This field is not a valid email');
          field = textItem;
          break;

        case 'text':
          field = textItem;
          break;

        case 'textarea':
          field = <Textarea rows={3} {...commonProp} />;
          break;

        case 'select':
          field = (
            <Select placeholder={placeholder} allowClear showSearch {...commonProp}>
              {!!dataSource.length &&
                dataSource.map(opt => (
                  <Option key={opt.key} value={opt.key}>
                    {opt.label || opt.kye}
                  </Option>
                ))}
            </Select>
          );
          break;

        // case 'date':
        //   field = <DatePicker {...fieldProps} />;
        //   break;

        // case 'date-range':
        //   field = <RangePicker {...fieldProps} />;
        //   break;

        case 'radio':
          field = (
            <RadioGroup>
              {!!dataSource.length &&
                dataSource.map(opt => (
                  <Radio key={opt.key} value={opt.key} {...commonProp}>
                    {opt.label || opt.key}
                  </Radio>
                ))}
            </RadioGroup>
          );
          break;

        case 'checkbox':
          field = (
            <CheckboxGroup>
              {!!dataSource.length &&
                dataSource.map(opt => (
                  <Checkbox key={opt.key} value={opt.key} {...commonProp}>
                    {opt.label || opt.key}
                  </Checkbox>
                ))}
            </CheckboxGroup>
          );
          break;

        case 'int':
          setRule('integer', 'This field should be an integer', { validator: (r, v, cb) => (!v || Number.isInteger(v) ? cb() : cb(true)) });
          defaultValue = getDv(defaultValue);
          field = <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder={placeholder} {...commonProp} />;
          break;

        case 'float':
        case 'number':
          setRule('number', 'This field should be a number', {
            validator: (r, v, cb) => (!v || typeof v === 'number' ? cb() : cb(true)),
          });
          defaultValue = getDv(defaultValue);
          field = <InputNumber min={0} style={{ width: '100%' }} placeholder={placeholder} {...commonProp} />;
          break;

        case 'url':
          setRule('url', 'This field should be a valid url');
          field = textItem;
          break;

        default:
          field = textItem;
          break;
      }
    }

    rules = [...myrule, ...rules];
    return getFieldDecorator(key, {
      rules,
      validateFirst: true,
      initialValue: defaultValue,
    })(field);
  };

  if (showItem) {
    return (
      <FormItem label={label} {...formProps}>
        {createField()}
      </FormItem>
    );
  }
  return createField();
};

CreateForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired, // key值
  defaultValue: PropTypes.any, // 默认值
  label: PropTypes.any, // label
  placeholder: PropTypes.string, // 默认跟label相同
  message: PropTypes.any, // 报错message,默认:This field is required
  required: PropTypes.bool, // 是否必填,默认true
  showItem: PropTypes.bool, // 是否显示formItem,默认true
  custom: PropTypes.bool, // 是否使用自定义组件,默认true
  disabled: PropTypes.bool, //
  fieldProps: PropTypes.object, // field的props
  formProps: PropTypes.object, // field的props
  rules: PropTypes.array, // 验证rules
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      label: PropTypes.string,
    })
  ), // select或radio-group的选项
  component: PropTypes.element,
  parentkey: PropTypes.string,
};
CreateForm.defaultProps = {
  label: '',
  required: true,
  showItem: true,
  custom: false,
  disabled: false,
  fieldProps: {},
  formProps: {},
  dataSource: [],
  rules: [],
};

export default CreateForm;
