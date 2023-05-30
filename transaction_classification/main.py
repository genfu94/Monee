from transaction_classification import InferencePipeline, WalletCsvFileIngestion, WalletDataFramePreprocess, TransactionTextPreprocessing, TransactionTextToBOW, BertEmbedding, UnicreditCsvFileIngestion
from sklearn import svm
from joblib import dump
from sklearn.naive_bayes import MultinomialNB
import pandas as pd
from  sklearn.ensemble import GradientBoostingClassifier

#def add_category_to_dataframe(transaction_classifier, df: pd.DataFrame, text_column_idx: int):
#    df['category'] = df.apply(lambda row: transaction_classifier.predict(row[text_column_idx]), axis=1)


if __name__ == '__main__':
    pipe = InferencePipeline([
        WalletCsvFileIngestion('./data/clean/export_wallet.csv'),
        UnicreditCsvFileIngestion('./data/clean/export_unicredit.csv'),
        WalletDataFramePreprocess()
    ], [
        ('text_clean', TransactionTextPreprocessing()),
        ('bow', TransactionTextToBOW()),
        #('embedding', BertEmbedding()),
        #('clf', svm.SVC(kernel='linear', C=1000))
        ('clf', GradientBoostingClassifier())
    ])
    pipe.fit()
    dump(pipe, 'transaction_classifier.joblib')