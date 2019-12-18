import React from 'react';
import { Form, Input, DatePicker, TimePicker, InputNumber,Button, Switch, Spin } from 'antd';
import { updatePickreq } from '../../redux/request.redux'
import { connect } from 'react-redux';
import moment from 'moment';

const { TextArea } = Input
@connect(
  state => state,
  { updatePickreq }
)
class PickreqForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    }
  }
  // handle submit form info
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      // Should format date value before submit.
      const values = {
        ...fieldsValue,
        'publish': fieldsValue['publish'] ? fieldsValue['publish'] : true,
        'notes': fieldsValue['notes'] ? fieldsValue['notes'] : '',
        'date': fieldsValue['date'].format('YYYY-MM-DD'),
        'time': fieldsValue['time'].format('HH:mm'),
        'username': this.props.user.username,
        'volunteer': this.props.user.volunteer
      };
      this.props.updatePickreq(values)
      //console.log('Received values of form: ', values);
      // TODO: add submit event to redux
      // TODO: Check if time is before today
    });
  };

  render() {
    this.previousReq = null;
    if(!this.props.request.request) {
      console.log('loading previous request!');
    } else {
      this.previousReq = this.props.request.request.data.request;
      this.state.loading = false;
    }

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 18 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 6 },
      },
    };

    const requirement = {
      rules: [{
        required: true, message: 'Please fill this field!'
      }],
    };

    
    return (
      this.state.loading ? <Spin size="large" style={{display:'flex', justifyContent:'center'}}></Spin> :
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='Publish'>
          {getFieldDecorator('publish')(<Switch autoFocus defaultChecked={this.previousReq.published}></Switch>)}
        </Form.Item>
        <Form.Item label='Date'>
          {getFieldDecorator('date', requirement)(<DatePicker  />)}
        </Form.Item>
        <Form.Item label='Time'>
          {getFieldDecorator('time', requirement)
          (<TimePicker format={'HH:mm'}/>)}
        </Form.Item>
        <Form.Item label='Airport/Location'>
          {getFieldDecorator('airport', requirement)(<Input placeholder='MCO'/>)}
        </Form.Item>
        <Form.Item label='Number of Carry-ons'>
          {getFieldDecorator('carryon', requirement)
          (<InputNumber min={0} max={10} placeholder={2}></InputNumber>)}
        </Form.Item>
        <Form.Item label='Number of large luggages'>
          {getFieldDecorator('luggage', requirement)
          (<InputNumber min={0} max={10} placeholder={2}></InputNumber>)}
        </Form.Item>
        <Form.Item label='Notes'>
          {getFieldDecorator('notes')
          (<TextArea placeholder='How many people coming with you?'></TextArea>)}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type='primary' htmlType='submit'>
            Submit My Updates!
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedPickreqForm = Form.create({ name: 'pick_time' })(PickreqForm)
export default WrappedPickreqForm