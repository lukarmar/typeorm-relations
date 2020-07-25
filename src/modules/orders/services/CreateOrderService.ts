import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    const productsExists = await this.productsRepository.findAllById(
      products.map(({ id }) => ({ id })),
    );

    if (!customer) {
      throw new AppError('Customer does not exist');
    }

    if (productsExists.length !== products.length) {
      throw new AppError('Product in list does not exist');
    }

    productsExists.forEach((product, index) => {
      if (product.quantity < products[index].quantity) {
        throw new AppError(`The product ${product.name}no stock quantity`);
      }
    });

    const newAddProducts = productsExists.map(product => ({
      product_id: product.id,
      price: Number(product.price),
      quantity: product.quantity,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: newAddProducts,
    });

    return order;
  }
}

export default CreateOrderService;
