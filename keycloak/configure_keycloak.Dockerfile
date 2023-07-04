FROM python
WORKDIR /keycloak_conf
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY configure_keycloak.py .

ENV FRONTEND_URL http://localhost:3000
ENV KEYCLOAK_SERVER_URL http://keycloak:8080
ENV KEYCLOAK_ADMIN admin
ENV KEYCLOAK_PASSWORD admin

CMD ["python", "configure_keycloak.py"]