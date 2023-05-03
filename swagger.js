const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');
const Product = require('./models/product.model');

exports.options = {
    "definitions": {
        User: m2s(User),
        Product: m2s(Product)
    },
    "swagger":"2.0",
    "info": {
        "Version": "1.0.0",
        "description": "Products Project App API",
        "title": "Products CRUD API"
    },
    "host": "localhost:3000",
    "basePath": "/",
    "tags": [
        {
            "name": "Users",
            "description": "API for users"
        },
        {
            "name": "Users and Products",
            "Desciption": "API for users and their products"
        },
        {
            "name": " Products",
            "Desciption": "API for products"
        }
       
    ],
    "schemes": ["http"],
    "consumes": ["application/json"],
    "produces": ["application/json"],
    "paths": {
        "/api/user/findAll": {
            "get": {
                "tags": [
                    "Users"
                ],
                "summary": "Get all users",
                "responses": {
                    "200": {
                        "descroption": "OK",
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                }
            }
        },
        "/api/user/findOne/{username}": {
            "get": {
                "tags": [
                    "Users"
                ],
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": true,
                        "description": "Username of user",
                        "type": "string"
                    }
                ], 
                "summary": "Get a user",
                "responses": {
                    "200": {
                        "descroption": "User found",
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                }
            }
        },
        "/api/user/create": {
            "post": {
                "tags": [
                    "Users"
                ],
                "description": "Create new user in app",
                "parameters":[ {
                    "name": "Parameters fro creating user",
                    "in": "body",
                    "description": "Users parameters that will create the user",
                    "schema": {
                        //"$ref": "#/definitions/User"
                        "type": "object",
                        "properties": {
                            "username": {"type": "string"},
                            "password": {"type": "string"},
                            "name": {"type": "string"},
                            "surname": {"type": "string"},
                            "email": {"type": "string"},
                            "address": {
                                "type": "object",
                                "properties": {
                                    "area":{"type": "string"},
                                    "road":  {"type": "string"}
                                },
                                
                            },
                            "phone": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": 
                                    {
                                    "type": {"type": "string"},
                                    "number":  {"type": "string"}
                                    },
                                },     
                            },
                        },
                        "required": ["username", "email"]
                    }
                }],
                "produces": ["application/json"],
                "responses": {
                    "200": {
                        "description": "New user is created",
                        "schema": {
                            "$ref":"#/definitions/User"
                        }
                    }
                }
            }
        },
        "/api/user/update": {
            "patch": {
                "tags": [
                    "Users"
                ],
                "description": "Update user in system",
                "parameters": [{
                    "name": "update user in system",
                    "in": "body",
                    "description": "User to be updated",
                    "schema": {
                        "type": 'object',
                        "properties": {
                            "username": {"type": "string"},
                            "name": {"type": "string"},
                            "surname": {"type": "string"},
                            "email": {"type": "string"},
                            "address": {
                                "type": "object",
                                "properties": {
                                    "area": {"type": "string"},
                                    "road": {"type": "string"}
                                },
                            },
                            "phone": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "type": {"type": "string"},
                                        "number": {"type": "string"}
                                    },
                                },
                            },
                        },
                        "required": ["email"]
                    }
                }],
                "produces": ["application/json"],
                "responses": {
                    "200": {
                        "description": " User Updated"
                    }
                }
            }
        },
        "/api/user/delete/{username}": {
            "delete": {
                "tags":[
                    "User"
                ],
                "description": "deletes the user",
                "parameters": [{
                    "name": "username",
                    "in":"path",
                    "description": "Username that will be deleted"
                }],
                "responses": {
                    "200": {
                        "description": "Deleted user"
                    }
                }
            }
        },
        "/api/userproducts/findone/{username}": {
            "get": {
                "tags": [
                    "Users and Products"
                ],
                "parameters": [{
                    "name": "username",
                    "in": "path",
                    "description": "Find users's products",
                    "type": "string"
                }],
                "responses": {
                    "200": {
                        "description": "User and Products"
                    }
                }
            }
        }
    }
}