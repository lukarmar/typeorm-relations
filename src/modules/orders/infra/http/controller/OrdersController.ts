import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findOrder = container.resolve(FindOrderService);

    const order = await findOrder.execute({ id });

    return response.json(classToClass(order));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrders = container.resolve(classToClass(CreateOrderService));

    const orders = await createOrders.execute({ customer_id, products });

    return response.json(orders);
  }
}
