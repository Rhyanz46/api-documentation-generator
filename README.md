# Swagger




## Install : 

clone

`git clone https://github.com/Rhyanz46/api-documentation-generator.git api-doc-generator`

Get in to the folder :

`cd api-doc-generator`

install all depedency :

`npm install`  
or  
`yarn`



## Set the API Specification
In the folder `data` you can set your API specification.

### file configuration roles :
#### Name
- Use number for the begininig character of the name in the file
- Dont use `space` for the file name, you can use `underscore` to replace that.
- Make folder it's mean you want to create sub menu.

#### Example :

```
data/
---- 1_token_checker.json
---- 2_user/
-------- 1_login.json
-------- 2_detail.json
-------- 3_forgot_passoword.json
-------- 4_verify_passoword.json
---- 3_order/
-------- 1_cart.json
-------- 2_detail.json
```

#### Configuration
- `title` : The name of menu that will show.
- `endpoint` : endpoint that you want to call.
- `get/post/put/delete` : The name of method
- `<MethodName>.desc` : Description for your endpoint
- `<MethodName>.header` : Header formart for your endpoint
- `<MethodName>.content_type` : It's can be json/form
#### Example :
```json
{
    "title": "detail akun",
    "endpoint": "https://google.com/account",
    "get" : {
        "desc": null,
        "header": {
            "Authorization": "Bearer <token>"
        },
        "content_type": "json",
        "protect": true
    },
    "post": {
        "example": {
            "title" : {
                "value": "google"
            },
            "birth": {
                "value": "google"
            }
        },
        "content_type": "form"
    },
    "put": {
        "example": {
            "photo_profile": {
                "value": "google",
                "type": "file"
            },
            "email": {
                "value": "google"
            },
            "mobile_phone": {
                "value": "google"
            },
            "password": {
                "value": "google"
            }
        },
        "desc": null,
        "content_type": "form",
        "header": {
            "Authorization" : "Bearer <token>"
        }
    }
}
```


## Running 

just running `npm run dev`

it's will running two services
- React app ( port 3000)
- Express backend ( port 9009)


## Usage

Choose one menu on the left

![](ui.png?raw=true)
