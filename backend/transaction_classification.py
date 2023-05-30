from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd
import numpy as np
import re
from sklearn import svm
from joblib import dump
import categories
from typing import List
from functools import reduce
from sklearn.pipeline import Pipeline


class WalletCsvFileIngestion:
    def initialize(self, filepath: str):
        self.filepath = filepath
        return self

    def execute(self) -> pd.DataFrame:
        transaction_data = pd.read_csv(self.filepath, sep=';')
        return transaction_data[['category', 'type', 'note']]


class WalletDataFramePreprocess:
    def initialize(self, wallet_transaction_df: pd.DataFrame):
        self.wallet_transaction_df = wallet_transaction_df
        return self
    
    def execute(self) -> list:
        self.wallet_transaction_df.category = self.wallet_transaction_df.category.map(lambda x: categories.convert_wallet_categories(x).value)
        self.wallet_transaction_df = self.wallet_transaction_df.query("type != 'Expense' and type != 'Income' ")
        self.wallet_transaction_df.note = self.wallet_transaction_df.note.fillna('')

        X = self.wallet_transaction_df.note.to_numpy()
        y = self.wallet_transaction_df.category.to_numpy()
        return X, y


class TransactionTextPreprocessing:
    def fit(self, X, y):
        return self
    
    def transform(self, X):
        return list(map(lambda x: re.sub(r"[^a-zA-Z0-9 ]", " ", x), X))


class TransactionTextToBOW:
    def __init__(self):
        self.count_vec = CountVectorizer()

    def fit(self, X, y):        
        self.count_vec.fit(X)
        return self
    
    def transform(self, X):
        bow = self.count_vec.transform(X)
        X = np.array(bow.todense())
        return X

class InferencePipeline:
    def __init__(self, data_preparations_steps: List, inference_steps: List):
        self.data_preparation_steps = data_preparations_steps
        self.inference_steps = inference_steps
    
    def fit(self, filepath: str):
        X, y = reduce(lambda f, g: g.initialize(f).execute(), self.data_preparation_steps, filepath)
        self.pipe = Pipeline(self.inference_steps)
        self.pipe.fit(X, y)
    
    def predict(self, transaction_text: str):
        return self.pipe.predict([transaction_text])[0]


