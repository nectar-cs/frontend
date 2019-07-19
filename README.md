## Prerequisites

You will need the following things properly installed on your computer:

* [Git](http://git-scm.com/)
* [React](https://reactjs.org/)
* [Docker](https://www.docker.com/)

## Running

To run the project locally follow the following steps:

* change into the project directory
* `docker build -t frontend-react .`
* `docker run -p 3000:3000 -v /HOST/PATH/TO/FRONTEND/FOLDER:/app frontend-react`
