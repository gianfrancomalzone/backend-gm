import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const idProductoPrueba = "64ed385a54a9f8683b07e3d7";
let cartCreado;
describe('Testing e-commerce', () => {
    describe('Test de products', () => {
        it("Crear Producto: El API POST /api/products debe crear un producto", async () => {
            //Given
                const productMock = {
                    title: "Producto Test",
                    description: "Producto Test Descripción",
                    price: 100,
                    thumbnail: [],
                    code: Math.random(),
                    stock: 10,
                    category: "TestCategory",
                    owner: "TestUser"
                }
            //Then
                const {statusCode, _body} = await requester.post('/api/products').send(productMock);
            
            //Assert
                expect(statusCode).is.eqls(200);
                expect(_body).is.ok.and.to.have.property("_id");
        })
        it("Crear Producto: El API POST /api/products debe devolver un error si no se envía el body", async () => {
            //Given
                const productMock = {}

            //Then
                const {statusCode, _body} = await requester.post('/api/products').send(productMock);
            
            //Assert
                expect(statusCode).is.eqls(403);
                expect(_body).is.ok.and.to.have.property("status").equals("failed");
        })
        it("Actualizar producto: El API PUT /api/products/:id debe actualizar el stock y la categoría del producto", async () => {
            //Given
                const productMock = {
                    stock: 25,
                    category: "UpdatedCategory"
                }
            //Then
                const {statusCode, _body} = await requester.put('/api/products/'+idProductoPrueba).send(productMock);       
            //Assert
                expect(statusCode).is.eqls(201);
                expect(_body).is.ok.and.to.have.property("status").equals("ok");
        })
    })
        
    describe('Test de carts', () => {
        it("Crear Carrito: El API POST /api/carts debe crear un carrito", async () => {
            //Then
                const {statusCode, _body} = await requester.post('/api/carts/').send();
            //Assert
                expect(statusCode).is.eqls(201);
                expect(_body).is.ok.and.to.have.property("createdCartId");
                cartCreado = _body.createdCartId;
        })
        it("Crear Carrito: Se actualiza la cantidad de Productos en el Carrito", async () => {
            //Given
                const cartId = "650e3115e64c0e4de34c1442";
                const productId = "64ed385a54a9f8683b07e3d7";
                const productMock = {
                    quantity: 25
                }
            //Then
                const {statusCode, _body} = await requester.put('/api/carts/' + cartId + "/products/" + productId).send(productMock);
            //Assert
                expect(statusCode).is.eqls(200);
                expect(_body).is.ok.and.to.have.property("status").equals("ok");
                
        })
        it ("Carrito: Se elimina el carrito generado en la prueba 1", async () => {
            //Then
                const {statusCode, _body} = await requester.delete('/api/carts/' + cartCreado).send();
            //Assert
                expect(statusCode).is.eqls(200);
                expect(_body).is.ok.and.to.have.property("status").equals("ok");
        })

    })
    describe('Test de sessions', () => {
        it("Inicio de sesión: El API POST /api/sessions/login debe devolver datos del usuario, ya que el login es positivo", async () => {
            //Given
                const userMock = {
                    email: "amas.priscila@gmail.com",
                    password: "2023"
                }
            //Then
                const {statusCode, _body} = await requester.post('/api/sessions/login').send(userMock);
            //Assert
                expect(statusCode).is.eqls(200);
                expect(_body.user).is.ok.and.to.have.property("first_name").equals("Priscila");
        })
        it("Inicio de sesión: El API POST /api/sessions/login debe devolver un error, ya que el login es negativo", async () => {
            //Given
                const userMock = {
                    email: "fakeEmail@somebody.com",
                    password: "fakePassword"
                }
            //Then
                const {statusCode, _body} = await requester.post('/api/sessions/login').send(userMock);
            //Assert
                expect(statusCode).is.eqls(302); //Redirección del middleware de passport
        })
        it("Registro de usuario: El API POST /api/sessions/register debe generar un nuevo usuario", async () => {
            //Given
            const userMock = {
                    first_name: "Fake",
                    last_name: "User",
                    email: Math.random()+"@fake.com",
                    age: 99,
                    password: "fakePassword",
            }
            //Then
            const {statusCode, _body} = await requester.post('/api/sessions/register').send(userMock);
            //Assert
            expect(statusCode).is.eqls(200); 
        })
    })
});