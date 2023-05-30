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
#from transformers import BertTokenizer, TFBertModel
from sklearn.model_selection import cross_validate
from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split
from sklearn.metrics import make_scorer, f1_score

class WalletCsvFileIngestion:
    def __init__(self, filepath: str):
        self.filepath = filepath
    
    def initialize(self, transaction_data):
        self.transaction_data = transaction_data
        return self

    def execute(self) -> pd.DataFrame:
        new_transaction_data = pd.read_csv(self.filepath, sep=';')
        new_transaction_data = new_transaction_data.query("type != 'Expense' and type != 'Income' ")
        new_transaction_data.note = new_transaction_data.note.fillna('')
        new_transaction_data.category = new_transaction_data.category.map(lambda x: categories.convert_wallet_categories(x).value)
        return pd.concat([self.transaction_data, new_transaction_data[['category', 'note']]])


class UnicreditCsvFileIngestion:
    def __init__(self, filepath: str):
        self.filepath = filepath
    
    def initialize(self, transaction_data):
        self.transaction_data = transaction_data
        return self

    def execute(self) -> pd.DataFrame:
        new_transaction_data = pd.read_csv(self.filepath, sep=',')

        return pd.concat([self.transaction_data, new_transaction_data[['category', 'note']]])


class WalletDataFramePreprocess:
    def initialize(self, transaction_df: pd.DataFrame):
        self.transaction_df = transaction_df
        return self
    
    def execute(self) -> list:
        X = self.transaction_df.note.to_numpy()
        y = self.transaction_df.category.to_numpy()
        return X, y


class TransactionTextPreprocessing:
    def fit(self, X, y):
        return self
    
    def transform(self, X):
        return list(map(lambda x: re.sub(r"[^a-zA-Z0-9 ]", " ", x), X))


# class BertEmbedding:
#     def __init__(self):
#         self.tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-uncased')
#         self.model = TFBertModel.from_pretrained("bert-base-multilingual-uncased")

#     def fit(self, X, y):
#         return self

#     def _encode(self, text):
#         encoded_input = self.tokenizer(text, return_tensors='tf')
#         output = self.model(encoded_input)
#         return output.pooler_output.numpy()[0]

#     def transform(self, X):
#         return list(map(self._encode, X))
        

class TransactionTextToBOW:
    def __init__(self):
        self.count_vec = CountVectorizer(max_df=0.1)

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
    
    def fit(self):
        scoring = {'f1_score' : make_scorer(f1_score, average='macro')}
        
        X, y = reduce(lambda f, g: g.initialize(f).execute(), self.data_preparation_steps, pd.DataFrame(columns=['category', 'note']))
        self.pipe = Pipeline(self.inference_steps)
        print(cross_validate(self.pipe, X, y, cv=5, scoring=scoring))
        self.pipe.fit(X, y)
    
    def predict(self, transaction_text: str):
        return self.pipe.predict([transaction_text])[0]


