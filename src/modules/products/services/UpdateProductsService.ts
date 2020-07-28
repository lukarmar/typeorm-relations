import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductRepository from '../repositories/IProductsRepository';
import IUpdateProductsQuantityDTO from '../dtos/IUpdateProductsQuantityDTO';

@injectable()
class UpdateProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductRepository,
  ) {}

  public async execute(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productExists = await this.productsRepository.findAllById(
      products.map(({ id }) => ({ id })),
    );
    if (!productExists) {
      throw new AppError('Product already exists');
    }

    const updatedProducts = await this.productsRepository.updateQuantity(
      products,
    );

    return updatedProducts;
  }
}

export default UpdateProductsService;
