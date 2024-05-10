import { Router } from "express"
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "./handlers/products"
import { handleInputErrors } from "./middleware"

const router = Router()
/**
* @swagger
*    components:
*        schemas:
*           Product:
*               type: object
*               properties:
*                   id:
*                       type: Integer
*                       description: The product id
*                       example: 1
*                   name:
*                       type: String
*                       description: The product name
*                       example: Monitor Curvo 49pulgadas
*                   price:
*                       type: Number
*                       description: The product price
*                       example: 399
*                   availability:
*                       type: Boolean
*                       description: The product availability
*                       example: true
*/

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *               200:
 *                  description: Succesful reponse
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 */

router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful response
 *              content: 
 *                   application/json:
 *                       schema:
 *                            $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad Request - Invalid ID
 */

router.get('/:id',
    param('id').isInt().withMessage('El ID no es valido.'),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products:
 *   post:
 *      summary: Creates a new project
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo 49pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *             201:
 *              description: Successfully updated product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *             400:
 *                  description: Bad Request - invalid input data
 *              
 *      
 */

router.post('/',
    body('name')
        .isString().withMessage('Nombre no valido.')
        .notEmpty().withMessage('El nombre del producto no puede ir vacio.'),
    body('price')
        .isNumeric().withMessage('No estas ingresando numeros.')
        .notEmpty().withMessage('El precio del producto no puede ir vacio.')
        .custom(value => value > 0).withMessage("El precio no puede ser negativo."),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *      summary: Update a product with user input
 *      tags:
 *          - Products
 *      description: Return updated product
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: The id of the product to update
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo 49pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          201:
 *              description: Successfully updated product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product not found
 */
router.put('/:id',
    param('id').isInt().withMessage('El ID no es valido.'),
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede ir vacio.'),
    body('price')
        .isNumeric().withMessage('No estas ingresando numeros.')
        .notEmpty().withMessage('El precio del producto no puede ir vacio.')
        .custom(value => value > 0).withMessage("El precio no puede ser negativo."),
    body('availability')
        .isBoolean().withMessage('El valor de disponivilidad no es valido.'),
    handleInputErrors,
    updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product availability
 *     tags:
 *       - Products
 *     description: Return the updated availability
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to update
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *          200:
 *              description: Successfully updated product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product not found
 */


router.patch('/:id',
    param('id').isInt().withMessage('El ID no es valido.'),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by Id
 *     tags:
 *       - Products
 *     description: Return the message that the product is eliminated
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *          200:
 *              description: Successfully delete product
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto Eliminado.'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product not found
 */

router.delete('/:id',
    param('id').isInt().withMessage('El ID no es valido.'),
    handleInputErrors,
    deleteProduct
)


export default router