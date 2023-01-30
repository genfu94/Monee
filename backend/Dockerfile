FROM python

WORKDIR /app/backend

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "src/main.py"]