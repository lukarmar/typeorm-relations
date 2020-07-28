import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductsService from '@modules/products/services/UpdateProductsService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({ name, price, quantity });

    return response.json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { products } = request.body;

    const updateProduct = container.resolve(UpdateProductsService);

    const updatedProducts = await updateProduct.execute(products);

    return response.json(updatedProducts);
  }
}
