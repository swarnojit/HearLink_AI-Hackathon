import json
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import requests

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

BACKEND_URL = 'http://127.0.0.1:5006/api'


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = {
            'username': request.form['username'],
            'password': request.form['password']
        }

        try:
            # Send JSON data instead of form data
            response = requests.post(f'{BACKEND_URL}/register', json=data)

            # Check if the response is JSON
            try:
                response_data = response.json()
            except json.JSONDecodeError:
                # If not JSON, use the text response as error
                error = f"Server error: {response.text if response.text else 'Unknown error'}"
                return render_template('register.html', error=error)

            if response.status_code == 201:
                return redirect(url_for('login'))
            else:
                error = response_data.get('error', 'Registration failed')
                return render_template('register.html', error=error)

        except requests.exceptions.ConnectionError:
            error = "Unable to connect to the backend server. Please make sure it's running."
            return render_template('register.html', error=error)
        except Exception as e:
            error = f"An unexpected error occurred: {str(e)}"
            return render_template('register.html', error=error)

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = {
            'username': request.form['username'],
            'password': request.form['password']
        }

        try:
            # Send JSON data instead of form data
            response = requests.post(f'{BACKEND_URL}/login', json=data)

            # Check if the response is JSON
            try:
                response_data = response.json()
            except json.JSONDecodeError:
                # If not JSON, use the text response as error
                error = f"Server error: {response.text if response.text else 'Unknown error'}"
                return render_template('login.html', error=error)

            if response.status_code == 200:
                session['student_id'] = response_data['student_id']
                return redirect(url_for('emotion_detection'))
            else:
                error = response_data.get('error', 'Login failed')
                return render_template('login.html', error=error)

        except requests.exceptions.ConnectionError:
            error = "Unable to connect to the backend server. Please make sure it's running."
            return render_template('login.html', error=error)
        except Exception as e:
            error = f"An unexpected error occurred: {str(e)}"
            return render_template('login.html', error=error)

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('student_id', None)
    return redirect(url_for('login'))


@app.route('/emotion-detection')
def emotion_detection():
    if 'student_id' not in session:
        return redirect(url_for('login'))

    return render_template('emotion_analysis.html', student_id=session['student_id'])


@app.route('/speech-to-text')
def speech_to_text():
    return render_template('speech_assist.html')


@app.route('/video-lesson')
def ai_comprehension():
    return render_template('transcript.html')


@app.route('/summarise')
def summarise():
    return render_template('summarise.html')


@app.route('/dashboard')
def dashboard():
    return render_template('teacher_dashboard.html')


@app.route('/teacher-decison')
def teacher_decison():
    return render_template('Teacher_Decision_Support.html')


@app.route('/advanced-privacy')
def advanced_privacy():
    return render_template('advanced-privacy.html')


@app.route('/cross-platform')
def cross_platform():
    return render_template('cross-platform.html')


@app.route('/customizable-experience')
def customizable_experience():
    return render_template('customizable-experience.html')


if __name__ == '__main__':
    app.run(debug=True)
