FROM python:3.7

RUN apt-get clean \
    && apt-get -y update

RUN apt-get -y install python3-dev lsb-release build-essential libssl-dev 

RUN pip3 install uwsgi

WORKDIR /app

COPY ./setup.py /app/setup.py
COPY ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY ./api /app/
COPY ./src /app/src

EXPOSE 1111

CMD ["python", "app.py"]