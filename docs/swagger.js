const appRootPath = require('app-root-path');
const packagejson = require(`${appRootPath}/package.json`);
const server = require(`${appRootPath}/server`)
const prefs = require(`${appRootPath}/config/prefs`)
const timeElapsed = require(`${appRootPath}/tools/dates`).timeElapsed

let updatedAt = '2020-03-19 17:30', description = ``
if (updatedAt == null) {
    updatedAt = server.appStartedAt
    description = `API documentation updated on ${updatedAt}`
} else {
    description = `API documentation updated ${timeElapsed(updatedAt, 'text')} ago, on ${updatedAt} `
}

module.exports = {
    "swagger": "2.0",
    "info": {
        description,
        "version": packagejson.version,
        "title": packagejson.name,
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "email": prefs.emails.developer,
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://server.apache.org/licenses/LICENSE-2.0.html"
        }
    },
    "host": `${server.ip}:${prefs.backPort}`,
    "basePath": "/api/",
    "tags": [
        {
            "name": "user",
            "description": "Operations about user",
            "externalDocs": {
                "description": "Find out more about our store",
                "url": prefs.frontBaseUrl,
            }
        },
        {
            "name": "assessment",
            "description": "Operations about Assessment",
            "externalDocs": {
                "description": "Find out more about our store",
                "url": prefs.frontBaseUrl,
            }
        }
    ],
    "schemes": [
        prefs.httpMode,
    ],
    "paths": {
        "/user/signup": {
            "post": {
                "tags": [
                    "user"
                ],
                "summary": "Create user",
                "description": "At the moment, only SUPER users can signup. The application supports a fixed number of SUPER users. ongoingAssessment is null",
                "operationId": "signup",
                "consumes": [
                    //"application/x-server-form-urlencoded"
                ],
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "Created user object",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                ],
                "responses": {
                    "default": {
                        "description": "successful operation"
                    }
                }
            }
        },
        "/user/createWithArray": {
            "post": {
                "tags": [
                    "user"
                ],
                "summary": "Creates list of users with given input array",
                "description": "",
                "operationId": "createUsersWithArrayInput",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "List of user object",
                        "required": true,
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/User"
                            }
                        }
                    }
                ],
                "responses": {
                    "default": {
                        "description": "successful operation"
                    }
                }
            }
        },
        "/user/createWithList": {
            "post": {
                "tags": [
                    "user"
                ],
                "summary": "Creates list of users with given input array",
                "description": "",
                "operationId": "createUsersWithListInput",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "List of user object",
                        "required": true,
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/User"
                            }
                        }
                    }
                ],
                "responses": {
                    "default": {
                        "description": "successful operation"
                    }
                }
            }
        },
        "/user/{username}": {
            "get": {
                "tags": [
                    "user"
                ],
                "summary": "Get user by user name",
                "description": "",
                "operationId": "getUserByName",
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "description": "The name that needs to be fetched. Use user1 for testing. ",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    },
                    "400": {
                        "description": "Invalid username supplied"
                    },
                    "404": {
                        "description": "User not found"
                    }
                }
            },
            "put": {
                "tags": [
                    "user"
                ],
                "summary": "Updated user",
                "description": "This can only be done by the logged in user.",
                "operationId": "updateUser",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "description": "name that need to be updated",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "in": "body",
                        "name": "body",
                        "description": "Updated user object",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/User"
                        }
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Invalid user supplied"
                    },
                    "404": {
                        "description": "User not found"
                    }
                }
            },
            "delete": {
                "tags": [
                    "user"
                ],
                "summary": "Delete user",
                "description": "This can only be done by the logged in user.",
                "operationId": "deleteUser",
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "description": "The name that needs to be deleted",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "400": {
                        "description": "Invalid username supplied"
                    },
                    "404": {
                        "description": "User not found"
                    }
                }
            }
        },
        "/user/login": {
            "get": {
                "tags": [
                    "user"
                ],
                "summary": "Logs user into the system",
                "description": "",
                "operationId": "loginUser",
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "name": "username",
                        "in": "query",
                        "description": "The user name for login",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "password",
                        "in": "query",
                        "description": "The password for login in clear text",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "headers": {
                            "X-Expires-After": {
                                "type": "string",
                                "format": "date-time",
                                "description": "date in UTC when token expires"
                            },
                            "X-Rate-Limit": {
                                "type": "integer",
                                "format": "int32",
                                "description": "calls per hour allowed by the user"
                            }
                        },
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Invalid username/password supplied"
                    }
                }
            }
        },
        "/user/logout": {
            "get": {
                "tags": [
                    "user"
                ],
                "summary": "Logs out current logged in user session",
                "description": "",
                "operationId": "logoutUser",
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [],
                "responses": {
                    "default": {
                        "description": "successful operation"
                    }
                }
            }
        },
        ///////////////////////////////////////////////// ASSESSMENT /////////////////////////////////////////////
        "/assessment/start": {
            "post": {
                "tags": [
                    "assessment"
                ],
                "summary": "start the ongoingAssessment of the current user",
                "description": "",
                "operationId": "start",
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "name": "token",
                        "in": "header",
                        "description": "token",
                        "required": true,
                        "type": "string"
                    }
                ], "responses": {
                    200: {
                        "description": "successful"
                    }
                }
            }
        },
        "/assessment/finish": {
            "post": {
                "tags": [
                    "assessment"
                ],
                "summary": "candidate finish his ongoingAssessment",
                "description": "",
                "operationId": "finish",
                "produces": [
                    "application/json",
                    "application/xml"
                ],
                "parameters": [
                    {
                        "name": "token",
                        "in": "header",
                        "description": "token",
                        "required": true,
                        "type": "string"
                    }
                ], "responses": {
                    200: {
                        "description": "successful"
                    }
                }
            }
        },
        "/assessment/create": {
            "post": {
                "tags": [
                    "assessment"
                ],
                "summary": "recruiter or admin or support can create an assessment",
                "description": "",
                "operationId": "create",
                /*"consumes": [
                    "application/x-server-form-urlencoded"
                ],
                "produces": [
                    "application/json",
                    "application/xml"
                ],*/
                "parameters": [
                    {
                        "name": "token",
                        "in": "header",
                        "description": "authorization token",
                        "required": true,
                        "type": "string",
                        "required": true
                    },
                    {
                        "name": "name",
                        "in": "body",
                        "type": "string"
                    },
                    {
                        "name": "Questions",
                        "in": "body",
                        "description": "ids Questions of the assessment, should be between 1 and 5",
                        "required": true,
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                    },
                    
                ],
                "responses": {
                    200: {
                        "description": "successful"
                    }
                }
            }
        }
    },
    "securityDefinitions": {
        "api_key": {
            "type": "apiKey",
            "name": "api_key",
            "in": "header"
        },
        "petstore_auth": {
            "type": "oauth2",
            "authorizationUrl": "https://petstore.swagger.io/oauth/authorize",
            "flow": "implicit",
            "scopes": {
                "read:pets": "read your pets",
                "write:pets": "modify pets in your account"
            }
        }
    },
    "definitions": {
        "Question": {
            "type": "object",
            "properties": {
                "statement": {
                    "type": "string",
                },
                "duration": {
                    "type": "int"
                }
            },
            "xml": {
                "name": "Question"
            }
        },
        "Pet": {
            "type": "object",
            "required": [
                "name",
                "photoUrls"
            ],
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                },
                "category": {
                    "$ref": "#/definitions/Category"
                },
                "name": {
                    "type": "string",
                    "example": "doggie"
                },
                "photoUrls": {
                    "type": "array",
                    "xml": {
                        "wrapped": true
                    },
                    "items": {
                        "type": "string",
                        "xml": {
                            "name": "photoUrl"
                        }
                    }
                },
                "tags": {
                    "type": "array",
                    "xml": {
                        "wrapped": true
                    },
                    "items": {
                        "xml": {
                            "name": "tag"
                        },
                        "$ref": "#/definitions/Tag"
                    }
                },
                "status": {
                    "type": "string",
                    "description": "pet status in the store",
                    "enum": [
                        "available",
                        "pending",
                        "sold"
                    ]
                }
            },
            "xml": {
                "name": "Pet"
            }
        },
        "Tag": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                },
                "name": {
                    "type": "string"
                }
            },
            "xml": {
                "name": "Tag"
            }
        },
        "ApiResponse": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer",
                    "format": "int32"
                },
                "type": {
                    "type": "string"
                },
                "message": {
                    "type": "string"
                }
            }
        },
        "Order": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                },
                "petId": {
                    "type": "integer",
                    "format": "int64"
                },
                "quantity": {
                    "type": "integer",
                    "format": "int32"
                },
                "shipDate": {
                    "type": "string",
                    "format": "date-time"
                },
                "status": {
                    "type": "string",
                    "description": "Order Status",
                    "enum": [
                        "placed",
                        "approved",
                        "delivered"
                    ]
                },
                "complete": {
                    "type": "boolean"
                }
            },
            "xml": {
                "name": "Order"
            }
        },
        "User": {
            "type": "object",
            "properties": {
                "_id": {
                    "type": "string",
                },
                "userName": {
                    "type": "string"
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "CompanyId": {
                    "type": "string",
                    "description": "Id of the company the user attached to"
                },
                "clearance": {
                    "type": "string",
                    "enum": ["SUPER", "ADMIN", "SUPPORT", "RECRUITER", "CANDIDATE"]
                }
                ,
                "ongoingAssessment": {
                    "$ref": "#/definitions/Assessment",
                    "description": "the assesssment that the user is answering"
                }

            },
            "xml": {
                "name": "User"
            }
        },
        "Assessment": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                },
                "name": {
                    "type": "integer",
                    "format": "int64"
                },
                "quantity": {
                    "type": "integer",
                    "format": "int32"
                },
                "shipDate": {
                    "type": "string",
                    "format": "date-time"
                },
                "status": {
                    "type": "string",
                    "description": "Order Status",
                    "enum": [
                        "placed",
                        "approved",
                        "delivered"
                    ]
                },
                "complete": {
                    "type": "boolean"
                }
            },
            "xml": {
                "name": "Order"
            }
        },
    },
    "externalDocs": {
        "description": prefs.company.name,
        "url": prefs.company.url
    }
}