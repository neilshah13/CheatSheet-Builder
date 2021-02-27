# app.py
from flask import Flask
from flask_restful import Api, Resource, reqparse
import numpy as np
from text_detection_v2 import predict, resize_image

APP = Flask(__name__)
API = Api(APP)

class Predict(Resource):

    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('image_path')
        parser.add_argument('image_name')

        args = parser.parse_args()  # creates dict

        out = {'prediction': predict(args['image_path'])}

        return out, 200


API.add_resource(Predict, '/predict')

class Resize(Resource):
    
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser = reqparse.RequestParser()
        parser.add_argument('image_path')
        parser.add_argument('new_path')
        parser.add_argument('new_width')
        parser.add_argument('new_height')

        args = parser.parse_args()  # creates dict

        out = {'resized': resize_image(args['image_path'],args['new_width'],
                                        args['new_height'],args['new_path'])}

        return out, 200


API.add_resource(Resize, '/resize')

if __name__ == '__main__':
    APP.run(debug=True, port='1080')