FROM python
WORKDIR /keycloak_conf
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY test_keycloak.py .

ENV frontend http://localhost:3000
CMD ["python", "test_keycloak.py"]