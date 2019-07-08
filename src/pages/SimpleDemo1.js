import React, { PureComponent } from 'react';
import { Card, Modal } from 'antd';
import MultiForm from '@/components/MultiForm';

const formAttr = [
  {
    label: 'Park',
    key: 'park',
    multi: true,
    children: [
      { label: 'Park Name', key: 'name' },
      { label: 'Location', key: 'location', required: false },
      { label: 'Rate', key: 'rate', type: 'int' },
    ],
  },
];

const formData = {
  park: [
    {
      name: 'park name 1',
      location: 'place 1',
      rate: 4,
    },
    {
      name: 'park name 2',
      location: 'place 2',
      rate: 5,
    },
  ],
};

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
      <Card title="Multi-Level-Form width default form data" className="blue-card">
        <MultiForm formAttr={formAttr} data={formData} onSubmit={this.handleSubmit} loading={loading} />
      </Card>
    );
  }
}

export default FormDemo;
