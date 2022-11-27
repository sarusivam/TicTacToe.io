from flask import Flask, render_template
import flask
app = Flask('app')

@app.route('/')
def startPage():
	return render_template('superspin.html')




app.run(host='0.0.0.0', port=8080)
