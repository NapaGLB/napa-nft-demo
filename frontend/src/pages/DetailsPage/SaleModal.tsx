import React, { useState } from 'react';
import Modal from 'ui/Modal';
import { Text } from 'ui/Typography';
import Input from 'ui/Input';
import styled from 'styled-components';
import Button from 'ui/Button';
import { Space, Radio } from 'antd';
import { CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';

interface IModalProps {
  visible: boolean;
  setOpenModal: any;
  handleOfferForSale: any;
  handleOfferForSaleToAddress: any;
}
const SaleModal: React.FC<IModalProps> = (props: IModalProps) => {
  const { visible, setOpenModal, handleOfferForSale, handleOfferForSaleToAddress } = props;
  const [value, setValue] = useState('0');
  const [address, setAddress] = useState('');
  const [saleType, setSaleType] = useState(1);

  const handleSubmit = () => {
    if (address && saleType === 2) handleOfferForSaleToAddress(value, address);
    else handleOfferForSale(value);
    setOpenModal(false);
  };
  return (
    <StyledModal
      title='Offer For Sale'
      visible={visible}
      onCancel={() => setOpenModal(false)}
    >
      <Radio.Group
        onChange={(e) => {
          setSaleType(e.target.value);
        }}
        value={saleType}
      >
        <Radio value={1}>To All</Radio>
        <Radio value={2}>To Address</Radio>
      </Radio.Group>
      <StyledText>
        Min Price in ETH
        <StyledInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </StyledText>
      {saleType === 2 && (
        <StyledText>
          To Address
          <StyledInput
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </StyledText>
      )}{' '}
      <ButtonContainer>
        <StyledButton
          $bgType='primary'
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <CloseCircleOutlined />
          Cancel
        </StyledButton>
        <StyledButton $bgType='primary' onClick={handleSubmit}>
          <CheckOutlined />
          Submit Sale
        </StyledButton>
      </ButtonContainer>
    </StyledModal>
  );
};

const StyledText = styled(Text)`
  font-weight: bold;
  font-size: 18px;
  margin-top: 15px;
  display: block;
`;

const StyledInput = styled(Input)`
  background-color: #f5f5f5;
  height: 45px;
  border: none;
  padding-left: 20px;
  font-weight: bold;
  margin-top: 10px;
  border-color: blue;
  border-right-width: 1px !important;
  outline: 0;
  box-shadow: 0 0 0 1px rgb(24 144 255 / 20%);
`;

const StyledButton = styled(Button)`
  color: white;
  font-weight: bold;
  display: block;
  width: 100%;
  height: 35px;
  text-align: left;
  font-size: 16px;
  .anticon {
    font-size: 16px;
  }
`;

const ButtonContainer = styled(Space)`
  width: 100%;
  > * {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
  margin: 35px 0 0px;
`;

const StyledModal = styled(Modal)`
  .ant-modal-footer {
    display: none;
  }
  .ant-modal-body {
    padding-top: 10px;
  }
`;
export default SaleModal;
