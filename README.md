# Star Wars API #

This is a simple project that makes use of the [Star Wars API](http://swapi.dev/) to download and display data on starship pilots. 

## Backend ##

To run the backend application, you must have Docker installed. Below are sample instructions for Ubuntu to create a new image from the Dockerfile and run the application.
<br><br>
Launch a terminal window in the same directory as this README file and navigate to the backend folder. From there, create a new Docker image from the Dockerfile (here I named named it "star_wars_api" - feel free to use whatever you want):

```
cd backend/
docker build -t star_wars_api .
```

Then launch the docker image using the name provided above:

```
docker container run -ti star_wars_api /bin/sh
```

Once the image loads, you can run the script with the following command. Output will be displayed on the terminal. 

```
python3 starships.py
```

If you would like to run the test cases, you can do so with:

```
pytest
```

## Frontend ##

To run the frontend application, navigate to the below directory and launch "index.html" in a browser. 

frontend/star_wars_api/build/