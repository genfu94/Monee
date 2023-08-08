FROM python:slim
WORKDIR /app/backend
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
ENV MONGO_DB_CONNECTION_STRING mongodb://mongo:27017/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]