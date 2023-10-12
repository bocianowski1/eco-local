FROM python:3.10

ADD start.sh /
RUN chmod +x /start.sh

RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | \
                                      gpg --dearmor > microsoft.asc.gpg && \
    mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ && \
    wget -q https://packages.microsoft.com/config/debian/10/prod.list && \
    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list && \
    chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
    chown root:root /etc/apt/sources.list.d/microsoft-prod.list && \
    apt-get update && \
    apt-get install azure-functions-core-tools-4

RUN pip install --upgrade pip

WORKDIR /app

COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . .

CMD ["func", "start", "--python"]