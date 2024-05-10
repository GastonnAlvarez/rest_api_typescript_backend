import request from 'supertest'
import server, { connectDB } from '../../server'
import db from '../../config/db'



describe('POST /api/products', () => {
    it('should display validations errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor - Testing",
            price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor - Testing",
            price: "hola"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Teclado Hyper - Testing",
            price: 100
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })

})

describe('GET /api/products', () => {
    it('should check if /api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch('/json')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado.')
    })

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get(`/api/products/not-valid-url`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('El ID no es valido.')
    })

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should display the the price is greater than 0', async () => {
        const response = await request(server)
            .put('/api/products/1')
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: 0
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('El precio no puede ser negativo.')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const response = await request(server)
            .put('/api/products/1')
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: 300
            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('should return 404 response for a non-existin product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado.')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should verify that the ID dont find the product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado.')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')

        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(1)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('El ID no es valido.')

        expect(response.status).not.toBe(200)
        expect(response.body.errors).not.toHaveProperty('data')
    })

    it('should eliminate the product if is finding', async () => {
        const response = await request(server).delete(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado.')
    })
})

    // jest.mock('../../config/db')

    // describe('connectDB', () => {
    //     it('should handle database connection error', async () => {
    //         jest.spyOn(db, 'authenticate')
    //             .mockRejectedValueOnce(new Error('Hubo un error al conectar a la DB'))
    //         const consoleSpy = jest.spyOn(console, 'log')

    //         await connectDB()
    //         expect(consoleSpy).toHaveBeenCalledWith(
    //             expect.stringContaining('Hubo un error al conectar a la DB')
    //         )
    //     })
    // })