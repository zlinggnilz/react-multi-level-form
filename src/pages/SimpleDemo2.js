import React, { PureComponent } from 'react';
import { Card, Modal } from 'antd';
import MultiForm from '@/components/MultiForm';

const formAttr = [
  {
    label: 'Country',
    key: 'country',
    multi: true,
    children: [
      { label: 'Country Name', key: 'name' },
      { label: 'Area', key: 'area', required: false },
      {
        label: 'Province',
        key: 'province',
        multi: true,
        children: [
          { label: 'Province Name', key: 'name' },
          { label: 'Population', key: 'population', required: false },
          {
            label: 'City',
            key: 'city',
            multi: true,
            items: [{ label: 'City Name', key: 'name' }, { label: 'Postal Code', key: 'postal', required: false }],
          },
        ],
      },
    ],
  },
  {
    label: 'Ocean',
    key: 'ocean',
    multi: true,
    children: [
      { label: 'Ocean Name', key: 'name' },
      { label: 'Area', key: 'area', required: false },
      {
        label: 'Island',
        key: 'island',
        // multi: true,
        items: [{ label: 'Island Name', key: 'name' }, { label: 'Area', key: 'area', required: false }],
      },
    ],
  },
];

class FormDemo extends PureComponent {
  state = { loading: false };

  handleSubmit = data => {
    console.log('submit data:', data);

    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      Modal.info({
        width: 800,
        title: 'Submit Data',
        content: <pre>{JSON.stringify(data, null, 2)}</pre>,
      });
    }, 1000);
  };

  render() {
    const { loading } = this.state;
    return (
      <Card title="Multi-Level-Form Demo" className="blue-card">
        <MultiForm formAttr={formAttr} onSubmit={this.handleSubmit} loading={loading} />
      </Card>
    );
  }
}

export default FormDemo;
