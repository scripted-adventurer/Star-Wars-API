FROM alpine:latest
WORKDIR /app
COPY . .
RUN pip install pytest
CMD ['python', './starships.py']