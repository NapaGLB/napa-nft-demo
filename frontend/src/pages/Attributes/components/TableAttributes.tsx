/* eslint-disable no-unused-vars */
import { InfoCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import StyledTable from 'ui/Table';
import { Text } from 'ui/Typography';
import Spaces from 'utils/spaces';
import { Link } from 'react-router-dom';
import formartNumber from 'utils/format';
import { ISpace } from 'types/SpaceProps';

const TOOL_TIP_CONTENT_AVG_SALE = 'Average sale price over past 90 days with this attributes';
const TOOL_TIP_CONTENT_CHEAPEST = 'Cheapest space currently for sale with this attribute';

const TableAttributes: React.FC<any> = (props: any) => {
  const { data } = props;

  const renderCheapest = (space: ISpace, price: string) => {
    if (space) {
      return (
        <div>
          <Link to={`/detail/${space.id}`}>
            <img
              src={space.img}
              alt=''
              width={50}
              height={50}
              style={{ background: '#95554f', padding: 4 }}
            />
          </Link>
          <Text $size='18px' ml='10px'>
            {formartNumber(price, 2)}Ξ
          </Text>
        </div>
      )
    }

    return (
      <Text $size='18px'>No space for sale</Text>
    );
  };

  const renderMoreExamples = (moreExample: Array<any>) =>
    moreExample.map((image) => {
      const isBid =
        data.bidData &&
        data.bidData.length > 0 &&
        data.bidData.some((bid: any) => bid.index === image.id);
      const isSale =
        data.saleData &&
        data.saleData.length > 0 &&
        data.saleData.some((bid: any) => bid.index === image.id);
      if (isBid)
        return (
          <SpaceContainer key={Math.random()} style={{ backgroundColor: '#8e6fb6' }}>
            <Link to={`/detail/${image.id}`}>
              <img src={image.img} alt='' width={42} height={42} />
            </Link>
          </SpaceContainer>
        );
      if (isSale)
        return (
          <SpaceContainer key={Math.random()} style={{ backgroundColor: '#95554f' }}>
            <Link to={`/detail/${image.id}`}>
              <img src={image.img} alt='' width={42} height={42} />
            </Link>
          </SpaceContainer>
        );
      return (
        <SpaceContainer key={Math.random()}>
          <Link to={`/detail/${image.id}`}>
            <img src={image.img} alt='' width={42} height={42} />
          </Link>
        </SpaceContainer>
      );
    });

  const renderAvgSale = (avgSale: string) => (avgSale ? formartNumber(avgSale, 2) : 0);

  const renderTitleTooltip = (title: string, text: string) => (
    <AvgSaleWrapper>
      <span>{title}</span>
      <Tooltip placement='top' title={text}>
        <InfoCircleFilled />
      </Tooltip>
    </AvgSaleWrapper>
  );

  const attributes = Spaces.reduce(
    (groups: any, item: any) => ({
      ...groups,
      [item.type]: [...(groups[item.type] || []), item]
    }),
    []
  );

  const dataSource = Object.keys(attributes).map((attribute: string) => ({
    attribute,
    number: attributes[attribute][0].id,
    avail: attributes[attribute][0].price,
    avgSale: 20,
    cheapest: { id: attributes[attribute][0].id, img: attributes[attribute][0].img, number: '25' },
    moreExamples: attributes[attribute].map((example: any) => ({
      id: example.id,
      img: example.img
    }))
  }));
  const columns = [
    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
      render(attribute: string) {
        return (
          <Link to='/'>
            <Text $color='#0080FF' $size='18px' strong>
              {attribute}
            </Text>
          </Link>
        );
      }
    },
    {
      title: '#',
      dataIndex: 'number',
      key: 'number',
      render(avail: string, record: any) {
        return (
          <Text $size='18px'>
            {' '}
            {record.attribute === 'Device' ? data.deviceCount : data.natureCount}
          </Text>
        );
      }
    },
    {
      title: 'Avail',
      dataIndex: 'avail',
      key: 'avail',
      render(avail: string, record: any) {
        return (
          <Text $size='18px'>
            {record.attribute === 'Device' ? data.deviceAvail : data.natureAvail}
          </Text>
        );
      }
    },
    {
      title: renderTitleTooltip('Avg Sale', TOOL_TIP_CONTENT_AVG_SALE),
      dataIndex: 'avgSale',
      key: 'avgSale',
      width: 120,
      render(avgSale: string, record: any) {
        return (
          <Text $size='18px'>
            {' '}
            {record.attribute === 'Device'
              ? renderAvgSale(data.avgDeviceEther)
              : renderAvgSale(data.avgNatureEther)}
            Ξ
          </Text>
        );
      }
    },
    {
      title: renderTitleTooltip('Cheapest', TOOL_TIP_CONTENT_CHEAPEST),
      dataIndex: 'cheapest',
      key: 'cheapest',
      width: 130,
      render(cheapest: any, record: any) {
        return record.attribute === 'Device'
          ? renderCheapest(data.cheapestDevice, data.cheapestDeviceEther)
          : renderCheapest(data.cheapestNature, data.cheapestNatureEther);
      }
    },
    {
      title: 'More Examples',
      dataIndex: 'moreExamples',
      key: 'moreExamples',
      render(moreExamples: Array<any>) {
        return renderMoreExamples(moreExamples);
      }
    }
  ];

  return (
    <CustomStyledTable
      columns={columns}
      dataSource={dataSource}
      rowKey='number'
      pagination={false}
    />
  );
};

const SpaceContainer = styled.div`
  display: inline-block;
  background-color: #dfdbe8;
  padding: 4px;
`;

const AvgSaleWrapper = styled.div`
  position: relative;
  .anticon {
    position: absolute;
    font-size: 14px;
    right: -4px;
    text-align: center;
  }
`;

const CustomStyledTable = styled(StyledTable)`
  td {
    padding: 5px 8px !important;
    text-align: left !important;
  }
  th {
    text-align: left !important;
  }
`;
export default TableAttributes;
