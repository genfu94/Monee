FROM quay.io/keycloak/keycloak:20.0.3 as keycloak

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

EXPOSE 8080

WORKDIR /keycloak
COPY requirements.txt .


#RUN pip3 install -r requirements.txt

RUN curl https://www.python.org/ftp/python/3.11.2/Python-3.11.2.tar.xz --output python3.tar.xz

COPY test_keycloak.py .

#RUN python test_keycloak.py

CMD ["start-dev"]