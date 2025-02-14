from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def home():
    return 'Google Docs Clone Backend'

@socketio.on('connect')
def handle_connect():
    print('User connected')

@socketio.on('join-document')
def handle_join_document(data):
    document_id = data['documentId']
    join_room(document_id)
    print(f'User joined document {document_id}')

@socketio.on('send-changes')
def handle_send_changes(data):
    document_id = data['documentId']
    emit('receive-changes', data['delta'], room=document_id)

@socketio.on('disconnect')
def handle_disconnect():
    print('User disconnected')

if __name__ == '__main__':
    socketio.run(app, port=5000, debug=True)