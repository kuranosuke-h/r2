import 'reflect-metadata';
import { CashMarginType, OrderType, OrderSide, Broker, Order } from '../types';
import BrokerAdapterRouter from '../BrokerAdapterRouter';
import { options } from '@bitr/logger';
import OrderImpl from '../OrderImpl';
import { createOrder } from './helper';
options.enabled = false;

const baBitflyer = {
  broker: 'Bitflyer',
  send: jest.fn(),
  cancel: jest.fn(),
  fetchQuotes: jest.fn(),
  getBtcPosition: jest.fn(),
  refresh: jest.fn()
};

const baQuoine = {
  broker: 'Quoine',
  send: jest.fn(),
  cancel: jest.fn(),
  fetchQuotes: jest.fn(),
  getBtcPosition: jest.fn(),
  refresh: jest.fn()
};

const brokerAdapters = [baBitflyer, baQuoine];
const baRouter = new BrokerAdapterRouter(brokerAdapters);
describe('BrokerAdapterRouter', () => {
  test('send', async () => {
    const order = createOrder('Bitflyer', OrderSide.Buy, 0.001, 500000, CashMarginType.Cash, OrderType.Limit, 0);
    await baRouter.send(order);
    expect(baBitflyer.send.mock.calls.length).toBe(1);
    expect(baQuoine.send.mock.calls.length).toBe(0);
  });

  test('fetchQuotes', async () => {
    await baRouter.fetchQuotes('Bitflyer');
    expect(baBitflyer.fetchQuotes.mock.calls.length).toBe(1);
    expect(baQuoine.fetchQuotes.mock.calls.length).toBe(0);
  });

  test('cancel', async () => {
    const order = createOrder('Bitflyer', OrderSide.Buy, 0.001, 500000, CashMarginType.Cash, OrderType.Limit, 0);
    await baRouter.cancel(order);
    expect(baBitflyer.cancel.mock.calls.length).toBe(1);
    expect(baQuoine.cancel.mock.calls.length).toBe(0);
  });

  test('getBtcPosition', async () => {
    await baRouter.getBtcPosition('Quoine');
    expect(baBitflyer.getBtcPosition.mock.calls.length).toBe(0);
    expect(baQuoine.getBtcPosition.mock.calls.length).toBe(1);
  });

  test('refresh', async () => {
    const order = createOrder('Quoine', OrderSide.Buy, 0.001, 500000, CashMarginType.Cash, OrderType.Limit, 0);
    await baRouter.refresh(order);
    expect(baBitflyer.refresh.mock.calls.length).toBe(0);
    expect(baQuoine.refresh.mock.calls.length).toBe(1);
  });
});
